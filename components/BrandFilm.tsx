"use client";

import { pinProgress, priorityFrameOrder } from "@/lib/scrollCanvas";
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

function frameSrc(base: string, index: number) {
  return `${base}/${String(index + 1).padStart(4, "0")}.webp`;
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

  const framesRef = useRef<(HTMLImageElement | null)[]>([]);
  const [frameReady, setFrameReady] = useState(false);

  const ready = isMobile !== null;
  const mobile = isMobile === true;
  const base = mobile ? (frameBaseMobile ?? frameBase) : frameBase;
  const count = mobile ? (frameCountMobile ?? frameCount) : frameCount;
  const videoPoster = mobile ? (posterMobile ?? poster) : poster;
  const sectionVh = isMobile === false ? SECTION_VH_DESKTOP : SECTION_VH_MOBILE;

  // Preload frames prioritised around the current scroll position.
  useEffect(() => {
    if (!ready || !base) return;

    let cancelled = false;
    const frames: (HTMLImageElement | null)[] = Array.from({ length: count }, () => null);
    framesRef.current = frames;
    let done = 0;
    let readyFired = false;

    setFrameReady(false);
    window.dispatchEvent(new CustomEvent("brandfilm:progress", { detail: 0 }));

    const section = sectionRef.current;
    const center = section ? Math.round(pinProgress(section) * (count - 1)) : 0;
    const order = priorityFrameOrder(center, count);
    let queueIndex = 0;

    const checkReady = () => {
      if (readyFired) return;
      if (frames[order[0]]) {
        readyFired = true;
        setFrameReady(true);
        window.dispatchEvent(new CustomEvent("brandfilm:ready"));
      }
    };

    const loadFrame = (i: number) => {
      const img = new Image();
      img.decoding = "async";
      img.onload = () => {
        if (cancelled) return;
        frames[i] = img;
        done++;
        if (done % 8 === 0 || done === count) {
          window.dispatchEvent(
            new CustomEvent("brandfilm:progress", { detail: done / count }),
          );
        }
        checkReady();
      };
      img.onerror = () => {
        if (cancelled) return;
        done++;
        checkReady();
      };
      img.src = frameSrc(base, i);
    };

    const loadBatch = () => {
      if (cancelled) return;
      const batchSize = mobile ? 8 : 12;
      const end = Math.min(queueIndex + batchSize, order.length);
      for (; queueIndex < end; queueIndex++) loadFrame(order[queueIndex]);
      if (queueIndex < order.length) requestAnimationFrame(loadBatch);
    };

    loadBatch();

    return () => {
      cancelled = true;
    };
  }, [ready, base, count, mobile]);

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

    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvasW = canvas.clientWidth;
      canvasH = canvas.clientHeight;
      canvas.width = Math.max(1, Math.round(canvasW * dpr));
      canvas.height = Math.max(1, Math.round(canvasH * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      lastExact = -1;
    };

    const drawFrame = (img: HTMLImageElement, alpha: number) => {
      const scale = Math.max(canvasW / img.naturalWidth, canvasH / img.naturalHeight);
      const dw = img.naturalWidth * scale;
      const dh = img.naturalHeight * scale;
      ctx.globalAlpha = alpha;
      ctx.drawImage(img, (canvasW - dw) / 2, (canvasH - dh) / 2, dw, dh);
      ctx.globalAlpha = 1;
    };

    /** Nearest loaded frame at or before/after `i` — sequence may still be loading. */
    const nearestLoaded = (i: number): number => {
      const frames = framesRef.current;
      if (frames[i]) return i;
      for (let d = 1; d < frames.length; d++) {
        if (i - d >= 0 && frames[i - d]) return i - d;
        if (i + d < frames.length && frames[i + d]) return i + d;
      }
      return -1;
    };

    const draw = () => {
      const exact = smooth * (count - 1);
      if (Math.abs(exact - lastExact) < 0.004) return;

      const frames = framesRef.current;
      const iRaw = Math.min(count - 1, Math.floor(exact));
      const i = nearestLoaded(iRaw);
      if (i === -1) return;

      const a = frames[i]!;
      const next = i + 1 < count ? frames[i + 1] : null;
      const frac = i === iRaw ? exact - iRaw : 0;

      drawFrame(a, 1);
      // Cross-blend into the next frame for sub-frame smoothness.
      if (next && frac > 0.01) drawFrame(next, frac);

      lastExact = exact;
    };

    const tick = (now: number) => {
      rafId = requestAnimationFrame(tick);
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      if (!active) return;

      const target = pinProgress(section);
      // Framerate-independent ease toward the scroll position — turns
      // discrete wheel steps into weighted, cinematic motion.
      const k = 1 - Math.exp(-5 * dt);
      smooth += (target - smooth) * k;
      if (Math.abs(target - smooth) < 0.0004) smooth = target;

      draw();
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        active = entry.isIntersecting;
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
  }, [ready, count, mobile]);

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
