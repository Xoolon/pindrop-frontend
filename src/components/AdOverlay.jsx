// components/AdOverlay.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Full-screen download gate with ExoClick VAST video — zone 5863172
//
// KEY FIXES vs previous version:
//
//  1. IMA SDK RACE: Old code ran inside a setTimeout(120ms) which sometimes
//     beat the SDK load. New code uses a proper promise-based loader that
//     resolves only after window.google.ima is confirmed available.
//
//  2. VIDEO ELEMENT: IMA requires the <video> to be in the visible DOM and
//     sized correctly. Previous code hid it with width:1px/height:1px which
//     caused "linear ad slot size" errors. New code positions the video as
//     an absolutely-placed fill element inside the ad container.
//
//  3. FALLBACK DISPLAY BANNER: Previous fallback injected push() before
//     provider was loaded. New code reuses the same reliable ensureProvider()
//     pattern used across all components.
//
//  4. SKIP BUTTON CLICK-THROUGH: Old backdrop used pointer-events that could
//     bleed through. New code uses explicit stopPropagation on skip.
//
// Timing: 10s total · skippable at 5s (from useAdManager)
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useRef, useState, useCallback } from 'react';

const VAST_TAG    = 'https://s.magsrv.com/v1/vast.php?idzone=5863172';
const IMA_SDK_URL = 'https://imasdk.googleapis.com/js/sdkloader/ima3.js';

const FB_ZONE_ID   = '5862972';
const FB_ZONE_CLS  = 'eas6a97888e10';
const PROVIDER_SRC = 'https://a.magsrv.com/ad-provider.js';

const AD_DURATION   = 10;
const SKIP_AFTER    = 5;
const CIRCUMFERENCE = 2 * Math.PI * 44;

// ── IMA SDK loader (promise-based) ────────────────────────────────────────────
let _imaLoading = false;
let _imaCbs = [];

function loadImaSdk(cb) {
  if (window.google?.ima) { cb(true); return; }
  _imaCbs.push(cb);
  if (_imaLoading) return;
  _imaLoading = true;
  const s   = document.createElement('script');
  s.src     = IMA_SDK_URL;
  s.async   = true;
  s.onload  = () => { const ok = !!window.google?.ima; _imaCbs.forEach(fn => fn(ok)); _imaCbs = []; };
  s.onerror = () => { _imaCbs.forEach(fn => fn(false)); _imaCbs = []; };
  document.head.appendChild(s);
}

// ── ExoClick provider loader ──────────────────────────────────────────────────
let _provLoaded = false;
let _provCbs = [];

function loadProvider(cb) {
  if (_provLoaded) { cb(); return; }
  _provCbs.push(cb);
  if (document.querySelector(`script[src="${PROVIDER_SRC}"]`)) {
    const poll = setInterval(() => {
      if (typeof window.AdProvider !== 'undefined') {
        clearInterval(poll); _provLoaded = true; _provCbs.forEach(fn => fn()); _provCbs = [];
      }
    }, 60);
    setTimeout(() => { clearInterval(poll); _provLoaded = true; _provCbs.forEach(fn => fn()); _provCbs = []; }, 3000);
    return;
  }
  const s   = document.createElement('script');
  s.src     = PROVIDER_SRC;
  s.async   = true;
  s.onload  = () => { _provLoaded = true; _provCbs.forEach(fn => fn()); _provCbs = []; };
  s.onerror = () => { _provLoaded = true; _provCbs.forEach(fn => fn()); _provCbs = []; };
  document.head.appendChild(s);
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function AdOverlay({ adState, onSkip }) {
  const { visible, countdown, skippable } = adState;

  const adContainerRef = useRef(null);
  const videoRef       = useRef(null);
  const fallbackRef    = useRef(null);
  const adsManagerRef  = useRef(null);
  const imaInitRef     = useRef(false);
  const fbInjRef       = useRef(false);

  const [mounted,    setMounted]    = useState(false);
  const [vastFailed, setVastFailed] = useState(false);

  // Animate in
  useEffect(() => {
    if (visible) {
      // Small delay so CSS transition can play
      requestAnimationFrame(() => requestAnimationFrame(() => setMounted(true)));
    } else {
      setMounted(false);
    }
  }, [visible]);

  // ── Fallback: ExoClick display banner ────────────────────────────────────
  const injectFallback = useCallback(() => {
    setVastFailed(true);
    if (fbInjRef.current || !fallbackRef.current) return;
    fbInjRef.current = true;

    loadProvider(() => {
      if (!fallbackRef.current) return;
      fallbackRef.current.innerHTML = '';

      const ins = document.createElement('ins');
      ins.className = FB_ZONE_CLS;
      ins.setAttribute('data-zoneid', FB_ZONE_ID);
      ins.style.cssText = 'display:inline-block;width:300px;height:250px;';
      fallbackRef.current.appendChild(ins);

      const srv = document.createElement('script');
      srv.type        = 'application/javascript';
      srv.textContent = `(AdProvider = window.AdProvider || []).push({"serve": {}});`;
      document.head.appendChild(srv);
    });
  }, []);

  // ── IMA VAST ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!visible || imaInitRef.current) return;

    loadImaSdk((sdkOk) => {
      if (!sdkOk || !window.google?.ima) { injectFallback(); return; }
      if (!videoRef.current || !adContainerRef.current) { injectFallback(); return; }
      if (imaInitRef.current) return;
      imaInitRef.current = true;

      try {
        const adc = new window.google.ima.AdDisplayContainer(
          adContainerRef.current,
          videoRef.current
        );
        adc.initialize();

        const loader = new window.google.ima.AdsLoader(adc);

        loader.addEventListener(
          window.google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED,
          (e) => {
            try {
              const mgr = e.getAdsManager(videoRef.current);
              adsManagerRef.current = mgr;

              mgr.addEventListener(window.google.ima.AdEvent.Type.AD_ERROR,         injectFallback);
              mgr.addEventListener(window.google.ima.AdEvent.Type.COMPLETE,          onSkip);
              mgr.addEventListener(window.google.ima.AdEvent.Type.ALL_ADS_COMPLETED, onSkip);
              mgr.addEventListener(window.google.ima.AdEvent.Type.SKIPPED,           onSkip);

              const W = adContainerRef.current?.offsetWidth  || 560;
              const H = adContainerRef.current?.offsetHeight || 315;
              mgr.init(W, H, window.google.ima.ViewMode.NORMAL);
              mgr.start();
            } catch { injectFallback(); }
          }
        );

        loader.addEventListener(window.google.ima.AdErrorEvent.Type.AD_ERROR, injectFallback);

        const req = new window.google.ima.AdsRequest();
        req.adTagUrl           = VAST_TAG;
        req.linearAdSlotWidth  = adContainerRef.current?.offsetWidth  || 560;
        req.linearAdSlotHeight = adContainerRef.current?.offsetHeight || 315;
        loader.requestAds(req);

      } catch { injectFallback(); }
    });
  }, [visible, injectFallback, onSkip]);

  // ── Cleanup ───────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!visible) {
      if (adsManagerRef.current) {
        try { adsManagerRef.current.destroy(); } catch {}
        adsManagerRef.current = null;
      }
      imaInitRef.current = false;
      fbInjRef.current   = false;
      setVastFailed(false);
    }
  }, [visible]);

  if (!visible) return null;

  const elapsed      = AD_DURATION - countdown;
  const skipProgress = Math.min(elapsed / SKIP_AFTER, 1);
  const dashOffset   = CIRCUMFERENCE * (countdown / AD_DURATION);

  return (
    /* Backdrop — stopPropagation prevents any accidental ad click leaking */
    <div style={s.backdrop} onClick={(e) => e.stopPropagation()}>
      <div style={s.scanline} />

      <div style={{
        ...s.modal,
        transform:  mounted ? 'scale(1) translateY(0)'        : 'scale(0.94) translateY(24px)',
        opacity:    mounted ? 1                                : 0,
        transition: 'transform 0.36s cubic-bezier(0.34,1.45,0.64,1), opacity 0.26s ease',
      }}>

        {/* Header */}
        <div style={s.header}>
          <span style={s.headerDot} />
          <span style={s.headerText}>Advertisement — your download starts when the ad ends</span>
        </div>

        {/* Ad area */}
        <div style={s.adArea}>

          {/* IMA container — hidden (not removed) when fallback is active */}
          <div
            ref={adContainerRef}
            style={{
              position:   'absolute',
              inset:      0,
              zIndex:     2,
              display:    vastFailed ? 'none' : 'block',
            }}
          >
            {/* Video element must be visible for IMA to work */}
            <video
              ref={videoRef}
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', background: '#000' }}
              playsInline
            />
          </div>

          {/* ExoClick display fallback */}
          {vastFailed && (
            <div style={s.fallbackWrap}>
              <div
                ref={fallbackRef}
                style={{ position: 'relative', zIndex: 2 }}
              />
              {/* Message underneath (visible if Exo also has no fill) */}
              <div style={s.fallbackMsg}>
                <div style={s.fallbackIcon}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                      stroke="#E60023" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <p style={s.fallbackTitle}>Support PinDrop</p>
                <p style={s.fallbackSub}>
                  Free downloads are powered by ads.<br />
                  Download starts in{' '}
                  <strong style={{ color: '#ededf0' }}>{countdown}s</strong>
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Controls bar */}
        <div style={s.controls}>
          <div style={{ flex: 1 }}>
            {skippable
              ? <span style={s.readyMsg}>✓ Download ready — skip now</span>
              : <span style={s.waitMsg}>
                  Download begins in{' '}
                  <strong style={{ color: '#ededf0' }}>{countdown}s</strong>
                </span>
            }
          </div>

          {!skippable ? (
            /* Countdown ring */
            <div style={s.ring}>
              <svg width="52" height="52" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
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
            /* Skip button */
            <button
              onClick={(e) => { e.stopPropagation(); onSkip(); }}
              style={s.skipBtn}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <polygon points="5,3 19,12 5,21"/><line x1="19" y1="3" x2="19" y2="21"/>
              </svg>
              Skip Ad
            </button>
          )}
        </div>

        {/* Skip progress bar */}
        {!skippable && elapsed > 0 && (
          <div style={s.skipBarWrap}>
            <span style={s.skipBarLabel}>
              Skip available in {Math.max(0, Math.ceil(SKIP_AFTER - elapsed))}s
            </span>
            <div style={s.skipTrack}>
              <div style={{ ...s.skipFill, width: `${skipProgress * 100}%`, transition: 'width 1s linear' }} />
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────────────
const s = {
  backdrop: {
    position:        'fixed',
    inset:           0,
    background:      'rgba(0,0,0,0.92)',
    backdropFilter:  'blur(14px)',
    display:         'flex',
    alignItems:      'center',
    justifyContent:  'center',
    zIndex:          9999,
    padding:         '16px',
  },
  scanline: {
    position:        'absolute',
    inset:           0,
    pointerEvents:   'none',
    background:      'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(255,255,255,0.007) 2px,rgba(255,255,255,0.007) 4px)',
  },
  modal: {
    width:           '100%',
    maxWidth:        '580px',
    background:      '#111115',
    border:          '1px solid rgba(255,255,255,0.09)',
    borderRadius:    '20px',
    overflow:        'hidden',
    boxShadow:       '0 40px 100px rgba(0,0,0,0.75), 0 0 0 1px rgba(230,0,35,0.07)',
  },
  header: {
    display:         'flex',
    alignItems:      'center',
    gap:             '8px',
    padding:         '10px 18px',
    background:      'rgba(230,0,35,0.07)',
    borderBottom:    '1px solid rgba(230,0,35,0.12)',
  },
  headerDot: {
    display:         'inline-block',
    width:           '6px',
    height:          '6px',
    borderRadius:    '50%',
    background:      '#E60023',
    boxShadow:       '0 0 8px #E60023',
    flexShrink:      0,
  },
  headerText: {
    fontSize:        '10px',
    fontFamily:      'Syne, sans-serif',
    fontWeight:      700,
    letterSpacing:   '0.13em',
    textTransform:   'uppercase',
    color:           '#c0001d',
  },
  adArea: {
    position:        'relative',
    minHeight:       '310px',
    background:      '#0c0c0f',
    overflow:        'hidden',
    display:         'flex',
    alignItems:      'center',
    justifyContent:  'center',
  },
  fallbackWrap: {
    position:        'absolute',
    inset:           0,
    zIndex:          2,
    display:         'flex',
    flexDirection:   'column',
    alignItems:      'center',
    justifyContent:  'center',
    gap:             '12px',
  },
  fallbackMsg: {
    position:        'absolute',
    inset:           0,
    zIndex:          1,
    display:         'flex',
    flexDirection:   'column',
    alignItems:      'center',
    justifyContent:  'center',
    gap:             '8px',
    padding:         '28px',
    textAlign:       'center',
  },
  fallbackIcon: {
    width:           '58px',
    height:          '58px',
    background:      'rgba(230,0,35,0.07)',
    borderRadius:    '50%',
    display:         'flex',
    alignItems:      'center',
    justifyContent:  'center',
    marginBottom:    '4px',
  },
  fallbackTitle: {
    fontSize:        '17px',
    fontWeight:      800,
    fontFamily:      'Syne, sans-serif',
    color:           '#ededf0',
  },
  fallbackSub: {
    fontSize:        '13px',
    color:           '#5a5a6a',
    fontFamily:      'DM Sans, sans-serif',
    lineHeight:      1.6,
  },
  controls: {
    display:         'flex',
    alignItems:      'center',
    justifyContent:  'space-between',
    padding:         '13px 18px',
    borderTop:       '1px solid rgba(255,255,255,0.06)',
    gap:             '12px',
    flexWrap:        'wrap',
  },
  waitMsg: {
    fontSize:        '13px',
    color:           '#6a6a7a',
    fontFamily:      'DM Sans, sans-serif',
  },
  readyMsg: {
    fontSize:        '13px',
    color:           '#22c55e',
    fontFamily:      'DM Sans, sans-serif',
    fontWeight:      500,
  },
  ring: {
    position:        'relative',
    width:           '52px',
    height:          '52px',
    display:         'flex',
    alignItems:      'center',
    justifyContent:  'center',
    flexShrink:      0,
  },
  ringNum: {
    position:        'absolute',
    fontSize:        '15px',
    fontWeight:      700,
    fontFamily:      'Syne, sans-serif',
    color:           '#ededf0',
  },
  skipBtn: {
    display:         'flex',
    alignItems:      'center',
    gap:             '7px',
    padding:         '9px 16px',
    background:      'rgba(230,0,35,0.12)',
    border:          '1px solid rgba(230,0,35,0.35)',
    borderRadius:    '9px',
    color:           '#ff6b8a',
    fontSize:        '13px',
    fontWeight:      700,
    fontFamily:      'Syne, sans-serif',
    cursor:          'pointer',
    flexShrink:      0,
    transition:      'background 0.2s',
  },
  skipBarWrap: {
    padding:         '0 18px 14px',
  },
  skipBarLabel: {
    display:         'block',
    fontSize:        '10px',
    color:           '#44444f',
    fontFamily:      'DM Sans, sans-serif',
    marginBottom:    '5px',
    letterSpacing:   '0.05em',
  },
  skipTrack: {
    height:          '2px',
    background:      'rgba(255,255,255,0.05)',
    borderRadius:    '2px',
    overflow:        'hidden',
  },
  skipFill: {
    height:          '100%',
    background:      'linear-gradient(90deg, #E60023, #ff6040)',
    borderRadius:    '2px',
  },
};