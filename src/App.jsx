import React, { useState, useRef, useCallback, useEffect } from 'react';
import AdOverlay from './components/AdOverlay.jsx';
import AdBanner from './components/AdBanner.jsx';
import { MediaCard } from './components/MediaCard.jsx';
import { DownloadHistory } from './components/DownloadHistory.jsx';
import FAQSection from './components/FAQSection.jsx';
import { PremiumModal } from './components/PremiumModal.jsx';
import { useAdManager } from './hooks/useAdManager.js';
import { usePremium } from './hooks/usePremium.js';

const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

/* ─── Global Styles ──────────────────────────────────────────────────────── */
const GlobalStyles = () => (
  <style>{`
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    html {
      scroll-behavior: smooth;
      /* CRITICAL: prevent mobile zoom without disabling user zoom entirely */
      -webkit-text-size-adjust: 100%;
      text-size-adjust: 100%;
    }

    body {
      background: #0d0d10;
      color: #e8e8f0;
      font-family: 'DM Sans', system-ui, sans-serif;
      -webkit-font-smoothing: antialiased;
      overflow-x: hidden;
      width: 100%;
      min-width: 0;
    }

    #root {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      overflow-x: hidden;
      width: 100%;
    }

    .container {
      width: 100%;
      max-width: 1100px;
      margin: 0 auto;
      padding: 0 16px;
    }
    @media (min-width: 480px)  { .container { padding: 0 20px; } }
    @media (min-width: 640px)  { .container { padding: 0 24px; } }
    @media (min-width: 1024px) { .container { padding: 0 40px; } }

    /* ── Animations ── */
    @keyframes spin    { to { transform: rotate(360deg); } }
    @keyframes fadeUp  { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes shimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
    @keyframes pulseGlow { 0%, 100% { box-shadow: 0 0 20px rgba(230,0,35,0.2); } 50% { box-shadow: 0 0 36px rgba(230,0,35,0.45); } }
    @keyframes toastIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }

    .gradient-text {
      background: linear-gradient(135deg, #ff3355 0%, #E60023 40%, #ff6b35 100%);
      background-size: 200% auto;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      animation: shimmer 3s linear infinite;
    }

    input::placeholder { color: #44444f; }
    input:focus { outline: none; }
    a:hover { color: #E60023 !important; }

    input[type=range] { appearance: none; background: rgba(255,255,255,0.15); border-radius: 4px; }
    input[type=range]::-webkit-slider-thumb {
      appearance: none; width: 12px; height: 12px;
      background: #E60023; border-radius: 50%;
    }

    /* ── Touch targets ── */
    button, a, [role="button"] { touch-action: manipulation; -webkit-tap-highlight-color: transparent; }

    /* ── Header nav responsive ── */
    .app-header { height: 56px; }
    @media (min-width: 480px) { .app-header { height: 64px; } }

    .logo-text { font-size: 18px; }
    @media (min-width: 480px) { .logo-text { font-size: 21px; } }

    .header-nav { gap: 12px; }
    @media (min-width: 480px) { .header-nav { gap: 18px; } }
    @media (min-width: 640px) { .header-nav { gap: 24px; } }

    .nav-link { font-size: 13px; }
    @media (min-width: 480px) { .nav-link { font-size: 14px; } }

    /* ── Hero ── */
    .hero-section { padding-top: 48px; padding-bottom: 40px; }
    @media (min-width: 640px) { .hero-section { padding-top: 80px; padding-bottom: 60px; } }

    /* ── Input card ── */
    .hero-input-card { padding: 14px; }
    @media (min-width: 480px) { .hero-input-card { padding: 18px; } }

    .input-row {
      display: flex; align-items: center; gap: 8px;
      background: #0a0a0e; border: 1px solid rgba(255,255,255,0.07);
      border-radius: 12px; padding: 4px 4px 4px 12px; margin-bottom: 12px;
      flex-wrap: nowrap; min-width: 0;
    }
    .input-row input { min-width: 0; font-size: 14px; }
    @media (min-width: 480px) { .input-row input { font-size: 15px; } }

    .action-buttons { display: flex; gap: 8px; align-items: center; }
    @media (max-width: 400px) {
      .action-buttons { flex-direction: column; }
      .action-buttons button { width: 100% !important; }
      .paste-btn { display: none; } /* hide on very small screens */
    }

    /* ── Features grid ── */
    .features-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
    }
    @media (min-width: 640px) {
      .features-grid { grid-template-columns: repeat(4, 1fr); gap: 12px; }
    }

    /* ── How it works ── */
    .how-steps {
      display: flex; align-items: flex-start; justify-content: center;
      gap: 0; flex-wrap: wrap;
    }
    .how-step { max-width: 280px; flex: 1 1 180px; padding: 0 16px; text-align: center; }
    .how-step-arrow { display: none; }
    @media (min-width: 640px) { .how-step-arrow { display: block; } }

    /* ── Footer links ── */
    .footer-links { flex-wrap: wrap; justify-content: center; gap: 10px; }
    .footer-dot { display: none; }
    @media (min-width: 400px) { .footer-dot { display: inline; } }

    /* ── Toast ── */
    .toast {
      position: fixed; bottom: 16px; right: 16px; left: 16px;
      max-width: 340px; margin: 0 auto;
    }
    @media (min-width: 480px) {
      .toast { left: auto; right: 24px; bottom: 24px; max-width: none; margin: 0; }
    }

    /* ── Media card container ── */
    .media-card-root { max-width: 540px; width: 100%; margin: 0 auto; }

    /* ── Result section spacing ── */
    .result-section { padding-bottom: 48px; }
    @media (min-width: 640px) { .result-section { padding-bottom: 64px; } }
  `}</style>
);

/* ─── Icons ──────────────────────────────────────────────────────────────── */
function PinIcon({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
      <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
    </svg>
  );
}

/* ─── Features ────────────────────────────────────────────────────────────── */
function Features() {
  const features = [
    { icon: '⚡', label: 'Lightning Fast', desc: 'Async streaming for instant results' },
    { icon: '◆', label: 'Original Quality', desc: 'No compression, no watermarks ever' },
    { icon: '▶', label: 'Preview First', desc: 'Watch before you download' },
    { icon: '⊞', label: 'No Sign-up', desc: 'Just paste, preview, download' },
  ];

  return (
    <div className="features-grid" style={{ marginBottom: '48px' }}>
      {features.map((f, i) => (
        <div key={i} style={{
          padding: 'clamp(14px, 3vw, 22px) clamp(12px, 2.5vw, 20px)',
          background: 'rgba(255,255,255,0.025)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: '16px',
          display: 'flex', flexDirection: 'column', gap: '6px',
          animation: `fadeUp 0.5s ease ${0.1 + i * 0.07}s both`,
        }}>
          <span style={{ fontSize: 'clamp(16px,4vw,20px)', marginBottom: '2px' }}>{f.icon}</span>
          <strong style={{ fontSize: 'clamp(12px,3vw,14px)', fontWeight: 700, fontFamily: 'Syne, sans-serif', color: '#ededf0' }}>{f.label}</strong>
          <span style={{ fontSize: 'clamp(11px,2.5vw,12px)', color: '#5a5a6a', fontFamily: 'DM Sans, sans-serif', lineHeight: 1.5 }}>{f.desc}</span>
        </div>
      ))}
    </div>
  );
}

/* ─── How It Works ──────────────────────────────────────────────────────── */
function HowItWorks() {
  const steps = [
    { n: '01', title: 'Copy Pin URL', desc: 'Copy any Pinterest video pin link from your browser or the app.' },
    { n: '02', title: 'Paste & Preview', desc: 'Paste the URL, hit Analyze, then watch the video right in your browser.' },
    { n: '03', title: 'Download Free', desc: 'Click Download — your MP4 saves instantly, no watermark.' },
  ];
  return (
    <section id="how" style={{ padding: 'clamp(40px,8vw,60px) 0', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)', marginBottom: 'clamp(40px,8vw,60px)' }}>
      <div style={{ fontSize: '11px', fontFamily: 'Syne, sans-serif', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#E60023', marginBottom: '12px', textAlign: 'center' }}>How It Works</div>
      <h2 style={{ fontSize: 'clamp(20px, 5vw, 32px)', fontWeight: 800, color: '#ededf0', fontFamily: 'Syne, sans-serif', textAlign: 'center', marginBottom: '40px' }}>
        Three steps to any Pinterest video
      </h2>
      <div className="how-steps">
        {steps.map((s, i) => (
          <div key={i} className="how-step" style={{ position: 'relative', marginBottom: '28px' }}>
            <div style={{ fontSize: 'clamp(32px,8vw,44px)', fontWeight: 800, fontFamily: 'Syne, sans-serif', color: 'rgba(230,0,35,0.12)', marginBottom: '12px', lineHeight: 1 }}>{s.n}</div>
            <h3 style={{ fontSize: 'clamp(14px,3.5vw,16px)', fontWeight: 700, fontFamily: 'Syne, sans-serif', color: '#ededf0', marginBottom: '10px' }}>{s.title}</h3>
            <p style={{ fontSize: 'clamp(12px,3vw,13px)', color: '#5a5a6a', fontFamily: 'DM Sans, sans-serif', lineHeight: 1.65 }}>{s.desc}</p>
            {i < steps.length - 1 && (
              <div className="how-step-arrow" style={{ position: 'absolute', right: '-8px', top: '16px', fontSize: '18px', color: 'rgba(230,0,35,0.25)' }}>→</div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── Main App ──────────────────────────────────────────────────────────── */
export default function App() {
  const [url,      setUrl]      = useState('');
  const [status,   setStatus]   = useState('idle');
  const [media,    setMedia]    = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [toast,    setToast]    = useState(null);
  const [isFocused,setIsFocused]= useState(false);

  const inputRef  = useRef(null);
  const resultRef = useRef(null);

  const { adState, gateDownload, skipAd, setPremiumState } = useAdManager();
  const { isPremium, premiumMeta, showUpgrade, setShowUpgrade } = usePremium();

  // Keep adManager in sync with premium state — fixes the stale closure bug
  useEffect(() => {
    setPremiumState(isPremium);
  }, [isPremium, setPremiumState]);

  const showToast = useCallback((msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  }, []);

  const handleAnalyze = useCallback(async () => {
    const trimmed = url.trim();
    if (!trimmed) { inputRef.current?.focus(); return; }
    if (!trimmed.includes('pinterest') && !trimmed.includes('pin.it')) {
      setErrorMsg('Please enter a valid Pinterest or pin.it URL');
      setStatus('error');
      return;
    }
    setStatus('loading');
    setMedia(null);
    setErrorMsg('');

    try {
      const res = await fetch(`${API_BASE}/api/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: trimmed }),
      });
      let data;
      try { data = await res.json(); } catch { throw new Error('Server returned an invalid response'); }
      if (!res.ok) throw new Error(data.detail || `Request failed (${res.status})`);
      if (data.media.type !== 'video') throw new Error('This pin does not contain a video.');

      setMedia(data.media);
      setStatus('success');
      showToast('Video found! Preview it below.');
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 150);
    } catch (err) {
      setStatus('error');
      setErrorMsg(err.message || 'Something went wrong. Please try again.');
    }
  }, [url, showToast]);

  const handleKeyDown = (e) => { if (e.key === 'Enter') handleAnalyze(); };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text.includes('pinterest') || text.includes('pin.it')) {
        setUrl(text);
        showToast('URL pasted!');
      }
    } catch { /* clipboard not accessible */ }
  };

  const handleDownload = useCallback((mediaType, action) => {
    gateDownload(mediaType, () => {
      action();
      showToast('Download started!');
    });
  }, [gateDownload, showToast]);

  const handleClear = () => {
    setUrl(''); setMedia(null); setStatus('idle'); setErrorMsg('');
    inputRef.current?.focus();
  };

  const inputBorderColor = isFocused
    ? 'rgba(230,0,35,0.4)'
    : status === 'error'
    ? 'rgba(230,0,35,0.3)'
    : 'rgba(255,255,255,0.09)';

  return (
    <>
      <GlobalStyles />

      <AdOverlay adState={adState} onSkip={skipAd} />
      <DownloadHistory onSelect={(item) => setUrl(item.url)} />
      {showUpgrade && <PremiumModal onClose={() => setShowUpgrade(false)} />}

      {/* Toast */}
      {toast && (
        <div className="toast" style={{
          padding: '12px 16px',
          background: toast.type === 'error' ? '#1a0005' : '#081408',
          border: `1px solid ${toast.type === 'error' ? 'rgba(230,0,35,0.3)' : 'rgba(34,197,94,0.3)'}`,
          borderRadius: '12px',
          color: toast.type === 'error' ? '#ff7090' : '#4ade80',
          fontSize: '13px', fontFamily: 'DM Sans, sans-serif', fontWeight: 500,
          zIndex: 9999, boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', gap: '8px',
          backdropFilter: 'blur(12px)',
          animation: 'toastIn 0.25s ease',
        }}>
          {toast.type === 'error' ? '✕' : '✓'} {toast.msg}
        </div>
      )}

      {/* Background */}
      <div style={{ position: 'fixed', top: '-220px', left: '50%', transform: 'translateX(-50%)', width: 'min(900px, 100vw)', height: '700px', background: 'radial-gradient(ellipse at center, rgba(230,0,35,0.07) 0%, transparent 60%)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'fixed', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)', backgroundSize: '64px 64px', pointerEvents: 'none', zIndex: 0, maskImage: 'radial-gradient(ellipse at 50% 0%, black 0%, transparent 65%)' }} />

      {/* Header */}
      <header className="app-header" style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(13,13,16,0.88)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '100%' }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            <div style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg, #E60023, #ad081b)', borderRadius: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', boxShadow: '0 4px 16px rgba(230,0,35,0.35)', animation: 'pulseGlow 3s ease infinite', flexShrink: 0 }}>
              <PinIcon size={16} />
            </div>
            <span className="logo-text" style={{ fontWeight: 800, fontFamily: 'Syne, sans-serif', color: '#ededf0', letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>
              Pin<span style={{ color: '#E60023' }}>Drop</span>
            </span>
          </div>

          {/* Nav */}
          <nav className="header-nav" style={{ display: 'flex', alignItems: 'center' }}>
            <a href="#how" className="nav-link" style={{ color: '#5a5a6a', textDecoration: 'none', fontWeight: 500, transition: 'color 0.2s', whiteSpace: 'nowrap' }}>How It Works</a>
            <a href="#faq" className="nav-link" style={{ color: '#5a5a6a', textDecoration: 'none', fontWeight: 500, transition: 'color 0.2s' }}>FAQ</a>
            {!isPremium ? (
              <button
                onClick={() => setShowUpgrade(true)}
                style={{ background: 'linear-gradient(135deg, #f5c842, #e69a10)', border: 'none', borderRadius: '100px', padding: '6px 12px', color: '#0e0e10', fontSize: 'clamp(11px,3vw,13px)', fontWeight: 800, fontFamily: 'Syne, sans-serif', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', boxShadow: '0 4px 14px rgba(245,200,66,0.25)', whiteSpace: 'nowrap', flexShrink: 0 }}
              >
                ⚡ Premium
              </button>
            ) : (
              <span style={{ fontSize: '13px', color: '#f5c842', fontWeight: 700, fontFamily: 'Syne, sans-serif', whiteSpace: 'nowrap' }}>⚡ Premium</span>
            )}
          </nav>
        </div>
      </header>

      <main style={{ position: 'relative', zIndex: 1, flex: 1 }}>

        {/* Hero */}
        <section className="hero-section">
          <div className="container">
            <div style={{ maxWidth: '720px', margin: '0 auto', textAlign: 'center' }}>

              {/* Eyebrow */}
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', fontSize: '10px', fontFamily: 'Syne, sans-serif', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#E60023', padding: '5px 12px', background: 'rgba(230,0,35,0.07)', border: '1px solid rgba(230,0,35,0.18)', borderRadius: '100px', marginBottom: 'clamp(16px,4vw,28px)', animation: 'fadeUp 0.5s ease 0.05s both' }}>
                <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#E60023', display: 'inline-block', flexShrink: 0 }} />
                Free Pinterest Video Downloader
              </div>

              <h1 style={{ fontSize: 'clamp(28px, 8vw, 66px)', fontWeight: 800, fontFamily: 'Syne, sans-serif', color: '#ededf0', lineHeight: 1.08, letterSpacing: '-0.03em', marginBottom: 'clamp(12px,3vw,20px)', animation: 'fadeUp 0.55s ease 0.1s both' }}>
                Save Pinterest<br />
                <span className="gradient-text">Videos Instantly</span>
              </h1>

              <p style={{ fontSize: 'clamp(14px, 3.5vw, 18px)', color: '#888897', fontFamily: 'DM Sans, sans-serif', lineHeight: 1.7, marginBottom: 'clamp(24px,5vw,40px)', animation: 'fadeUp 0.55s ease 0.15s both', padding: '0 4px' }}>
                Preview any Pinterest video before downloading it in full original quality.
                No watermarks. No registration. Just MP4.
              </p>

              {/* Input card */}
              <div className="hero-input-card" style={{
                background: '#121215',
                border: `1px solid ${inputBorderColor}`,
                borderRadius: '20px',
                marginBottom: '16px',
                boxShadow: isFocused ? '0 0 0 4px rgba(230,0,35,0.07), 0 20px 60px rgba(0,0,0,0.4)' : '0 20px 60px rgba(0,0,0,0.35)',
                transition: 'border-color 0.25s, box-shadow 0.25s',
                animation: 'fadeUp 0.6s ease 0.2s both',
              }}>
                {/* Input row */}
                <div className="input-row">
                  <div style={{ color: '#E60023', opacity: 0.6, display: 'flex' }}>
                    <PinIcon size={16} />
                  </div>
                  <input
                    ref={inputRef}
                    type="url"
                    value={url}
                    onChange={e => setUrl(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder="Paste Pinterest video URL here…"
                    style={{ flex: 1, background: 'transparent', border: 'none', color: '#ededf0', fontFamily: 'DM Sans, sans-serif', padding: '10px 0', minWidth: 0 }}
                    spellCheck={false}
                    autoComplete="off"
                    inputMode="url"
                  />
                  {url && (
                    <button onClick={handleClear} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: '#555560', width: '28px', height: '28px', borderRadius: '7px', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '4px', flexShrink: 0 }}>✕</button>
                  )}
                </div>

                {/* Action buttons */}
                <div className="action-buttons">
                  <button
                    className="paste-btn"
                    onClick={handlePaste}
                    style={{ padding: '11px 14px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', color: '#888897', fontSize: '13px', fontWeight: 500, fontFamily: 'DM Sans, sans-serif', cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }}
                  >
                    ⊕ Paste
                  </button>
                  <button
                    onClick={handleAnalyze}
                    disabled={status === 'loading'}
                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px 20px', background: status === 'loading' ? 'rgba(230,0,35,0.5)' : 'linear-gradient(135deg, #E60023 0%, #b8001c 100%)', border: 'none', borderRadius: '10px', color: '#fff', fontSize: 'clamp(13px,3.5vw,15px)', fontWeight: 700, fontFamily: 'Syne, sans-serif', cursor: status === 'loading' ? 'not-allowed' : 'pointer', boxShadow: status === 'loading' ? 'none' : '0 4px 20px rgba(230,0,35,0.35)', transition: 'all 0.2s', whiteSpace: 'nowrap' }}
                  >
                    {status === 'loading' ? (
                      <><span style={{ display: 'inline-block', width: '15px', height: '15px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite', flexShrink: 0 }} /> Analyzing…</>
                    ) : 'Analyze & Preview'}
                  </button>
                </div>

                {status === 'error' && errorMsg && (
                  <div style={{ marginTop: '10px', padding: '11px 14px', background: 'rgba(230,0,35,0.05)', border: '1px solid rgba(230,0,35,0.18)', borderRadius: '8px', color: '#ff7090', fontSize: '13px', display: 'flex', alignItems: 'flex-start', gap: '8px', fontFamily: 'DM Sans, sans-serif', textAlign: 'left' }}>
                    <span style={{ flexShrink: 0 }}>✕</span> {errorMsg}
                  </div>
                )}
              </div>

              {/* Tags */}
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '6px', animation: 'fadeUp 0.6s ease 0.25s both' }}>
                {['MP4 Video', 'Original Quality', 'No Watermark', 'Free'].map(tag => (
                  <span key={tag} style={{ fontSize: '11px', color: '#3a3a4a', padding: '4px 10px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '100px', fontFamily: 'DM Sans, sans-serif', whiteSpace: 'nowrap' }}>{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Top ad banner — hidden for premium */}
        {!isPremium && (
          <div className="container">
            <AdBanner slot="top" format="responsive" isPremium={isPremium} />
          </div>
        )}

        {/* Features */}
        <section style={{ paddingBottom: '32px' }}>
          <div className="container">
            <Features />
          </div>
        </section>

        {/* Result */}
        {status === 'success' && media && (
          <section ref={resultRef} className="result-section">
            <div className="container">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 12px #22c55e', flexShrink: 0 }} />
                <span style={{ fontSize: '11px', fontFamily: 'Syne, sans-serif', fontWeight: 700, color: '#22c55e', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Video Found</span>
              </div>
              <div className="media-card-root">
                <MediaCard media={media} onDownload={handleDownload} isPremium={isPremium} />
              </div>
            </div>
          </section>
        )}

        {/* Post-result ad — hidden for premium */}
        {status === 'success' && !isPremium && (
          <div className="container" style={{ marginBottom: 'clamp(40px,8vw,60px)' }}>
            <AdBanner slot="bottom" format="responsive" isPremium={isPremium} />
          </div>
        )}

        {/* How it works */}
        <div className="container">
          <HowItWorks />
        </div>

        {/* FAQ */}
        <div className="container" id="faq">
          <FAQSection />
        </div>

        {/* Footer */}
        <footer style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '32px', paddingBottom: '48px', marginTop: '32px' }}>
          <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px', textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#2a2a35' }}>
              <PinIcon size={15} />
              <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '15px' }}>PinDrop</span>
            </div>
            <p style={{ fontSize: '12px', color: '#2e2e3a', fontFamily: 'DM Sans, sans-serif', maxWidth: '480px', lineHeight: 1.7 }}>
              Not affiliated with Pinterest, Inc. All trademarks belong to their respective owners.<br />
              Please respect copyright and only download content you have rights to.
            </p>
            <div className="footer-links" style={{ display: 'flex', alignItems: 'center' }}>
              {['FAQ', 'Privacy', 'Terms'].map((link, i) => (
                <React.Fragment key={link}>
                  {i > 0 && <span className="footer-dot" style={{ color: '#222228', margin: '0 8px' }}>·</span>}
                  <a href="#" style={{ fontSize: '12px', color: '#2e2e3a', fontFamily: 'DM Sans, sans-serif', textDecoration: 'none' }}>{link}</a>
                </React.Fragment>
              ))}
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}