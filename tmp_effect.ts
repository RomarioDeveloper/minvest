  useEffect(() => {
    if (!ready) return;

    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;

    video.pause();

    let unlocked = false;
    let rafId = 0;
    const ensureUnlocked = () => {
      if (unlocked) return;
      unlocked = true;
      void unlockVideoForScrub(video);
    };
    const onTouch = () => {
      ensureUnlocked();
    };
    section.addEventListener("touchstart", onTouch, { passive: true });

    if (mobile) {
      let canScrub = false;
      let seeking = false;
      let targetTime = 0;

      const FPS = 30;
      const FRAME_DURATION = 1 / FPS;

      let smoothProgress = pinProgress(section);
      let lastTime = performance.now();

      const onSeeked = () => {
        seeking = false;
      };

      const onCanScrub = () => {
        if (canScrub) return;
        ensureUnlocked();
        canScrub = true;
        setFrameReady(true);
        smoothProgress = pinProgress(section);
      };

      const tick = (now: number) => {
        const dt = Math.min((now - lastTime) / 1000, 0.05);
        lastTime = now;

        if (canScrub) {
          const duration = video.duration;
          if (Number.isFinite(duration) && duration > 0) {
            const targetProgress = pinProgress(section);
            
            const rawTime = targetProgress * Math.max(0, duration - 0.05);
            targetTime = Math.round(rawTime / FRAME_DURATION) * FRAME_DURATION;

            if (!seeking && Math.abs(video.currentTime - targetTime) >= FRAME_DURATION * 0.9) {
              seeking = true;
              try {
                if (typeof (video as any).fastSeek === 'function') {
                  (video as any).fastSeek(targetTime);
                } else {
                  video.currentTime = targetTime;
                }
              } catch {
                seeking = false;
              }
            }
          }
        }
        rafId = requestAnimationFrame(tick);
      };

      video.addEventListener("loadedmetadata", onCanScrub);
      video.addEventListener("loadeddata", onCanScrub);
      video.addEventListener("canplay", onCanScrub);
      video.addEventListener("seeked", onSeeked);
      if (video.readyState >= 1) {
        onCanScrub();
      }
      rafId = requestAnimationFrame(tick);

      return () => {
        cancelAnimationFrame(rafId);
        section.removeEventListener("touchstart", onTouch);
        video.removeEventListener("loadedmetadata", onCanScrub);
        video.removeEventListener("loadeddata", onCanScrub);
        video.removeEventListener("canplay", onCanScrub);
        video.removeEventListener("seeked", onSeeked);
      };
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let canvasW = 0;
    let canvasH = 0;
    let seeking = false;
    let targetTime = 0;
    let scrubReady = false;
    let rvfcId = 0;

    const FPS = 30;
    const FRAME_DURATION = 1 / FPS;

    let smoothProgress = pinProgress(section);
    let lastTime = performance.now();

    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvasW = canvas.clientWidth;
      canvasH = canvas.clientHeight;
      canvas.width = Math.max(1, Math.round(canvasW * dpr));
      canvas.height = Math.max(1, Math.round(canvasH * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const paint = () => {
      if (drawVideoCover(ctx, video, canvasW, canvasH)) {
        setFrameReady(true);
      }
    };

    const updateFrame = () => {
      paint();
      if ('requestVideoFrameCallback' in video) {
        rvfcId = (video as any).requestVideoFrameCallback(updateFrame);
      }
    };

    const onSeeked = () => {
      seeking = false;
      if (!('requestVideoFrameCallback' in video)) {
        paint(); // Fallback for old browsers
      }
    };

    const onCanScrub = () => {
      if (scrubReady) return;
      ensureUnlocked();
      scrubReady = true;
      resizeCanvas();
      
      if ('requestVideoFrameCallback' in video) {
        rvfcId = (video as any).requestVideoFrameCallback(updateFrame);
      } else {
        paint();
      }

      smoothProgress = pinProgress(section);
    };

    const onDesktopTouch = () => {
      ensureUnlocked();
    };

    video.addEventListener("loadeddata", onCanScrub);
    video.addEventListener("canplay", onCanScrub);
    video.addEventListener("canplaythrough", onCanScrub);
    video.addEventListener("seeked", onSeeked);
    section.addEventListener("touchstart", onDesktopTouch, { passive: true });
    if (video.readyState >= 2) {
      onCanScrub();
    }

    const tick = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      if (scrubReady) {
        const duration = video.duration;
        if (Number.isFinite(duration) && duration > 0) {
          const targetProgress = pinProgress(section);
          
          // Мы убрали сглаживание, чтобы время не ползло "микро-шагами".
          // Теперь мы просто считаем чистый процент и округляем его до ближайшего кадра.
          const rawTime = targetProgress * Math.max(0, duration - 0.05);
          targetTime = Math.round(rawTime / FRAME_DURATION) * FRAME_DURATION;

          // Проверяем: если мы не в процессе перемотки, и время изменилось хотя бы на 1 кадр
          if (!seeking && Math.abs(video.currentTime - targetTime) >= FRAME_DURATION * 0.9) {
            seeking = true;
            try {
              if (typeof (video as any).fastSeek === 'function') {
                (video as any).fastSeek(targetTime);
              } else {
                video.currentTime = targetTime;
              }
            } catch {
              seeking = false;
            }
          }
        }
      }
      
      rafId = requestAnimationFrame(tick);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    window.visualViewport?.addEventListener("resize", resizeCanvas);
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      if ('requestVideoFrameCallback' in video) {
        (video as any).cancelVideoFrameCallback(rvfcId);
      }
      window.removeEventListener("resize", resizeCanvas);
      window.visualViewport?.removeEventListener("resize", resizeCanvas);
      section.removeEventListener("touchstart", onTouch);
      section.removeEventListener("touchstart", onDesktopTouch);
      video.removeEventListener("loadeddata", onCanScrub);
      video.removeEventListener("canplay", onCanScrub);
      video.removeEventListener("canplaythrough", onCanScrub);
      video.removeEventListener("seeked", onSeeked);
    };
  }, [ready, mobile, src]);
