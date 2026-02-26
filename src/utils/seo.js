/**
 * SEO utility for PinDrop — pindr.site
 * ─────────────────────────────────────
 * Handles dynamic meta tag updates and structured data injection.
 * Called from main.jsx on boot, and from page components on route change.
 */

export const SITE = {
  name:        'PinDrop',
  domain:      'pindr.site',
  url:         'https://pindr.site',
  ogImage:     'https://pindr.site/og-image.png',
  logo:        'https://pindr.site/logo-512.png',
  description: 'Download Pinterest videos, images and GIFs in original quality — free, no watermarks, no sign-up. Paste any Pinterest or pin.it URL and save instantly.',
  twitter:     '', // '@pindrsite' — add when you have one
};

const PAGE_SEO = {
  home: {
    title:       'PinDrop — Free Pinterest Video, Image & GIF Downloader | pindr.site',
    description: 'Download Pinterest videos, images and GIFs in original quality — free, no watermarks, no sign-up. Paste any Pinterest or pin.it URL and save your media instantly.',
    url:         'https://pindr.site/',
  },
  privacy: {
    title:       'Privacy Policy — PinDrop | pindr.site',
    description: 'Read the PinDrop privacy policy. We collect minimal data and never sell your information.',
    url:         'https://pindr.site/privacy',
  },
  terms: {
    title:       'Terms of Service — PinDrop | pindr.site',
    description: 'Read the PinDrop terms of service. By using pindr.site you agree to these terms.',
    url:         'https://pindr.site/terms',
  },
};

/**
 * Upsert a <meta> tag in <head>
 */
function setMeta(selector, attrName, attrValue, content) {
  let el = document.querySelector(selector);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attrName, attrValue);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

/**
 * Upsert <link rel="canonical">
 */
function setCanonical(href) {
  let el = document.querySelector('link[rel="canonical"]');
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

/**
 * Update all SEO meta tags for a given page.
 * @param {'home'|'privacy'|'terms'} page
 * @param {object} [overrides] - optional field overrides
 */
export function updatePageSEO(page = 'home', overrides = {}) {
  const base = PAGE_SEO[page] || PAGE_SEO.home;
  const seo  = { ...base, image: SITE.ogImage, ...overrides };

  document.title = seo.title;
  setCanonical(seo.url);

  // Standard
  setMeta('meta[name="title"]',       'name', 'title',       seo.title);
  setMeta('meta[name="description"]', 'name', 'description', seo.description);

  // Open Graph
  setMeta('meta[property="og:title"]',       'property', 'og:title',       seo.title);
  setMeta('meta[property="og:description"]', 'property', 'og:description', seo.description);
  setMeta('meta[property="og:url"]',         'property', 'og:url',         seo.url);
  setMeta('meta[property="og:image"]',       'property', 'og:image',       seo.image);

  // Twitter
  setMeta('meta[name="twitter:title"]',       'name', 'twitter:title',       seo.title);
  setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', seo.description);
  setMeta('meta[name="twitter:image"]',       'name', 'twitter:image',       seo.image);
  setMeta('meta[name="twitter:url"]',         'name', 'twitter:url',         seo.url);
}

/**
 * Inject or replace the JSON-LD <script> block.
 */
export function injectStructuredData(schema) {
  const existing = document.querySelector('script[type="application/ld+json"]');
  if (existing) existing.remove();
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(schema, null, 2);
  document.head.appendChild(script);
}

/**
 * Full PinDrop JSON-LD schema.
 * Covers: WebApplication, WebSite, Organization, FAQPage, BreadcrumbList.
 */
export const PINDROP_SCHEMA = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebApplication',
      '@id': 'https://pindr.site/#app',
      name: 'PinDrop',
      alternateName: 'pindr',
      url: 'https://pindr.site/',
      description: SITE.description,
      applicationCategory: 'UtilitiesApplication',
      operatingSystem: 'Web Browser',
      browserRequirements: 'Requires JavaScript',
      inLanguage: 'en',
      offers: [
        { '@type': 'Offer', name: 'Free',             price: '0',    priceCurrency: 'USD' },
        { '@type': 'Offer', name: 'Premium Monthly',  price: '1.00', priceCurrency: 'USD' },
        { '@type': 'Offer', name: 'Premium Lifetime', price: '29.00',priceCurrency: 'USD' },
      ],
      featureList: [
        'Download Pinterest videos in MP4 format',
        'Save Pinterest images in JPG and PNG',
        'Download animated Pinterest GIFs',
        'No watermarks on any downloaded media',
        'No account or registration required',
        'Original quality, zero compression',
      ],
      screenshot: SITE.ogImage,
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.8',
        ratingCount: '312',
        bestRating: '5',
        worstRating: '1',
      },
    },
    {
      '@type': 'WebSite',
      '@id': 'https://pindr.site/#website',
      name: 'PinDrop',
      url: 'https://pindr.site/',
      publisher: { '@id': 'https://pindr.site/#organization' },
      potentialAction: {
        '@type': 'SearchAction',
        target: { '@type': 'EntryPoint', urlTemplate: 'https://pindr.site/?url={search_term_string}' },
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': 'Organization',
      '@id': 'https://pindr.site/#organization',
      name: 'PinDrop',
      url: 'https://pindr.site/',
      logo: { '@type': 'ImageObject', url: SITE.logo, width: 512, height: 512 },
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        { '@type': 'Question', name: 'Is PinDrop free to use?',
          acceptedAnswer: { '@type': 'Answer', text: 'Yes, PinDrop is completely free. Occasional ads keep the service running. Upgrade to Premium for $1/month or $29 lifetime to remove all ads.' }},
        { '@type': 'Question', name: 'What media types can I download from Pinterest?',
          acceptedAnswer: { '@type': 'Answer', text: 'PinDrop supports MP4 videos, JPG/PNG images, animated GIFs, and WebP — all in original quality with zero watermarks.' }},
        { '@type': 'Question', name: 'Do I need an account to use PinDrop?',
          acceptedAnswer: { '@type': 'Answer', text: 'No account needed. Paste your Pinterest or pin.it URL at pindr.site and click Download.' }},
        { '@type': 'Question', name: 'Does PinDrop add watermarks?',
          acceptedAnswer: { '@type': 'Answer', text: 'Never. You receive the original file exactly as it exists on Pinterest.' }},
        { '@type': 'Question', name: 'Is PinDrop affiliated with Pinterest?',
          acceptedAnswer: { '@type': 'Answer', text: 'No. PinDrop is independent and not affiliated with Pinterest, Inc. All trademarks belong to their owners.' }},
      ],
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home',           item: 'https://pindr.site/' },
        { '@type': 'ListItem', position: 2, name: 'FAQ',            item: 'https://pindr.site/#faq' },
        { '@type': 'ListItem', position: 3, name: 'Privacy Policy', item: 'https://pindr.site/privacy' },
        { '@type': 'ListItem', position: 4, name: 'Terms of Service', item: 'https://pindr.site/terms' },
      ],
    },
  ],
};