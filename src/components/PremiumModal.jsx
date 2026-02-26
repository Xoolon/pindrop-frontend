// components/PremiumModal.jsx
import React, { useState } from 'react';
import { usePremium, PLANS } from '../hooks/usePremium.js';

export function PremiumModal({ onClose }) {
  const { initPayment, loading, error, restoreByRef } = usePremium();
  const [email, setEmail]               = useState('');
  const [selectedPlan, setSelectedPlan] = useState('lifetime'); // default to best value
  const [restoreMode, setRestoreMode]   = useState(false);
  const [restoreRef, setRestoreRef]     = useState('');
  const [restoreError, setRestoreError] = useState('');
  const [emailError, setEmailError]     = useState('');

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const validateEmail = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

  const handleUpgrade = () => {
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address.');
      return;
    }
    setEmailError('');
    initPayment(selectedPlan, email.trim());
  };

  const handleRestore = () => {
    const trimmed = restoreRef.trim();
    if (!trimmed) { setRestoreError('Please paste your transaction reference.'); return; }
    const ok = restoreByRef(trimmed);
    if (ok) {
      onClose();
    } else {
      setRestoreError('Reference not recognised. Check you pasted the correct pdrop_… reference.');
    }
  };

  const plan = PLANS[selectedPlan];

  return (
    <div style={m.overlay} onClick={handleBackdropClick}>
      <div style={m.modal}>
        <button onClick={onClose} style={m.close} aria-label="Close">✕</button>

        {/* Header */}
        <div style={m.header}>
          <div style={m.crownWrap}>
            <span style={m.crown}>♛</span>
          </div>
          <h2 style={m.title}>PinDrop Premium</h2>
          <p style={m.sub}>Download without interruptions — forever.</p>
        </div>

        {!restoreMode ? (
          <>
            {/* Plan selector */}
            <div style={m.plans}>
              {Object.values(PLANS).map(p => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPlan(p.id)}
                  style={{ ...m.planCard, ...(selectedPlan === p.id ? m.planActive : {}) }}
                >
                  {p.id === 'lifetime' && <div style={m.bestBadge}>BEST VALUE</div>}
                  <strong style={{ ...m.planLabel, color: selectedPlan === p.id ? '#f5c842' : '#888897' }}>
                    {p.label}
                  </strong>
                  <div style={m.planPrice}>
                    <span style={m.planCurrency}>$</span>
                    <span style={m.planAmount}>
                      {p.id === 'monthly' ? '1' : '29'}
                    </span>
                  </div>
                  <span style={m.planNote}>
                    {p.id === 'monthly' ? 'per month' : 'one-time payment'}
                  </span>
                </button>
              ))}
            </div>

            {/* What you get */}
            <div style={m.perks}>
              {[
                { icon: '◈', text: 'Zero ads, forever' },
                { icon: '⬇', text: 'Unlimited downloads' },
                { icon: '▶', text: 'Preview before download' },
                { icon: '✦', text: 'All future features included' },
              ].map(({ icon, text }) => (
                <div key={text} style={m.perk}>
                  <span style={m.perkIcon}>{icon}</span>
                  <span style={m.perkText}>{text}</span>
                </div>
              ))}
            </div>

            {/* Email input */}
            <div style={m.fieldWrap}>
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={e => { setEmail(e.target.value); setEmailError(''); }}
                onKeyDown={e => e.key === 'Enter' && handleUpgrade()}
                style={{ ...m.input, borderColor: emailError ? 'rgba(230,0,35,0.4)' : 'rgba(255,255,255,0.08)' }}
                autoComplete="email"
              />
              {emailError && <p style={m.fieldError}>{emailError}</p>}
            </div>

            {/* API/network error */}
            {error && <p style={m.apiError}>{error}</p>}

            {/* Pay button */}
            <button
              onClick={handleUpgrade}
              disabled={loading}
              style={{ ...m.payBtn, opacity: loading ? 0.65 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
            >
              {loading
                ? <><span style={m.btnSpinner} /> Processing…</>
                : <>Pay ${plan.id === 'monthly' ? '1/mo' : '29 once'} via Paystack</>
              }
            </button>

            <p style={m.security}>🔒 Secured by Paystack · SSL encrypted</p>

            {/* Restore link */}
            <button onClick={() => setRestoreMode(true)} style={m.restoreLink}>
              Already paid? Restore access →
            </button>
          </>
        ) : (
          /* Restore mode */
          <div style={m.restoreWrap}>
            <p style={m.restoreDesc}>
              Paste the transaction reference from your Paystack receipt email
              (starts with <code style={m.code}>pdrop_</code>).
            </p>
            <input
              type="text"
              placeholder="pdrop_1234567890_abc123"
              value={restoreRef}
              onChange={e => { setRestoreRef(e.target.value); setRestoreError(''); }}
              onKeyDown={e => e.key === 'Enter' && handleRestore()}
              style={{ ...m.input, borderColor: restoreError ? 'rgba(230,0,35,0.4)' : 'rgba(255,255,255,0.08)' }}
            />
            {restoreError && <p style={m.fieldError}>{restoreError}</p>}
            <button onClick={handleRestore} style={m.payBtn}>Restore Access</button>
            <button onClick={() => setRestoreMode(false)} style={m.restoreLink}>← Back to upgrade</button>
          </div>
        )}
      </div>
    </div>
  );
}

const m = {
  overlay: {
    position: 'fixed', inset: 0,
    background: 'rgba(0,0,0,0.82)',
    backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
    zIndex: 10000,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '24px',
  },
  modal: {
    background: 'linear-gradient(160deg, #131318, #0f0f14)',
    border: '1px solid rgba(255,255,255,0.09)',
    borderRadius: '24px',
    padding: '36px 28px 28px',
    maxWidth: '420px', width: '100%',
    position: 'relative', textAlign: 'center',
    boxShadow: '0 40px 80px rgba(0,0,0,0.65), 0 0 0 1px rgba(245,200,66,0.07)',
  },
  close: {
    position: 'absolute', top: '14px', right: '14px',
    background: 'rgba(255,255,255,0.05)', border: 'none',
    color: '#555560', width: '30px', height: '30px',
    borderRadius: '8px', cursor: 'pointer', fontSize: '13px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  header: { marginBottom: '24px' },
  crownWrap: { marginBottom: '10px' },
  crown: {
    fontSize: '38px',
    filter: 'drop-shadow(0 0 18px rgba(245,200,66,0.85))',
    display: 'inline-block',
  },
  title: {
    fontSize: '24px', fontWeight: 800, fontFamily: 'Syne, sans-serif',
    color: '#ededf0', marginBottom: '7px',
  },
  sub: { fontSize: '13px', color: '#555560', fontFamily: 'DM Sans, sans-serif' },
  plans: {
    display: 'flex', gap: '10px', marginBottom: '18px',
  },
  planCard: {
    flex: 1, padding: '16px 10px',
    background: 'rgba(255,255,255,0.025)',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: '14px', cursor: 'pointer',
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px',
    position: 'relative', transition: 'all 0.2s ease',
  },
  planActive: {
    border: '1px solid rgba(245,200,66,0.45)',
    background: 'rgba(245,200,66,0.05)',
    boxShadow: '0 0 20px rgba(245,200,66,0.08)',
  },
  bestBadge: {
    position: 'absolute', top: '-9px', left: '50%', transform: 'translateX(-50%)',
    background: 'linear-gradient(135deg, #f5c842, #e6a817)',
    color: '#0e0e10', fontSize: '8px', fontWeight: 800,
    fontFamily: 'Syne, sans-serif', letterSpacing: '0.1em',
    padding: '3px 8px', borderRadius: '100px', whiteSpace: 'nowrap',
  },
  planLabel: {
    fontSize: '12px', fontWeight: 700,
    fontFamily: 'Syne, sans-serif', marginTop: '8px', letterSpacing: '0.03em',
  },
  planPrice: { display: 'flex', alignItems: 'baseline', gap: '1px' },
  planCurrency: { fontSize: '14px', fontWeight: 700, color: '#ededf0', fontFamily: 'Syne, sans-serif' },
  planAmount: { fontSize: '28px', fontWeight: 800, color: '#ededf0', fontFamily: 'Syne, sans-serif', lineHeight: 1 },
  planNote: { fontSize: '10px', color: '#444450', fontFamily: 'DM Sans, sans-serif' },
  perks: {
    display: 'flex', flexDirection: 'column', gap: '8px',
    marginBottom: '18px', textAlign: 'left',
    padding: '14px 14px',
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(255,255,255,0.05)',
    borderRadius: '12px',
  },
  perk: { display: 'flex', alignItems: 'center', gap: '10px' },
  perkIcon: { fontSize: '13px', color: '#f5c842', flexShrink: 0, width: '16px', textAlign: 'center' },
  perkText: { fontSize: '13px', color: '#888897', fontFamily: 'DM Sans, sans-serif' },
  fieldWrap: { marginBottom: '10px' },
  input: {
    width: '100%', padding: '12px 14px',
    background: '#0a0a0e',
    border: '1px solid',
    borderRadius: '10px',
    color: '#ededf0', fontSize: '14px',
    fontFamily: 'DM Sans, sans-serif',
    outline: 'none', boxSizing: 'border-box',
    marginBottom: '4px',
  },
  fieldError: { fontSize: '11px', color: '#ff7090', fontFamily: 'DM Sans, sans-serif', textAlign: 'left' },
  apiError: {
    fontSize: '12px', color: '#ff7090', fontFamily: 'DM Sans, sans-serif',
    background: 'rgba(230,0,35,0.05)', border: '1px solid rgba(230,0,35,0.15)',
    borderRadius: '8px', padding: '9px 12px', marginBottom: '10px',
  },
  payBtn: {
    width: '100%', padding: '14px',
    background: 'linear-gradient(135deg, #f5c842, #d49810)',
    border: 'none', borderRadius: '12px',
    color: '#0a0a0a', fontSize: '14px', fontWeight: 800,
    fontFamily: 'Syne, sans-serif',
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
    marginBottom: '10px', boxSizing: 'border-box',
    boxShadow: '0 6px 22px rgba(245,200,66,0.22)',
    transition: 'opacity 0.2s, transform 0.15s',
    cursor: 'pointer',
  },
  btnSpinner: {
    display: 'inline-block', width: '15px', height: '15px',
    border: '2px solid rgba(0,0,0,0.2)', borderTopColor: '#000',
    borderRadius: '50%', animation: 'spin 0.7s linear infinite',
  },
  security: { fontSize: '11px', color: '#383840', fontFamily: 'DM Sans, sans-serif', marginBottom: '12px' },
  restoreLink: {
    background: 'none', border: 'none', cursor: 'pointer',
    fontSize: '12px', color: '#444450', fontFamily: 'DM Sans, sans-serif',
    textDecoration: 'underline', padding: '4px',
    transition: 'color 0.2s',
  },
  restoreWrap: { textAlign: 'left' },
  restoreDesc: {
    fontSize: '13px', color: '#666675', fontFamily: 'DM Sans, sans-serif',
    lineHeight: 1.65, marginBottom: '14px',
  },
  code: {
    fontFamily: 'DM Mono, monospace', fontSize: '12px',
    background: 'rgba(255,255,255,0.06)', padding: '2px 6px', borderRadius: '4px',
    color: '#f5c842',
  },
};