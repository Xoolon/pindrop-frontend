// components/AdOverlay.jsx
// Full-screen ad overlay that gates downloads for free users.
// - 15s countdown; skip button after 5s.
// - Contains a real AdSense interstitial slot.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useEffect, useRef, useState } from 'react';

// ── Replace slot ID with your interstitial/overlay unit from AdSense dashboard
const PUBLISHER_ID    = 'ca-pub-9505934511045266'; // ← your actual publisher ID
const OVERLAY_AD_SLOT = '3333333333';               // ← replace with real slot

const CIRCUMFERENCE = 2 * Math.PI * 44;

export default function AdOverlay({ adState, onSkip }) {
  const { visible, countdown, skippable } = adState;
  const [mounted,  setMounted]  = useState(false);
  const adPushed = useRef(false);

  useEffect(() => {
    if (visible) {
      requestAnimationFrame(() => setMounted(true));
      if (!adPushed.current) {
        adPushed.current = true;
        setTimeout(() => {
          try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
          } catch (e) {
            console.debug('[AdOverlay] AdSense push failed:', e.message);
          }
        }, 200);
      }
    } else {
      setMounted(false);
      adPushed.current = false;
    }
  }, [visible]);

  if (!visible) return null;

  const elapsed      = 15 - countdown;
  const skipProgress = Math.min(elapsed / 5, 1);
  const dashOffset   = CIRCUMFERENCE * (countdown / 15);

  return (
    <div style={s.backdrop}>
      <div style={s.scanline} />

      <div style={{
        ...s.modal,
        transform: mounted ? 'scale(1) translateY(0)' : 'scale(0.94) translateY(24px)',
        opacity:   mounted ? 1 : 0,
        transition: 'transform 0.38s cubic-bezier(0.34,1.45,0.64,1), opacity 0.28s ease',
      }}>
        {/* Top label bar */}
        <div style={s.adLabel}>
          <span style={s.adDot} />
          <span>Advertisement — Your download starts when the ad ends</span>
        </div>

        {/* Ad content area */}
        <div style={s.adContent}>
          <div style={s.adsenseWrap}>
            <ins
              className="adsbygoogle"
              style={{ display: 'block', width: '100%', height: '250px' }}
              data-ad-client={PUBLISHER_ID}
              data-ad-slot={OVERLAY_AD_SLOT}
              data-ad-format="auto"
              data-full-width-responsive="true"
            />
          </div>

          {/* Fallback shown when AdSense doesn't fill */}
          <div style={s.fallback}>
            <div style={s.fallbackIcon}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                  stroke="#E60023" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <p style={s.fallbackTitle}>Support PinDrop</p>
            <p style={s.fallbackSub}>
              Free downloads are powered by ads.<br />
              Go Premium to remove them forever.
            </p>
          </div>
        </div>

        {/* Bottom controls */}
        <div style={s.controls}>
          <div style={s.leftMsg}>
            {skippable
              ? <span style={s.readyMsg}>✓ Download ready — skip now</span>
              : <span style={s.waitMsg}>
                  Download begins in <strong style={{ color: '#ededf0' }}>{countdown}s</strong>
                </span>
            }
          </div>

          {!skippable ? (
            <div style={s.ring}>
              <svg width="60" height="60" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="6" />
                <circle cx="50" cy="50" r="44" fill="none" stroke="#E60023" strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={CIRCUMFERENCE}
                  strokeDashoffset={dashOffset}
                  style={{ transition: 'stroke-dashoffset 1s linear' }}
                />
              </svg>
              <span style={s.ringNum}>{countdown}</span>
            </div>
          ) : (
            <button onClick={onSkip} style={s.skipBtn}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <polygon points="5,3 19,12 5,21"/><line x1="19" y1="3" x2="19" y2="21"/>
              </svg>
              Skip Ad
            </button>
          )}
        </div>

        {!skippable && elapsed > 0 && (
          <div style={s.skipBar}>
            <div style={s.skipBarLabel}>
              Skip available in {Math.max(0, Math.ceil(5 - elapsed))}s
            </div>
            <div style={s.skipTrack}>
              <div style={{ ...s.skipFill, width: `${skipProgress * 100}%`, transition: 'width 1s linear' }} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const s = {
  backdrop: {
    position: 'fixed', inset: 0,
    background: 'rgba(0,0,0,0.9)',
    backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 9999, padding: '16px',
  },
  scanline: {
    position: 'absolute', inset: 0, pointerEvents: 'none',
    background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.01) 2px, rgba(255,255,255,0.01) 4px)',
  },
  modal: {
    width: '100%', maxWidth: '560px',
    background: '#111115',
    border: '1px solid rgba(255,255,255,0.09)',
    borderRadius: '20px', overflow: 'hidden',
    boxShadow: '0 40px 100px rgba(0,0,0,0.75), 0 0 0 1px rgba(230,0,35,0.08)',
  },
  adLabel: {
    display: 'flex', alignItems: 'center', gap: '8px',
    padding: '11px 20px',
    background: 'rgba(230,0,35,0.07)',
    borderBottom: '1px solid rgba(230,0,35,0.12)',
    fontSize: '10px', fontFamily: 'Syne, sans-serif',
    fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase',
    color: '#c0001d',
  },
  adDot: {
    width: '6px', height: '6px', borderRadius: '50%',
    background: '#E60023', boxShadow: '0 0 8px #E60023', flexShrink: 0,
  },
  adContent: {
    position: 'relative', minHeight: '250px',
    background: '#0c0c0f', overflow: 'hidden',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  adsenseWrap: {
    width: '100%', padding: '16px', position: 'relative', zIndex: 2,
  },
  fallback: {
    position: 'absolute', inset: 0, zIndex: 1,
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    gap: '10px', padding: '32px', textAlign: 'center',
  },
  fallbackIcon: {
    width: '64px', height: '64px',
    background: 'rgba(230,0,35,0.07)', borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '4px',
  },
  fallbackTitle: {
    fontSize: '18px', fontWeight: 800, fontFamily: 'Syne, sans-serif',
    color: '#ededf0', marginBottom: '4px',
  },
  fallbackSub: {
    fontSize: '13px', color: '#5a5a6a', fontFamily: 'DM Sans, sans-serif', lineHeight: 1.6,
  },
  controls: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '14px 20px', borderTop: '1px solid rgba(255,255,255,0.06)', gap: '12px',
    flexWrap: 'wrap',
  },
  leftMsg: { flex: 1, minWidth: '120px' },
  waitMsg:  { fontSize: '13px', color: '#6a6a7a', fontFamily: 'DM Sans, sans-serif' },
  readyMsg: { fontSize: '13px', color: '#22c55e', fontFamily: 'DM Sans, sans-serif', fontWeight: 500 },
  ring: {
    position: 'relative', width: '56px', height: '56px',
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  ringNum: {
    position: 'absolute', fontSize: '16px', fontWeight: 700,
    fontFamily: 'Syne, sans-serif', color: '#ededf0',
  },
  skipBtn: {
    display: 'flex', alignItems: 'center', gap: '7px',
    padding: '10px 16px',
    background: 'rgba(230,0,35,0.12)',
    border: '1px solid rgba(230,0,35,0.35)',
    borderRadius: '9px', color: '#ff6b8a',
    fontSize: '13px', fontWeight: 700, fontFamily: 'Syne, sans-serif',
    cursor: 'pointer', flexShrink: 0,
    transition: 'background 0.2s, border-color 0.2s',
  },
  skipBar: { padding: '0 20px 14px' },
  skipBarLabel: {
    fontSize: '10px', color: '#44444f',
    fontFamily: 'DM Sans, sans-serif', marginBottom: '5px', letterSpacing: '0.05em',
  },
  skipTrack: {
    height: '2px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden',
  },
  skipFill: {
    height: '100%', background: 'linear-gradient(90deg, #E60023, #ff6040)', borderRadius: '2px',
  },
};