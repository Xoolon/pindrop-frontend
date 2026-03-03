import React, { useEffect, useRef } from 'react';

export default function AnchorAd({ zoneId }) {
  const anchorRef = useRef(null);
  const scriptLoaded = useRef(false);

  useEffect(() => {
    if (!anchorRef.current) return;

    anchorRef.current.innerHTML = '';

    // Create ins (use the same class name as provided by ExoClick – check your tag)
    const ins = document.createElement('ins');
    ins.className = 'eas6a97888e17'; // or whatever class your anchor tag uses
    ins.setAttribute('data-zoneid', zoneId);
    anchorRef.current.appendChild(ins);

    // Load provider script if needed (same as before)
    if (!scriptLoaded.current) {
      const script = document.createElement('script');
      script.src = 'https://a.magsrv.com/ad-provider.js';
      script.async = true;
      document.head.appendChild(script);
      scriptLoaded.current = true;
    }

    window.AdProvider = window.AdProvider || [];
    window.AdProvider.push({ serve: {} });
  }, [zoneId]);

  return (
    <div
      ref={anchorRef}
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        display: 'flex',
        justifyContent: 'center',
        background: 'rgba(13,13,16,0.95)',
        backdropFilter: 'blur(10px)',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        padding: '8px 0',
      }}
    />
  );
}