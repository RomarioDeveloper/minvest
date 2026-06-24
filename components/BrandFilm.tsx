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
  if (video.readyState < 2 || video.videoWidth === 0) return;
  const scale = Math.max(w / video.videoWidth, h / video.videoHeight);
  const dw = video.videoWidth * scale;
  const dh = video.videoHeight * scale;
  ctx.fillStyle = "#08080a";
  ctx.fillRect(0, 0, w, h);
  ctx.drawImage(video, (w - dw) / 2, (h - dh) / 2, dw, dh);
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
  try {
    await video.play();
    video.pause();
  } catch {
    /* muted + playsInline */
  }
}

export default function BrandFilm({ scrubSrc, poster, scrubSrcMobile, posterMobile }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isMobile = useMobileViewport();

  const src = isMobile ? (scrubSrcMobile ?? scrubSrc) : scrubSrc;
  const videoPoster = isMobile ? (posterMobile ?? poster) : poster;
  const sectionVh = isMobile ? SECTION_VH_MOBILE : SECTION_VH_DESKTOP;

  useEffect(() => {
    if (isMobile === null) return;

    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;

    const mobile = isMobile;
    const canvas = mobile ? null : canvasRef.current;
    const ctx = canvas?.getContext("2d") ?? null;

    video.pause();
    let unlocked = false;
    let rafId = 0;
    let canvasW = 0;
    let canvasH = 0;
    let pendingTime = -1;
    let seeking = false;

    const resizeCanvas = () => {
      if (!canvas || !ctx) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvasW = canvas.clientWidth;
      canvasH = canvas.clientHeight;
      canvas.width = Math.max(1, Math.round(canvasW * dpr));
      canvas.height = Math.max(1, Math.round(canvasH * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const paint = () => {
      if (mobile || !ctx) return;
      drawVideoCover(ctx, video, canvasW, canvasH);
    };

    const seekTo = (progress: number) => {
      const duration = video.duration;
      if (!Number.isFinite(duration) || duration <= 0) return;
      if (video.readyState < 1) return;

      const t = progress * Math.max(0, duration - 1 / 60);

      if (mobile) {
        if (Math.abs(video.currentTime - t) < 0.015) return;
        try {
          video.currentTime = t;
        } catch {
          /* iOS */
        }
        return;
      }

      pendingTime = t;
      if (seeking) return;
      if (Math.abs(video.currentTime - t) < 0.001) {
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

      if (pendingTime >= 0 && Math.abs(video.currentTime - pendingTime) > 0.001) {
        seeking = true;
        try {
          video.currentTime = pendingTime;
        } catch {
          seeking = false;
        }
      }
    };

    const onMeta = () => {
      if (!unlocked) {
        unlocked = true;
        void unlockVideoForScrub(video);
      }
      resizeCanvas();
      seekTo(pinProgress(section));
    };

    video.addEventListener("loadedmetadata", onMeta);
    video.addEventListener("loadeddata", onMeta);
    video.addEventListener("canplay", onMeta);
    video.addEventListener("seeked", onSeeked);

    const tick = () => {
      seekTo(pinProgress(section));
      rafId = requestAnimationFrame(tick);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resizeCanvas);
      video.removeEventListener("loadedmetadata", onMeta);
      video.removeEventListener("loadeddata", onMeta);
      video.removeEventListener("canplay", onMeta);
      video.removeEventListener("seeked", onSeeked);
    };
  }, [isMobile, src]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-ink"
      style={{ height: `${sectionVh}dvh` }}
      aria-label="Видео о доме, управляемое скроллом"
    >
      <div className="sticky top-0 h-[100dvh] w-full overflow-hidden bg-ink supports-[height:100svh]:h-[100svh]">
        {isMobile !== null && (
          <>
            {!isMobile && (
              <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden />
            )}
            <video
              ref={videoRef}
              key={src}
              className={isMobile ? "absolute inset-0 h-full w-full object-cover" : "hidden"}
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
