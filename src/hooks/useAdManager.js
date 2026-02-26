// hooks/useAdManager.js
// ─────────────────────────────────────────────────────────────────────────────
// Controls when ads are shown before downloads.
// Premium users bypass ALL ads.
//
// Frequency: show an ad every N downloads per media type.
// Since PinDrop is video-only, video is the only type that matters now —
// but we keep image/gif for future flexibility.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useCallback, useRef } from 'react';

const AD_FREQUENCY = {
  video: 2,   // Show ad every 2 video downloads
  image: 3,
  gif:   3,
};

const AD_DURATION   = 15;  // Total seconds
const SKIP_AFTER    = 5;   // Seconds before skip button appears

export function useAdManager(isPremium = false) {
  const [adState, setAdState] = useState({
    visible:    false,
    countdown:  AD_DURATION,
    skippable:  false,
    onComplete: null,
  });

  const downloadCounts = useRef({ video: 0, image: 0, gif: 0 });
  const timerRef       = useRef(null);

  const clearAdTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const showAd = useCallback((onComplete) => {
    setAdState({
      visible:    true,
      countdown:  AD_DURATION,
      skippable:  false,
      onComplete,
    });

    let remaining = AD_DURATION;

    timerRef.current = setInterval(() => {
      remaining -= 1;

      setAdState(prev => ({
        ...prev,
        countdown: remaining,
        skippable: remaining <= (AD_DURATION - SKIP_AFTER),
      }));

      if (remaining <= 0) {
        clearAdTimer();
        setAdState({ visible: false, countdown: AD_DURATION, skippable: false, onComplete: null });
        onComplete?.();
      }
    }, 1000);
  }, [clearAdTimer]);

  const skipAd = useCallback(() => {
    clearAdTimer();
    setAdState(prev => {
      if (!prev.skippable) return prev;
      const cb = prev.onComplete;
      setTimeout(() => cb?.(), 0);
      return { visible: false, countdown: AD_DURATION, skippable: false, onComplete: null };
    });
  }, [clearAdTimer]);

  /**
   * gateDownload(mediaType, action)
   * If premium → run action immediately (no ads ever).
   * Otherwise  → check if this download should trigger an ad first.
   */
  const gateDownload = useCallback((mediaType, action) => {
    // Premium users: bypass completely
    if (isPremium) {
      action();
      return;
    }

    const type = mediaType === 'gif' ? 'gif' : mediaType === 'video' ? 'video' : 'image';
    downloadCounts.current[type] = (downloadCounts.current[type] || 0) + 1;

    const frequency = AD_FREQUENCY[type] ?? 3;
    const count     = downloadCounts.current[type];
    const needsAd   = count % frequency === 0;

    if (needsAd) {
      showAd(() => action());
    } else {
      action();
    }
  }, [isPremium, showAd]);

  // How many total downloads (for UpgradeStrip visibility logic)
  const totalDownloads = Object.values(downloadCounts.current).reduce((a, b) => a + b, 0);

  return {
    adState,
    gateDownload,
    skipAd,
    totalDownloads,
  };
}