import React, { useState, useRef, useCallback } from 'react';
import AdOverlay from './components/AdOverlay.jsx';
import AdBanner from './components/AdBanner.jsx';
import { MediaCard } from './components/MediaCard.jsx';
import { DownloadHistory } from './components/DownloadHistory.jsx';
import FAQSection from './components/FAQSection.jsx';
import { PremiumModal } from './components/PremiumModal.jsx';
import { useAdManager } from './hooks/useAdManager.js';
import { usePremium } from './hooks/usePremium.js';

const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

/* ─── Injected global styles (with responsive additions) ─────────────── */
const GlobalStyles = () => (
  <style>{`
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body {
      background: #0d0d10;
      color: #e8e8f0;
      font-family: 'DM Sans', system-ui, sans-serif;
      -webkit-font-smoothing: antialiased;
    }
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&family=DM+Mono:wght@400&display=swap');

    .container { max-width: 1100px; margin: 0 auto; padding: 0 24px; }

    @keyframes spin { to { transform: rotate(360deg); } }
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(18px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes shimmer {
      0%   { background-position: -200% center; }
      100% { background-position: 200% center; }
    }
    @keyframes pulseGlow {
      0%, 100% { box-shadow: 0 0 20px rgba(230,0,35,0.2); }
      50%       { box-shadow: 0 0 36px rgba(230,0,35,0.45); }
    }
    @keyframes toastIn {
      from { opacity: 0; transform: translateY(12px); }
      to   { opacity: 1; transform: translateY(0); }
    }

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
    button:hover { filter: brightness(1.1); }

    /* Range input styling */
    input[type=range] {
      appearance: none;
      background: rgba(255,255,255,0.15);
      border-radius: 4px;
    }
    input[type=range]::-webkit-slider-thumb {
      appearance: none;
      width: 12px;
      height: 12px;
      background: #E60023;
      border-radius: 50%;
    }

    /* ========== RESPONSIVE FIXES ========== */
    @media (max-width: 600px) {
      /* Header */
      .app-header {
        height: 56px !important;
      }
      .app-header .logo-text {
        font-size: 18px !important;
      }
      .app-header nav {
        gap: 12px !important;
      }
      .app-header nav a,
      .app-header nav button {
        font-size: 12px !important;
        padding: 5px 10px !important;
      }

      /* Hero input card */
      .hero-input-card {
        padding: 12px !important;
      }
      .hero-input-card .input-row {
        flex-direction: column !important;
        align-items: stretch !important;
      }
      .hero-input-card .input-row button {
        width: 100% !important;
        margin-top: 8px !important;
      }
      .hero-input-card .action-buttons {
        flex-direction: column !important;
      }
      .hero-input-card .action-buttons button {
        width: 100% !important;
      }

      /* Features grid */
      .features-grid {
        gap: 8px !important;
        margin-bottom: 32px !important;
      }
      .features-grid > div {
        padding: 16px !important;
      }

      /* How it works */
      .how-steps {
        flex-direction: column !important;
        align-items: center !important;
      }
      .how-step {
        max-width: 100% !important;
        margin-bottom: 24px !important;
      }
      .how-step-arrow {
        display: none !important;
      }

      /* Premium badge */
      .premium-badge button,
      .premium-badge div[role="button"] {
        padding: 4px 8px !important;
        font-size: 11px !important;
      }
      .premium-badge .nudge-text {
        max-width: 100px !important;
      }

      /* Footer */
      .app-footer {
        padding-top: 24px !important;
        padding-bottom: 32px !important;
      }
      .app-footer .footer-links {
        flex-wrap: wrap !important;
        justify-content: center !important;
      }
    }

    /* Extra small screens (under 400px) */
    @media (max-width: 400px) {
      .hero-input-card .input-row input {
        font-size: 14px !important;
      }
      .features-grid {
        grid-template-columns: 1fr !important;
      }
    }
  `}</style>
);

/* ─── Icon ────────────────────────────────────────────────────────────── */
function PinIcon({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
    </svg>
  );
}

/* ─── Features ───────────────────────────────────────────────────────── */
function Features() {
  const features = [
    { icon: '⚡', label: 'Lightning Fast', desc: 'Async streaming for instant results' },
    { icon: '◆', label: 'Original Quality', desc: 'No compression, no watermarks ever' },
    { icon: '▶', label: 'Preview First', desc: 'Watch before you download' },
    { icon: '⊞', label: 'No Sign-up', desc: 'Just paste, preview, download' },
  ];

  return (
    <div className="features-grid" style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
      gap: '12px',
      marginBottom: '52px',
    }}>
      {features.map((f, i) => (
        <div key={i} style={{
          padding: '22px 20px',
          background: 'rgba(255,255,255,0.025)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '7px',
          animation: `fadeUp 0.5s ease ${0.1 + i * 0.07}s both`,
          transition: 'border-color 0.2s',
        }}>
          <span style={{ fontSize: '20px', marginBottom: '2px' }}>{f.icon}</span>
          <strong style={{ fontSize: '14px', fontWeight: 700, fontFamily: 'Syne, sans-serif', color: '#ededf0' }}>{f.label}</strong>
          <span style={{ fontSize: '12px', color: '#5a5a6a', fontFamily: 'DM Sans, sans-serif', lineHeight: 1.5 }}>{f.desc}</span>
        </div>
      ))}
    </div>
  );
}

/* ─── How It Works ────────────────────────────────────────────────────── */
function HowItWorks() {
  const steps = [
    { n: '01', title: 'Copy Pin URL', desc: 'Copy any Pinterest video pin link from your browser or the app.' },
    { n: '02', title: 'Paste & Preview', desc: 'Paste the URL, hit Analyze, then watch the video right in your browser.' },
    { n: '03', title: 'Download Free', desc: 'Click Download — your MP4 saves instantly, no watermark.' },
  ];
  return (
    <section id="how" style={{ padding: '60px 0', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)', marginBottom: '60px' }}>
      <div style={{ fontSize: '11px', fontFamily: 'Syne, sans-serif', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#E60023', marginBottom: '12px', textAlign: 'center' }}>How It Works</div>
      <h2 style={{ fontSize: 'clamp(22px, 4vw, 32px)', fontWeight: 800, color: '#ededf0', fontFamily: 'Syne, sans-serif', textAlign: 'center', marginBottom: '44px' }}>
        Three steps to any Pinterest video
      </h2>
      <div className="how-steps" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', gap: '0', flexWrap: 'wrap' }}>
        {steps.map((s, i) => (
          <div key={i} className="how-step" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', maxWidth: '260px', padding: '0 24px', flex: '1 1 200px', position: 'relative' }}>
            <div style={{ fontSize: '44px', fontWeight: 800, fontFamily: 'Syne, sans-serif', color: 'rgba(230,0,35,0.12)', marginBottom: '14px', lineHeight: 1 }}>{s.n}</div>
            <h3 style={{ fontSize: '16px', fontWeight: 700, fontFamily: 'Syne, sans-serif', color: '#ededf0', marginBottom: '10px' }}>{s.title}</h3>
            <p style={{ fontSize: '13px', color: '#5a5a6a', fontFamily: 'DM Sans, sans-serif', lineHeight: 1.65 }}>{s.desc}</p>
            {i < steps.length - 1 && (
              <div className="how-step-arrow" style={{ position: 'absolute', right: '-8px', top: '16px', fontSize: '18px', color: 'rgba(230,0,35,0.25)' }}>→</div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── Main App ──────────────────────────────────────────────────────── */
export default function App() {
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [media, setMedia] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [toast, setToast] = useState(null);
  const [isFocused, setIsFocused] = useState(false);

  const inputRef = useRef(null);
  const resultRef = useRef(null);

  const { adState, gateDownload, skipAd } = useAdManager();
  const { isPremium, showUpgrade, setShowUpgrade } = usePremium();

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
      if (data.media.type !== 'video') throw new Error('This pin does not contain a video. Only video pins are supported.');

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
    } catch {
      // clipboard not accessible
    }
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
        <div style={{
          position: 'fixed', bottom: '24px', right: '24px',
          padding: '13px 18px',
          background: toast.type === 'error' ? '#1a0005' : '#081408',
          border: `1px solid ${toast.type === 'error' ? 'rgba(230,0,35,0.3)' : 'rgba(34,197,94,0.3)'}`,
          borderRadius: '12px',
          color: toast.type === 'error' ? '#ff7090' : '#4ade80',
          fontSize: '13px',
          fontFamily: 'DM Sans, sans-serif',
          fontWeight: 500,
          zIndex: 9999,
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          backdropFilter: 'blur(12px)',
          animation: 'toastIn 0.25s ease',
        }}>
          {toast.type === 'error' ? '✕' : '✓'} {toast.msg}
        </div>
      )}

      {/* Background effects */}
      <div style={{ position: 'fixed', top: '-220px', left: '50%', transform: 'translateX(-50%)', width: '900px', height: '700px', background: 'radial-gradient(ellipse at center, rgba(230,0,35,0.07) 0%, transparent 60%)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'fixed', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)', backgroundSize: '64px 64px', pointerEvents: 'none', zIndex: 0, maskImage: 'radial-gradient(ellipse at 50% 0%, black 0%, transparent 65%)' }} />

      {/* Header */}
      <header className="app-header" style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(13,13,16,0.88)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg, #E60023, #ad081b)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', boxShadow: '0 4px 16px rgba(230,0,35,0.35)', animation: 'pulseGlow 3s ease infinite' }}>
              <PinIcon size={18} />
            </div>
            <span className="logo-text" style={{ fontSize: '21px', fontWeight: 800, fontFamily: 'Syne, sans-serif', color: '#ededf0', letterSpacing: '-0.02em' }}>
              Pin<span style={{ color: '#E60023' }}>Drop</span>
            </span>
          </div>
          <nav style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <a href="#how" style={{ fontSize: '14px', color: '#5a5a6a', textDecoration: 'none', fontWeight: 500, transition: 'color 0.2s' }}>How It Works</a>
            <a href="#faq" style={{ fontSize: '14px', color: '#5a5a6a', textDecoration: 'none', fontWeight: 500, transition: 'color 0.2s' }}>FAQ</a>
            {!isPremium && (
              <button
                onClick={() => setShowUpgrade(true)}
                style={{ background: 'linear-gradient(135deg, #f5c842, #e69a10)', border: 'none', borderRadius: '100px', padding: '7px 14px', color: '#0e0e10', fontSize: '13px', fontWeight: 800, fontFamily: 'Syne, sans-serif', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', boxShadow: '0 4px 14px rgba(245,200,66,0.25)' }}
              >
                ⚡ Premium
              </button>
            )}
            {isPremium && (
              <span style={{ fontSize: '13px', color: '#f5c842', fontWeight: 700, fontFamily: 'Syne, sans-serif' }}>⚡ Premium</span>
            )}
          </nav>
        </div>
      </header>

      <main style={{ position: 'relative', zIndex: 1 }}>
        {/* Hero */}
        <section style={{ paddingTop: '80px', paddingBottom: '60px' }}>
          <div className="container">
            <div style={{ maxWidth: '720px', margin: '0 auto', textAlign: 'center' }}>

              {/* Eyebrow */}
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '11px', fontFamily: 'Syne, sans-serif', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#E60023', padding: '6px 14px', background: 'rgba(230,0,35,0.07)', border: '1px solid rgba(230,0,35,0.18)', borderRadius: '100px', marginBottom: '28px', animation: 'fadeUp 0.5s ease 0.05s both' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#E60023', display: 'inline-block' }} />
                Free Pinterest Video Downloader
              </div>

              <h1 style={{ fontSize: 'clamp(36px, 7vw, 66px)', fontWeight: 800, fontFamily: 'Syne, sans-serif', color: '#ededf0', lineHeight: 1.08, letterSpacing: '-0.03em', marginBottom: '20px', animation: 'fadeUp 0.55s ease 0.1s both' }}>
                Save Pinterest<br />
                <span className="gradient-text">Videos Instantly</span>
              </h1>

              <p style={{ fontSize: 'clamp(15px, 2vw, 18px)', color: '#888897', fontFamily: 'DM Sans, sans-serif', lineHeight: 1.7, marginBottom: '40px', animation: 'fadeUp 0.55s ease 0.15s both' }}>
                Preview any Pinterest video before downloading it in full original quality.<br />
                No watermarks. No registration. Just MP4.
              </p>

              {/* Input card */}
              <div className="hero-input-card" style={{ background: '#121215', border: `1px solid ${inputBorderColor}`, borderRadius: '20px', padding: '18px', marginBottom: '20px', boxShadow: isFocused ? '0 0 0 4px rgba(230,0,35,0.07), 0 20px 60px rgba(0,0,0,0.4)' : '0 20px 60px rgba(0,0,0,0.35)', transition: 'border-color 0.25s, box-shadow 0.25s', animation: 'fadeUp 0.6s ease 0.2s both' }}>
                <div className="input-row" style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#0a0a0e', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', padding: '4px 4px 4px 16px', marginBottom: '14px' }}>
                  <div style={{ color: '#E60023', opacity: 0.6, display: 'flex', flexShrink: 0 }}><PinIcon size={18} /></div>
                  <input
                    ref={inputRef}
                    type="url"
                    value={url}
                    onChange={e => setUrl(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder="Paste Pinterest video URL here…"
                    style={{ flex: 1, background: 'transparent', border: 'none', color: '#ededf0', fontSize: '15px', fontFamily: 'DM Sans, sans-serif', padding: '12px 0' }}
                    spellCheck={false}
                    autoComplete="off"
                  />
                  {url && (
                    <button onClick={handleClear} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: '#555560', width: '30px', height: '30px', borderRadius: '7px', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '4px', flexShrink: 0 }}>✕</button>
                  )}
                </div>

                <div className="action-buttons" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <button
                    onClick={handlePaste}
                    style={{ padding: '12px 16px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', color: '#888897', fontSize: '13px', fontWeight: 500, fontFamily: 'DM Sans, sans-serif', cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }}
                  >
                    ⊕ Paste
                  </button>
                  <button
                    onClick={handleAnalyze}
                    disabled={status === 'loading'}
                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '9px', padding: '13px 24px', background: status === 'loading' ? 'rgba(230,0,35,0.5)' : 'linear-gradient(135deg, #E60023 0%, #b8001c 100%)', border: 'none', borderRadius: '10px', color: '#fff', fontSize: '15px', fontWeight: 700, fontFamily: 'Syne, sans-serif', cursor: status === 'loading' ? 'not-allowed' : 'pointer', boxShadow: status === 'loading' ? 'none' : '0 4px 20px rgba(230,0,35,0.35)', transition: 'all 0.2s' }}
                  >
                    {status === 'loading' ? (
                      <><span style={{ display: 'inline-block', width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} /> Analyzing…</>
                    ) : 'Analyze & Preview'}
                  </button>
                </div>

                {status === 'error' && errorMsg && (
                  <div style={{ marginTop: '12px', padding: '12px 16px', background: 'rgba(230,0,35,0.05)', border: '1px solid rgba(230,0,35,0.18)', borderRadius: '8px', color: '#ff7090', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'DM Sans, sans-serif' }}>
                    <span>✕</span> {errorMsg}
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px', animation: 'fadeUp 0.6s ease 0.25s both' }}>
                {['MP4 Video', 'Original Quality', 'No Watermark', 'Free'].map(tag => (
                  <span key={tag} style={{ fontSize: '11px', color: '#3a3a4a', padding: '4px 11px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '100px', fontFamily: 'DM Sans, sans-serif' }}>{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Top ad banner */}
        <div className="container">
          <AdBanner slot="top" format="responsive" />
        </div>

        {/* Features */}
        <section style={{ paddingBottom: '40px' }}>
          <div className="container">
            <Features />
          </div>
        </section>

        {/* Result */}
        {status === 'success' && media && (
          <section ref={resultRef} style={{ paddingBottom: '64px' }}>
            <div className="container">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 12px #22c55e' }} />
                <span style={{ fontSize: '12px', fontFamily: 'Syne, sans-serif', fontWeight: 700, color: '#22c55e', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Video Found</span>
              </div>
              <div style={{ maxWidth: '540px' }}>
                <MediaCard media={media} onDownload={handleDownload} />
              </div>
            </div>
          </section>
        )}

        {/* Post-result ad */}
        {status === 'success' && (
          <div className="container" style={{ marginBottom: '60px' }}>
            <AdBanner slot="4218418628" format="responsive" />
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
        <footer className="app-footer" style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '36px', paddingBottom: '48px', marginTop: '40px' }}>
          <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#2a2a35' }}>
              <PinIcon size={16} />
              <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '16px' }}>PinDrop</span>
            </div>
            <p style={{ fontSize: '12px', color: '#2e2e3a', fontFamily: 'DM Sans, sans-serif', maxWidth: '480px', lineHeight: 1.7 }}>
              Not affiliated with Pinterest, Inc. All trademarks belong to their respective owners.<br />
              Please respect copyright and only download content you have rights to.
            </p>
            <div className="footer-links" style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              {['FAQ', 'Privacy', 'Terms'].map((link, i) => (
                <React.Fragment key={link}>
                  {i > 0 && <span style={{ color: '#222228' }}>·</span>}
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