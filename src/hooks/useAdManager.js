// hooks/useAdManager.js
// ─────────────────────────────────────────────────────────────────────────────
// AD_FREQUENCY = 1 → ad shown on EVERY single download (maximum revenue)
// AD_DURATION  = 10s total, SKIP_AFTER = 5s
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useCallback, useRef, useEffect } from 'react';

const AD_FREQUENCY = {
  video: 2,   // every download
  image: 1,
  gif:   1,
};

const AD_DURATION = 10;  // 10 seconds total
const SKIP_AFTER  = 5;   // skip button appears at 5s

export function useAdManager() {
  const [adState, setAdState] = useState({
    visible:    false,
    countdown:  AD_DURATION,
    skippable:  false,
    onComplete: null,
  });

  const downloadCounts = useRef({ video: 0, image: 0, gif: 0 });
  const timerRef       = useRef(null);
  const isPremiumRef   = useRef(false);

  const setPremiumState = useCallback((val) => {
    isPremiumRef.current = Boolean(val);
  }, []);

  const clearAdTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => () => clearAdTimer(), [clearAdTimer]);

  const showAd = useCallback((onComplete) => {
    setAdState({ visible: true, countdown: AD_DURATION, skippable: false, onComplete });

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

  const gateDownload = useCallback((mediaType, action) => {
    if (isPremiumRef.current) { action(); return; }

    const type = mediaType === 'gif' ? 'gif' : mediaType === 'video' ? 'video' : 'image';
    downloadCounts.current[type] = (downloadCounts.current[type] || 0) + 1;

    const frequency = AD_FREQUENCY[type] ?? 1;
    const count     = downloadCounts.current[type];

    if (count % frequency === 0) {
      showAd(() => action());
    } else {
      action();
    }
  }, [showAd]);

  return {
    adState,
    gateDownload,
    skipAd,
    totalDownloads: Object.values(downloadCounts.current).reduce((a, b) => a + b, 0),
    setPremiumState,
  };
}