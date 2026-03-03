// components/AdBanner.jsx
// ─────────────────────────────────────────────────────────────────────────────
// ExoClick mobile banner — zone 5862972 (320×50)
// Shown below the analyze button / hero section. Hidden for premium users.
//
// IMPORTANT: This replaces the old Google AdSense component entirely.
// ExoClick was rejecting the site because AdSense code was present.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useRef } from 'react';

const ZONE_ID    = '5862972';
const ZONE_CLASS = 'eas6a97888e10';
const AD_W       = 320;
const AD_H       = 50;

let _scriptInjected = false;
let _scriptReady    = false;
let _queue          = [];

function ensureProvider(cb) {
  if (_scriptReady) { cb(); return; }
  _queue.push(cb);
  if (_scriptInjected) return;
  _scriptInjected = true;

  if (document.querySelector('script[src="https://a.magsrv.com/ad-provider.js"]')) {
    const poll = setInterval(() => {
      if (typeof window.AdProvider !== 'undefined') {
        clearInterval(poll); _scriptReady = true;
        _queue.forEach(fn => fn()); _queue = [];
      }
    }, 80);
    setTimeout(() => { clearInterval(poll); _scriptReady = true; _queue.forEach(fn => fn()); _queue = []; }, 4000);
    return;
  }

  const s   = document.createElement('script');
  s.src     = 'https://a.magsrv.com/ad-provider.js';
  s.async   = true;
  s.type    = 'application/javascript';
  s.onload  = () => { _scriptReady = true; _queue.forEach(fn => fn()); _queue = []; };
  s.onerror = () => { _scriptReady = true; _queue.forEach(fn => fn()); _queue = []; };
  document.head.appendChild(s);
}

export default function AdBanner({ isPremium = false }) {
  const containerRef = useRef(null);
  const injected     = useRef(false);

  useEffect(() => {
    if (isPremium || injected.current || !containerRef.current) return;
    injected.current = true;

    ensureProvider(() => {
      if (!containerRef.current) return;

      const ins = document.createElement('ins');
      ins.className = ZONE_CLASS;
      ins.setAttribute('data-zoneid', ZONE_ID);
      ins.style.cssText = `display:inline-block;width:${AD_W}px;height:${AD_H}px;`;
      containerRef.current.appendChild(ins);

      const srv = document.createElement('script');
      srv.type        = 'application/javascript';
      srv.textContent = `(AdProvider = window.AdProvider || []).push({"serve": {}});`;
      document.head.appendChild(srv);
    });
  }, [isPremium]);

  if (isPremium) return null;

  return (
    <div style={{
      display:        'flex',
      flexDirection:  'column',
      alignItems:     'center',
      width:          '100%',
      padding:        '20px 0',
    }}>
      {/* Subtle sponsored label */}
      <div style={{
        display:       'flex',
        alignItems:    'center',
        gap:           '10px',
        width:         '100%',
        maxWidth:      `${AD_W}px`,
        marginBottom:  '8px',
      }}>
        <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.04)' }} />
        <span style={{
          fontSize:      '9px',
          fontFamily:    'DM Sans, sans-serif',
          fontWeight:    600,
          color:         '#2e2e3a',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          whiteSpace:    'nowrap',
        }}>Sponsored</span>
        <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.04)' }} />
      </div>

      {/* Ad slot */}
      <div
        ref={containerRef}
        style={{
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          minHeight:      `${AD_H}px`,
          minWidth:       `${AD_W}px`,
          borderRadius:   '8px',
          overflow:       'hidden',
          background:     'rgba(255,255,255,0.015)',
          border:         '1px solid rgba(255,255,255,0.04)',
        }}
      />
    </div>
  );
}