// components/PropellerBanner.jsx
// ─────────────────────────────────────────────────────────────────────────────
// PropellerAds 300×250 banner — rendered directly in the MediaCard.
//
// ROOT CAUSE OF PREVIOUS FAILURE:
//   The old code used an IIFE that called document.body.appendChild(newScript).
//   PropellerAds' script writes the ad via document.write() or appends to body,
//   so the ad rendered *outside* React's container entirely — invisible in the card.
//
// FIX:
//   Use a named anchor <div id="propeller-banner-{zoneId}"> and load the script
//   as a proper async <script src> pointing to PropellerAds' direct zone URL.
//   PropellerAds will find the nearest container div and render into it.
//
// FALLBACK:
//   If PropellerAds has no fill (common — fill rates are ~60-80%), ExoClick zone
//   5862972 is shown instead. Both networks try every time; whichever fills first
//   wins. This maximises revenue and eliminates empty slots.
//
// Zone IDs:
//   PropellerAds: 10676450  (your real banner zone)
//   ExoClick fallback: 5862972  class: eas6a97888e10
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useRef, useState } from 'react';

const PROP_ZONE_ID      = '10676450';
const PROP_SCRIPT_HOST  = 'a.zorrocloud.com';   // PropellerAds CDN

const EXO_ZONE_ID       = '5862972';
const EXO_ZONE_CLASS    = 'eas6a97888e10';
const EXO_PROVIDER      = 'https://a.magsrv.com/ad-provider.js';

// Module-level singletons — one injection per page load
let propInjected = false;
let exoProviderLoaded = false;

function loadExoProvider(cb) {
  if (exoProviderLoaded || document.querySelector(`script[src="${EXO_PROVIDER}"]`)) {
    exoProviderLoaded = true;
    setTimeout(cb, 200);
    return;
  }
  exoProviderLoaded = true;
  const s = document.createElement('script');
  s.src     = EXO_PROVIDER;
  s.async   = true;
  s.onload  = cb;
  s.onerror = cb;
  document.head.appendChild(s);
}

export default function PropellerBanner({ isPremium = false }) {
  const propAnchorRef  = useRef(null);   // PropellerAds render target
  const exoAnchorRef   = useRef(null);   // ExoClick fallback target
  const injectedRef    = useRef(false);
  const [showFallback, setShowFallback] = useState(false);

  if (isPremium) return null;

  useEffect(() => {
    if (injectedRef.current || !propAnchorRef.current) return;
    injectedRef.current = true;

    // ── 1. PropellerAds: load their zone script directly ─────────────────
    // Their script targets the nearest wrapping div / writes inline.
    // We give it a stable anchor ID so it knows where to render.
    if (!propInjected) {
      propInjected = true;

      const s   = document.createElement('script');
      s.async   = true;
      s.type    = 'text/javascript';
      // PropellerAds direct banner zone script URL
      s.src     = `https://${PROP_SCRIPT_HOST}/show/${PROP_ZONE_ID}`;

      // If PropellerAds fails to load, reveal ExoClick fallback
      s.onerror = () => setShowFallback(true);

      propAnchorRef.current.appendChild(s);
    }

    // ── 2. ExoClick fallback — load in parallel, hidden until needed ─────
    // We pre-load and pre-render it (display:none) so it appears instantly
    // if/when we switch the flag, with no extra load delay.
    loadExoProvider(() => {
      if (!exoAnchorRef.current) return;

      const ins = document.createElement('ins');
      ins.className         = EXO_ZONE_CLASS;
      ins.setAttribute('data-zoneid', EXO_ZONE_ID);
      ins.style.display     = 'inline-block';
      ins.style.width       = '300px';
      ins.style.height      = '250px';
      exoAnchorRef.current.appendChild(ins);

      const srv = document.createElement('script');
      srv.type        = 'application/javascript';
      srv.textContent = `(AdProvider = window.AdProvider || []).push({"serve": {}});`;
      exoAnchorRef.current.appendChild(srv);
    });

    // ── 3. Timeout: if PropellerAds hasn't rendered in 4s, show ExoClick ─
    const timeout = setTimeout(() => {
      // Check if PropellerAds actually rendered something (an iframe or img)
      const hasContent = propAnchorRef.current &&
        (propAnchorRef.current.querySelector('iframe') ||
         propAnchorRef.current.querySelector('img'));
      if (!hasContent) setShowFallback(true);
    }, 4000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div style={styles.wrapper}>
      <div style={styles.labelRow}>
        <span style={styles.label}>Sponsored</span>
        <div style={styles.divider} />
      </div>

      <div style={styles.adBox}>
        {/* PropellerAds slot — visible when NOT showing fallback */}
        <div
          id={`propeller-banner-${PROP_ZONE_ID}`}
          ref={propAnchorRef}
          style={{
            display:        showFallback ? 'none' : 'flex',
            justifyContent: 'center',
            alignItems:     'center',
            width:          '300px',
            minHeight:      '250px',
          }}
        />

        {/* ExoClick fallback slot — pre-rendered, revealed when Propeller fails */}
        <div
          ref={exoAnchorRef}
          style={{
            display:        showFallback ? 'flex' : 'none',
            justifyContent: 'center',
            alignItems:     'center',
            width:          '300px',
            minHeight:      '250px',
          }}
        />
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    width: '100%', marginTop: '20px',
  },
  labelRow: {
    display: 'flex', alignItems: 'center', gap: '12px',
    width: '100%', marginBottom: '10px',
  },
  label: {
    fontSize: '10px', fontFamily: 'DM Sans, sans-serif', fontWeight: 500,
    color: '#383840', letterSpacing: '0.12em', textTransform: 'uppercase', whiteSpace: 'nowrap',
  },
  divider: {
    flex: 1, height: '1px',
    background: 'linear-gradient(90deg, rgba(255,255,255,0.05) 0%, transparent 100%)',
  },
  adBox: {
    width: '100%',
    background: 'rgba(255,255,255,0.015)',
    border: '1px dashed rgba(255,255,255,0.05)',
    borderRadius: '12px', overflow: 'hidden',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    minHeight: '250px',
  },
};