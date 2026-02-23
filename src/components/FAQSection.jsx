import React, { useState } from 'react';

const faqs = [
  {
    q: "Is PinDrop free to use?",
    a: "Yes, PinDrop is completely free. We support the service through non-intrusive advertisements that allow us to keep the tool running at no cost to you.",
  },
  {
    q: "What types of Pinterest media can I download?",
    a: "PinDrop supports downloading Pinterest videos (MP4), images (JPG/PNG/WebP), and animated GIFs. We detect the media type automatically and download it in the highest available quality.",
  },
  {
    q: "How do I download a Pinterest video?",
    a: "Copy the URL of any Pinterest pin containing a video, paste it into the input field on PinDrop, click Analyze, then press the Download button. The video will save to your device in MP4 format.",
  },
  {
    q: "Can I download from private Pinterest boards?",
    a: "No. PinDrop can only download media from publicly accessible Pinterest pins. Private boards and secret pins require login credentials that we do not collect or store.",
  },
  {
    q: "Will the downloaded files have watermarks?",
    a: "Never. PinDrop downloads media directly from Pinterest's CDN servers in original quality without any watermarks or modifications.",
  },
  {
    q: "Is it legal to download Pinterest images and videos?",
    a: "Downloading Pinterest content for personal, non-commercial use is generally tolerated, but the content remains protected by copyright. You must have the rights or permission to use any media you download. Always credit the original creator and respect Pinterest's Terms of Service.",
  },
  {
    q: "Why did my download fail?",
    a: "Downloads can fail if the pin is private, has been deleted, or if Pinterest has temporarily rate-limited requests. Try again after a short wait or ensure the pin URL is correct and publicly accessible.",
  },
  {
    q: "Does PinDrop store my downloads?",
    a: "No. PinDrop streams media directly from Pinterest's servers to your device. We do not store any downloaded content, cache media files, or log the pins you access.",
  },
  {
    q: "What is the maximum video quality I can download?",
    a: "PinDrop automatically selects the highest resolution available from Pinterest's video CDN, which is typically 720p or 1080p depending on what the original creator uploaded.",
  },
  {
    q: "Can I use PinDrop on mobile?",
    a: "Yes! PinDrop is fully responsive and works on iOS, Android, and any modern mobile browser. You can share a pin URL directly from the Pinterest app and paste it into PinDrop.",
  },
];

function FAQItem({ faq, index }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      style={{
        ...styles.item,
        borderColor: open ? 'rgba(230,0,35,0.2)' : 'rgba(255,255,255,0.06)',
        animation: `fadeUp 0.4s ease ${index * 0.04}s both`,
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        style={styles.question}
        aria-expanded={open}
      >
        <span style={styles.qText}>{faq.q}</span>
        <span style={{
          ...styles.chevron,
          transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
          color: open ? '#E60023' : '#666675',
        }}>
          ↓
        </span>
      </button>
      {open && (
        <div style={styles.answer} className="animate-fadeIn">
          <p style={styles.answerText}>{faq.a}</p>
        </div>
      )}
    </div>
  );
}

export default function FAQSection() {
  return (
    <section style={styles.section} id="faq">
      <div className="container">
        {/* Schema.org FAQ markup */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqs.map(f => ({
              "@type": "Question",
              "name": f.q,
              "acceptedAnswer": { "@type": "Answer", "text": f.a }
            }))
          })
        }} />

        <div style={styles.header}>
          <div style={styles.eyebrow}>Help Center</div>
          <h2 style={styles.title}>Frequently Asked Questions</h2>
          <p style={styles.subtitle}>Everything you need to know about PinDrop</p>
        </div>

        <div style={styles.grid}>
          {faqs.map((faq, i) => (
            <FAQItem key={i} faq={faq} index={i} />
          ))}
        </div>

        {/* Disclaimer */}
        <div style={styles.disclaimer}>
          <div style={styles.disclaimerIcon}>⚠</div>
          <div>
            <h4 style={styles.disclaimerTitle}>Copyright Disclaimer</h4>
            <p style={styles.disclaimerText}>
              PinDrop is an independent tool not affiliated with, endorsed by, or connected to Pinterest, Inc. in any way. All media downloaded through PinDrop remains the intellectual property of its respective copyright holders. By using PinDrop, you agree to download content solely for personal, non-commercial purposes and to respect the rights of original creators. Downloading, reproducing, or redistributing copyrighted material without explicit permission from the rights holder may violate copyright law and Pinterest's Terms of Service. PinDrop assumes no liability for how users utilize downloaded content. If you are a copyright holder and believe content is being shared without authorization, please report it directly to Pinterest via their official DMCA process.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

const styles = {
  section: {
    paddingTop: '80px',
    paddingBottom: '80px',
    borderTop: '1px solid rgba(255,255,255,0.05)',
  },
  header: {
    textAlign: 'center',
    marginBottom: '56px',
  },
  eyebrow: {
    display: 'inline-block',
    fontSize: '11px',
    fontFamily: 'Syne, sans-serif',
    fontWeight: 700,
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    color: '#E60023',
    marginBottom: '12px',
  },
  title: {
    fontSize: 'clamp(28px, 5vw, 40px)',
    fontWeight: 800,
    color: '#f0eff2',
    fontFamily: 'Syne, sans-serif',
    marginBottom: '12px',
  },
  subtitle: {
    fontSize: '16px',
    color: '#666675',
    fontFamily: 'DM Sans, sans-serif',
  },
  grid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginBottom: '56px',
  },
  item: {
    background: '#111113',
    border: '1px solid',
    borderRadius: '12px',
    overflow: 'hidden',
    transition: 'border-color 0.2s ease',
  },
  question: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '16px',
    padding: '20px 24px',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    textAlign: 'left',
  },
  qText: {
    fontSize: '15px',
    fontWeight: 600,
    color: '#f0eff2',
    fontFamily: 'Syne, sans-serif',
    lineHeight: 1.4,
  },
  chevron: {
    fontSize: '16px',
    transition: 'transform 0.25s ease, color 0.2s ease',
    flexShrink: 0,
  },
  answer: {
    padding: '0 24px 20px',
  },
  answerText: {
    fontSize: '14px',
    color: '#a09fad',
    lineHeight: 1.7,
    fontFamily: 'DM Sans, sans-serif',
  },
  disclaimer: {
    display: 'flex',
    gap: '20px',
    padding: '28px',
    background: 'rgba(245,200,66,0.04)',
    border: '1px solid rgba(245,200,66,0.12)',
    borderRadius: '16px',
  },
  disclaimerIcon: {
    fontSize: '22px',
    color: '#f5c842',
    flexShrink: 0,
    marginTop: '2px',
  },
  disclaimerTitle: {
    fontSize: '14px',
    fontWeight: 700,
    color: '#f5c842',
    fontFamily: 'Syne, sans-serif',
    marginBottom: '10px',
    letterSpacing: '0.02em',
  },
  disclaimerText: {
    fontSize: '13px',
    color: '#666675',
    lineHeight: 1.7,
    fontFamily: 'DM Sans, sans-serif',
  },
};