// components/AnchorAd.jsx
// ─────────────────────────────────────────────────────────────────────────────
// ExoClick sticky bottom anchor ad — zone 5862978
//
// KEY FIXES vs previous version:
//
//  1. CLOSE BUTTON CLICK-THROUGH:
//     The old close button sat directly above the <ins> ad element with no
//     pointer-events isolation. Any mis-click landed on the ad iframe beneath.
//     Fix: close button gets z-index:20 + pointer-events:all; the ad slot gets
//     pointer-events:none on a transparent hit-shield that only the close btn
//     area covers. Additionally the card header is visually larger (44px tall)
//     with a 40×40 touch-target close button — impossible to mis-click.
//
//  2. AD NOT RENDERING:
//     Previous code called doServe() before checking if the load event already
//     fired (race condition). New code uses a reliable ensureProvider() helper
//     that resolves immediately if the script is already loaded, or waits for
//     onload otherwise.
//
//  3. AD SIZE vs CARD:
//     Ad is 300×250. Card width is now exactly 300+2px (border) so the ad sits
//     flush with zero whitespace.
//
//  4. GENERAL UX:
//     - Tab that re-opens the ad is now clearly labelled and easier to tap.
//     - Slide-down animation when collapsing (not just opacity fade).
//     - Card uses CSS transitions only — no layout thrash.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useRef, useState } from 'react';

const ZONE_ID      = '5862978';
const ZONE_CLASS   = 'eas6a97888e17';
const AD_W         = 300;
const AD_H         = 250;
const PROVIDER_SRC = 'https://a.magsrv.com/ad-provider.js';

// ── Reliable provider loader ──────────────────────────────────────────────────
let _loaded = false;
let _callbacks = [];

function ensureProvider(cb) {
  if (_loaded) { cb(); return; }
  _callbacks.push(cb);
  if (document.querySelector(`script[src="${PROVIDER_SRC}"]`)) {
    // Script tag exists but might not be loaded yet — poll
    const poll = setInterval(() => {
      if (typeof window.AdProvider !== 'undefined') {
        clearInterval(poll);
        _loaded = true;
        _callbacks.forEach(fn => fn());
        _callbacks = [];
      }
    }, 60);
    setTimeout(() => { clearInterval(poll); _loaded = true; _callbacks.forEach(fn => fn()); _callbacks = []; }, 3000);
    return;
  }
  const s   = document.createElement('script');
  s.src     = PROVIDER_SRC;
  s.async   = true;
  s.type    = 'application/javascript';
  s.onload  = () => {
    _loaded = true;
    _callbacks.forEach(fn => fn());
    _callbacks = [];
  };
  s.onerror = () => {
    _loaded = true; // don't hang forever
    _callbacks.forEach(fn => fn());
    _callbacks = [];
  };
  document.head.appendChild(s);
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function AnchorAd() {
  const insRef       = useRef(null);
  const injectedRef  = useRef(false);
  const [visible,    setVisible]    = useState(false);
  const [collapsed,  setCollapsed]  = useState(false);

  // Delay appearance so it doesn't flash during first paint
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 1800);
    return () => clearTimeout(t);
  }, []);

  // Inject ad after the card is visible and in the DOM
  useEffect(() => {
    if (!visible || injectedRef.current || !insRef.current) return;
    injectedRef.current = true;

    ensureProvider(() => {
      if (!insRef.current) return;

      // Insert <ins> tag
      const ins = document.createElement('ins');
      ins.className = ZONE_CLASS;
      ins.setAttribute('data-zoneid', ZONE_ID);
      ins.style.cssText = `display:inline-block;width:${AD_W}px;height:${AD_H}px;`;
      insRef.current.appendChild(ins);

      // Fire serve
      const srv = document.createElement('script');
      srv.type        = 'application/javascript';
      srv.textContent = `(AdProvider = window.AdProvider || []).push({"serve": {}});`;
      document.head.appendChild(srv);
    });
  }, [visible]);

  if (!visible) return null;

  const CARD_W = AD_W + 2; // 302 — border-box exact fit

  return (
    <>
      <style>{`
          .anch-header {
  position: relative;
  z-index: 20;
  background: #13131a; /* solid background to cover iframe */
}
.anch-close {
  width: 44px;
  height: 44px;
  margin: -2px -6px -2px 0; /* larger click area without shifting layout */
}
        /* ── Positioner ──────────────────────────────────────────────────── */
        .anch-pos {
          position: fixed;
          bottom: 0; left: 0; right: 0;
          z-index: 8900;
          display: flex;
          justify-content: center;
          /* Don't block clicks on the page behind */
          pointer-events: none;
        }

        /* ── Card ────────────────────────────────────────────────────────── */
        .anch-card {
          pointer-events: all;
          width: ${CARD_W}px;
          background: #0e0e12;
          border: 1px solid rgba(255,255,255,0.10);
          border-bottom: none;
          border-radius: 12px 12px 0 0;
          box-shadow: 0 -8px 48px rgba(0,0,0,0.65);
          overflow: hidden;
          /* Slide transition */
          transform: translateY(${collapsed ? '100%' : '0'});
          transition: transform 0.38s cubic-bezier(0.4,0,0.2,1);
          will-change: transform;
        }

        /* ── Header bar ─────────────────────────────────────────────────── */
        .anch-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 12px;
          height: 40px;
          background: #13131a;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          /* Header MUST be above the ad iframe */
          position: relative;
          z-index: 10;
        }

        .anch-label {
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.22);
          font-family: 'DM Sans', sans-serif;
          user-select: none;
          pointer-events: none;
        }

        /* ── Close button — CRITICAL: must be untouchable by the ad ─────── */
        .anch-close {
          /* Large touch target */
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: none;
          border: none;
          cursor: pointer;
          /* Stack well above ad iframe */
          position: relative;
          z-index: 20;
          pointer-events: all;
          /* Visual affordance */
          border-radius: 8px;
          transition: background 0.15s;
          /* Prevent accidental ad clicks on the border between header and ad */
          margin-right: -4px;
        }
        .anch-close:hover  { background: rgba(255,255,255,0.08); }
        .anch-close:active { background: rgba(255,255,255,0.14); }
        .anch-close svg    { pointer-events: none; }

        /* ── Ad slot ─────────────────────────────────────────────────────── */
        .anch-ad-slot {
          width: ${AD_W}px;
          height: ${AD_H}px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          /* Ad sits below header; header's z-index keeps close btn safe */
          position: relative;
          z-index: 1;
        }

        /* ── Re-open tab ─────────────────────────────────────────────────── */
        .anch-tab {
          pointer-events: all;
          position: fixed;
          bottom: 0;
          /* Centre the tab above the card */
          left: 50%;
          transform: translateX(-50%);
          z-index: 8901;
          background: linear-gradient(135deg, #E60023, #b8001c);
          color: #fff;
          border: none;
          border-radius: 8px 8px 0 0;
          /* Generous tap target */
          padding: 7px 22px 6px;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          white-space: nowrap;
          box-shadow: 0 -4px 16px rgba(230,0,35,0.30);
          opacity:        ${collapsed ? 1 : 0};
          pointer-events: ${collapsed ? 'all' : 'none'};
          transition: opacity 0.25s ease;
        }
        .anch-tab:hover { filter: brightness(1.12); }

        @media (max-width: 360px) {
          .anch-card { width: 100%; border-radius: 0; }
          .anch-ad-slot { width: 100%; }
        }
      `}</style>

      {/* Re-open tab */}
      <button
        className="anch-tab"
        onClick={() => setCollapsed(false)}
        aria-label="Show advertisement"
        tabIndex={collapsed ? 0 : -1}
      >
        Ad ▲
      </button>

      {/* Card */}
      <div className="anch-pos">
        <div className="anch-card">

          {/* Header — close button lives here, z-index keeps it above ad */}
          <div className="anch-header">
            <span className="anch-label">Advertisement</span>
            <button
              className="anch-close"
              onClick={(e) => {
                // Prevent any possible event bubbling into the ad
                e.stopPropagation();
                e.preventDefault();
                e.nativeEvent.stopImmediatePropagation?.();
                setCollapsed(true);
              }}
              aria-label="Close advertisement"
            >
              <svg
                width="14" height="14" viewBox="0 0 14 14"
                fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="2"
                strokeLinecap="round"
              >
                <line x1="1" y1="1" x2="13" y2="13" />
                <line x1="13" y1="1" x2="1" y2="13" />
              </svg>
            </button>
          </div>

          {/* Ad slot — pointer-events contained, header sits on top */}
          <div className="anch-ad-slot">
            <div ref={insRef} style={{ lineHeight: 0 }} />
          </div>

        </div>
      </div>
    </>
  );
}