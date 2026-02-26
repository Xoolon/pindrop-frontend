// components/AdBanner.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Renders a Google AdSense unit.
//
// SETUP:
// 1. Replace YOUR_PUBLISHER_ID with your ca-pub-XXXXXXXXXXXXXXXX from
//    https://www.google.com/adsense → Account → Account information
// 2. Replace slot numbers with real slot IDs from
//    AdSense → Ads → By ad unit → Create new ad unit
// 3. Add your AdSense script to index.html <head>:
//    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX" crossorigin="anonymous"></script>
//
// FORMAT GUIDE:
//   'horizontal'  → 728×90 leaderboard (top/bottom of page)   ← BEST for us
//   'rectangle'   → 336×280 medium rectangle (beside content)
//   'responsive'  → auto-sizes to container
// ─────────────────────────────────────────────────────────────────────────────

import React, { useEffect, useRef, useState } from 'react';

// ── REPLACE THIS ──────────────────────────────────────────────────────────────
const PUBLISHER_ID = 'pub-9505934511045266'; // ← your AdSense publisher ID
// ─────────────────────────────────────────────────────────────────────────────

// Map slot IDs passed via props to configured ad units
// Create these in AdSense dashboard and paste the slot numbers here.
const AD_SLOTS = {
  top:    '1111111111',  // ← replace: slot for top banner (after hero)
  bottom: '2222222222',  // ← replace: slot for bottom banner (after result)
  // Add more as needed
};

export default function AdBanner({
  slot = 'top',           // key from AD_SLOTS, or a raw slot number string
  format = 'horizontal',  // 'horizontal' | 'rectangle' | 'responsive'
  className,
}) {
  const adRef      = useRef(null);
  const pushed     = useRef(false);
  const [loaded, setLoaded] = useState(false);

  const slotId = AD_SLOTS[slot] || slot;  // allow raw slot IDs too

  const isLeaderboard = format === 'horizontal';
  const minHeight     = isLeaderboard ? 90 : 250;
  const maxWidth      = isLeaderboard ? 728 : 336;

  useEffect(() => {
    if (pushed.current) return;
    pushed.current = true;

    // Small delay ensures the DOM <ins> is mounted before push
    const t = setTimeout(() => {
      try {
        if (typeof window !== 'undefined') {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          setLoaded(true);
        }
      } catch (e) {
        // AdSense script not loaded (dev environment or blocked)
        console.debug('[AdBanner] AdSense not available:', e.message);
      }
    }, 100);

    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{ ...styles.wrapper }} className={className}>
      {/* "Sponsored" label + divider */}
      <div style={styles.labelRow}>
        <span style={styles.label}>Sponsored</span>
        <div style={styles.divider} />
      </div>

      {/* Ad container */}
      <div style={{ ...styles.adBox, minHeight, maxWidth }}>
        {/* Real AdSense unit */}
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{ display: 'block', width: '100%', minHeight }}
          data-ad-client={PUBLISHER_ID}
          data-ad-slot={slotId}
          data-ad-format={format === 'responsive' ? 'auto' : isLeaderboard ? 'horizontal' : 'rectangle'}
          data-full-width-responsive="true"
        />

        {/* Placeholder shown until ad loads or in dev mode */}
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
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    padding: '32px 0',
  },
  labelRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    width: '100%',
    maxWidth: '728px',
    marginBottom: '10px',
  },
  label: {
    fontSize: '10px',
    fontFamily: 'DM Sans, sans-serif',
    fontWeight: 500,
    color: '#383840',
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    whiteSpace: 'nowrap',
  },
  divider: {
    flex: 1,
    height: '1px',
    background: 'linear-gradient(90deg, rgba(255,255,255,0.05) 0%, transparent 100%)',
  },
  adBox: {
    width: '100%',
    background: 'rgba(255,255,255,0.015)',
    border: '1px dashed rgba(255,255,255,0.05)',
    borderRadius: '12px',
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholder: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    pointerEvents: 'none',
  },
  placeholderIcon: {
    fontSize: '22px',
    color: '#242430',
  },
  placeholderText: {
    fontSize: '10px',
    color: '#242430',
    fontFamily: 'DM Sans, sans-serif',
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
  },
};