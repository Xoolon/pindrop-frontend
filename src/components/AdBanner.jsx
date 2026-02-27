// components/AdBanner.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Renders a Google AdSense banner unit.
// Premium users: pass isPremium={true} to suppress rendering entirely.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useEffect, useRef, useState } from 'react';

const PUBLISHER_ID = 'ca-pub-9505934511045266'; // ← your real publisher ID

// Replace slot values with real AdSense ad unit slot IDs
const AD_SLOTS = {
  top:    '1111111111',  // ← create in AdSense → Ads → By ad unit
  bottom: '4218418628',  // ← already in your app.jsx
};

export default function AdBanner({ slot = 'top', format = 'responsive', isPremium = false }) {
  const adRef  = useRef(null);
  const pushed = useRef(false);
  const [loaded, setLoaded] = useState(false);

  // Don't render at all for premium users
  if (isPremium) return null;

  const slotId      = AD_SLOTS[slot] || slot;
  const isLeader    = format === 'horizontal';
  const minHeight   = isLeader ? 90 : 250;

  useEffect(() => {
    if (pushed.current) return;
    pushed.current = true;

    const t = setTimeout(() => {
      try {
        if (typeof window !== 'undefined') {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          setLoaded(true);
        }
      } catch (e) {
        console.debug('[AdBanner] AdSense not available:', e.message);
      }
    }, 150);

    return () => clearTimeout(t);
  }, []);

  return (
    <div style={styles.wrapper}>
      <div style={styles.labelRow}>
        <span style={styles.label}>Sponsored</span>
        <div style={styles.divider} />
      </div>

      <div style={{ ...styles.adBox, minHeight }}>
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{ display: 'block', width: '100%', minHeight }}
          data-ad-client={PUBLISHER_ID}
          data-ad-slot={slotId}
          data-ad-format={format === 'responsive' ? 'auto' : isLeader ? 'horizontal' : 'rectangle'}
          data-full-width-responsive="true"
        />

        {!loaded && (
          <div style={styles.placeholder}>
            <span style={styles.placeholderIcon}>◈</span>
            <span style={styles.placeholderText}>Advertisement</span>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    width: '100%', padding: '24px 0',
  },
  labelRow: {
    display: 'flex', alignItems: 'center', gap: '12px',
    width: '100%', maxWidth: '728px', marginBottom: '10px',
  },
  label: {
    fontSize: '10px', fontFamily: 'DM Sans, sans-serif', fontWeight: 500,
    color: '#383840', letterSpacing: '0.12em', textTransform: 'uppercase', whiteSpace: 'nowrap',
  },
  divider: {
    flex: 1, height: '1px',
    background: 'linear-gradient(90deg, rgba(255,255,255,0.05) 0%, transparent 100%)',
  },
  adBox: {
    width: '100%', maxWidth: '728px',
    background: 'rgba(255,255,255,0.015)',
    border: '1px dashed rgba(255,255,255,0.05)',
    borderRadius: '12px', overflow: 'hidden',
    position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  placeholder: {
    position: 'absolute', inset: 0,
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center', gap: '8px', pointerEvents: 'none',
  },
  placeholderIcon:  { fontSize: '22px', color: '#242430' },
  placeholderText: {
    fontSize: '10px', color: '#242430', fontFamily: 'DM Sans, sans-serif',
    letterSpacing: '0.12em', textTransform: 'uppercase',
  },
};