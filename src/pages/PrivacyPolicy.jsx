import React, { useEffect } from 'react';
import { updatePageSEO } from '../utils/seo.js';

function PinIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
    </svg>
  );
}

const LAST_UPDATED = 'February 25, 2025';

export default function PrivacyPolicy() {
  useEffect(() => {
    updatePageSEO('privacy');
    window.scrollTo(0, 0);
  }, []);

  return (
    <div style={s.root}>
      {/* Header */}
      <header style={s.header}>
        <div style={s.headerInner}>
          <a href="/" style={s.logo}>
            <div style={s.logoIcon}><PinIcon /></div>
            <span style={s.logoText}>Pin<span style={{ color: '#E60023' }}>Drop</span></span>
          </a>
          <a href="/" style={s.backBtn}>← Back to Home</a>
        </div>
      </header>

      <main style={s.main}>
        <div style={s.container}>

          {/* Page header */}
          <div style={s.pageHeader}>
            <div style={s.eyebrow}>Legal</div>
            <h1 style={s.title}>Privacy Policy</h1>
            <p style={s.meta}>
              <span style={s.domain}>pindr.site</span>
              <span style={s.separator}>·</span>
              Last updated: <strong>{LAST_UPDATED}</strong>
            </p>
            <p style={s.intro}>
              Your privacy matters to us. This policy explains what data PinDrop collects,
              how it is used, and what choices you have. We keep it simple because we
              genuinely collect very little.
            </p>
          </div>

          <div style={s.toc}>
            <p style={s.tocTitle}>Contents</p>
            {[
              ['#who',       '1. Who We Are'],
              ['#collect',   '2. Data We Collect'],
              ['#nocollect', '3. Data We Do NOT Collect'],
              ['#ads',       '4. Advertising & Third Parties'],
              ['#premium',   '5. Premium Payments'],
              ['#cookies',   '6. Cookies & Local Storage'],
              ['#rights',    '7. Your Rights'],
              ['#children',  '8. Children\'s Privacy'],
              ['#changes',   '9. Changes to This Policy'],
              ['#contact',   '10. Contact Us'],
            ].map(([href, label]) => (
              <a key={href} href={href} style={s.tocLink}>{label}</a>
            ))}
          </div>

          <div style={s.content}>

            <Section id="who" title="1. Who We Are">
              <p>PinDrop operates the website at <strong>pindr.site</strong> ("the Service"). We provide a free tool to download publicly available media from Pinterest. We are not affiliated with Pinterest, Inc.</p>
              <p>For questions about this policy, contact us at <a href="mailto:hello@pindr.site" style={s.link}>hello@pindr.site</a>.</p>
            </Section>

            <Section id="collect" title="2. Data We Collect">
              <p>We collect minimal data necessary to operate the Service:</p>
              <InfoBox items={[
                { icon: '🌐', label: 'Server Logs', desc: 'Standard web server logs including IP address, browser type, and pages visited. These are retained for up to 30 days for security and debugging, then automatically deleted.' },
                { icon: '📊', label: 'Analytics (optional)', desc: 'If you have not opted out, we may use Google Analytics to understand aggregate usage patterns (page views, session duration, country). No personally identifiable information is tracked.' },
                { icon: '🍪', label: 'Local Storage', desc: 'If you purchase Premium, your subscription status is stored in your browser\'s localStorage on your device only. We do not store this on our servers.' },
              ]} />
            </Section>

            <Section id="nocollect" title="3. Data We Do NOT Collect">
              <p>We want to be explicit about what we never do:</p>
              <ul style={s.list}>
                <li>We do <strong>not</strong> store the Pinterest URLs you submit.</li>
                <li>We do <strong>not</strong> store, cache, or retain any media files you download.</li>
                <li>We do <strong>not</strong> require account registration or collect email addresses (except for Premium payment processing).</li>
                <li>We do <strong>not</strong> sell, rent, or share your data with third parties for marketing.</li>
                <li>We do <strong>not</strong> build advertising profiles based on your usage.</li>
                <li>We do <strong>not</strong> use fingerprinting or cross-site tracking.</li>
              </ul>
            </Section>

            <Section id="ads" title="4. Advertising & Third Parties">
              <p>PinDrop is free to use and is supported by advertising. We use <strong>Google AdSense</strong> to serve ads.</p>
              <p>Google AdSense may use cookies and similar technologies to serve ads based on your prior visits to our site and other sites on the internet. You can opt out of personalised advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" style={s.link}>Google Ad Settings</a> or <a href="https://optout.aboutads.info" target="_blank" rel="noopener noreferrer" style={s.link}>aboutads.info</a>.</p>
              <p><strong>Premium subscribers</strong> see no ads and are therefore not subject to AdSense data collection while using PinDrop.</p>
              <CalloutBox type="info" text="Third-party ad networks operate under their own privacy policies. We encourage you to review Google's privacy policy at policies.google.com." />
            </Section>

            <Section id="premium" title="5. Premium Payments">
              <p>Premium subscriptions are processed by <strong>Paystack</strong>, a third-party payment provider. When you upgrade:</p>
              <ul style={s.list}>
                <li>Your email address is shared with Paystack to process payment.</li>
                <li>Your payment card details are handled entirely by Paystack — we never see or store them.</li>
                <li>After successful payment, only your email and subscription tier are retained on Paystack's servers, subject to their privacy policy at <a href="https://paystack.com/privacy" target="_blank" rel="noopener noreferrer" style={s.link}>paystack.com/privacy</a>.</li>
                <li>Your Premium status is stored as a token in your browser's localStorage — not on our servers.</li>
              </ul>
            </Section>

            <Section id="cookies" title="6. Cookies & Local Storage">
              <p>We use the following storage mechanisms:</p>
              <table style={s.table}>
                <thead>
                  <tr>
                    <th style={s.th}>Storage</th>
                    <th style={s.th}>Purpose</th>
                    <th style={s.th}>Duration</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={s.td}><code style={s.code}>pindrop_premium</code></td>
                    <td style={s.td}>Stores your Premium subscription status locally</td>
                    <td style={s.td}>Until cleared or expired</td>
                  </tr>
                  <tr>
                    <td style={s.td}><code style={s.code}>pindrop_ref</code></td>
                    <td style={s.td}>Stores Paystack payment reference for restoration</td>
                    <td style={s.td}>Persistent</td>
                  </tr>
                  <tr>
                    <td style={s.td}>Google AdSense cookies</td>
                    <td style={s.td}>Personalised ad targeting (opt-out available)</td>
                    <td style={s.td}>Up to 13 months</td>
                  </tr>
                  <tr>
                    <td style={s.td}>Google Analytics cookies</td>
                    <td style={s.td}>Aggregate usage analytics</td>
                    <td style={s.td}>Up to 2 years</td>
                  </tr>
                </tbody>
              </table>
              <p style={{ marginTop: '16px' }}>You can clear localStorage at any time via your browser settings (Settings → Privacy → Clear browsing data).</p>
            </Section>

            <Section id="rights" title="7. Your Rights">
              <p>Depending on your location, you may have the following rights regarding your data:</p>
              <ul style={s.list}>
                <li><strong>Access:</strong> Request what data we hold about you.</li>
                <li><strong>Deletion:</strong> Request deletion of any personal data we hold.</li>
                <li><strong>Opt-out:</strong> Opt out of analytics and personalised advertising at any time.</li>
                <li><strong>Portability:</strong> Receive a copy of your data in a machine-readable format.</li>
              </ul>
              <p>To exercise any of these rights, email <a href="mailto:hello@pindr.site" style={s.link}>hello@pindr.site</a>. We will respond within 30 days.</p>
            </Section>

            <Section id="children" title="8. Children's Privacy">
              <p>PinDrop is not directed at children under the age of 13. We do not knowingly collect personal information from children. If you believe a child has provided us with personal information, please contact us immediately at <a href="mailto:hello@pindr.site" style={s.link}>hello@pindr.site</a> and we will delete it promptly.</p>
            </Section>

            <Section id="changes" title="9. Changes to This Policy">
              <p>We may update this Privacy Policy from time to time. When we do, we will update the "Last updated" date at the top of this page. Continued use of PinDrop after changes constitutes acceptance of the updated policy.</p>
              <p>For significant changes, we will display a notice on the homepage.</p>
            </Section>

            <Section id="contact" title="10. Contact Us">
              <p>Questions, concerns, or requests regarding this Privacy Policy:</p>
              <div style={s.contactCard}>
                <strong style={{ color: '#f0eff2', fontFamily: 'Syne, sans-serif' }}>PinDrop</strong>
                <a href="mailto:hello@pindr.site" style={{ ...s.link, fontSize: '15px' }}>hello@pindr.site</a>
                <span style={{ color: '#666675', fontSize: '13px' }}>pindr.site</span>
              </div>
            </Section>

          </div>
        </div>
      </main>

      <footer style={s.footer}>
        <div style={s.footerInner}>
          <span style={s.footerText}>© 2025 PinDrop · pindr.site</span>
          <div style={s.footerLinks}>
            <a href="/" style={s.footerLink}>Home</a>
            <span style={s.dot}>·</span>
            <a href="/privacy" style={{ ...s.footerLink, color: '#E60023' }}>Privacy</a>
            <span style={s.dot}>·</span>
            <a href="/terms" style={s.footerLink}>Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Section({ id, title, children }) {
  return (
    <section id={id} style={sectionS.section}>
      <h2 style={sectionS.title}>{title}</h2>
      <div style={sectionS.body}>{children}</div>
    </section>
  );
}

function InfoBox({ items }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', margin: '16px 0' }}>
      {items.map((item, i) => (
        <div key={i} style={{ display: 'flex', gap: '14px', padding: '14px 16px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px' }}>
          <span style={{ fontSize: '20px', flexShrink: 0, marginTop: '2px' }}>{item.icon}</span>
          <div>
            <strong style={{ display: 'block', color: '#f0eff2', fontFamily: 'Syne, sans-serif', fontSize: '14px', marginBottom: '4px' }}>{item.label}</strong>
            <span style={{ color: '#a09fad', fontSize: '13px', fontFamily: 'DM Sans, sans-serif', lineHeight: 1.6 }}>{item.desc}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function CalloutBox({ type, text }) {
  const colors = {
    info:    { bg: 'rgba(96,165,250,0.06)', border: 'rgba(96,165,250,0.2)', color: '#93c5fd' },
    warning: { bg: 'rgba(245,200,66,0.06)', border: 'rgba(245,200,66,0.2)', color: '#fde68a' },
  };
  const c = colors[type] || colors.info;
  return (
    <div style={{ margin: '16px 0', padding: '14px 16px', background: c.bg, border: `1px solid ${c.border}`, borderRadius: '10px', color: c.color, fontSize: '13px', fontFamily: 'DM Sans, sans-serif', lineHeight: 1.6 }}>
      ℹ️ {text}
    </div>
  );
}

const sectionS = {
  section: {
    paddingBottom: '40px',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
    marginBottom: '40px',
  },
  title: {
    fontSize: '20px',
    fontWeight: 700,
    fontFamily: 'Syne, sans-serif',
    color: '#f0eff2',
    marginBottom: '16px',
    scrollMarginTop: '80px',
  },
  body: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    color: '#a09fad',
    fontSize: '15px',
    fontFamily: 'DM Sans, sans-serif',
    lineHeight: 1.8,
  },
};

const s = {
  root: { minHeight: '100vh', background: '#0a0a0b', color: '#f0eff2' },
  header: {
    position: 'sticky', top: 0, zIndex: 100,
    background: 'rgba(10,10,11,0.9)',
    backdropFilter: 'blur(20px)',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
  },
  headerInner: {
    maxWidth: '860px', margin: '0 auto', padding: '0 24px',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    height: '60px',
  },
  logo: {
    display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none',
  },
  logoIcon: {
    width: '32px', height: '32px',
    background: 'linear-gradient(135deg, #E60023, #ad081b)',
    borderRadius: '8px', display: 'flex', alignItems: 'center',
    justifyContent: 'center', color: '#fff', flexShrink: 0,
  },
  logoText: {
    fontSize: '18px', fontWeight: 800, fontFamily: 'Syne, sans-serif',
    color: '#f0eff2', letterSpacing: '-0.02em',
  },
  backBtn: {
    fontSize: '13px', color: '#666675', fontFamily: 'DM Sans, sans-serif',
    textDecoration: 'none', transition: 'color 0.2s',
  },
  main: { padding: '60px 0 80px' },
  container: { maxWidth: '860px', margin: '0 auto', padding: '0 24px' },
  pageHeader: { marginBottom: '48px' },
  eyebrow: {
    fontSize: '11px', fontFamily: 'Syne, sans-serif', fontWeight: 700,
    letterSpacing: '0.2em', textTransform: 'uppercase', color: '#E60023',
    marginBottom: '12px',
  },
  title: {
    fontSize: 'clamp(28px, 5vw, 44px)', fontWeight: 800, fontFamily: 'Syne, sans-serif',
    color: '#f0eff2', marginBottom: '12px', letterSpacing: '-0.02em',
  },
  meta: {
    fontSize: '13px', color: '#666675', fontFamily: 'DM Sans, sans-serif',
    marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px',
  },
  domain: { color: '#E60023', fontWeight: 600, fontFamily: 'Syne, sans-serif' },
  separator: { color: '#333340' },
  intro: {
    fontSize: '16px', color: '#a09fad', lineHeight: 1.8,
    fontFamily: 'DM Sans, sans-serif', maxWidth: '640px',
    padding: '20px', background: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px',
  },
  toc: {
    display: 'flex', flexDirection: 'column', gap: '6px',
    padding: '20px 24px', background: 'rgba(230,0,35,0.04)',
    border: '1px solid rgba(230,0,35,0.12)', borderRadius: '14px',
    marginBottom: '48px',
  },
  tocTitle: {
    fontSize: '11px', fontFamily: 'Syne, sans-serif', fontWeight: 700,
    letterSpacing: '0.15em', textTransform: 'uppercase', color: '#E60023',
    marginBottom: '8px',
  },
  tocLink: {
    fontSize: '14px', color: '#a09fad', fontFamily: 'DM Sans, sans-serif',
    textDecoration: 'none', transition: 'color 0.2s',
    padding: '2px 0',
  },
  content: {},
  list: {
    paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px',
    color: '#a09fad', fontSize: '15px', fontFamily: 'DM Sans, sans-serif', lineHeight: 1.8,
  },
  link: { color: '#E60023', textDecoration: 'none' },
  table: {
    width: '100%', borderCollapse: 'collapse',
    fontSize: '13px', fontFamily: 'DM Sans, sans-serif',
  },
  th: {
    padding: '10px 14px', background: 'rgba(255,255,255,0.04)',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
    color: '#f0eff2', fontFamily: 'Syne, sans-serif', fontWeight: 700,
    textAlign: 'left', fontSize: '12px', letterSpacing: '0.05em',
  },
  td: {
    padding: '10px 14px', borderBottom: '1px solid rgba(255,255,255,0.04)',
    color: '#a09fad', verticalAlign: 'top',
  },
  code: {
    background: 'rgba(255,255,255,0.06)', padding: '2px 6px',
    borderRadius: '4px', fontSize: '12px', color: '#f0eff2',
    fontFamily: 'monospace',
  },
  contactCard: {
    display: 'flex', flexDirection: 'column', gap: '6px',
    padding: '16px 20px', background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px',
    maxWidth: '280px',
  },
  footer: {
    borderTop: '1px solid rgba(255,255,255,0.05)',
    padding: '24px 0',
  },
  footerInner: {
    maxWidth: '860px', margin: '0 auto', padding: '0 24px',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    flexWrap: 'wrap', gap: '12px',
  },
  footerText: { fontSize: '12px', color: '#333340', fontFamily: 'DM Sans, sans-serif' },
  footerLinks: { display: 'flex', alignItems: 'center', gap: '10px' },
  footerLink: { fontSize: '12px', color: '#333340', fontFamily: 'DM Sans, sans-serif', textDecoration: 'none' },
  dot: { color: '#222228' },
};