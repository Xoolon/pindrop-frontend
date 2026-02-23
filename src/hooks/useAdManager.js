import { useState, useCallback, useRef } from 'react';

// Ad frequency config:
// Images/GIFs: 1 ad per 3 downloads
// Videos: 1 ad per 2 downloads
// Each ad: 15 seconds total, skippable after 10 seconds

const AD_FREQUENCY = {
  image: 3,
  gif: 3,
  video: 2,
};

export function useAdManager() {
  const [adState, setAdState] = useState({
    visible: false,
    countdown: 15,
    skippable: false,
    onComplete: null,
  });

  const downloadCounts = useRef({ image: 0, gif: 0, video: 0 });
  const timerRef = useRef(null);
  const pendingAction = useRef(null);

  const clearAdTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const showAd = useCallback((onComplete) => {
    setAdState({
      visible: true,
      countdown: 15,
      skippable: false,
      onComplete,
    });

    let remaining = 15;

    timerRef.current = setInterval(() => {
      remaining -= 1;

      setAdState(prev => ({
        ...prev,
        countdown: remaining,
        skippable: remaining <= 10, // skippable after 10 seconds (5 seconds elapsed)
      }));

      if (remaining <= 0) {
        clearAdTimer();
        setAdState({ visible: false, countdown: 15, skippable: false, onComplete: null });
        onComplete?.();
      }
    }, 1000);
  }, [clearAdTimer]);

  const skipAd = useCallback(() => {
    if (!adState.skippable) return;
    clearAdTimer();
    const callback = adState.onComplete;
    setAdState({ visible: false, countdown: 15, skippable: false, onComplete: null });
    callback?.();
  }, [adState, clearAdTimer]);

  const dismissAd = useCallback(() => {
    // Only allow dismiss if skippable
    if (!adState.skippable) return;
    skipAd();
  }, [adState.skippable, skipAd]);

  /**
   * Gate a download action behind an ad check.
   * If ad is needed, show ad then run action.
   * Otherwise run action immediately.
   */
  const gateDownload = useCallback((mediaType, action) => {
    const type = mediaType === 'gif' ? 'gif' : mediaType === 'video' ? 'video' : 'image';
    downloadCounts.current[type] = (downloadCounts.current[type] || 0) + 1;

    const frequency = AD_FREQUENCY[type];
    const count = downloadCounts.current[type];

    const needsAd = count % frequency === 0;

    if (needsAd) {
      // Show ad, then run action after it completes or is skipped
      showAd(() => {
        action();
      });
    } else {
      action();
    }
  }, [showAd]);

  return {
    adState,
    gateDownload,
    skipAd,
    dismissAd,
  };
}