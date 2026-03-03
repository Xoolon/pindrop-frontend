// components/AnchorAd.jsx
// ─────────────────────────────────────────────────────────────────────────────
// ExoClick Sticky / Anchor Ad for pindr.site
// Zone: 5862978  |  Class: eas6a97888e17  |  Size: 300×250
//
// - Appears 1.5s after page load (no layout flash)
// - Collapsible with ✕ — resets to open on every page refresh (pure state)
// - Card sized exactly to 300×250 + chrome
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useRef, useState } from 'react';

let providerScriptInjected = false;
function ensureProviderScript() {
  if (providerScriptInjected) return;
  if (document.querySelector('script[src="https://a.magsrv.com/ad-provider.js"]')) {
    providerScriptInjected = true;
    return;
  }
  const s = document.createElement('script');
  s.src   = 'https://a.magsrv.com/ad-provider.js';
  s.async = true;
  s.type  = 'application/javascript';
  document.head.appendChild(s);
  providerScriptInjected = true;
}

const ZONE_ID    = '5862978';
const ZONE_CLASS = 'eas6a97888e17';
const AD_W       = 300;
const AD_H       = 250;

export default function AnchorAd() {
  const containerRef = useRef(null);
  const injected     = useRef(false);

  // collapsed is plain state → always false on fresh page load
  const [collapsed, setCollapsed] = useState(false);
  const [visible,   setVisible]   = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 1500);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!visible || injected.current || !containerRef.current) return;
    injected.current = true;

    ensureProviderScript();

    const ins = document.createElement('ins');
    ins.className = ZONE_CLASS;
    ins.setAttribute('data-zoneid', ZONE_ID);
    ins.style.display = 'inline-block';
    ins.style.width   = `${AD_W}px`;
    ins.style.height  = `${AD_H}px`;
    containerRef.current.appendChild(ins);

    const serveScript = document.createElement('script');
    serveScript.type        = 'application/javascript';
    serveScript.textContent = `(AdProvider = window.AdProvider || []).push({"serve": {}});`;
    containerRef.current.appendChild(serveScript);
  }, [visible]);

  if (!visible) return null;

  const CARD_W = AD_W + 24; // 324px — ad + 12px side padding each

  return (
    <>
      <style>{`
        .anch-positioner {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 9000;
          display: flex;
          justify-content: center;
          pointer-events: none;
        }
        .anch-card {
          pointer-events: all;
          width: ${CARD_W}px;
          background: rgba(13, 13, 16, 0.97);
          border: 1px solid rgba(255, 255, 255, 0.09);
          border-bottom: none;
          border-radius: 14px 14px 0 0;
          box-shadow: 0 -6px 40px rgba(0, 0, 0, 0.6);
          overflow: hidden;
          transition: max-height 0.38s cubic-bezier(0.4, 0, 0.2, 1),
                      opacity    0.25s ease;
          max-height: ${collapsed ? '0px' : '310px'};
          opacity:    ${collapsed ? 0 : 1};
        }
        .anch-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 7px 10px 5px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }
        .anch-label {
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.2);
          font-family: 'DM Sans', sans-serif;
        }
        .anch-close {
          background: rgba(255, 255, 255, 0.05);
          border: none;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          color: rgba(255, 255, 255, 0.35);
          cursor: pointer;
          font-size: 11px;
          line-height: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.15s, color 0.15s;
          font-family: inherit;
        }
        .anch-close:hover { background: rgba(255,255,255,0.12); color: #fff; }
        .anch-ad-slot {
          width: ${AD_W}px;
          height: ${AD_H}px;
          margin: 8px auto 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        /* Reopen tab */
        .anch-tab {
          position: fixed;
          bottom: 0;
          right: calc(50% - ${CARD_W / 2}px + 8px);
          z-index: 9000;
          background: linear-gradient(135deg, #E60023, #b8001c);
          color: #fff;
          border: none;
          border-radius: 8px 8px 0 0;
          padding: 5px 14px 4px;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: opacity 0.22s ease;
          opacity:        ${collapsed ? 1 : 0};
          pointer-events: ${collapsed ? 'all' : 'none'};
        }
        .anch-tab:hover { filter: brightness(1.1); }
        @media (max-width: 340px) {
          .anch-card { width: 100%; border-radius: 0; }
          .anch-ad-slot { width: 100%; }
          .anch-tab { right: 8px; }
        }
      `}</style>

      {/* Reopen tab */}
      <button
        className="anch-tab"
        onClick={() => setCollapsed(false)}
        aria-label="Show advertisement"
      >Ad ▲</button>

      {/* Sticky card */}
      <div className="anch-positioner">
        <div className="anch-card">
          <div className="anch-header">
            <span className="anch-label">Advertisement</span>
            <button
              className="anch-close"
              onClick={() => setCollapsed(true)}
              aria-label="Close advertisement"
            >✕</button>
          </div>
          <div className="anch-ad-slot">
            <div ref={containerRef} style={{ lineHeight: 0 }} />
          </div>
        </div>
      </div>
    </>
  );
}