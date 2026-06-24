"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  scrubSrc: string;
  poster?: string;
  scrubSrcMobile?: string;
  posterMobile?: string;
};

const SECTION_VH_MOBILE = 300;
const SECTION_VH_DESKTOP = 520;

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

function pinProgress(section: HTMLElement): number {
  const viewport = window.visualViewport?.height ?? window.innerHeight;
  const scrollable = section.offsetHeight - viewport;
  if (scrollable <= 0) return 0;
  return clamp01(-section.getBoundingClientRect().top / scrollable);
}

function drawVideoCover(
  ctx: CanvasRenderingContext2D,
  video: HTMLVideoElement,
  w: number,
  h: number,
): boolean {
  if (video.readyState < 2 || video.videoWidth === 0) return false;
  const scale = Math.max(w / video.videoWidth, h / video.videoHeight);
  const dw = video.videoWidth * scale;
  const dh = video.videoHeight * scale;
  ctx.fillStyle = "#08080a";
  ctx.fillRect(0, 0, w, h);
  ctx.drawImage(video, (w - dw) / 2, (h - dh) / 2, dw, dh);
  return true;
}

function useMobileViewport() {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return isMobile;
}

async function unlockVideoForScrub(video: HTMLVideoElement) {
  video.setAttribute("webkit-playsinline", "true");
  video.playsInline = true;
  video.muted = true;
  try {
    await video.play();
    video.pause();
  } catch {
    /* unlocked on first touch if autoplay blocked */
  }
}

export default function BrandFilm({ scrubSrc, poster, scrubSrcMobile, posterMobile }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isMobile = useMobileViewport();
  const [frameReady, setFrameReady] = useState(false);

  const ready = isMobile !== null;
  const mobile = isMobile === true;
  const src = mobile ? (scrubSrcMobile ?? scrubSrc) : scrubSrc;
  const videoPoster = mobile ? (posterMobile ?? poster) : poster;
  const sectionVh = isMobile === false ? SECTION_VH_DESKTOP : SECTION_VH_MOBILE;

  useEffect(() => {
    setFrameReady(false);
  }, [src]);

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
      let pending = -1;
      let lastRequested = -1;

      const queueSeek = (progress: number) => {
        if (!canScrub) return;
        const duration = video.duration;
        if (!Number.isFinite(duration) || duration <= 0 || video.readyState < 1) return;

        const t = progress * Math.max(0, duration - 0.05);
        if (Math.abs(t - lastRequested) < 0.015) return;
        lastRequested = t;
        pending = t;

        if (seeking) return;
        seeking = true;
        try {
          video.currentTime = t;
        } catch {
          seeking = false;
        }
      };

      const onSeeked = () => {
        seeking = false;
        if (pending >= 0 && Math.abs(video.currentTime - pending) > 0.025) {
          seeking = true;
          try {
            video.currentTime = pending;
          } catch {
            seeking = false;
          }
        }
      };

      const onCanScrub = () => {
        if (canScrub) return;
        ensureUnlocked();
        canScrub = true;
        setFrameReady(true);
        queueSeek(pinProgress(section));
      };

      const tick = () => {
        queueSeek(pinProgress(section));
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
    let pendingTime = -1;
    let seeking = false;
    let scrubReady = false;

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

    const queueSeek = (progress: number) => {
      if (!scrubReady) return;
      const duration = video.duration;
      if (!Number.isFinite(duration) || duration <= 0) return;

      const t = progress * Math.max(0, duration - 0.05);
      pendingTime = t;
      if (seeking) return;
      if (Math.abs(video.currentTime - t) < 0.004) return;

      seeking = true;
      try {
        video.currentTime = t;
      } catch {
        seeking = false;
      }
    };

    const onSeeked = () => {
      seeking = false;
      paint();
      if (pendingTime >= 0 && Math.abs(video.currentTime - pendingTime) > 0.004) {
        seeking = true;
        try {
          video.currentTime = pendingTime;
        } catch {
          seeking = false;
        }
      }
    };

    const onCanScrub = () => {
      if (scrubReady) return;
      ensureUnlocked();
      scrubReady = true;
      resizeCanvas();
      paint(); // Do initial paint so canvas isn't blank
      queueSeek(pinProgress(section));
    };

    const onDesktopTouch = () => {
      ensureUnlocked();
      if (scrubReady) queueSeek(pinProgress(section));
    };

    video.addEventListener("loadeddata", onCanScrub);
    video.addEventListener("canplay", onCanScrub);
    video.addEventListener("canplaythrough", onCanScrub);
    video.addEventListener("seeked", onSeeked);
    section.addEventListener("touchstart", onDesktopTouch, { passive: true });
    if (video.readyState >= 2) {
      onCanScrub();
    }

    const tick = () => {
      queueSeek(pinProgress(section));
      rafId = requestAnimationFrame(tick);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    window.visualViewport?.addEventListener("resize", resizeCanvas);
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
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

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-ink"
      style={{ height: `${sectionVh}dvh` }}
      aria-label="Видео о доме, управляемое скроллом"
    >
      <div className="sticky top-0 h-[100dvh] w-full overflow-hidden bg-ink supports-[height:100svh]:h-[100svh]">
        {ready && (
          <>
            {videoPoster && !frameReady && (
              <img
                src={videoPoster}
                alt=""
                aria-hidden
                className="absolute inset-0 h-full w-full object-cover"
                draggable={false}
              />
            )}
            {!mobile && <canvas ref={canvasRef} className="absolute inset-0 z-[1] h-full w-full" aria-hidden />}
            {/*
              Full-size video (opacity 0) — iOS Safari refuses to decode
              zero-size or display:none video, which caused the black screen.
            */}
            <video
              ref={videoRef}
              key={src}
              className={
                mobile
                  ? "absolute inset-0 z-[1] h-full w-full object-cover"
                  : "pointer-events-none absolute inset-0 z-0 h-full w-full opacity-0"
              }
              src={src}
              poster={videoPoster}
              muted
              playsInline
              preload="auto"
              disablePictureInPicture
            />
          </>
        )}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-32 bg-gradient-to-t from-ink to-transparent" />
      </div>
    </section>
  );
}
