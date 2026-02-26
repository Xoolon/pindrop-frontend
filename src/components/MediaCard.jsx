import React, { useState, useRef, useCallback } from 'react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

// ── Real SVG brand logos ──────────────────────────────────────────────────────

function WhatsAppIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="#25D366">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="#fff">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.259 5.631 5.905-5.631zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );
}

function TelegramIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="#229ED9">
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="#1877F2">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="url(#igGrad)">
      <defs>
        <linearGradient id="igGrad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FFDC80"/>
          <stop offset="25%" stopColor="#FCAF45"/>
          <stop offset="50%" stopColor="#F77737"/>
          <stop offset="75%" stopColor="#C13584"/>
          <stop offset="100%" stopColor="#833AB4"/>
        </linearGradient>
      </defs>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
    </svg>
  );
}

// ── Video Preview Player ──────────────────────────────────────────────────────

function VideoPlayer({ videoUrl, thumbnail, title }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const controlsTimer = useRef(null);

  const proxyUrl = `${API_BASE}/api/preview-video?url=${encodeURIComponent(videoUrl)}`;

  const formatTime = (s) => {
    if (!s || isNaN(s)) return '0:00';
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (!hasStarted) setHasStarted(true);
    if (v.paused) {
      v.play().catch(console.error);
      setIsPlaying(true);
    } else {
      v.pause();
      setIsPlaying(false);
    }
    resetControlsTimer();
  }, [hasStarted]);

  const resetControlsTimer = () => {
    clearTimeout(controlsTimer.current);
    setShowControls(true);
    controlsTimer.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
  };

  const handleTimeUpdate = () => {
    const v = videoRef.current;
    if (!v) return;
    setCurrentTime(v.currentTime);
    setProgress(v.duration ? (v.currentTime / v.duration) * 100 : 0);
  };

  const handleSeek = (e) => {
    const v = videoRef.current;
    if (!v || !v.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    v.currentTime = ratio * v.duration;
  };

  const handleVolumeChange = (e) => {
    const v = videoRef.current;
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (v) {
      v.volume = val;
      v.muted = val === 0;
      setIsMuted(val === 0);
    }
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setIsMuted(v.muted);
  };

  const handleMouseMove = () => {
    if (hasStarted) resetControlsTimer();
  };

  return (
    <div
      style={playerStyles.wrapper}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { if (isPlaying) setShowControls(false); }}
    >
      {/* Thumbnail shown before first play */}
      {!hasStarted && thumbnail && (
        <img src={thumbnail} alt={title} style={playerStyles.thumbnail} />
      )}

      <video
        ref={videoRef}
        src={proxyUrl}
        style={{ ...playerStyles.video, opacity: hasStarted ? 1 : 0 }}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={() => {
          const v = videoRef.current;
          if (v) setDuration(v.duration);
        }}
        onWaiting={() => setIsLoading(true)}
        onCanPlay={() => setIsLoading(false)}
        onEnded={() => { setIsPlaying(false); setShowControls(true); }}
        playsInline
        preload="metadata"
        crossOrigin="anonymous"
      />

      {/* Loading spinner */}
      {isLoading && hasStarted && (
        <div style={playerStyles.spinnerOverlay}>
          <div style={playerStyles.spinner} />
        </div>
      )}

      {/* Play button overlay */}
      {(!isPlaying || !hasStarted) && (
        <button style={playerStyles.bigPlayBtn} onClick={handlePlayPause}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="#fff">
            <polygon points="5,3 19,12 5,21" />
          </svg>
        </button>
      )}

      {/* Controls bar */}
      <div style={{
        ...playerStyles.controls,
        opacity: showControls || !isPlaying ? 1 : 0,
        transition: 'opacity 0.3s ease',
      }}>
        {/* Progress bar */}
        <div style={playerStyles.progressTrack} onClick={handleSeek}>
          <div style={{ ...playerStyles.progressFill, width: `${progress}%` }} />
          <div style={{ ...playerStyles.progressThumb, left: `${progress}%` }} />
        </div>

        <div style={playerStyles.controlRow}>
          {/* Play/pause */}
          <button style={playerStyles.ctrlBtn} onClick={handlePlayPause}>
            {isPlaying ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5,3 19,12 5,21"/>
              </svg>
            )}
          </button>

          {/* Volume */}
          <button style={playerStyles.ctrlBtn} onClick={toggleMute}>
            {isMuted || volume === 0 ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11 5L6 9H2v6h4l5 4V5zM23 9l-6 6M17 9l6 6"/>
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="11,5 6,9 2,9 2,15 6,15 11,19" opacity="0.9"/>
                <path d="M15.54 8.46a5 5 0 010 7.07M19.07 4.93a10 10 0 010 14.14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round"/>
              </svg>
            )}
          </button>

          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            style={playerStyles.volumeSlider}
          />

          {/* Time */}
          <span style={playerStyles.timeLabel}>
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>

          {/* Fullscreen */}
          <button
            style={{ ...playerStyles.ctrlBtn, marginLeft: 'auto' }}
            onClick={() => videoRef.current?.requestFullscreen?.()}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/>
              <line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

const playerStyles = {
  wrapper: {
    position: 'relative',
    width: '100%',
    background: '#000',
    borderRadius: '14px 14px 0 0',
    overflow: 'hidden',
    aspectRatio: '16/9',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbnail: {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  video: {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    background: '#000',
  },
  spinnerOverlay: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(0,0,0,0.4)',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '3px solid rgba(255,255,255,0.2)',
    borderTopColor: '#fff',
    borderRadius: '50%',
    animation: 'spin 0.7s linear infinite',
  },
  bigPlayBtn: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '64px',
    height: '64px',
    background: 'rgba(220, 38, 38, 0.9)',
    backdropFilter: 'blur(8px)',
    border: '2px solid rgba(255,255,255,0.2)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    boxShadow: '0 8px 32px rgba(220,38,38,0.5)',
    transition: 'transform 0.15s ease, background 0.15s ease',
    zIndex: 10,
  },
  controls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: '32px 12px 12px',
    background: 'linear-gradient(transparent, rgba(0,0,0,0.75))',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    zIndex: 10,
  },
  progressTrack: {
    position: 'relative',
    width: '100%',
    height: '4px',
    background: 'rgba(255,255,255,0.2)',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  progressFill: {
    height: '100%',
    background: '#E60023',
    borderRadius: '4px',
    transition: 'width 0.1s linear',
  },
  progressThumb: {
    position: 'absolute',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    width: '12px',
    height: '12px',
    background: '#fff',
    borderRadius: '50%',
    boxShadow: '0 0 4px rgba(0,0,0,0.5)',
    pointerEvents: 'none',
  },
  controlRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  ctrlBtn: {
    background: 'none',
    border: 'none',
    color: '#fff',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    padding: '4px',
    borderRadius: '4px',
    opacity: 0.9,
    transition: 'opacity 0.15s',
    flexShrink: 0,
  },
  volumeSlider: {
    width: '64px',
    height: '3px',
    cursor: 'pointer',
    accentColor: '#E60023',
  },
  timeLabel: {
    fontSize: '11px',
    color: 'rgba(255,255,255,0.8)',
    fontFamily: 'DM Mono, monospace',
    whiteSpace: 'nowrap',
  },
};

// ── MediaCard ─────────────────────────────────────────────────────────────────

export function MediaCard({ media, onDownload }) {
  const { type, url, thumbnail, title, size, quality, width, height } = media;
  const [isDownloading, setIsDownloading] = useState(false);
  const [copied, setCopied] = useState(false);

  const proxyThumb = thumbnail
    ? `${API_BASE}/api/proxy-image?url=${encodeURIComponent(thumbnail)}`
    : null;

  const handleDownloadClick = async () => {
    if (isDownloading) return;

    const downloadUrl = `${API_BASE}/api/download?url=${encodeURIComponent(url)}&filename=${encodeURIComponent(title || 'pindrop_video')}`;

    onDownload(type, async () => {
      setIsDownloading(true);
      try {
        const response = await fetch(downloadUrl);
        if (!response.ok) throw new Error('Download failed');
        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);

        let filename = 'pindrop_video.mp4';
        const cd = response.headers.get('Content-Disposition');
        if (cd) {
          const match = cd.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
          if (match && match[1]) filename = match[1].replace(/['"]/g, '');
        }

        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(blobUrl);

        // Save to history
        try {
          const history = JSON.parse(localStorage.getItem('pindrop_history') || '[]');
          history.unshift({ timestamp: Date.now(), title: title || 'Pinterest Video', url, thumbnail });
          localStorage.setItem('pindrop_history', JSON.stringify(history.slice(0, 50)));
        } catch {}
      } catch (err) {
        console.error('Download error:', err);
      } finally {
        setIsDownloading(false);
      }
    });
  };

  const shareOn = (platform) => {
    const shareUrl = url;
    const text = title || 'Check out this video';
    let link = '';
    switch (platform) {
      case 'whatsapp':
        link = `https://wa.me/?text=${encodeURIComponent(text + ' ' + shareUrl)}`;
        break;
      case 'x':
        link = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`;
        break;
      case 'telegram':
        link = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(text)}`;
        break;
      case 'facebook':
        link = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        break;
      case 'instagram':
        // Instagram doesn't support URL sharing, copy link instead
        navigator.clipboard.writeText(shareUrl).catch(() => {});
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        return;
      default:
        return;
    }
    window.open(link, '_blank', 'noopener');
  };

  const sharePlatforms = [
    { id: 'whatsapp', label: 'WhatsApp', Icon: WhatsAppIcon, bg: 'rgba(37,211,102,0.1)', border: 'rgba(37,211,102,0.2)' },
    { id: 'x', label: 'X', Icon: XIcon, bg: 'rgba(255,255,255,0.06)', border: 'rgba(255,255,255,0.1)' },
    { id: 'telegram', label: 'Telegram', Icon: TelegramIcon, bg: 'rgba(34,158,217,0.1)', border: 'rgba(34,158,217,0.2)' },
    { id: 'facebook', label: 'Facebook', Icon: FacebookIcon, bg: 'rgba(24,119,242,0.1)', border: 'rgba(24,119,242,0.2)' },
    { id: 'instagram', label: copied ? 'Copied!' : 'Instagram', Icon: InstagramIcon, bg: 'rgba(193,53,132,0.08)', border: 'rgba(193,53,132,0.2)' },
  ];

  return (
    <div style={cardStyles.card}>
      {/* Video Player */}
      <VideoPlayer videoUrl={url} thumbnail={proxyThumb} title={title} />

      {/* Info section */}
      <div style={cardStyles.body}>
        {/* Title */}
        <h3 style={cardStyles.title}>{title || 'Pinterest Video'}</h3>

        {/* Meta chips */}
        <div style={cardStyles.metaRow}>
          <span style={cardStyles.chip}>
            <span style={cardStyles.chipDot} />
            Video
          </span>
          {size && <span style={cardStyles.chip}>📦 {size}</span>}
          {quality && quality !== 'Original' && <span style={cardStyles.chip}>🖥 {quality}</span>}
          {quality === 'Original' && <span style={cardStyles.chip}>✦ Best Quality</span>}
        </div>

        {/* Share section */}
        <div style={cardStyles.shareSection}>
          <span style={cardStyles.shareLabel}>Share</span>
          <div style={cardStyles.shareRow}>
            {sharePlatforms.map(({ id, label, Icon, bg, border }) => (
              <button
                key={id}
                onClick={() => shareOn(id)}
                title={`Share on ${label}`}
                style={{ ...cardStyles.shareBtn, background: bg, borderColor: border }}
              >
                <Icon />
                <span style={cardStyles.shareBtnLabel}>{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Download button */}
        <button
          onClick={handleDownloadClick}
          disabled={isDownloading}
          style={{
            ...cardStyles.downloadBtn,
            opacity: isDownloading ? 0.7 : 1,
            cursor: isDownloading ? 'not-allowed' : 'pointer',
          }}
        >
          {isDownloading ? (
            <>
              <span style={cardStyles.btnSpinner} />
              Downloading…
            </>
          ) : (
            <>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Download MP4
            </>
          )}
        </button>

        <p style={cardStyles.disclaimer}>
          Free download · No watermark · Original quality
        </p>
      </div>
    </div>
  );
}

const cardStyles = {
  card: {
    background: 'linear-gradient(145deg, #16161a, #111115)',
    border: '1px solid rgba(255,255,255,0.09)',
    borderRadius: '18px',
    overflow: 'hidden',
    boxShadow: '0 24px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(230,0,35,0.04)',
    maxWidth: '540px',
    width: '100%',
  },
  body: {
    padding: '20px 20px 24px',
  },
  title: {
    fontSize: '15px',
    fontWeight: 600,
    color: '#ededf0',
    fontFamily: 'DM Sans, sans-serif',
    lineHeight: 1.5,
    marginBottom: '12px',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  metaRow: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
    marginBottom: '18px',
  },
  chip: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '5px',
    fontSize: '11px',
    color: '#888897',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: '100px',
    padding: '3px 10px',
    fontFamily: 'DM Sans, sans-serif',
  },
  chipDot: {
    width: '5px',
    height: '5px',
    borderRadius: '50%',
    background: '#22c55e',
    boxShadow: '0 0 6px #22c55e',
    display: 'inline-block',
  },
  shareSection: {
    marginBottom: '16px',
  },
  shareLabel: {
    display: 'block',
    fontSize: '10px',
    fontWeight: 700,
    fontFamily: 'Syne, sans-serif',
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    color: '#555560',
    marginBottom: '8px',
  },
  shareRow: {
    display: 'flex',
    gap: '6px',
    flexWrap: 'wrap',
  },
  shareBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    padding: '7px 10px',
    border: '1px solid',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'transform 0.15s ease, filter 0.15s ease',
    flex: '1 1 80px',
    minWidth: '70px',
    justifyContent: 'center',
  },
  shareBtnLabel: {
    fontSize: '11px',
    fontFamily: 'DM Sans, sans-serif',
    fontWeight: 600,
    color: '#b0b0be',
    whiteSpace: 'nowrap',
  },
  downloadBtn: {
    width: '100%',
    padding: '14px',
    background: 'linear-gradient(135deg, #E60023 0%, #c0001d 100%)',
    border: 'none',
    borderRadius: '12px',
    color: '#fff',
    fontSize: '15px',
    fontWeight: 700,
    fontFamily: 'Syne, sans-serif',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '9px',
    boxShadow: '0 6px 24px rgba(230,0,35,0.35)',
    transition: 'opacity 0.2s, transform 0.15s',
    marginBottom: '10px',
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
  disclaimer: {
    textAlign: 'center',
    fontSize: '11px',
    color: '#3a3a46',
    fontFamily: 'DM Sans, sans-serif',
    margin: 0,
  },
};