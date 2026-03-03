// components/PropellerAdCard.jsx
import { useEffect, useRef, useState } from 'react';

// ⚠️ REPLACE THIS WITH YOUR ACTUAL PROPELLERADS DISPLAY ZONE ID (300×250)
const PROP_ZONE_ID = '10676990';   // ← CHANGE THIS

const EXO_ZONE_ID  = '5862972';
const EXO_ZONE_CLS = 'eas6a97888e10';

let exoLoaded = false;
let exoCbs = [];
function ensureExo(cb) {
  if (exoLoaded) { cb(); return; }
  exoCbs.push(cb);
  if (document.querySelector('script[src="https://a.magsrv.com/ad-provider.js"]')) {
    const poll = setInterval(() => {
      if (window.AdProvider) { clearInterval(poll); exoLoaded = true; exoCbs.forEach(fn => fn()); exoCbs = []; }
    }, 60);
    setTimeout(() => { clearInterval(poll); exoLoaded = true; exoCbs.forEach(fn => fn()); exoCbs = []; }, 3000);
    return;
  }
  const s = document.createElement('script');
  s.src = 'https://a.magsrv.com/ad-provider.js';
  s.async = true;
  s.onload = () => { exoLoaded = true; exoCbs.forEach(fn => fn()); exoCbs = []; };
  document.head.appendChild(s);
}

export default function PropellerBanner({ isPremium }) {
  const containerRef = useRef(null);
  const exoRef = useRef(null);
  const [showExo, setShowExo] = useState(false);
  const [scriptInjected, setScriptInjected] = useState(false);

  useEffect(() => {
    if (isPremium) return;

    // Inject PropellerAds async display script (only once)
    if (!scriptInjected) {
      const script = document.createElement('script');
      script.src = `https://a.zorrocloud.com/show/${PROP_ZONE_ID}`;
      script.async = true;
      script.setAttribute('data-cfasync', 'false');
      document.head.appendChild(script);
      setScriptInjected(true);
    }

    // Prepare Exo fallback
    ensureExo(() => {
      if (!exoRef.current) return;
      exoRef.current.innerHTML = '';
      const ins = document.createElement('ins');
      ins.className = EXO_ZONE_CLS;
      ins.setAttribute('data-zoneid', EXO_ZONE_ID);
      ins.style.cssText = 'display:inline-block;width:300px;height:250px;';
      exoRef.current.appendChild(ins);
      const srv = document.createElement('script');
      srv.textContent = '(AdProvider = window.AdProvider || []).push({"serve": {}});';
      document.head.appendChild(srv);
    });

    // Fallback timer
    const timer = setTimeout(() => {
      const propFilled = containerRef.current?.querySelector('iframe, img');
      if (!propFilled) setShowExo(true);
    }, 4500);

    return () => clearTimeout(timer);
  }, [isPremium, scriptInjected]);

  if (isPremium) return null;

  return (
    <div style={styles.wrapper}>
      <div style={styles.labelRow}>
        <div style={styles.divider} />
        <span style={styles.label}>Sponsored</span>
        <div style={styles.divider} />
      </div>
      <div style={styles.adBox}>
        {/* PropellerAds slot (hidden if fallback active) */}
        <div
          ref={containerRef}
          style={{ display: showExo ? 'none' : 'block', width: 300, height: 250 }}
          data-zone={PROP_ZONE_ID}
        />
        {/* ExoClick fallback */}
        <div
          ref={exoRef}
          style={{ display: showExo ? 'flex' : 'none', justifyContent: 'center', alignItems: 'center', width: 300, height: 250 }}
        />
      </div>
    </div>
  );
}

const styles = {
  wrapper: { display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', marginTop: 32 },
  labelRow: { display: 'flex', alignItems: 'center', gap: 10, width: '100%', marginBottom: 10 },
  label: { fontSize: 9, fontFamily: 'DM Sans, sans-serif', fontWeight: 600, color: '#2e2e3a', letterSpacing: '0.18em', textTransform: 'uppercase', whiteSpace: 'nowrap' },
  divider: { flex: 1, height: 1, background: 'rgba(255,255,255,0.04)' },
  adBox: { width: 300, height: 250, background: 'rgba(255,255,255,0.012)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: 10, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' },
};