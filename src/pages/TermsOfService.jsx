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

export default function TermsOfService() {
  useEffect(() => {
    updatePageSEO('terms');
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
            <h1 style={s.title}>Terms of Service</h1>
            <p style={s.meta}>
              <span style={s.domain}>pindr.site</span>
              <span style={s.separator}>·</span>
              Last updated: <strong>{LAST_UPDATED}</strong>
            </p>
            <div style={s.intro}>
              <strong style={{ color: '#fde68a', display: 'block', marginBottom: '6px' }}>⚠️ Please read carefully.</strong>
              By accessing or using PinDrop at pindr.site, you agree to be bound by these Terms of Service. If you disagree with any part of these terms, please do not use the Service.
            </div>
          </div>

          <div style={s.toc}>
            <p style={s.tocTitle}>Contents</p>
            {[
              ['#acceptance',    '1. Acceptance of Terms'],
              ['#description',   '2. Description of Service'],
              ['#permitted',     '3. Permitted Use'],
              ['#prohibited',    '4. Prohibited Use'],
              ['#ip',            '5. Intellectual Property'],
              ['#disclaimer',    '6. Disclaimer of Warranties'],
              ['#liability',     '7. Limitation of Liability'],
              ['#premium-terms', '8. Premium Subscription Terms'],
              ['#termination',   '9. Termination'],
              ['#governing',     '10. Governing Law'],
              ['#changes',       '11. Changes to Terms'],
              ['#contact',       '12. Contact'],
            ].map(([href, label]) => (
              <a key={href} href={href} style={s.tocLink}>{label}</a>
            ))}
          </div>

          <div style={s.content}>

            <Section id="acceptance" title="1. Acceptance of Terms">
              <p>These Terms of Service ("Terms") govern your use of PinDrop ("the Service"), accessible at <strong>pindr.site</strong>. By using the Service, you confirm that you are at least 13 years of age and legally capable of entering into binding contracts.</p>
              <p>These Terms constitute a legally binding agreement between you and PinDrop. Your continued use of the Service after any changes constitutes acceptance of the revised Terms.</p>
            </Section>

            <Section id="description" title="2. Description of Service">
              <p>PinDrop provides a web-based utility that allows users to download publicly available media (videos, images, and GIFs) from Pinterest pins. The Service operates by fetching publicly accessible URLs and facilitating download to the user's device.</p>
              <p>PinDrop is not affiliated with, endorsed by, or connected to Pinterest, Inc. in any way. "Pinterest" is a trademark of Pinterest, Inc.</p>
            </Section>

            <Section id="permitted" title="3. Permitted Use">
              <p>You may use PinDrop for the following purposes:</p>
              <ul style={s.list}>
                <li><strong>Personal use:</strong> Downloading media for your own private, non-commercial use.</li>
                <li><strong>Content you own:</strong> Downloading media that you yourself uploaded to Pinterest.</li>
                <li><strong>Public domain / Creative Commons:</strong> Downloading content that is explicitly marked as free to use, distribute, or modify.</li>
                <li><strong>Fair use:</strong> Uses that qualify as fair use or fair dealing under applicable copyright law (commentary, criticism, education, etc.).</li>
              </ul>
            </Section>

            <Section id="prohibited" title="4. Prohibited Use">
              <AlertBox text="Violation of these terms may result in termination of your access to the Service and potential legal liability." />
              <p>You agree NOT to use PinDrop to:</p>
              <ul style={s.list}>
                <li>Download, reproduce, or distribute content that is protected by copyright without the permission of the rights holder.</li>
                <li>Download content for commercial redistribution, resale, or monetisation without authorisation.</li>
                <li>Circumvent technical measures intended to protect content.</li>
                <li>Use the Service in any way that violates Pinterest's Terms of Service.</li>
                <li>Attempt to reverse-engineer, scrape at scale, or automate requests to the Service in a way that burdens our infrastructure.</li>
                <li>Use the Service to download content that is illegal in your jurisdiction, including but not limited to child sexual abuse material (CSAM), which we report to NCMEC.</li>
                <li>Use the Service for harassment, stalking, or invasions of privacy.</li>
              </ul>
              <p>You are solely responsible for determining whether your use of downloaded content complies with applicable law. PinDrop bears no responsibility for how you use downloaded media.</p>
            </Section>

            <Section id="ip" title="5. Intellectual Property">
              <p><strong>Third-party content:</strong> All media available via Pinterest is owned by its respective creators or rights holders. PinDrop does not claim ownership of any third-party content accessed through the Service. Downloading a file does not transfer ownership or grant additional rights to that content.</p>
              <p><strong>PinDrop property:</strong> The PinDrop name, logo, website design, and original code are owned by PinDrop. You may not copy, reproduce, or create derivative works from our interface or branding without written permission.</p>
            </Section>

            <Section id="disclaimer" title="6. Disclaimer of Warranties">
              <p>THE SERVICE IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED.</p>
              <p>PinDrop makes no warranties or representations that:</p>
              <ul style={s.list}>
                <li>The Service will be uninterrupted, error-free, or always available.</li>
                <li>Downloaded content will be complete, accurate, or of any particular quality.</li>
                <li>The Service is free of viruses or harmful components (though we take reasonable precautions).</li>
                <li>Your use of the Service will not infringe third-party rights.</li>
              </ul>
            </Section>

            <Section id="liability" title="7. Limitation of Liability">
              <p>TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, PINDROP AND ITS OPERATORS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, OR GOODWILL, ARISING FROM YOUR USE OF THE SERVICE.</p>
              <p>In no event shall PinDrop's total liability to you exceed the amount you paid for Premium in the 12 months preceding the claim, or $29 (whichever is greater).</p>
            </Section>

            <Section id="premium-terms" title="8. Premium Subscription Terms">
              <p>Premium access is available as a monthly subscription ($1/month) or a one-time lifetime payment ($29).</p>
              <SubSection title="Monthly Subscription">
                <ul style={s.list}>
                  <li>Billed monthly via Paystack. Cancel at any time before the next billing date.</li>
                  <li>Cancellation takes effect at the end of the current billing period — no partial refunds.</li>
                  <li>If payment fails, your account reverts to the free tier at the next billing cycle.</li>
                </ul>
              </SubSection>
              <SubSection title="Lifetime Access">
                <ul style={s.list}>
                  <li>One-time payment grants lifetime access to Premium features as they exist at time of purchase.</li>
                  <li>Refunds are available within 7 days of purchase if the Service is materially defective. Contact <a href="mailto:hello@pindr.site" style={s.link}>hello@pindr.site</a>.</li>
                  <li>"Lifetime" means for as long as PinDrop continues to operate the Service.</li>
                </ul>
              </SubSection>
              <SubSection title="Refund Policy">
                <p>We offer refunds at our discretion within 7 days of payment for technical issues. To request a refund, email <a href="mailto:hello@pindr.site" style={s.link}>hello@pindr.site</a> with your payment reference.</p>
              </SubSection>
            </Section>

            <Section id="termination" title="9. Termination">
              <p>We reserve the right to suspend or terminate your access to PinDrop at any time, without notice, for violations of these Terms or for any reason we deem necessary to protect the Service or other users.</p>
              <p>If your Premium account is terminated for violations of these Terms, no refund will be issued.</p>
            </Section>

            <Section id="governing" title="10. Governing Law">
              <p>These Terms shall be governed by and construed in accordance with applicable law. Any disputes shall be resolved through good-faith negotiation before resorting to formal legal proceedings.</p>
            </Section>

            <Section id="changes" title="11. Changes to Terms">
              <p>We may update these Terms at any time. We will post the revised Terms on this page with an updated "Last updated" date. Your continued use of PinDrop after changes are posted constitutes your acceptance of the new Terms.</p>
            </Section>

            <Section id="contact" title="12. Contact">
              <p>For questions about these Terms, or to report misuse of the Service:</p>
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
            <a href="/privacy" style={s.footerLink}>Privacy</a>
            <span style={s.dot}>·</span>
            <a href="/terms" style={{ ...s.footerLink, color: '#E60023' }}>Terms</a>
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

function SubSection({ title, children }) {
  return (
    <div style={{ marginTop: '16px' }}>
      <h3 style={{ fontSize: '14px', fontWeight: 700, fontFamily: 'Syne, sans-serif', color: '#f0eff2', marginBottom: '8px', letterSpacing: '0.02em' }}>{title}</h3>
      {children}
    </div>
  );
}

function AlertBox({ text }) {
  return (
    <div style={{ margin: '0 0 16px', padding: '14px 16px', background: 'rgba(245,200,66,0.06)', border: '1px solid rgba(245,200,66,0.2)', borderRadius: '10px', color: '#fde68a', fontSize: '13px', fontFamily: 'DM Sans, sans-serif', lineHeight: 1.6 }}>
      ⚠️ {text}
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
    fontSize: '20px', fontWeight: 700, fontFamily: 'Syne, sans-serif',
    color: '#f0eff2', marginBottom: '16px', scrollMarginTop: '80px',
  },
  body: {
    display: 'flex', flexDirection: 'column', gap: '12px',
    color: '#a09fad', fontSize: '15px', fontFamily: 'DM Sans, sans-serif', lineHeight: 1.8,
  },
};

const s = {
  root: { minHeight: '100vh', background: '#0a0a0b', color: '#f0eff2' },
  header: {
    position: 'sticky', top: 0, zIndex: 100,
    background: 'rgba(10,10,11,0.9)', backdropFilter: 'blur(20px)',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
  },
  headerInner: {
    maxWidth: '860px', margin: '0 auto', padding: '0 24px',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '60px',
  },
  logo: { display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' },
  logoIcon: {
    width: '32px', height: '32px', background: 'linear-gradient(135deg, #E60023, #ad081b)',
    borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: '#fff', flexShrink: 0,
  },
  logoText: { fontSize: '18px', fontWeight: 800, fontFamily: 'Syne, sans-serif', color: '#f0eff2', letterSpacing: '-0.02em' },
  backBtn: { fontSize: '13px', color: '#666675', fontFamily: 'DM Sans, sans-serif', textDecoration: 'none' },
  main: { padding: '60px 0 80px' },
  container: { maxWidth: '860px', margin: '0 auto', padding: '0 24px' },
  pageHeader: { marginBottom: '48px' },
  eyebrow: { fontSize: '11px', fontFamily: 'Syne, sans-serif', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#E60023', marginBottom: '12px' },
  title: { fontSize: 'clamp(28px, 5vw, 44px)', fontWeight: 800, fontFamily: 'Syne, sans-serif', color: '#f0eff2', marginBottom: '12px', letterSpacing: '-0.02em' },
  meta: { fontSize: '13px', color: '#666675', fontFamily: 'DM Sans, sans-serif', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' },
  domain: { color: '#E60023', fontWeight: 600, fontFamily: 'Syne, sans-serif' },
  separator: { color: '#333340' },
  intro: {
    fontSize: '15px', color: '#a09fad', lineHeight: 1.8, fontFamily: 'DM Sans, sans-serif',
    padding: '16px 20px', background: 'rgba(245,200,66,0.04)',
    border: '1px solid rgba(245,200,66,0.12)', borderRadius: '12px',
  },
  toc: {
    display: 'flex', flexDirection: 'column', gap: '6px',
    padding: '20px 24px', background: 'rgba(230,0,35,0.04)',
    border: '1px solid rgba(230,0,35,0.12)', borderRadius: '14px', marginBottom: '48px',
  },
  tocTitle: { fontSize: '11px', fontFamily: 'Syne, sans-serif', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#E60023', marginBottom: '8px' },
  tocLink: { fontSize: '14px', color: '#a09fad', fontFamily: 'DM Sans, sans-serif', textDecoration: 'none', padding: '2px 0' },
  content: {},
  list: { paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px', color: '#a09fad', fontSize: '15px', fontFamily: 'DM Sans, sans-serif', lineHeight: 1.8 },
  link: { color: '#E60023', textDecoration: 'none' },
  contactCard: {
    display: 'flex', flexDirection: 'column', gap: '6px',
    padding: '16px 20px', background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', maxWidth: '280px',
  },
  footer: { borderTop: '1px solid rgba(255,255,255,0.05)', padding: '24px 0' },
  footerInner: {
    maxWidth: '860px', margin: '0 auto', padding: '0 24px',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px',
  },
  footerText: { fontSize: '12px', color: '#333340', fontFamily: 'DM Sans, sans-serif' },
  footerLinks: { display: 'flex', alignItems: 'center', gap: '10px' },
  footerLink: { fontSize: '12px', color: '#333340', fontFamily: 'DM Sans, sans-serif', textDecoration: 'none' },
  dot: { color: '#222228' },
};