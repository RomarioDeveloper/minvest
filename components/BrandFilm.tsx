"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  scrubSrc: string;
  poster?: string;
  scrubSrcMobile?: string;
  posterMobile?: string;
};

const SECTION_VH_MOBILE = 350;
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
) {
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
    /* first touch unlocks on strict iOS builds */
  }
}

export default function BrandFilm({ scrubSrc, poster, scrubSrcMobile, posterMobile }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isMobile = useMobileViewport();

  const ready = isMobile !== null;
  const mobile = isMobile === true;
  const src = mobile ? (scrubSrcMobile ?? scrubSrc) : scrubSrc;
  const videoPoster = mobile ? (posterMobile ?? poster) : poster;
  const sectionVh = isMobile === false ? SECTION_VH_DESKTOP : SECTION_VH_MOBILE;

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
      // iOS Safari won't decode zero-size / hidden video for canvas — show video directly.
      const onMeta = () => {
        ensureUnlocked();
        const t = pinProgress(section) * Math.max(0, (video.duration || 0) - 0.05);
        if (Number.isFinite(t)) {
          try {
            video.currentTime = t;
          } catch {
            /* not ready yet */
          }
        }
      };

      video.addEventListener("loadedmetadata", onMeta);
      video.addEventListener("loadeddata", onMeta);
      video.addEventListener("canplay", onMeta);

      const tick = () => {
        const duration = video.duration;
        if (Number.isFinite(duration) && duration > 0 && video.readyState >= 1) {
          const t = pinProgress(section) * Math.max(0, duration - 0.05);
          if (Math.abs(video.currentTime - t) > 0.012) {
            try {
              video.currentTime = t;
            } catch {
              /* iOS seek while buffering */
            }
          }
        }
        rafId = requestAnimationFrame(tick);
      };

      rafId = requestAnimationFrame(tick);

      return () => {
        cancelAnimationFrame(rafId);
        section.removeEventListener("touchstart", onTouch);
        video.removeEventListener("loadedmetadata", onMeta);
        video.removeEventListener("loadeddata", onMeta);
        video.removeEventListener("canplay", onMeta);
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

    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvasW = canvas.clientWidth;
      canvasH = canvas.clientHeight;
      canvas.width = Math.max(1, Math.round(canvasW * dpr));
      canvas.height = Math.max(1, Math.round(canvasH * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const paint = () => {
      drawVideoCover(ctx, video, canvasW, canvasH);
    };

    const queueSeek = (progress: number) => {
      const duration = video.duration;
      if (!Number.isFinite(duration) || duration <= 0) return;
      if (video.readyState < 1) return;

      const t = progress * Math.max(0, duration - 0.05);
      pendingTime = t;

      if (seeking) return;
      if (Math.abs(video.currentTime - t) < 0.004) {
        paint();
        return;
      }

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

    const onMeta = () => {
      ensureUnlocked();
      resizeCanvas();
      queueSeek(pinProgress(section));
    };

    video.addEventListener("loadedmetadata", onMeta);
    video.addEventListener("loadeddata", onMeta);
    video.addEventListener("canplay", onMeta);
    video.addEventListener("seeked", onSeeked);

    const tick = () => {
      queueSeek(pinProgress(section));
      rafId = requestAnimationFrame(tick);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resizeCanvas);
      section.removeEventListener("touchstart", onTouch);
      video.removeEventListener("loadedmetadata", onMeta);
      video.removeEventListener("loadeddata", onMeta);
      video.removeEventListener("canplay", onMeta);
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
            {!mobile && <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden />}
            <video
              ref={videoRef}
              key={src}
              className={
                mobile
                  ? "absolute inset-0 h-full w-full object-cover"
                  : "pointer-events-none absolute inset-0 h-full w-full opacity-0"
              }
              src={`${src}#t=0.001`}
              poster={videoPoster}
              muted
              playsInline
              preload="auto"
              disablePictureInPicture
            />
          </>
        )}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-ink to-transparent" />
      </div>
    </section>
  );
}
