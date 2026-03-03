// components/AdBanner.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Top-of-page sponsored banner for pindr.site.
// Uses ExoClick zone 5863000 (300×250 or whatever size you configured).
// Premium users: pass isPremium={true} to suppress rendering.
//
// NOTE: The old AdSense <ins class="adsbygoogle"> version was using placeholder
// slot IDs (1111111111) which will never fill and can trigger policy flags.
// This version uses the real ExoClick tag instead.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useRef } from 'react';

let providerScriptInjected = false;
function ensureProviderScript() {
  if (providerScriptInjected) return;
  if (document.querySelector('script[src="https://a.magsrv.com/ad-provider.js"]')) {
    providerScriptInjected = true; return;
  }
  const s = document.createElement('script');
  s.src   = 'https://a.magsrv.com/ad-provider.js';
  s.async = true;
  s.type  = 'application/javascript';
  document.head.appendChild(s);
  providerScriptInjected = true;
}

// Top banner zone for pindr.site — add your real zone here
const TOP_ZONE_ID    = '5863000';     // ← your ExoClick top banner zone ID
const TOP_ZONE_CLASS = 'eas6a97888e2';// ← matching class from ExoClick tag

export default function AdBanner({ isPremium = false }) {
  const containerRef = useRef(null);
  const injected     = useRef(false);

  if (isPremium) return null;

  useEffect(() => {
    if (injected.current || !containerRef.current) return;
    injected.current = true;

    ensureProviderScript();

    const ins = document.createElement('ins');
    ins.className = TOP_ZONE_CLASS;
    ins.setAttribute('data-zoneid', TOP_ZONE_ID);
    ins.style.display = 'inline-block';
    ins.style.width   = '300px';
    ins.style.height  = '250px';
    containerRef.current.appendChild(ins);

    const serveScript = document.createElement('script');
    serveScript.type        = 'application/javascript';
    serveScript.textContent = `(AdProvider = window.AdProvider || []).push({"serve": {}});`;
    containerRef.current.appendChild(serveScript);
  }, []);

  return (
    <div style={styles.wrapper}>
      <div style={styles.labelRow}>
        <span style={styles.label}>Sponsored</span>
        <div style={styles.divider} />
      </div>
      <div style={styles.adBox}>
        <div
          ref={containerRef}
          style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '250px', width: '100%' }}
        />
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    width: '100%', padding: '24px 0',
  },
  labelRow: {
    display: 'flex', alignItems: 'center', gap: '12px',
    width: '100%', maxWidth: '728px', marginBottom: '10px',
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
    width: '100%', maxWidth: '728px',
    background: 'rgba(255,255,255,0.015)',
    border: '1px dashed rgba(255,255,255,0.05)',
    borderRadius: '12px', overflow: 'hidden',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    minHeight: '250px',
  },
};