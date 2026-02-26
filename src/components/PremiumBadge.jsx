// components/PremiumBadge.jsx
import React, { useState, useEffect } from 'react';

const NUDGES = [
  'Go ad-free · $1/mo',
  'Upgrade to Premium',
  'Remove all ads',
  'Lifetime deal: $29',
  'Download uninterrupted',
];

// ── Premium active badge ───────────────────────────────────────────────────────
export function PremiumBadge({ isPremium, onClick }) {
  const [nudgeIdx, setNudgeIdx] = useState(0);
  const [pulse, setPulse]       = useState(false);

  useEffect(() => {
    if (isPremium) return;
    const id = setInterval(() => {
      setNudgeIdx(i => (i + 1) % NUDGES.length);
      setPulse(true);
      setTimeout(() => setPulse(false), 500);
    }, 4000);
    return () => clearInterval(id);
  }, [isPremium]);

  if (isPremium) {
    return (
      <div style={s.active} title="PinDrop Premium — Active">
        <span style={s.crown}>♛</span>
        <span style={s.activeLabel}>Premium</span>
        <span style={s.activeDot} />
      </div>
    );
  }

  return (
    <button
      onClick={onClick}
      style={{ ...s.upgradeBtn, transform: pulse ? 'scale(1.05)' : 'scale(1)' }}
      title="Upgrade to Premium"
    >
      <span style={s.crown}>♛</span>
      <span style={s.nudge}>{NUDGES[nudgeIdx]}</span>
      <span style={s.arrow}>→</span>
    </button>
  );
}

// ── Upgrade strip — appears between downloads ─────────────────────────────────
export function UpgradeStrip({ onUpgrade, downloadCount }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Show after 2nd download, then every 3rd
    if (downloadCount === 2 || (downloadCount > 2 && downloadCount % 3 === 0)) {
      setVisible(true);
    }
  }, [downloadCount]);

  if (!visible) return null;

  return (
    <div style={s.strip}>
      <div style={s.stripLeft}>
        <span style={s.stripCrown}>♛</span>
        <div>
          <p style={s.stripTitle}>Tired of ads?</p>
          <p style={s.stripSub}>Go Premium — $1/mo or $29 forever</p>
        </div>
      </div>
      <div style={s.stripRight}>
        <button onClick={onUpgrade} style={s.stripBtn}>Upgrade now</button>
        <button onClick={() => setVisible(false)} style={s.stripX}>✕</button>
      </div>
    </div>
  );
}

// ── Post-ad floating prompt ───────────────────────────────────────────────────
export function PostAdUpgrade({ onUpgrade, onClose }) {
  return (
    <div style={s.postAd}>
      <span style={s.postAdCrown}>♛</span>
      <div style={s.postAdText}>
        <strong style={s.postAdTitle}>Skip ads forever</strong>
        <span style={s.postAdSub}>$1/mo · or $29 once</span>
      </div>
      <button onClick={onUpgrade} style={s.postAdBtn}>Upgrade</button>
      <button onClick={onClose} style={s.postAdX}>✕</button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
const s = {
  // Active premium pill
  active: {
    display: 'flex', alignItems: 'center', gap: '7px',
    padding: '6px 12px',
    background: 'linear-gradient(135deg, rgba(245,200,66,0.1), rgba(230,168,23,0.06))',
    border: '1px solid rgba(245,200,66,0.22)',
    borderRadius: '100px',
    cursor: 'default',
  },
  crown: { fontSize: '13px', filter: 'drop-shadow(0 0 6px rgba(245,200,66,0.7))' },
  activeLabel: { fontSize: '12px', fontWeight: 700, fontFamily: 'Syne, sans-serif', color: '#f5c842', letterSpacing: '0.05em' },
  activeDot: { width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 6px #22c55e' },

  // Upgrade button
  upgradeBtn: {
    display: 'flex', alignItems: 'center', gap: '6px',
    padding: '7px 13px',
    background: 'rgba(245,200,66,0.07)',
    border: '1px solid rgba(245,200,66,0.2)',
    borderRadius: '100px', cursor: 'pointer',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    boxShadow: '0 0 16px rgba(245,200,66,0.06)',
  },
  nudge: {
    fontSize: '12px', fontWeight: 700, fontFamily: 'Syne, sans-serif',
    color: '#f5c842', letterSpacing: '0.02em',
    whiteSpace: 'nowrap', overflow: 'hidden', maxWidth: '150px',
  },
  arrow: { fontSize: '11px', color: '#f5c842', opacity: 0.6 },

  // Strip
  strip: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    gap: '16px', padding: '14px 20px',
    background: 'linear-gradient(135deg, rgba(245,200,66,0.06), rgba(245,200,66,0.02))',
    border: '1px solid rgba(245,200,66,0.13)',
    borderRadius: '14px', marginBottom: '20px', flexWrap: 'wrap',
  },
  stripLeft: { display: 'flex', alignItems: 'center', gap: '12px' },
  stripCrown: { fontSize: '20px', filter: 'drop-shadow(0 0 8px rgba(245,200,66,0.5))' },
  stripTitle: { fontSize: '14px', fontWeight: 700, fontFamily: 'Syne, sans-serif', color: '#ededf0', marginBottom: '2px' },
  stripSub: { fontSize: '12px', color: '#666675', fontFamily: 'DM Sans, sans-serif' },
  stripRight: { display: 'flex', alignItems: 'center', gap: '8px' },
  stripBtn: {
    padding: '8px 16px',
    background: 'linear-gradient(135deg, #f5c842, #e6a817)',
    border: 'none', borderRadius: '8px',
    color: '#0e0e10', fontSize: '13px', fontWeight: 800,
    fontFamily: 'Syne, sans-serif', cursor: 'pointer',
    boxShadow: '0 4px 14px rgba(245,200,66,0.25)',
    transition: 'all 0.2s ease',
  },
  stripX: {
    background: 'none', border: 'none', color: '#383840',
    cursor: 'pointer', fontSize: '14px', padding: '4px',
  },

  // Post-ad floating
  postAd: {
    position: 'fixed', bottom: '80px', right: '24px',
    display: 'flex', alignItems: 'center', gap: '12px',
    padding: '12px 16px',
    background: '#111115',
    border: '1px solid rgba(245,200,66,0.18)',
    borderRadius: '14px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
    zIndex: 9000, maxWidth: '280px',
    animation: 'fadeUp 0.25s ease forwards',
  },
  postAdCrown: { fontSize: '18px', flexShrink: 0, filter: 'drop-shadow(0 0 6px rgba(245,200,66,0.6))' },
  postAdText: { display: 'flex', flexDirection: 'column', gap: '2px', flex: 1 },
  postAdTitle: { fontSize: '13px', fontWeight: 700, fontFamily: 'Syne, sans-serif', color: '#ededf0', display: 'block' },
  postAdSub: { fontSize: '11px', color: '#888897', fontFamily: 'DM Sans, sans-serif' },
  postAdBtn: {
    padding: '7px 12px',
    background: 'linear-gradient(135deg, #f5c842, #e6a817)',
    border: 'none', borderRadius: '7px',
    color: '#0e0e10', fontSize: '12px', fontWeight: 800,
    fontFamily: 'Syne, sans-serif', cursor: 'pointer',
    whiteSpace: 'nowrap', flexShrink: 0,
  },
  postAdX: {
    background: 'none', border: 'none', color: '#383840',
    cursor: 'pointer', fontSize: '13px', flexShrink: 0, padding: '2px',
  },
};