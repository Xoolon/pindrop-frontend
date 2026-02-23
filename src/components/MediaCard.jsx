import React, { useState } from 'react';

const API_BASE = import.meta.env.VITE_API_URL || '';

const typeConfig = {
  video: { label: 'Video', icon: '▶', color: '#60a5fa', bg: 'rgba(96,165,250,0.1)', ext: 'mp4' },
  gif: { label: 'GIF', icon: '◎', color: '#f5c842', bg: 'rgba(245,200,66,0.1)', ext: 'gif' },
  image: { label: 'Image', icon: '◆', color: '#22c55e', bg: 'rgba(34,197,94,0.1)', ext: 'jpg' },
};

export default function MediaCard({ media, onDownload }) {
  const [imgError, setImgError] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const config = typeConfig[media.type] || typeConfig.image;

  const handleDownload = async () => {
    if (downloading) return;
    setDownloading(true);

    // Gate through ad manager, then actually download
    onDownload(media.type, async () => {
      try {
        const params = new URLSearchParams({
          url: media.url,
          filename: media.title || 'pinterest_media',
          type: media.type,
        });
        const downloadUrl = `${API_BASE}/api/download?${params}`;

        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = `pindrop_${media.id}.${config.ext}`;
        a.rel = 'noopener noreferrer';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } catch (e) {
        console.error('Download failed:', e);
      } finally {
        setDownloading(false);
      }
    });
  };

  const thumbnailSrc = media.thumbnail
    ? `${API_BASE}/api/proxy-image?url=${encodeURIComponent(media.thumbnail)}`
    : null;

  return (
    <div style={styles.card} className="animate-fadeUp">
      {/* Thumbnail */}
      <div style={styles.thumbWrapper}>
        {thumbnailSrc && !imgError ? (
          <img
            src={thumbnailSrc}
            alt={media.title}
            style={styles.thumb}
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : (
          <div style={styles.thumbFallback}>
            <span style={{ fontSize: '48px' }}>{config.icon}</span>
          </div>
        )}

        {/* Type badge */}
        <div style={{ ...styles.typeBadge, background: config.bg, color: config.color, borderColor: `${config.color}33` }}>
          <span>{config.icon}</span>
          {config.label}
        </div>

        {/* Dimensions overlay */}
        {media.quality && media.quality !== 'Original' && (
          <div style={styles.qualityBadge}>{media.quality}</div>
        )}
      </div>

      {/* Info */}
      <div style={styles.info}>
        <h3 style={styles.title} title={media.title}>
          {media.title || 'Pinterest Media'}
        </h3>

        <div style={styles.meta}>
          {media.size && (
            <span style={styles.metaTag}>
              <span style={{ color: '#666675' }}>◈</span> {media.size}
            </span>
          )}
          <span style={{ ...styles.metaTag, color: config.color }}>
            {config.icon} {config.label}
          </span>
          {media.quality && (
            <span style={styles.metaTag}>
              ⊞ {media.quality}
            </span>
          )}
        </div>

        {/* Download button */}
        <button
          onClick={handleDownload}
          disabled={downloading}
          style={{
            ...styles.downloadBtn,
            ...(downloading ? styles.downloadBtnLoading : {}),
          }}
        >
          {downloading ? (
            <span style={styles.spinner} />
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
              <polyline points="7,10 12,15 17,10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
          )}
          {downloading ? 'Preparing...' : `Download ${config.label}`}
        </button>

        {/* Open original link */}
        <a
          href={media.url}
          target="_blank"
          rel="noopener noreferrer"
          style={styles.viewLink}
        >
          View original ↗
        </a>
      </div>
    </div>
  );
}

const styles = {
  card: {
    background: '#111113',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: '20px',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    transition: 'border-color 0.2s ease, transform 0.2s ease',
    boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
  },
  thumbWrapper: {
    position: 'relative',
    width: '100%',
    aspectRatio: '16/9',
    background: '#0d0d0f',
    overflow: 'hidden',
  },
  thumb: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.4s ease',
  },
  thumbFallback: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#0d0d0f',
    color: '#333',
  },
  typeBadge: {
    position: 'absolute',
    top: '12px',
    left: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '5px 10px',
    borderRadius: '6px',
    border: '1px solid',
    fontSize: '11px',
    fontWeight: 700,
    fontFamily: 'Syne, sans-serif',
    letterSpacing: '0.08em',
    backdropFilter: 'blur(8px)',
  },
  qualityBadge: {
    position: 'absolute',
    bottom: '12px',
    right: '12px',
    padding: '4px 8px',
    background: 'rgba(0,0,0,0.7)',
    backdropFilter: 'blur(8px)',
    borderRadius: '4px',
    fontSize: '11px',
    color: '#a09fad',
    fontFamily: 'DM Sans, sans-serif',
    fontWeight: 500,
  },
  info: {
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  title: {
    fontSize: '15px',
    fontWeight: 600,
    color: '#f0eff2',
    fontFamily: 'Syne, sans-serif',
    lineHeight: 1.4,
    overflow: 'hidden',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
  },
  meta: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  },
  metaTag: {
    fontSize: '12px',
    color: '#666675',
    padding: '3px 8px',
    background: 'rgba(255,255,255,0.04)',
    borderRadius: '4px',
    fontFamily: 'DM Sans, sans-serif',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  downloadBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    width: '100%',
    padding: '14px 20px',
    background: 'linear-gradient(135deg, #E60023 0%, #ad081b 100%)',
    border: 'none',
    borderRadius: '12px',
    color: '#fff',
    fontSize: '15px',
    fontWeight: 700,
    fontFamily: 'Syne, sans-serif',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 20px rgba(230,0,35,0.3)',
    letterSpacing: '0.02em',
  },
  downloadBtnLoading: {
    opacity: 0.7,
    cursor: 'not-allowed',
    background: 'linear-gradient(135deg, #6b0010 0%, #4a000b 100%)',
    boxShadow: 'none',
  },
  spinner: {
    display: 'inline-block',
    width: '18px',
    height: '18px',
    border: '2px solid rgba(255,255,255,0.3)',
    borderTopColor: '#fff',
    borderRadius: '50%',
    animation: 'spin 0.7s linear infinite',
  },
  viewLink: {
    fontSize: '13px',
    color: '#666675',
    fontFamily: 'DM Sans, sans-serif',
    textAlign: 'center',
    transition: 'color 0.2s ease',
    cursor: 'pointer',
  },
};