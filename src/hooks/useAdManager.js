// hooks/useAdManager.js
// ─────────────────────────────────────────────────────────────────────────────
// Controls when ads are shown before downloads.
// Premium users bypass ALL ads immediately.
//
// FIX: The original hook accepted isPremium as a parameter at hook-call time,
// meaning it captured a stale closure. We now accept isPremium as a ref-based
// prop so gateDownload always reads the current value without re-creating.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useCallback, useRef, useEffect } from 'react';

const AD_FREQUENCY = {
  video: 2,   // show ad every 2 video downloads
  image: 3,
  gif:   3,
};

const AD_DURATION = 15;   // total seconds overlay is shown
const SKIP_AFTER  = 5;    // seconds before skip button appears

export function useAdManager() {
  const [adState, setAdState] = useState({
    visible:    false,
    countdown:  AD_DURATION,
    skippable:  false,
    onComplete: null,
  });

  const downloadCounts  = useRef({ video: 0, image: 0, gif: 0 });
  const timerRef        = useRef(null);
  const isPremiumRef    = useRef(false);   // updated by setPremium below

  // Allow App to push current premium state into the ref
  const setPremiumState = useCallback((val) => {
    isPremiumRef.current = Boolean(val);
  }, []);

  const clearAdTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Clean up timer on unmount
  useEffect(() => () => clearAdTimer(), [clearAdTimer]);

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
      // Fire callback after state update
      setTimeout(() => cb?.(), 0);
      return { visible: false, countdown: AD_DURATION, skippable: false, onComplete: null };
    });
  }, [clearAdTimer]);

  /**
   * gateDownload(mediaType, action)
   * Runs action immediately for premium users.
   * For free users: shows ad on every Nth download (per AD_FREQUENCY).
   */
  const gateDownload = useCallback((mediaType, action) => {
    // Always read from ref so we never use a stale closure value
    if (isPremiumRef.current) {
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
  }, [showAd]);

  const totalDownloads = Object.values(downloadCounts.current).reduce((a, b) => a + b, 0);

  return {
    adState,
    gateDownload,
    skipAd,
    totalDownloads,
    setPremiumState,   // call this in App whenever isPremium changes
  };
}