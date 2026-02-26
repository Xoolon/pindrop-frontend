import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import PrivacyPolicy from './pages/PrivacyPolicy.jsx';
import TermsOfService from './pages/TermsOfService.jsx';
import './index.css';
import { updatePageSEO, injectStructuredData, PINDROP_SCHEMA } from './utils/seo.js';

// ─── Homepage wrapper for SEO and structured data ───────────────────────────
function HomePage() {
  React.useEffect(() => {
    updatePageSEO('home');
    injectStructuredData(PINDROP_SCHEMA);
  }, []);

  return <App />;
}

// ─── Minimal client-side router ──────────────────────────────────────────────
function Router() {
  const path = window.location.pathname;

  if (path === '/privacy') {
    return <PrivacyPolicy />;
  }
  if (path === '/terms') {
    return <TermsOfService />;
  }

  // Default: homepage
  return <HomePage />;
}

// ─── Render app ─────────────────────────────────────────────────────────────
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router />
  </React.StrictMode>
);