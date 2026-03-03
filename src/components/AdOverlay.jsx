// components/AdOverlay.jsx
// ─────────────────────────────────────────────────────────────────────────────
// ExoClick In-Stream Video (VAST) gate overlay — zone 5863172
//
// Shown BEFORE the download begins. Shows a video ad for 10 seconds,
// skip button appears at 5 seconds. While the ad plays, the actual
// download runs in the background so it's ready immediately after.
//
// Implementation: We use ExoClick's VAST tag via a lightweight IMA-style
// approach. Since ExoClick VAST requires a video player, we embed their
// ad tag inside a <video> element using a VAST XML fetch → parse → play flow.
// For reliability, we use the simpler direct ExoClick JS tag approach that
// injects into a dedicated container.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useRef, useState } from 'react';

const VAST_ZONE_ID    = '5863172';
const AD_DURATION     = 10; // seconds total overlay
const SKIP_AFTER      = 5;  // seconds before skip button appears

// ExoClick VAST / In-Stream tag endpoint
const EXOCLICK_VAST_URL = `https://syndication.exoclick.com/splash.php?type=9&idzone=${VAST_ZONE_ID}`;

export default function AdOverlay({ adState, onSkip }) {
  const { visible, countdown, skippable } = adState;
  const videoRef    = useRef(null);
  const [adError,   setAdError]   = useState(false);
  const [adLoaded,  setAdLoaded]  = useState(false);
  const [vastUrl,   setVastUrl]   = useState(null);

  // Fetch the VAST XML to extract the video media file URL
  useEffect(() => {
    if (!visible) { setAdError(false); setAdLoaded(false); setVastUrl(null); return; }

    const fetchVast = async () => {
      try {
        const res  = await fetch(EXOCLICK_VAST_URL, { mode: 'cors' });
        const text = await res.text();
        const parser = new DOMParser();
        const xml    = parser.parseFromString(text, 'text/xml');

        // Try to find MediaFile elements (video sources)
        const mediaFiles = xml.querySelectorAll('MediaFile');
        let bestUrl = null;

        mediaFiles.forEach(mf => {
          const url = mf.textContent?.trim().replace(/\s/g, '');
          if (url && url.startsWith('http')) bestUrl = url;
        });

        if (bestUrl) {
          setVastUrl(bestUrl);
        } else {
          // No valid VAST media — skip gracefully so download proceeds
          setAdError(true);
          setTimeout(() => onSkip?.(), 300);
        }
      } catch {
        // Network error or CORS block — skip gracefully
        setAdError(true);
        setTimeout(() => onSkip?.(), 300);
      }
    };

    fetchVast();
  }, [visible]);

  // Play video once we have the URL
  useEffect(() => {
    if (!vastUrl || !videoRef.current) return;
    videoRef.current.src = vastUrl;
    videoRef.current.play().catch(() => {
      // Autoplay blocked — show skip immediately
      setAdError(true);
      setTimeout(() => onSkip?.(), 500);
    });
    setAdLoaded(true);
  }, [vastUrl]);

  if (!visible || adError) return null;

  const progressPct = ((AD_DURATION - countdown) / AD_DURATION) * 100;

  return (
    <div style={styles.backdrop}>
      {/* Dark overlay */}
      <div style={styles.overlay} />

      <div style={styles.modal}>
        {/* Ad label */}
        <div style={styles.topBar}>
          <span style={styles.adLabel}>Advertisement</span>
          <span style={styles.timer}>{countdown}s</span>
        </div>

        {/* Video player */}
        <div style={styles.videoWrap}>
          {!adLoaded && (
            <div style={styles.loadingState}>
              <div style={styles.spinner} />
              <span style={styles.loadingText}>Loading ad…</span>
            </div>
          )}
          <video
            ref={videoRef}
            style={{ ...styles.video, opacity: adLoaded ? 1 : 0 }}
            muted={false}
            playsInline
            autoPlay
            onLoadedData={() => setAdLoaded(true)}
            onError={() => { setAdError(true); setTimeout(() => onSkip?.(), 300); }}
            onEnded={() => onSkip?.()}
          />
        </div>

        {/* Progress bar */}
        <div style={styles.progressTrack}>
          <div style={{ ...styles.progressFill, width: `${progressPct}%` }} />
        </div>

        {/* Bottom row */}
        <div style={styles.bottomRow}>
          <span style={styles.downloadingText}>
            ⬇ Preparing your download…
          </span>

          {skippable ? (
            <button onClick={onSkip} style={styles.skipBtn}>
              Skip Ad →
            </button>
          ) : (
            <span style={styles.skipCountdown}>
              Skip in {SKIP_AFTER - (AD_DURATION - countdown)}s
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  backdrop: {
    position:       'fixed',
    inset:          0,
    zIndex:         10000,
    display:        'flex',
    alignItems:     'center',
    justifyContent: 'center',
    padding:        '16px',
  },
  overlay: {
    position:   'absolute',
    inset:      0,
    background: 'rgba(0,0,0,0.85)',
    backdropFilter: 'blur(6px)',
  },
  modal: {
    position:     'relative',
    zIndex:       1,
    width:        '100%',
    maxWidth:     '560px',
    background:   '#0e0e12',
    border:       '1px solid rgba(255,255,255,0.1)',
    borderRadius: '16px',
    overflow:     'hidden',
    boxShadow:    '0 32px 80px rgba(0,0,0,0.7)',
  },
  topBar: {
    display:        'flex',
    justifyContent: 'space-between',
    alignItems:     'center',
    padding:        '10px 14px',
    background:     '#13131a',
    borderBottom:   '1px solid rgba(255,255,255,0.06)',
  },
  adLabel: {
    fontSize:      '10px',
    fontFamily:    'DM Sans, sans-serif',
    fontWeight:    700,
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    color:         'rgba(255,255,255,0.3)',
  },
  timer: {
    fontSize:   '12px',
    fontFamily: 'DM Mono, monospace',
    color:      '#E60023',
    fontWeight: 700,
  },
  videoWrap: {
    position:        'relative',
    width:           '100%',
    aspectRatio:     '16/9',
    background:      '#000',
    display:         'flex',
    alignItems:      'center',
    justifyContent:  'center',
  },
  video: {
    position:   'absolute',
    inset:      0,
    width:      '100%',
    height:     '100%',
    objectFit:  'contain',
    background: '#000',
    transition: 'opacity 0.3s ease',
  },
  loadingState: {
    position:       'absolute',
    inset:          0,
    display:        'flex',
    flexDirection:  'column',
    alignItems:     'center',
    justifyContent: 'center',
    gap:            '12px',
  },
  spinner: {
    width:           '36px',
    height:          '36px',
    border:          '3px solid rgba(255,255,255,0.1)',
    borderTopColor:  '#E60023',
    borderRadius:    '50%',
    animation:       'spin 0.7s linear infinite',
  },
  loadingText: {
    fontSize:   '12px',
    fontFamily: 'DM Sans, sans-serif',
    color:      'rgba(255,255,255,0.3)',
  },
  progressTrack: {
    width:      '100%',
    height:     '3px',
    background: 'rgba(255,255,255,0.08)',
  },
  progressFill: {
    height:     '100%',
    background: '#E60023',
    transition: 'width 1s linear',
  },
  bottomRow: {
    display:        'flex',
    justifyContent: 'space-between',
    alignItems:     'center',
    padding:        '12px 14px',
    background:     '#0a0a0e',
  },
  downloadingText: {
    fontSize:   '12px',
    fontFamily: 'DM Sans, sans-serif',
    color:      'rgba(255,255,255,0.35)',
  },
  skipBtn: {
    background:    'rgba(230,0,35,0.12)',
    border:        '1px solid rgba(230,0,35,0.3)',
    borderRadius:  '8px',
    color:         '#E60023',
    fontSize:      '12px',
    fontFamily:    'DM Sans, sans-serif',
    fontWeight:    700,
    padding:       '7px 16px',
    cursor:        'pointer',
    transition:    'background 0.15s',
  },
  skipCountdown: {
    fontSize:   '12px',
    fontFamily: 'DM Sans, sans-serif',
    color:      'rgba(255,255,255,0.25)',
  },
};