// hooks/usePremium.js
// ─────────────────────────────────────────────────────────────────────────────
// Paystack integration for PinDrop Premium
//
// Pricing:
//   Monthly  → $1/month  (charged in USD via Paystack international)
//   Lifetime → $29 once  (charged in USD via Paystack international)
//
// NOTE: Paystack now supports USD for international payments.
// Set currency: 'USD' and amount in cents (100 = $1.00).
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useCallback } from 'react';

// ── REPLACE THESE WITH YOUR REAL VALUES ──────────────────────────────────────
// 1. Get your public key from https://dashboard.paystack.com/#/settings/developer
// 2. Create a Recurring Plan in Paystack dashboard (for monthly sub):
//    Dashboard → Products → Plans → Create Plan
//    Set: Name="PinDrop Monthly", Amount=100 (Kobo = ₦1 OR set USD), interval=monthly
//    Copy the plan code (PLN_xxxxxxxx) and paste below.
const PAYSTACK_PUBLIC_KEY = 'pk_live_431776b40501c3df1990a00fa6b85fe032180618'; // ← replace

export const PLANS = {
  monthly: {
    id: 'monthly',
    label: 'Monthly',
    amount: 1 * 100,           // $1.00 in cents
    currency: 'USD',
    interval: 'monthly',
    paystackPlanCode: 'PLN_xxxxxxxxxxxxxxx', // ← replace with your plan code from dashboard
    description: '$1 / month · Cancel anytime',
  },
  lifetime: {
    id: 'lifetime',
    label: 'Lifetime',
    amount: 29 * 100,          // $29.00 in cents
    currency: 'USD',
    interval: 'once',
    paystackPlanCode: null,    // one-time charge, no plan code needed
    description: '$29 once · Forever ad-free',
  },
};

// ── Storage helpers ───────────────────────────────────────────────────────────
const STORAGE_KEY   = 'pindrop_premium';
const REF_KEY       = 'pindrop_ref';
const EXPIRY_KEY    = 'pindrop_expiry';

function loadPremium() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    // Check monthly expiry
    if (data.plan === 'monthly' && data.expiry) {
      if (Date.now() > data.expiry) {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(EXPIRY_KEY);
        return null;
      }
    }
    return data;
  } catch {
    return null;
  }
}

function savePremium(plan, reference, email) {
  // Monthly expires in 32 days (small grace period), lifetime never expires
  const expiry = plan === 'monthly'
    ? Date.now() + 32 * 24 * 60 * 60 * 1000
    : null;
  const data = { plan, reference, email, activatedAt: Date.now(), expiry };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  localStorage.setItem(REF_KEY, reference);
  if (expiry) localStorage.setItem(EXPIRY_KEY, String(expiry));
  return data;
}

function generateRef() {
  return `pdrop_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

// ── Load Paystack script once ─────────────────────────────────────────────────
let paystackScriptPromise = null;

function loadPaystackScript() {
  if (paystackScriptPromise) return paystackScriptPromise;
  if (window.PaystackPop) {
    paystackScriptPromise = Promise.resolve();
    return paystackScriptPromise;
  }
  paystackScriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
  return paystackScriptPromise;
}

// ── Hook ──────────────────────────────────────────────────────────────────────
export function usePremium() {
  const [premium, setPremium]       = useState(null);
  const [loading, setLoading]       = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [error, setError]           = useState(null);

  // Load from localStorage on mount
  useEffect(() => {
    const data = loadPremium();
    setPremium(data);
  }, []);

  const isPremium = Boolean(premium);

  /**
   * initPayment(planId, email)
   * Opens the Paystack inline checkout popup.
   * On success, saves premium status locally and closes the modal.
   *
   * ⚠️  IMPORTANT: After go-live you should ALSO verify the payment
   * server-side using Paystack's /transaction/verify endpoint.
   * See SETUP_GUIDE.md for details.
   */
  const initPayment = useCallback(async (planId, email) => {
    if (!email?.trim()) return;
    setError(null);
    setLoading(true);

    const plan = PLANS[planId];
    const ref  = generateRef();

    try {
      await loadPaystackScript();
    } catch {
      setLoading(false);
      setError('Could not load payment processor. Check your internet connection.');
      return;
    }

    const config = {
      key:      PAYSTACK_PUBLIC_KEY,
      email:    email.trim(),
      amount:   plan.amount,     // in cents/kobo
      currency: plan.currency,   // 'USD'
      ref,
      label:    'PinDrop Premium',
      metadata: {
        custom_fields: [
          { display_name: 'Plan',    variable_name: 'plan',    value: plan.id },
          { display_name: 'Product', variable_name: 'product', value: 'PinDrop' },
        ],
      },
      channels: ['card', 'bank', 'ussd', 'mobile_money'],
      callback: (response) => {
        // response.reference is the transaction ref
        setLoading(false);
        const data = savePremium(plan.id, response.reference, email.trim());
        setPremium(data);
        setShowUpgrade(false);
        // ⚠️  In production: POST response.reference to your backend to verify
        // fetch('/api/verify-payment', { method: 'POST', body: JSON.stringify({ ref: response.reference }) })
      },
      onClose: () => {
        setLoading(false);
      },
    };

    // For monthly subscription: attach the plan code
    if (plan.paystackPlanCode) {
      config.plan = plan.paystackPlanCode;
    }

    try {
      const handler = window.PaystackPop.setup(config);
      handler.openIframe();
    } catch (e) {
      setLoading(false);
      setError('Payment setup failed. Please try again.');
    }
  }, []);

  /**
   * Restore premium by pasting a valid transaction reference.
   * Useful if a user clears localStorage and wants to restore access
   * without paying again.
   */
  const restoreByRef = useCallback((ref) => {
    if (ref && ref.startsWith('pdrop_')) {
      const data = savePremium('lifetime', ref, 'restored');
      setPremium(data);
      return true;
    }
    return false;
  }, []);

  const clearPremium = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(REF_KEY);
    localStorage.removeItem(EXPIRY_KEY);
    setPremium(null);
  }, []);

  return {
    isPremium,
    premium,
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