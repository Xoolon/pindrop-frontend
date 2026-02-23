import React, { useEffect, useRef } from 'react';

export default function AdBanner({ slot = "0987654321", format = "horizontal" }) {
  const adRef = useRef(null);
  const pushed = useRef(false);

  useEffect(() => {
    if (pushed.current) return;
    pushed.current = true;
    try {
      if (window.adsbygoogle) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (e) {
      // AdSense not loaded
    }
  }, []);

  const isLeaderboard = format === 'horizontal';

  return (
    <div style={styles.wrapper}>
      <div style={styles.labelRow}>
        <span style={styles.label}>Sponsored</span>
        <div style={styles.divider} />
      </div>
      <div style={{
        ...styles.adBox,
        minHeight: isLeaderboard ? '90px' : '250px',
        maxWidth: isLeaderboard ? '728px' : '336px',
      }}>
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
          data-ad-slot={slot}
          data-ad-format={isLeaderboard ? 'auto' : 'rectangle'}
          data-full-width-responsive="true"
        />
        {/* Placeholder shown when AdSense hasn't loaded */}
        <div style={styles.placeholder}>
          <span style={styles.placeholderIcon}>◈</span>
          <span style={styles.placeholderText}>Advertisement</span>
        </div>
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
    padding: '40px 0',
    position: 'relative',
  },
  labelRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    width: '100%',
    maxWidth: '728px',
    marginBottom: '12px',
  },
  label: {
    fontSize: '10px',
    fontFamily: 'DM Sans, sans-serif',
    fontWeight: 500,
    color: '#444450',
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    whiteSpace: 'nowrap',
  },
  divider: {
    flex: 1,
    height: '1px',
    background: 'linear-gradient(90deg, rgba(255,255,255,0.06) 0%, transparent 100%)',
  },
  adBox: {
    width: '100%',
    background: 'rgba(255,255,255,0.02)',
    border: '1px dashed rgba(255,255,255,0.06)',
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
    zIndex: 0,
  },
  placeholderIcon: {
    fontSize: '24px',
    color: '#2a2a30',
  },
  placeholderText: {
    fontSize: '11px',
    color: '#2a2a30',
    fontFamily: 'DM Sans, sans-serif',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
  },
};