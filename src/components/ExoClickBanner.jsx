import React, { useEffect, useRef } from 'react';

export default function ExoClickBanner({ zoneId, className = '' }) {
  const bannerRef = useRef(null);
  const scriptLoaded = useRef(false);

  useEffect(() => {
    if (!bannerRef.current) return;

    // Clear previous content (important for re-renders)
    bannerRef.current.innerHTML = '';

    // Create the <ins> element
    const ins = document.createElement('ins');
    ins.className = 'eas6a97888e10'; // fixed class name as per your tag
    ins.setAttribute('data-zoneid', zoneId);
    bannerRef.current.appendChild(ins);

    // Load the provider script if not already loaded
    if (!scriptLoaded.current) {
      const script = document.createElement('script');
      script.src = 'https://a.magsrv.com/ad-provider.js';
      script.async = true;
      script.type = 'application/javascript';
      document.head.appendChild(script);
      scriptLoaded.current = true;
    }

    // Push the serve command
    if (window.AdProvider) {
      window.AdProvider.push({ serve: {} });
    } else {
      window.AdProvider = [];
      window.AdProvider.push({ serve: {} });
    }

    // Cleanup: remove ins on unmount? Not necessary, but you could.
    return () => {
      // Optional: remove ins if needed
    };
  }, [zoneId]);

  return (
    <div
      ref={bannerRef}
      className={`exoclick-banner ${className}`}
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100px', // adjust based on ad size
        background: 'rgba(255,255,255,0.02)',
        borderRadius: '8px',
      }}
    />
  );
}