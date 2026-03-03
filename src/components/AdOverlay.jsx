// components/AdOverlay.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Full-screen download gate. Fires on EVERY download (frequency=1).
//
// PRIMARY:   ExoClick VAST  zone 5863172  (pindrinstream)
//            https://s.magsrv.com/v1/vast.php?idzone=5863172
// FALLBACK:  ExoClick display banner zone 5862972 if VAST has no fill / errors
//
// Timing:    10s total · skip at 5s  (matches useAdManager)
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useRef, useState, useCallback } from 'react';

// ── Config ────────────────────────────────────────────────────────────────────
const VAST_TAG        = 'https://s.magsrv.com/v1/vast.php?idzone=5863172';
const IMA_SDK_URL     = 'https://imasdk.googleapis.com/js/sdkloader/ima3.js';

// ExoClick fallback display banner (same provider, no extra script needed)
const FB_ZONE_ID      = '5862972';
const FB_ZONE_CLASS   = 'eas6a97888e10';
const PROVIDER_SCRIPT = 'https://a.magsrv.com/ad-provider.js';

const AD_DURATION   = 10;
const SKIP_AFTER    = 5;
const CIRCUMFERENCE = 2 * Math.PI * 44;

// ── Module-level singletons ───────────────────────────────────────────────────
let imaSdkLoading   = false;
let providerLoaded  = false;

function ensureImaSdk(cb) {
  if (window.google?.ima) { cb(); return; }
  if (imaSdkLoading) {
    const poll = setInterval(() => {
      if (window.google?.ima) { clearInterval(poll); cb(); }
    }, 80);
    return;
  }
  imaSdkLoading = true;
  const s = document.createElement('script');
  s.src     = IMA_SDK_URL;
  s.async   = true;
  s.onload  = cb;
  s.onerror = cb;   // trigger fallback path on load failure
  document.head.appendChild(s);
}

function ensureProviderScript(cb) {
  if (providerLoaded || document.querySelector(`script[src="${PROVIDER_SCRIPT}"]`)) {
    providerLoaded = true;
    // Script may still be loading — give it a moment
    setTimeout(cb, 300);
    return;
  }
  providerLoaded = true;
  const s = document.createElement('script');
  s.src   = PROVIDER_SCRIPT;
  s.async = true;
  s.onload  = cb;
  s.onerror = cb;
  document.head.appendChild(s);
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function AdOverlay({ adState, onSkip }) {
  const { visible, countdown, skippable } = adState;

  const adContainerRef  = useRef(null);
  const videoRef        = useRef(null);
  const fallbackRef     = useRef(null);
  const adsManagerRef   = useRef(null);
  const imaInitRef      = useRef(false);
  const fallbackInjRef  = useRef(false);

  const [mounted,    setMounted]    = useState(false);
  const [vastFailed, setVastFailed] = useState(false);

  // Animate in
  useEffect(() => {
    if (visible) requestAnimationFrame(() => setMounted(true));
    else         setMounted(false);
  }, [visible]);

  // ── Fallback: ExoClick display banner ────────────────────────────────────
  const injectFallback = useCallback(() => {
    setVastFailed(true);
    if (fallbackInjRef.current) return;
    fallbackInjRef.current = true;

    const doInject = () => {
      if (!fallbackRef.current) return;

      const ins = document.createElement('ins');
      ins.className         = FB_ZONE_CLASS;
      ins.setAttribute('data-zoneid', FB_ZONE_ID);
      ins.style.display     = 'inline-block';
      ins.style.width       = '300px';
      ins.style.height      = '250px';
      fallbackRef.current.appendChild(ins);

      const srv = document.createElement('script');
      srv.type        = 'application/javascript';
      srv.textContent = `(AdProvider = window.AdProvider || []).push({"serve": {}});`;
      fallbackRef.current.appendChild(srv);
    };

    ensureProviderScript(doInject);
  }, []);

  // ── IMA VAST ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!visible || imaInitRef.current) return;

    ensureImaSdk(() => {
      if (!window.google?.ima) { injectFallback(); return; }

      const t = setTimeout(() => {
        if (!videoRef.current || !adContainerRef.current) { injectFallback(); return; }

        try {
          imaInitRef.current = true;

          const adc = new window.google.ima.AdDisplayContainer(
            adContainerRef.current,
            videoRef.current
          );
          adc.initialize();

          const loader = new window.google.ima.AdsLoader(adc);

          loader.addEventListener(
            window.google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED,
            (e) => {
              const mgr = e.getAdsManager(videoRef.current);
              adsManagerRef.current = mgr;

              mgr.addEventListener(window.google.ima.AdEvent.Type.AD_ERROR,          injectFallback);
              mgr.addEventListener(window.google.ima.AdEvent.Type.COMPLETE,           onSkip);
              mgr.addEventListener(window.google.ima.AdEvent.Type.ALL_ADS_COMPLETED,  onSkip);
              mgr.addEventListener(window.google.ima.AdEvent.Type.SKIPPED,            onSkip);

              try {
                mgr.init(560, 315, window.google.ima.ViewMode.NORMAL);
                mgr.start();
              } catch { injectFallback(); }
            }
          );

          loader.addEventListener(
            window.google.ima.AdErrorEvent.Type.AD_ERROR,
            injectFallback
          );

          const req = new window.google.ima.AdsRequest();
          req.adTagUrl           = VAST_TAG;
          req.linearAdSlotWidth  = 560;
          req.linearAdSlotHeight = 315;
          loader.requestAds(req);

        } catch { injectFallback(); }
      }, 120);

      return () => clearTimeout(t);
    });
  }, [visible, injectFallback, onSkip]);

  // ── Cleanup on close ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!visible) {
      if (adsManagerRef.current) {
        try { adsManagerRef.current.destroy(); } catch {}
        adsManagerRef.current = null;
      }
      imaInitRef.current    = false;
      fallbackInjRef.current = false;
      setVastFailed(false);
    }
  }, [visible]);

  if (!visible) return null;

  const elapsed      = AD_DURATION - countdown;
  const skipProgress = Math.min(elapsed / SKIP_AFTER, 1);
  const dashOffset   = CIRCUMFERENCE * (countdown / AD_DURATION);

  return (
    <div style={s.backdrop}>
      <div style={s.scanline} />

      <div style={{
        ...s.modal,
        transform:  mounted ? 'scale(1) translateY(0)' : 'scale(0.94) translateY(20px)',
        opacity:    mounted ? 1 : 0,
        transition: 'transform 0.36s cubic-bezier(0.34,1.45,0.64,1), opacity 0.26s ease',
      }}>

        {/* Header */}
        <div style={s.adLabel}>
          <span style={s.adDot} />
          <span>Advertisement — Your download starts when the ad ends</span>
        </div>

        {/* Ad area */}
        <div style={s.adContent}>

          {/* IMA VAST container — hidden (not removed) when fallback shows */}
          <div
            ref={adContainerRef}
            style={{ ...s.imaWrap, display: vastFailed ? 'none' : 'block' }}
          >
            <video
              ref={videoRef}
              style={{ position: 'absolute', width: '1px', height: '1px', opacity: 0, pointerEvents: 'none' }}
              playsInline
            />
          </div>

          {/* ExoClick display fallback */}
          {vastFailed && (
            <div style={s.fallbackOuter}>
              <div
                ref={fallbackRef}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 2 }}
              />
              {/* Static message underneath — visible if ExoClick also has no fill */}
              <div style={s.fallbackMsg}>
                <div style={s.fallbackIcon}>
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                      stroke="#E60023" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <p style={s.fallbackTitle}>Support PinDrop</p>
                <p style={s.fallbackSub}>
                  Free downloads are powered by ads.<br />
                  Download starts in <strong style={{ color: '#ededf0' }}>{countdown}s</strong>
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
              <svg width="56" height="56" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
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

        {/* Skip progress bar — shown during the first 5s */}
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

// ── Styles ────────────────────────────────────────────────────────────────────
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
    background: 'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(255,255,255,0.008) 2px,rgba(255,255,255,0.008) 4px)',
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
    padding: '10px 18px',
    background: 'rgba(230,0,35,0.07)',
    borderBottom: '1px solid rgba(230,0,35,0.12)',
    fontSize: '10px', fontFamily: 'Syne, sans-serif',
    fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#c0001d',
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
  // IMA VAST container — fills the whole ad area
  imaWrap: {
    position: 'absolute', inset: 0, zIndex: 2,
  },
  // Fallback layout
  fallbackOuter: {
    position: 'absolute', inset: 0, zIndex: 2,
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
  },
  fallbackMsg: {
    position: 'absolute', inset: 0, zIndex: 1,
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    gap: '8px', padding: '28px', textAlign: 'center',
  },
  fallbackIcon: {
    width: '60px', height: '60px',
    background: 'rgba(230,0,35,0.07)', borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '4px',
  },
  fallbackTitle: { fontSize: '17px', fontWeight: 800, fontFamily: 'Syne, sans-serif', color: '#ededf0' },
  fallbackSub:   { fontSize: '13px', color: '#5a5a6a', fontFamily: 'DM Sans, sans-serif', lineHeight: 1.6 },
  controls: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '13px 18px', borderTop: '1px solid rgba(255,255,255,0.06)',
    gap: '12px', flexWrap: 'wrap',
  },
  leftMsg:  { flex: 1, minWidth: '120px' },
  waitMsg:  { fontSize: '13px', color: '#6a6a7a', fontFamily: 'DM Sans, sans-serif' },
  readyMsg: { fontSize: '13px', color: '#22c55e', fontFamily: 'DM Sans, sans-serif', fontWeight: 500 },
  ring: {
    position: 'relative', width: '52px', height: '52px',
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  ringNum: {
    position: 'absolute', fontSize: '15px', fontWeight: 700,
    fontFamily: 'Syne, sans-serif', color: '#ededf0',
  },
  skipBtn: {
    display: 'flex', alignItems: 'center', gap: '7px', padding: '9px 15px',
    background: 'rgba(230,0,35,0.12)', border: '1px solid rgba(230,0,35,0.35)',
    borderRadius: '9px', color: '#ff6b8a',
    fontSize: '13px', fontWeight: 700, fontFamily: 'Syne, sans-serif',
    cursor: 'pointer', flexShrink: 0, transition: 'background 0.2s',
  },
  skipBar:      { padding: '0 18px 13px' },
  skipBarLabel: { fontSize: '10px', color: '#44444f', fontFamily: 'DM Sans, sans-serif', marginBottom: '5px', letterSpacing: '0.05em' },
  skipTrack:    { height: '2px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' },
  skipFill:     { height: '100%', background: 'linear-gradient(90deg, #E60023, #ff6040)', borderRadius: '2px' },
};