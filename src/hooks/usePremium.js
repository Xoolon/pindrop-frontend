// hooks/usePremium.js
// ─────────────────────────────────────────────────────────────────────────────
// Premium management with HMAC-signed tokens verified against the backend.
//
// Security model:
//   1. User pays via Paystack popup
//   2. Frontend POSTs reference to /api/verify-payment
//   3. Backend verifies with Paystack, then issues a signed token
//   4. Token stored in localStorage (tamper-proof: signature uses server secret)
//   5. On every page load, token is re-verified against /api/verify-token
//   6. Without TOKEN_SECRET, forging a token is cryptographically infeasible
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useCallback, useRef } from 'react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

// ── Replace with your real Paystack public key ────────────────────────────────
export const PAYSTACK_PUBLIC_KEY = 'pk_live_431776b40501c3df1990a00fa6b85fe032180618';

export const PLANS = {
  monthly: {
    id:              'monthly',
    label:           'Monthly',
    amount:          1 * 100,           // $1.00 in cents
    currency:        'USD',
    interval:        'monthly',
    paystackPlanCode:'PLN_j8rbb1ig732appf', // ← your Paystack plan code
    description:     '$1 / month · Cancel anytime',
  },
  lifetime: {
    id:              'lifetime',
    label:           'Lifetime',
    amount:          29 * 100,          // $29.00 in cents
    currency:        'USD',
    interval:        'once',
    paystackPlanCode: null,
    description:     '$29 once · Forever ad-free',
  },
};

// ── Storage key for the signed token ─────────────────────────────────────────
const TOKEN_KEY = 'pindrop_premium_token';
const META_KEY  = 'pindrop_premium_meta';   // stores plan/email for UI display only

// ── Load Paystack inline.js once ──────────────────────────────────────────────
let _paystackPromise = null;
function loadPaystack() {
  if (_paystackPromise) return _paystackPromise;
  if (window.PaystackPop) { _paystackPromise = Promise.resolve(); return _paystackPromise; }
  _paystackPromise = new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src     = 'https://js.paystack.co/v1/inline.js';
    s.onload  = resolve;
    s.onerror = reject;
    document.head.appendChild(s);
  });
  return _paystackPromise;
}

function generateRef() {
  return `pdrop_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

// ── Hook ──────────────────────────────────────────────────────────────────────
export function usePremium() {
  const [isPremium,    setIsPremium]    = useState(false);
  const [premiumMeta,  setPremiumMeta]  = useState(null);   // { plan, email }
  const [loading,      setLoading]      = useState(false);
  const [showUpgrade,  setShowUpgrade]  = useState(false);
  const [error,        setError]        = useState(null);
  const verified = useRef(false);

  // ── On mount: verify any stored token against the backend ─────────────────
  useEffect(() => {
    if (verified.current) return;
    verified.current = true;

    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return;

    // Optimistically set premium from stored meta while we verify
    const cached = _loadMeta();
    if (cached) {
      setIsPremium(true);
      setPremiumMeta(cached);
    }

    // Background verify
    fetch(`${API_BASE}/api/verify-token`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ token }),
    })
      .then(r => r.json())
      .then(data => {
        if (data.valid) {
          setIsPremium(true);
          setPremiumMeta({ plan: data.plan, email: data.email });
          _saveMeta({ plan: data.plan, email: data.email });
        } else {
          // Token invalid or expired — clear everything
          _clearAll();
          setIsPremium(false);
          setPremiumMeta(null);
        }
      })
      .catch(() => {
        // Network error: keep optimistic state (offline tolerance)
        // Token will be re-verified next session
      });
  }, []);

  // ── Initiate Paystack payment ──────────────────────────────────────────────
  const initPayment = useCallback(async (planId, email) => {
    if (!email?.trim()) return;
    setError(null);
    setLoading(true);

    const plan = PLANS[planId];
    const ref  = generateRef();

    try {
      await loadPaystack();
    } catch {
      setLoading(false);
      setError('Could not load payment processor. Check your connection.');
      return;
    }

    const config = {
      key:      PAYSTACK_PUBLIC_KEY,
      email:    email.trim(),
      amount:   plan.amount,
      currency: plan.currency,
      ref,
      label:    'PinDrop Premium',
      metadata: {
        custom_fields: [
          { display_name: 'Plan',    variable_name: 'plan',    value: plan.id },
          { display_name: 'Product', variable_name: 'product', value: 'PinDrop' },
        ],
      },
      channels: ['card'],

      callback: async (response) => {
        // Payment popup closed with success — now verify server-side
        try {
          const res = await fetch(`${API_BASE}/api/verify-payment`, {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({
              reference: response.reference,
              email:     email.trim(),
              plan:      plan.id,
            }),
          });

          const data = await res.json();

          if (!res.ok || !data.success) {
            setLoading(false);
            setError(data.detail || 'Payment verification failed. Contact support.');
            return;
          }

          // Store the signed token — this is the only thing that grants premium
          localStorage.setItem(TOKEN_KEY, data.token);
          _saveMeta({ plan: plan.id, email: email.trim() });

          setIsPremium(true);
          setPremiumMeta({ plan: plan.id, email: email.trim() });
          setLoading(false);
          setShowUpgrade(false);

        } catch (err) {
          setLoading(false);
          setError('Network error during verification. Please try again.');
        }
      },

      onClose: () => {
        setLoading(false);
      },
    };

    // Monthly: attach Paystack plan code for recurring billing
    if (plan.paystackPlanCode) {
      config.plan = plan.paystackPlanCode;
    }

    try {
      const handler = window.PaystackPop.setup(config);
      handler.openIframe();
    } catch {
      setLoading(false);
      setError('Payment setup failed. Please try again.');
    }
  }, []);

  // ── Restore via reference (calls backend to re-issue token) ───────────────
  const restoreByRef = useCallback(async (reference, email) => {
    if (!reference?.trim() || !email?.trim()) return false;
    setError(null);
    setLoading(true);

    // We attempt to verify the reference with Paystack and get a new token
    // This requires the user to also provide their email (used at payment time)
    try {
      const res = await fetch(`${API_BASE}/api/verify-payment`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          reference: reference.trim(),
          email:     email.trim(),
          plan:      'lifetime', // restore assumes lifetime; monthly would have renewed
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setLoading(false);
        setError(data.detail || 'Could not restore access. Check your reference and email.');
        return false;
      }

      localStorage.setItem(TOKEN_KEY, data.token);
      _saveMeta({ plan: data.plan, email: email.trim() });
      setIsPremium(true);
      setPremiumMeta({ plan: data.plan, email: email.trim() });
      setLoading(false);
      return true;

    } catch {
      setLoading(false);
      setError('Network error. Please try again.');
      return false;
    }
  }, []);

  const clearPremium = useCallback(() => {
    _clearAll();
    setIsPremium(false);
    setPremiumMeta(null);
  }, []);

  return {
    isPremium,
    premiumMeta,
    loading,
    error,
    showUpgrade,
    setShowUpgrade,
    initPayment,
    restoreByRef,
    clearPremium,
    plans: PLANS,
  };
}

// ── Private helpers ───────────────────────────────────────────────────────────
function _saveMeta(meta) {
  try { localStorage.setItem(META_KEY, JSON.stringify(meta)); } catch {}
}
function _loadMeta() {
  try { return JSON.parse(localStorage.getItem(META_KEY)); } catch { return null; }
}
function _clearAll() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(META_KEY);
}