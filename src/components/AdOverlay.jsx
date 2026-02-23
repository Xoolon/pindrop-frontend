import React, { useEffect, useState } from 'react';

const CIRCUMFERENCE = 2 * Math.PI * 45; // r=45

export default function AdOverlay({ adState, onSkip }) {
  const { visible, countdown, skippable } = adState;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (visible) {
      requestAnimationFrame(() => setMounted(true));
    } else {
      setMounted(false);
    }
  }, [visible]);

  if (!visible) return null;

  const progress = countdown / 15;
  const dashOffset = CIRCUMFERENCE * (1 - progress);
  const elapsed = 15 - countdown;
  const skipProgress = Math.min(elapsed / 5, 1); // 5 seconds to become skippable

  return (
    <div style={styles.backdrop} className="animate-fadeIn">
      {/* Scanline effect */}
      <div style={styles.scanline} />

      <div style={{
        ...styles.modal,
        transform: mounted ? 'scale(1) translateY(0)' : 'scale(0.92) translateY(20px)',
        opacity: mounted ? 1 : 0,
        transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease',
      }}>
        {/* Ad label */}
        <div style={styles.adLabel}>
          <span style={styles.adDot} />
          ADVERTISEMENT
        </div>

        {/* Ad content area */}
        <div style={styles.adContent}>
          {/* AdSense slot */}
          <div style={styles.adsenseContainer}>
            <ins
              className="adsbygoogle"
              style={{ display: 'block', width: '100%', height: '250px' }}
              data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
              data-ad-slot="1234567890"
              data-ad-format="auto"
              data-full-width-responsive="true"
            />
            <script dangerouslySetInnerHTML={{ __html: '(adsbygoogle = window.adsbygoogle || []).push({});' }} />
          </div>

          {/* Fallback visual if ad doesn't load */}
          <div style={styles.adFallback}>
            <div style={styles.adFallbackInner}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" style={{ marginBottom: 12 }}>
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#E60023" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <p style={{ color: '#f0eff2', fontFamily: 'Syne, sans-serif', fontSize: '18px', fontWeight: 700, marginBottom: 8 }}>
                Support PinDrop
              </p>
              <p style={{ color: '#a09fad', fontSize: '14px', fontFamily: 'DM Sans, sans-serif' }}>
                Free downloads powered by our sponsors
              </p>
            </div>
          </div>
        </div>

        {/* Bottom controls */}
        <div style={styles.controls}>
          <div style={styles.messageArea}>
            {!skippable ? (
              <span style={styles.waitMessage}>
                Your download will begin in <strong style={{ color: '#fff' }}>{countdown}s</strong>
              </span>
            ) : (
              <span style={styles.readyMessage}>
                ✓ Download ready
              </span>
            )}
          </div>

          {/* Countdown ring + skip button */}
          <div style={styles.timerArea}>
            {!skippable ? (
              <div style={styles.countdownRing}>
                <svg width="64" height="64" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
                  {/* Track */}
                  <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="6" />
                  {/* Progress */}
                  <circle
                    cx="50" cy="50" r="45"
                    fill="none"
                    stroke="#E60023"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={CIRCUMFERENCE}
                    strokeDashoffset={dashOffset}
                    style={{ transition: 'stroke-dashoffset 1s linear' }}
                  />
                </svg>
                <span style={styles.countdownNum}>{countdown}</span>
              </div>
            ) : (
              <button onClick={onSkip} style={styles.skipBtn}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 18L18 6M18 6H8M18 6v10"/>
                </svg>
                Skip Ad
              </button>
            )}
          </div>
        </div>

        {/* Skip progress bar (shows during pre-skip window) */}
        {!skippable && elapsed > 0 && (
          <div style={styles.skipProgressContainer}>
            <div style={styles.skipProgressLabel}>Skip available in {Math.ceil(5 - elapsed)}s</div>
            <div style={styles.skipProgressTrack}>
              <div style={{
                ...styles.skipProgressFill,
                width: `${skipProgress * 100}%`,
                transition: 'width 1s linear',
              }} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  backdrop: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.88)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    padding: '20px',
  },
  scanline: {
    position: 'absolute',
    inset: 0,
    background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.012) 2px, rgba(255,255,255,0.012) 4px)',
    pointerEvents: 'none',
  },
  modal: {
    width: '100%',
    maxWidth: '640px',
    background: '#111113',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '20px',
    overflow: 'hidden',
    boxShadow: '0 40px 100px rgba(0,0,0,0.7), 0 0 0 1px rgba(230,0,35,0.1)',
    position: 'relative',
  },
  adLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 20px',
    background: 'rgba(230,0,35,0.08)',
    borderBottom: '1px solid rgba(230,0,35,0.15)',
    fontSize: '11px',
    fontFamily: 'Syne, sans-serif',
    fontWeight: 700,
    letterSpacing: '0.15em',
    color: '#E60023',
  },
  adDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    background: '#E60023',
    boxShadow: '0 0 8px #E60023',
    animation: 'pulse 1.5s ease infinite',
  },
  adContent: {
    position: 'relative',
    minHeight: '270px',
    background: '#0d0d0f',
    overflow: 'hidden',
  },
  adsenseContainer: {
    padding: '12px',
    position: 'relative',
    zIndex: 2,
  },
  adFallback: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  adFallbackInner: {
    textAlign: 'center',
    padding: '40px',
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 24px',
    borderTop: '1px solid rgba(255,255,255,0.06)',
    gap: '16px',
  },
  messageArea: {
    flex: 1,
  },
  waitMessage: {
    fontSize: '14px',
    color: '#a09fad',
    fontFamily: 'DM Sans, sans-serif',
  },
  readyMessage: {
    fontSize: '14px',
    color: '#22c55e',
    fontFamily: 'DM Sans, sans-serif',
    fontWeight: 500,
  },
  timerArea: {
    display: 'flex',
    alignItems: 'center',
  },
  countdownRing: {
    position: 'relative',
    width: '64px',
    height: '64px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  countdownNum: {
    position: 'absolute',
    fontSize: '18px',
    fontWeight: 700,
    fontFamily: 'Syne, sans-serif',
    color: '#f0eff2',
  },
  skipBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 20px',
    background: 'rgba(230,0,35,0.15)',
    border: '1px solid rgba(230,0,35,0.4)',
    borderRadius: '8px',
    color: '#ff6b8a',
    fontSize: '13px',
    fontWeight: 600,
    fontFamily: 'Syne, sans-serif',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    animation: 'fadeUp 0.3s ease forwards',
  },
  skipProgressContainer: {
    padding: '0 24px 16px',
  },
  skipProgressLabel: {
    fontSize: '11px',
    color: '#666675',
    fontFamily: 'DM Sans, sans-serif',
    marginBottom: '6px',
    letterSpacing: '0.05em',
  },
  skipProgressTrack: {
    height: '2px',
    background: 'rgba(255,255,255,0.06)',
    borderRadius: '2px',
    overflow: 'hidden',
  },
  skipProgressFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #E60023, #ff6b35)',
    borderRadius: '2px',
  },
};