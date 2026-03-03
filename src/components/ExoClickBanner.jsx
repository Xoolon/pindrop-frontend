// components/ExoClickBanner.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Renders an ExoClick display banner using the exact <ins> tag approach.
//
// Each ExoClick zone has its OWN class name (e.g. eas6a97888e2, eas6a97888e10).
// Pass the correct zoneClass for each zone.
//
// Zone map for pindr.site:
//   5862972  →  eas6a97888e10   (MediaCard sponsored banner, 300×250)
//
// The ad-provider.js script is loaded ONCE globally via a module-level flag,
// so multiple ExoClickBanner instances on the same page don't double-inject.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useRef } from 'react';

// ── Module-level singleton: script only injected once per page load ───────────
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

// ── Zone → class lookup (add more zones here as needed) ──────────────────────
const ZONE_CLASS_MAP = {
  '5862972': 'eas6a97888e10',   // MediaCard sponsored / bottom banner
  '5863000': 'eas6a97888e2',    // Top / standalone banner (if used)
};

export default function ExoClickBanner({ zoneId, minHeight = 250, className = '' }) {
  const containerRef = useRef(null);
  const injected     = useRef(false);

  useEffect(() => {
    if (injected.current || !containerRef.current || !zoneId) return;
    injected.current = true;

    const zoneClass = ZONE_CLASS_MAP[String(zoneId)] || 'eas6a97888e10';

    // 1. Global provider script
    ensureProviderScript();

    // 2. <ins> placeholder sized to the ad slot
    const ins = document.createElement('ins');
    ins.className = zoneClass;
    ins.setAttribute('data-zoneid', String(zoneId));
    ins.style.display = 'inline-block';
    ins.style.width   = '300px';
    ins.style.height  = `${minHeight}px`;
    containerRef.current.appendChild(ins);

    // 3. Serve push — wait a tick so the ins is in the DOM
    //    and the script has had a moment to begin loading
    const serveScript = document.createElement('script');
    serveScript.type        = 'application/javascript';
    serveScript.textContent = `(AdProvider = window.AdProvider || []).push({"serve": {}});`;
    containerRef.current.appendChild(serveScript);
  }, [zoneId, minHeight]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        display:         'flex',
        justifyContent:  'center',
        alignItems:      'center',
        minHeight:       minHeight,
        width:           '100%',
        overflow:        'hidden',
        borderRadius:    '8px',
      }}
    />
  );
}