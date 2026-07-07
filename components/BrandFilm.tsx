"use client";

import {
  createSlidingFrameLoader,
  frameHeight,
  frameWidth,
  pinProgress,
  snapFrameIndex,
  type Frame,
} from "@/lib/scrollCanvas";
import { useEffect, useRef, useState } from "react";

type Props = {
  frameBase: string;
  frameBaseMobile?: string;
  frameCount: number;
  frameCountMobile?: number;
  poster?: string;
  posterMobile?: string;
};

const SECTION_VH_MOBILE = 300;
const SECTION_VH_DESKTOP = 520;

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

/**
 * Scroll-scrubbed fullscreen frame sequence on canvas — the Apple technique:
 *
 *   • WebP frames are preloaded starting from the current scroll position.
 *   • Scroll progress is eased with a framerate-independent lerp, so wheel
 *     steps and touch flicks become weighted, continuous motion.
 *   • The fractional position between two frames is rendered by blending
 *     them (camera motion is continuous), which reads as real video even
 *     though the sequence is ~20fps.
 */
export default function BrandFilm({
  frameBase,
  frameBaseMobile,
  frameCount,
  frameCountMobile,
  poster,
  posterMobile,
}: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isMobile = useMobileViewport();

  const loaderRef = useRef<ReturnType<typeof createSlidingFrameLoader> | null>(null);
  const [frameReady, setFrameReady] = useState(false);

  const ready = isMobile !== null;
  const mobile = isMobile === true;
  const base = mobile ? (frameBaseMobile ?? frameBase) : frameBase;
  const count = mobile ? (frameCountMobile ?? frameCount) : frameCount;
  const videoPoster = mobile ? (posterMobile ?? poster) : poster;
  const sectionVh = isMobile === false ? SECTION_VH_DESKTOP : SECTION_VH_MOBILE;
  const frameStep = mobile ? 2 : 1;

  useEffect(() => {
    if (!ready || !base) return;

    setFrameReady(false);
    window.dispatchEvent(new CustomEvent("brandfilm:progress", { detail: 0 }));

    const section = sectionRef.current;
    const startCenter = section ? Math.round(pinProgress(section) * (count - 1)) : 0;

    const loader = createSlidingFrameLoader({
      base,
      count,
      extension: "webp",
      step: frameStep,
      windowRadius: mobile ? 14 : 22,
      batchSize: mobile ? 2 : 4,
      onFirstFrame: () => {
        setFrameReady(true);
        window.dispatchEvent(new CustomEvent("brandfilm:ready"));
      },
    });

    loader.setCenter(startCenter);
    loaderRef.current = loader;

    return () => {
      loader.destroy();
      loaderRef.current = null;
    };
  }, [ready, base, count, frameStep, mobile]);

  // Render loop: eased progress → blended frames on canvas.
  useEffect(() => {
    if (!ready) return;

    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let canvasW = 0;
    let canvasH = 0;
    let rafId = 0;
    let active = true;
    let lastExact = -1;
    let smooth = pinProgress(section);
    let lastTime = performance.now();
    let velocity = 0;

    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvasW = canvas.clientWidth;
      canvasH = canvas.clientHeight;
      canvas.width = Math.max(1, Math.round(canvasW * dpr));
      canvas.height = Math.max(1, Math.round(canvasH * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      lastExact = -1;
    };

    const drawFrame = (img: Frame, alpha: number) => {
      const iw = frameWidth(img);
      const ih = frameHeight(img);
      const scale = Math.max(canvasW / iw, canvasH / ih);
      const dw = iw * scale;
      const dh = ih * scale;
      ctx.globalAlpha = alpha;
      ctx.drawImage(img, (canvasW - dw) / 2, (canvasH - dh) / 2, dw, dh);
      ctx.globalAlpha = 1;
    };

    // Blending two offset frames reads as motion blur when the camera moves
    // fast — so cross-blend only below this speed (frames per RAF tick).
    // Above it a single crisp frame looks sharper and the eye can't tell.
    const BLEND_MAX_VELOCITY = 0.6;

    const draw = () => {
      const exact = smooth * (count - 1);
      if (Math.abs(exact - lastExact) < 0.004) return;

      const loader = loaderRef.current;
      if (!loader) return;

      const frames = loader.frames;
      const blend = velocity < BLEND_MAX_VELOCITY;
      const iRaw = snapFrameIndex(
        Math.min(count - 1, blend ? Math.floor(exact) : Math.round(exact)),
        count,
        frameStep,
      );
      const i = loader.nearestLoaded(iRaw);
      if (i === -1) return;

      drawFrame(frames[i]!, 1);

      if (blend && i === iRaw) {
        const nextIndex = i + frameStep < count ? i + frameStep : -1;
        const next = nextIndex >= 0 ? frames[nextIndex] : null;
        const frac = (exact - iRaw) / frameStep;
        if (next && frac > 0.01) drawFrame(next, frac);
      }

      lastExact = exact;
    };

    let lastScrollY = -1;
    let lastTarget = 0;

    const tick = (now: number) => {
      rafId = requestAnimationFrame(tick);
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      if (!active) return;

      let target = lastTarget;
      if (window.scrollY !== lastScrollY) {
        lastScrollY = window.scrollY;
        target = pinProgress(section);
        lastTarget = target;
        loaderRef.current?.setCenter(Math.round(target * (count - 1)));
      }

      // Framerate-independent ease toward the scroll position — turns
      // discrete wheel steps into weighted, cinematic motion.
      const k = 1 - Math.exp(-5 * dt);
      const prev = smooth;
      smooth += (target - smooth) * k;
      if (Math.abs(target - smooth) < 0.0004) smooth = target;
      velocity = Math.abs(smooth - prev) * (count - 1);

      draw();
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        active = entry.isIntersecting;
        loaderRef.current?.setActive(entry.isIntersecting);
      },
      { rootMargin: "100px 0px" },
    );
    observer.observe(section);

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      observer.disconnect();
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [ready, count, frameStep, mobile]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-ink"
      style={{ height: `${sectionVh}dvh` }}
      aria-label="Видео о доме, управляемое скроллом"
    >
      <div className="sticky top-0 h-[100dvh] w-full overflow-hidden bg-ink supports-[height:100svh]:h-[100svh]">
        {videoPoster && !frameReady && (
          <img
            src={videoPoster}
            alt=""
            aria-hidden
            className="pointer-events-none absolute inset-0 h-full w-full object-cover"
            draggable={false}
          />
        )}
        <canvas
          ref={canvasRef}
          className={`pointer-events-none absolute inset-0 z-[1] h-full w-full transition-opacity duration-300 ${
            frameReady ? "opacity-100" : "opacity-0"
          }`}
          aria-hidden
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-32 bg-gradient-to-t from-ink to-transparent" />
      </div>
    </section>
  );
}
