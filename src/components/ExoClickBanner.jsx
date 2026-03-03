// components/ExoClickBanner.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Renders an ExoClick display banner using the official <ins> tag approach.
//
// Zone map for pindr.site:
//   5862972  →  eas6a97888e10   (Top mobile banner, below analyze button)
//   5863452  →  eas6a97888e2    (Below MediaCard download button, 300×250)
//   5862978  →  handled by AnchorAd.jsx (sticky bottom)
//   5863172  →  handled by AdOverlay.jsx (VAST in-stream video)
//
// The ad-provider.js script is loaded ONCE globally via a module-level flag.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useRef } from 'react';

// ── Module-level singleton: provider script only injected once per page ───────
let _providerInjected = false;
let _providerReady    = false;
let _onReadyQueue     = [];

function ensureProvider(cb) {
  if (_providerReady) { cb(); return; }
  _onReadyQueue.push(cb);

  if (_providerInjected) return; // already loading, just queued
  _providerInjected = true;

  // Check if already in DOM (e.g. from AnchorAd)
  if (document.querySelector('script[src="https://a.magsrv.com/ad-provider.js"]')) {
    const poll = setInterval(() => {
      if (typeof window.AdProvider !== 'undefined' || typeof window.adProvider !== 'undefined') {
        clearInterval(poll);
        _providerReady = true;
        _onReadyQueue.forEach(fn => fn());
        _onReadyQueue = [];
      }
    }, 80);
    setTimeout(() => {
      clearInterval(poll);
      _providerReady = true;
      _onReadyQueue.forEach(fn => fn());
      _onReadyQueue = [];
    }, 4000);
    return;
  }

  const s   = document.createElement('script');
  s.src     = 'https://a.magsrv.com/ad-provider.js';
  s.async   = true;
  s.type    = 'application/javascript';
  s.onload  = () => {
    _providerReady = true;
    _onReadyQueue.forEach(fn => fn());
    _onReadyQueue = [];
  };
  s.onerror = () => {
    // Still resolve so we don't block downloads
    _providerReady = true;
    _onReadyQueue.forEach(fn => fn());
    _onReadyQueue = [];
  };
  document.head.appendChild(s);
}

// ── Zone → ExoClick INS class name lookup ─────────────────────────────────────
// These class names come directly from your ExoClick dashboard tag snippets.
const ZONE_CLASS_MAP = {
  '5862972': 'eas6a97888e10',  // Mobile banner (top, below analyze)
  '5863452': 'eas6a97888e2',   // 300×250 banner (below MediaCard download btn)
};

// ── Default dimensions per zone ───────────────────────────────────────────────
const ZONE_SIZE_MAP = {
  '5862972': { w: 320, h: 50  },  // mobile banner
  '5863452': { w: 300, h: 250 },  // rectangle
};

export default function ExoClickBanner({ zoneId, className = '' }) {
  const containerRef = useRef(null);
  const injected     = useRef(false);

  useEffect(() => {
    if (injected.current || !containerRef.current || !zoneId) return;
    injected.current = true;

    const zoneStr   = String(zoneId);
    const zoneClass = ZONE_CLASS_MAP[zoneStr] || 'eas6a97888e2';
    const size      = ZONE_SIZE_MAP[zoneStr]  || { w: 300, h: 250 };

    ensureProvider(() => {
      if (!containerRef.current) return;

      // Insert <ins> placeholder
      const ins = document.createElement('ins');
      ins.className = zoneClass;
      ins.setAttribute('data-zoneid', zoneStr);
      ins.style.cssText = `display:inline-block;width:${size.w}px;height:${size.h}px;`;
      containerRef.current.appendChild(ins);

      // Push serve — ExoClick requires this after the <ins> is in the DOM
      const srv = document.createElement('script');
      srv.type        = 'application/javascript';
      srv.textContent = `(AdProvider = window.AdProvider || []).push({"serve": {}});`;
      document.head.appendChild(srv);
    });
  }, [zoneId]);

  const size = ZONE_SIZE_MAP[String(zoneId)] || { w: 300, h: 250 };

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        display:        'flex',
        justifyContent: 'center',
        alignItems:     'center',
        minHeight:      size.h,
        width:          '100%',
        overflow:       'hidden',
        borderRadius:   '8px',
      }}
    />
  );
}