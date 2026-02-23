import React, { useState, useRef, useCallback, useEffect } from 'react';
import AdOverlay from './components/AdOverlay.jsx';
import AdBanner from './components/AdBanner.jsx';
import MediaCard from './components/MediaCard.jsx';
import FAQSection from './components/FAQSection.jsx';
import { useAdManager } from './hooks/useAdManager.js';

const API_BASE = import.meta.env.VITE_API_URL || '';

function PinIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
    </svg>
  );
}

function Features() {
  const features = [
    { icon: '⚡', label: 'Lightning Fast', desc: 'Async streaming for instant downloads' },
    { icon: '◆', label: 'Original Quality', desc: 'No compression, no watermarks ever' },
    { icon: '▶', label: 'Video + GIF + Image', desc: 'All Pinterest media types supported' },
    { icon: '⊞', label: 'No Registration', desc: 'Just paste, click, download' },
  ];

  return (
    <div style={featureStyles.grid}>
      {features.map((f, i) => (
        <div key={i} style={{
          ...featureStyles.card,
          animation: `fadeUp 0.5s ease ${0.1 + i * 0.08}s both`,
        }}>
          <span style={featureStyles.icon}>{f.icon}</span>
          <strong style={featureStyles.label}>{f.label}</strong>
          <span style={featureStyles.desc}>{f.desc}</span>
        </div>
      ))}
    </div>
  );
}

const featureStyles = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '12px',
    marginBottom: '48px',
  },
  card: {
    padding: '20px',
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '14px',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    transition: 'border-color 0.2s ease, background 0.2s ease',
  },
  icon: { fontSize: '22px', marginBottom: '4px' },
  label: {
    fontSize: '14px',
    fontWeight: 700,
    fontFamily: 'Syne, sans-serif',
    color: '#f0eff2',
    letterSpacing: '0.01em',
  },
  desc: {
    fontSize: '12px',
    color: '#666675',
    fontFamily: 'DM Sans, sans-serif',
    lineHeight: 1.4,
  },
};

function HowItWorks() {
  const steps = [
    { n: '01', title: 'Copy Pin URL', desc: 'Open any Pinterest pin, copy the link from your browser or app' },
    { n: '02', title: 'Paste & Analyze', desc: 'Paste the URL into PinDrop and hit Analyze' },
    { n: '03', title: 'Download', desc: 'Click Download — your media saves in original quality instantly' },
  ];

  return (
    <section style={howStyles.section}>
      <div style={howStyles.eyebrow}>How It Works</div>
      <h2 style={howStyles.title}>Three steps to any Pinterest media</h2>
      <div style={howStyles.steps}>
        {steps.map((s, i) => (
          <div key={i} style={howStyles.step}>
            <div style={howStyles.num}>{s.n}</div>
            <div>
              <h3 style={howStyles.stepTitle}>{s.title}</h3>
              <p style={howStyles.stepDesc}>{s.desc}</p>
            </div>
            {i < steps.length - 1 && <div style={howStyles.arrow}>→</div>}
          </div>
        ))}
      </div>
    </section>
  );
}

const howStyles = {
  section: {
    padding: '60px 0',
    borderTop: '1px solid rgba(255,255,255,0.05)',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
    marginBottom: '60px',
  },
  eyebrow: {
    fontSize: '11px',
    fontFamily: 'Syne, sans-serif',
    fontWeight: 700,
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    color: '#E60023',
    marginBottom: '12px',
    textAlign: 'center',
  },
  title: {
    fontSize: 'clamp(22px, 4vw, 32px)',
    fontWeight: 800,
    color: '#f0eff2',
    fontFamily: 'Syne, sans-serif',
    textAlign: 'center',
    marginBottom: '40px',
  },
  steps: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    gap: '0',
    flexWrap: 'wrap',
    position: 'relative',
  },
  step: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    maxWidth: '240px',
    padding: '0 20px',
    position: 'relative',
    flex: '1 1 200px',
  },
  num: {
    fontSize: '40px',
    fontWeight: 800,
    fontFamily: 'Syne, sans-serif',
    color: 'rgba(230,0,35,0.15)',
    marginBottom: '12px',
    lineHeight: 1,
  },
  stepTitle: {
    fontSize: '16px',
    fontWeight: 700,
    fontFamily: 'Syne, sans-serif',
    color: '#f0eff2',
    marginBottom: '8px',
  },
  stepDesc: {
    fontSize: '13px',
    color: '#666675',
    fontFamily: 'DM Sans, sans-serif',
    lineHeight: 1.6,
  },
  arrow: {
    position: 'absolute',
    right: '-10px',
    top: '16px',
    fontSize: '20px',
    color: 'rgba(230,0,35,0.3)',
  },
};

export default function App() {
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [media, setMedia] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [toast, setToast] = useState(null);
  const inputRef = useRef(null);
  const resultRef = useRef(null);

  const { adState, gateDownload, skipAd } = useAdManager();

  const showToast = useCallback((msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  }, []);

  const handleAnalyze = useCallback(async () => {
    const trimmed = url.trim();
    if (!trimmed) {
      inputRef.current?.focus();
      return;
    }
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
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || 'Failed to analyze URL');
      }

      setMedia(data.media);
      setStatus('success');

      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (err) {
      setStatus('error');
      setErrorMsg(err.message || 'Something went wrong. Please try again.');
    }
  }, [url]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleAnalyze();
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text.includes('pinterest') || text.includes('pin.it')) {
        setUrl(text);
      }
    } catch {}
  };

  const handleDownload = useCallback((mediaType, action) => {
    gateDownload(mediaType, () => {
      action();
      showToast(`Download started! Enjoy your ${mediaType}.`);
    });
  }, [gateDownload, showToast]);

  const handleClear = () => {
    setUrl('');
    setMedia(null);
    setStatus('idle');
    setErrorMsg('');
    inputRef.current?.focus();
  };

  return (
    <div style={appStyles.root}>
      {/* Ad Overlay */}
      <AdOverlay adState={adState} onSkip={skipAd} />

      {/* Toast notification */}
      {toast && (
        <div style={{
          ...appStyles.toast,
          background: toast.type === 'error' ? '#1a0008' : '#0a1a0a',
          borderColor: toast.type === 'error' ? 'rgba(230,0,35,0.3)' : 'rgba(34,197,94,0.3)',
          color: toast.type === 'error' ? '#ff6b8a' : '#4ade80',
        }} className="animate-fadeUp">
          {toast.type === 'error' ? '✕' : '✓'} {toast.msg}
        </div>
      )}

      {/* Background decoration */}
      <div style={appStyles.bgGlow} />
      <div style={appStyles.bgGrid} />

      {/* Header */}
      <header style={appStyles.header}>
        <div className="container" style={appStyles.headerInner}>
          <div style={appStyles.logo}>
            <div style={appStyles.logoIcon}>
              <PinIcon />
            </div>
            <span style={appStyles.logoText}>Pin<span style={{ color: '#E60023' }}>Drop</span></span>
          </div>
          <nav style={appStyles.nav}>
            <a href="#how" style={appStyles.navLink}>How It Works</a>
            <a href="#faq" style={appStyles.navLink}>FAQ</a>
          </nav>
        </div>
      </header>

      <main>
        {/* Hero section */}
        <section style={appStyles.hero}>
          <div className="container">
            <div style={appStyles.heroContent}>
              {/* Eyebrow */}
              <div style={appStyles.eyebrow} className="animate-fadeUp">
                <span style={appStyles.eyebrowDot} />
                Free Pinterest Downloader
              </div>

              {/* Title */}
              <h1 style={appStyles.heroTitle} className="animate-fadeUp">
                Save Pinterest<br />
                <span className="gradient-text">Videos, Images & GIFs</span>
              </h1>

              <p style={appStyles.heroSub} className="animate-fadeUp">
                The fastest way to download any Pinterest media in original quality.
                <br />No watermarks. No registration. Instant.
              </p>

              {/* Input card */}
              <div style={appStyles.inputCard} className="animate-fadeUp">
                <div style={appStyles.inputWrapper}>
                  <div style={appStyles.inputIcon}>
                    <PinIcon />
                  </div>
                  <input
                    ref={inputRef}
                    type="url"
                    value={url}
                    onChange={e => setUrl(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Paste Pinterest or pin.it URL here..."
                    style={appStyles.input}
                    aria-label="Pinterest URL input"
                    spellCheck={false}
                    autoComplete="off"
                  />
                  {url && (
                    <button onClick={handleClear} style={appStyles.clearBtn} aria-label="Clear">✕</button>
                  )}
                </div>

                <div style={appStyles.inputActions}>
                  <button onClick={handlePaste} style={appStyles.pasteBtn}>
                    ⊕ Paste URL
                  </button>
                  <button
                    onClick={handleAnalyze}
                    disabled={status === 'loading'}
                    style={{
                      ...appStyles.analyzeBtn,
                      ...(status === 'loading' ? appStyles.analyzeBtnLoading : {}),
                    }}
                  >
                    {status === 'loading' ? (
                      <><span style={appStyles.btnSpinner} /> Analyzing...</>
                    ) : (
                      <> Analyze & Download</>
                    )}
                  </button>
                </div>

                {/* Error message */}
                {status === 'error' && errorMsg && (
                  <div style={appStyles.errorMsg} className="animate-fadeIn">
                    <span>✕</span> {errorMsg}
                  </div>
                )}
              </div>

              {/* Supported types tags */}
              <div style={appStyles.supportedTags} className="animate-fadeUp">
                {['MP4 Video', 'JPG/PNG Image', 'Animated GIF', 'WebP'].map(tag => (
                  <span key={tag} style={appStyles.tag}>{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Center ad banner */}
        <div className="container">
          <AdBanner slot="1111111111" format="horizontal" />
        </div>

        {/* Features */}
        <section style={appStyles.featuresSection}>
          <div className="container">
            <Features />
          </div>
        </section>

        {/* Result */}
        {status === 'success' && media && (
          <section ref={resultRef} style={appStyles.resultSection}>
            <div className="container">
              <div style={appStyles.resultHeader} className="animate-fadeUp">
                <div style={appStyles.resultDot} />
                <span style={appStyles.resultLabel}>Media Found</span>
              </div>
              <div style={appStyles.cardGrid}>
                <MediaCard media={media} onDownload={handleDownload} />
              </div>
            </div>
          </section>
        )}

        {/* Second ad banner (below result) */}
        {status === 'success' && (
          <div className="container">
            <AdBanner slot="2222222222" format="horizontal" />
          </div>
        )}

        {/* How it works */}
        <div className="container" id="how">
          <HowItWorks />
        </div>

        {/* FAQ + Footer */}
        <FAQSection />

        {/* Footer */}
        <footer style={appStyles.footer}>
          <div className="container" style={appStyles.footerInner}>
            <div style={appStyles.footerLogo}>
              <PinIcon />
              <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800 }}>PinDrop</span>
            </div>
            <p style={appStyles.footerText}>
              Not affiliated with Pinterest, Inc. All trademarks belong to their respective owners.
            </p>
            <div style={appStyles.footerLinks}>
              <a href="#faq" style={appStyles.footerLink}>FAQ</a>
              <span style={{ color: '#2a2a30' }}>·</span>
              <a href="#" style={appStyles.footerLink}>Privacy</a>
              <span style={{ color: '#2a2a30' }}>·</span>
              <a href="#" style={appStyles.footerLink}>Terms</a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

const appStyles = {
  root: {
    minHeight: '100vh',
    position: 'relative',
    zIndex: 1,
  },
  bgGlow: {
    position: 'fixed',
    top: '-200px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '800px',
    height: '600px',
    background: 'radial-gradient(ellipse at center, rgba(230,0,35,0.08) 0%, transparent 65%)',
    pointerEvents: 'none',
    zIndex: 0,
  },
  bgGrid: {
    position: 'fixed',
    inset: 0,
    backgroundImage: `
      linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)
    `,
    backgroundSize: '60px 60px',
    pointerEvents: 'none',
    zIndex: 0,
    maskImage: 'radial-gradient(ellipse at 50% 0%, black 0%, transparent 70%)',
  },
  header: {
    position: 'sticky',
    top: 0,
    zIndex: 100,
    background: 'rgba(10,10,11,0.85)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
  },
  headerInner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '64px',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  logoIcon: {
    width: '36px',
    height: '36px',
    background: 'linear-gradient(135deg, #E60023, #ad081b)',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    flexShrink: 0,
    boxShadow: '0 4px 16px rgba(230,0,35,0.4)',
  },
  logoText: {
    fontSize: '22px',
    fontWeight: 800,
    fontFamily: 'Syne, sans-serif',
    color: '#f0eff2',
    letterSpacing: '-0.02em',
  },
  nav: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
  },
  navLink: {
    fontSize: '14px',
    color: '#666675',
    fontFamily: 'DM Sans, sans-serif',
    transition: 'color 0.2s ease',
    fontWeight: 500,
  },
  hero: {
    paddingTop: '80px',
    paddingBottom: '60px',
    position: 'relative',
    zIndex: 1,
  },
  heroContent: {
    maxWidth: '720px',
    margin: '0 auto',
    textAlign: 'center',
  },
  eyebrow: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '12px',
    fontFamily: 'Syne, sans-serif',
    fontWeight: 700,
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    color: '#E60023',
    padding: '6px 14px',
    background: 'rgba(230,0,35,0.08)',
    border: '1px solid rgba(230,0,35,0.2)',
    borderRadius: '100px',
    marginBottom: '24px',
    animation: 'fadeUp 0.4s ease 0.1s both',
  },
  eyebrowDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    background: '#E60023',
    animation: 'pulse 2s ease infinite',
  },
  heroTitle: {
    fontSize: 'clamp(36px, 7vw, 68px)',
    fontWeight: 800,
    fontFamily: 'Syne, sans-serif',
    color: '#f0eff2',
    lineHeight: 1.1,
    letterSpacing: '-0.03em',
    marginBottom: '20px',
    animation: 'fadeUp 0.4s ease 0.15s both',
  },
  heroSub: {
    fontSize: 'clamp(15px, 2vw, 18px)',
    color: '#a09fad',
    fontFamily: 'DM Sans, sans-serif',
    lineHeight: 1.7,
    marginBottom: '40px',
    animation: 'fadeUp 0.4s ease 0.2s both',
  },
  inputCard: {
    background: '#111113',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '20px',
    padding: '20px',
    marginBottom: '20px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(230,0,35,0.05)',
    animation: 'fadeUp 0.4s ease 0.25s both',
  },
  inputWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    background: '#0a0a0b',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '12px',
    padding: '4px 4px 4px 16px',
    marginBottom: '16px',
    transition: 'border-color 0.2s ease',
  },
  inputIcon: {
    color: '#E60023',
    flexShrink: 0,
    opacity: 0.7,
    display: 'flex',
  },
  input: {
    flex: 1,
    background: 'transparent',
    border: 'none',
    color: '#f0eff2',
    fontSize: '15px',
    fontFamily: 'DM Sans, sans-serif',
    padding: '12px 0',
    minWidth: 0,
  },
  clearBtn: {
    background: 'rgba(255,255,255,0.05)',
    border: 'none',
    color: '#666675',
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    transition: 'all 0.2s ease',
    marginRight: '4px',
  },
  inputActions: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
  },
  pasteBtn: {
    padding: '12px 18px',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '10px',
    color: '#a09fad',
    fontSize: '13px',
    fontWeight: 500,
    fontFamily: 'DM Sans, sans-serif',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    whiteSpace: 'nowrap',
    flexShrink: 0,
  },
  analyzeBtn: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    padding: '13px 24px',
    background: 'linear-gradient(135deg, #E60023 0%, #ad081b 100%)',
    border: 'none',
    borderRadius: '10px',
    color: '#fff',
    fontSize: '15px',
    fontWeight: 700,
    fontFamily: 'Syne, sans-serif',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 20px rgba(230,0,35,0.4)',
    letterSpacing: '0.01em',
  },
  analyzeBtnLoading: {
    opacity: 0.7,
    cursor: 'not-allowed',
    boxShadow: 'none',
  },
  btnSpinner: {
    display: 'inline-block',
    width: '16px',
    height: '16px',
    border: '2px solid rgba(255,255,255,0.3)',
    borderTopColor: '#fff',
    borderRadius: '50%',
    animation: 'spin 0.7s linear infinite',
  },
  errorMsg: {
    marginTop: '12px',
    padding: '12px 16px',
    background: 'rgba(230,0,35,0.06)',
    border: '1px solid rgba(230,0,35,0.2)',
    borderRadius: '8px',
    color: '#ff6b8a',
    fontSize: '13px',
    fontFamily: 'DM Sans, sans-serif',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  supportedTags: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '8px',
    animation: 'fadeUp 0.4s ease 0.3s both',
  },
  tag: {
    fontSize: '12px',
    color: '#444450',
    padding: '4px 10px',
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(255,255,255,0.05)',
    borderRadius: '100px',
    fontFamily: 'DM Sans, sans-serif',
    fontWeight: 500,
  },
  featuresSection: {
    paddingBottom: '40px',
    position: 'relative',
    zIndex: 1,
  },
  resultSection: {
    paddingBottom: '60px',
    position: 'relative',
    zIndex: 1,
  },
  resultHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '20px',
  },
  resultDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: '#22c55e',
    boxShadow: '0 0 12px #22c55e',
    animation: 'pulse 2s ease infinite',
  },
  resultLabel: {
    fontSize: '13px',
    fontFamily: 'Syne, sans-serif',
    fontWeight: 700,
    color: '#22c55e',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
  },
  cardGrid: {
    maxWidth: '520px',
  },
  toast: {
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    padding: '14px 20px',
    borderRadius: '12px',
    border: '1px solid',
    fontSize: '14px',
    fontFamily: 'DM Sans, sans-serif',
    fontWeight: 500,
    zIndex: 9998,
    boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backdropFilter: 'blur(12px)',
  },
  footer: {
    borderTop: '1px solid rgba(255,255,255,0.05)',
    paddingTop: '32px',
    paddingBottom: '40px',
  },
  footerInner: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
    textAlign: 'center',
  },
  footerLogo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: '#2a2a30',
    fontSize: '16px',
  },
  footerText: {
    fontSize: '12px',
    color: '#333340',
    fontFamily: 'DM Sans, sans-serif',
    maxWidth: '480px',
    lineHeight: 1.6,
  },
  footerLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  footerLink: {
    fontSize: '12px',
    color: '#333340',
    fontFamily: 'DM Sans, sans-serif',
    transition: 'color 0.2s ease',
  },
};