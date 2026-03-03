// components/AdOverlay.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Full-screen download gate overlay for pindr.site.
//
// Video ad source:  ExoClick VAST  (zone 5862980 — replace with your real ID)
//   VAST tag: https://s.magsrv.com/v1/vast.php?idzone=5862980&ex_av=name
//
// Playback:         Google IMA SDK (loaded once from CDN)
// Fallback:         If IMA fails / no fill → PropellerAds native banner + countdown
//
// Timing:           15s total, skip button after 5s
// Frequency:        Controlled by useAdManager (every Nth download)
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useRef, useState, useCallback } from 'react';

// ── ExoClick VAST tag (replace zone ID with your real video zone) ─────────────
const VAST_TAG    = 'https://s.magsrv.com/v1/vast.php?idzone=5862980&ex_av=name';
const IMA_SDK_URL = 'https://imasdk.googleapis.com/js/sdkloader/ima3.js';

// ── PropellerAds fallback banner (shown when VAST has no fill) ───────────────
// Zone ID from your PropellerAds account for a 300×250 banner
const PROPELLER_ZONE = '9505934';   // ← replace with your PropellerAds zone ID

const TOTAL_DURATION = 15;
const SKIP_AFTER     = 5;
const CIRCUMFERENCE  = 2 * Math.PI * 44;

// Module-level flag so IMA SDK only loads once
let imaSdkInjected = false;
function ensureImaSdk(onReady) {
  if (window.google?.ima) { onReady(); return; }
  if (imaSdkInjected) {
    // Already injecting — poll for readiness
    const check = setInterval(() => {
      if (window.google?.ima) { clearInterval(check); onReady(); }
    }, 100);
    return;
  }
  imaSdkInjected = true;
  const s = document.createElement('script');
  s.src   = IMA_SDK_URL;
  s.async = true;
  s.onload  = onReady;
  s.onerror = onReady; // call anyway so fallback takes over
  document.head.appendChild(s);
}

export default function AdOverlay({ adState, onSkip }) {
  const { visible, countdown, skippable } = adState;

  const videoRef       = useRef(null);
  const adContainerRef = useRef(null);
  const adsManagerRef  = useRef(null);
  const propellerRef   = useRef(null);
  const propInjected   = useRef(false);
  const imaInitialized = useRef(false);

  const [mounted,       setMounted]       = useState(false);
  const [vastLoaded,    setVastLoaded]    = useState(false);   // IMA got a valid ad
  const [vastFailed,    setVastFailed]    = useState(false);   // IMA errored / no fill

  // ── Animate in ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (visible) requestAnimationFrame(() => setMounted(true));
    else         setMounted(false);
  }, [visible]);

  // ── PropellerAds fallback banner ──────────────────────────────────────────
  const injectPropellerFallback = useCallback(() => {
    setVastFailed(true);
    if (propInjected.current || !propellerRef.current) return;
    propInjected.current = true;

    // PropellerAds banner script
    const s = document.createElement('script');
    s.type  = 'text/javascript';
    s.innerHTML = `
      (function(d,z,s){
        s.src='https://'+d+'/400/'+z;
        try{ (document.body||document.documentElement).appendChild(s); }
        catch(e){ console.debug('[PropellerAds] fallback inject error:', e); }
      })('groleegni.net', ${PROPELLER_ZONE}, document.createElement('script'));
    `;
    propellerRef.current.appendChild(s);
  }, []);

  // ── Initialize IMA VAST when overlay opens ────────────────────────────────
  useEffect(() => {
    if (!visible || imaInitialized.current) return;

    ensureImaSdk(() => {
      if (!window.google?.ima) {
        injectPropellerFallback();
        return;
      }

      // Small tick so DOM refs are guaranteed mounted
      const t = setTimeout(() => {
        if (!videoRef.current || !adContainerRef.current) {
          injectPropellerFallback();
          return;
        }

        try {
          imaInitialized.current = true;

          const adDisplayContainer = new window.google.ima.AdDisplayContainer(
            adContainerRef.current,
            videoRef.current
          );
          adDisplayContainer.initialize();

          const adsLoader = new window.google.ima.AdsLoader(adDisplayContainer);

          adsLoader.addEventListener(
            window.google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED,
            (e) => {
              const mgr = e.getAdsManager(videoRef.current);
              adsManagerRef.current = mgr;

              mgr.addEventListener(window.google.ima.AdEvent.Type.STARTED, () => {
                setVastLoaded(true);
              });
              mgr.addEventListener(window.google.ima.AdEvent.Type.AD_ERROR,       injectPropellerFallback);
              mgr.addEventListener(window.google.ima.AdEvent.Type.COMPLETE,        onSkip);
              mgr.addEventListener(window.google.ima.AdEvent.Type.ALL_ADS_COMPLETED, onSkip);
              mgr.addEventListener(window.google.ima.AdEvent.Type.SKIPPED,         onSkip);

              try {
                mgr.init(560, 315, window.google.ima.ViewMode.NORMAL);
                mgr.start();
              } catch {
                injectPropellerFallback();
              }
            }
          );

          adsLoader.addEventListener(
            window.google.ima.AdErrorEvent.Type.AD_ERROR,
            injectPropellerFallback
          );

          const req = new window.google.ima.AdsRequest();
          req.adTagUrl            = VAST_TAG;
          req.linearAdSlotWidth   = 560;
          req.linearAdSlotHeight  = 315;
          adsLoader.requestAds(req);

        } catch {
          injectPropellerFallback();
        }
      }, 150);

      return () => clearTimeout(t);
    });
  }, [visible, injectPropellerFallback, onSkip]);

  // ── Cleanup on close ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!visible) {
      if (adsManagerRef.current) {
        try { adsManagerRef.current.destroy(); } catch {}
        adsManagerRef.current = null;
      }
      imaInitialized.current = false;
      propInjected.current   = false;
      setVastLoaded(false);
      setVastFailed(false);
    }
  }, [visible]);

  if (!visible) return null;

  const elapsed      = TOTAL_DURATION - countdown;
  const skipProgress = Math.min(elapsed / SKIP_AFTER, 1);
  const dashOffset   = CIRCUMFERENCE * (countdown / TOTAL_DURATION);

  return (
    <div style={s.backdrop}>
      <div style={s.scanline} />

      <div style={{
        ...s.modal,
        transform:  mounted ? 'scale(1) translateY(0)' : 'scale(0.94) translateY(20px)',
        opacity:    mounted ? 1 : 0,
        transition: 'transform 0.36s cubic-bezier(0.34,1.45,0.64,1), opacity 0.26s ease',
      }}>

        {/* Label bar */}
        <div style={s.adLabel}>
          <span style={s.adDot} />
          <span>Advertisement — Your download starts when the ad ends</span>
        </div>

        {/* Ad content area */}
        <div style={s.adContent}>

          {/* IMA renders the VAST video into this container */}
          <div ref={adContainerRef} style={{
            ...s.imaContainer,
            display: vastFailed ? 'none' : 'flex',
          }}>
            <video
              ref={videoRef}
              style={{ position: 'absolute', width: '1px', height: '1px', opacity: 0 }}
              playsInline
            />
          </div>

          {/* PropellerAds fallback — shown only when VAST fails */}
          {vastFailed && (
            <div style={s.fallbackWrap}>
              <div ref={propellerRef} style={s.propellerSlot} />
              {/* Static fallback if PropellerAds also has no fill */}
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
                  Your download will start in {countdown}s.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
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

        {/* Skip progress bar */}
        {!skippable && elapsed > 0 && (
          <div style={s.skipBar}>
            <div style={s.skipBarLabel}>
              Skip available in {Math.max(0, Math.ceil(SKIP_AFTER - elapsed))}s
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
    background: 'rgba(0,0,0,0.92)',
    backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 9999, padding: '16px',
  },
  scanline: {
    position: 'absolute', inset: 0, pointerEvents: 'none',
    background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.008) 2px, rgba(255,255,255,0.008) 4px)',
  },
  modal: {
    width: '100%', maxWidth: '560px',
    background: '#111115',
    border: '1px solid rgba(255,255,255,0.09)',
    borderRadius: '20px', overflow: 'hidden',
    boxShadow: '0 40px 100px rgba(0,0,0,0.75), 0 0 0 1px rgba(230,0,35,0.07)',
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
    position: 'relative', minHeight: '280px',
    background: '#0c0c0f', overflow: 'hidden',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  // IMA renders into this — must be position:relative and sized
  imaContainer: {
    position: 'absolute', inset: 0, zIndex: 2,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  fallbackWrap: {
    position: 'absolute', inset: 0, zIndex: 2,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  propellerSlot: {
    position: 'absolute', inset: 0, zIndex: 3,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
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
  leftMsg:  { flex: 1, minWidth: '120px' },
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
    transition: 'background 0.2s',
  },
  skipBar:      { padding: '0 20px 14px' },
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