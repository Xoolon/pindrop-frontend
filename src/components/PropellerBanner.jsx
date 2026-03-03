// components/PropellerBanner.jsx
// ─────────────────────────────────────────────────────────────────────────────
// PropellerAds banner for the bottom of MediaCard.
// Renders a 300×250 native banner via PropellerAds zone script.
//
// This keeps PropellerAds completely separate from ExoClick — two networks,
// two different placements, helping reach the $200 threshold on each faster.
//
// Replace PROPELLER_ZONE_ID with your real zone ID from:
//   PropellerAds dashboard → Sites → Zones → Create Zone → Banner 300×250
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useRef } from 'react';

const PROPELLER_ZONE_ID = '10676450'; // ← replace with your real PropellerAds 300×250 zone ID

let propellerScriptInjected = false;

export default function PropellerBanner({ isPremium = false }) {
  const containerRef = useRef(null);
  const injected     = useRef(false);

  if (isPremium) return null;

  useEffect(() => {
    if (injected.current || !containerRef.current) return;
    injected.current = true;

    if (!propellerScriptInjected) {
      propellerScriptInjected = true;
      const s = document.createElement('script');
      s.type      = 'text/javascript';
      s.innerHTML = `
        (function(d,z,s){
          s.src='https://'+ d +'/400/'+ z;
          try{
            (document.body || document.documentElement).appendChild(s);
          } catch(e) {}
        })('groleegni.net', ${PROPELLER_ZONE_ID}, document.createElement('script'));
      `;
      containerRef.current.appendChild(s);
    }
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
          style={{
            display:        'flex',
            justifyContent: 'center',
            alignItems:     'center',
            minHeight:      '250px',
            width:          '100%',
          }}
        />
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    display:       'flex',
    flexDirection: 'column',
    alignItems:    'center',
    width:         '100%',
    marginTop:     '20px',
  },
  labelRow: {
    display:       'flex',
    alignItems:    'center',
    gap:           '12px',
    width:         '100%',
    marginBottom:  '10px',
  },
  label: {
    fontSize:      '10px',
    fontFamily:    'DM Sans, sans-serif',
    fontWeight:    500,
    color:         '#383840',
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    whiteSpace:    'nowrap',
  },
  divider: {
    flex:       1,
    height:     '1px',
    background: 'linear-gradient(90deg, rgba(255,255,255,0.05) 0%, transparent 100%)',
  },
  adBox: {
    width:          '100%',
    background:     'rgba(255,255,255,0.015)',
    border:         '1px dashed rgba(255,255,255,0.05)',
    borderRadius:   '12px',
    overflow:       'hidden',
    display:        'flex',
    alignItems:     'center',
    justifyContent: 'center',
    minHeight:      '250px',
  },
};