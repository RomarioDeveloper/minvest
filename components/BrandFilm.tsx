"use client";

import { findNearestLoadedFrame, pinProgress, priorityFrameOrder } from "@/lib/scrollCanvas";
import { useEffect, useRef, useState } from "react";

type Props = {
  frameBase: string;
  frameBaseMobile?: string;
  frameCount: number;
  poster?: string;
  posterMobile?: string;
};

const SECTION_VH_MOBILE = 300;
const SECTION_VH_DESKTOP = 520;

function frameSrc(base: string, index: number) {
  return `${base}/${String(index + 1).padStart(4, "0")}.jpg`;
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

export default function BrandFilm({
  frameBase,
  frameBaseMobile,
  frameCount,
  poster,
  posterMobile,
}: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const isMobile = useMobileViewport();

  const framesRef = useRef<(HTMLImageElement | null)[]>([]);
  const onTickRef = useRef<() => void>(() => {});
  const [frameReady, setFrameReady] = useState(false);

  const ready = isMobile !== null;
  const mobile = isMobile === true;
  const base = mobile ? (frameBaseMobile ?? frameBase) : frameBase;
  const videoPoster = mobile ? (posterMobile ?? poster) : poster;
  const sectionVh = isMobile === false ? SECTION_VH_DESKTOP : SECTION_VH_MOBILE;

  // Load frames once — priority from current position, never restart on scroll.
  useEffect(() => {
    if (!ready || !base) return;

    let cancelled = false;
    const frames: (HTMLImageElement | null)[] = Array.from({ length: frameCount }, () => null);
    framesRef.current = frames;
    let done = 0;
    let readyFired = false;

    setFrameReady(false);
    window.dispatchEvent(new CustomEvent("brandfilm:progress", { detail: 0 }));

    const section = sectionRef.current;
    const center = section ? Math.round(pinProgress(section) * (frameCount - 1)) : 0;
    const order = priorityFrameOrder(center, frameCount);
    let queueIndex = 0;

    const checkFinished = () => {
      if (readyFired) return;
      const first = order[0];
      if (frames[first]) {
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
        if (done % 8 === 0 || done === frameCount) {
          window.dispatchEvent(new CustomEvent("brandfilm:progress", { detail: done / frameCount }));
        }
        checkFinished();
      };
      img.onerror = () => {
        if (cancelled) return;
        done++;
        checkFinished();
      };
      img.src = frameSrc(base, i);
    };

    const loadBatch = () => {
      if (cancelled) return;
      const batchSize = mobile ? 8 : 12;
      let loaded = 0;

      while (loaded < batchSize && queueIndex < order.length) {
        loadFrame(order[queueIndex]);
        queueIndex++;
        loaded++;
      }

      if (queueIndex < order.length) requestAnimationFrame(loadBatch);
    };

    loadBatch();

    return () => {
      cancelled = true;
    };
  }, [ready, base, frameCount, mobile]);

  // Mobile: swap <img> src — no canvas, no drawImage, GPU-friendly.
  useEffect(() => {
    if (!ready || !mobile) return;

    let lastExact = -1;
    let lastSrc = "";

    onTickRef.current = () => {
      const section = sectionRef.current;
      const img = imgRef.current;
      if (!section || !img) return;

      const exact = Math.min(
        frameCount - 1,
        Math.max(0, Math.round(pinProgress(section) * (frameCount - 1))),
      );
      if (exact === lastExact) return;

      const frame = findNearestLoadedFrame(framesRef.current, exact);
      const src = frame?.src ?? frameSrc(base, exact);
      if (src === lastSrc) return;

      lastExact = exact;
      lastSrc = src;
      img.src = src;
    };
  }, [ready, mobile, base, frameCount]);

  // Desktop: canvas cover at 2× DPR.
  useEffect(() => {
    if (!ready || mobile) return;

    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let canvasW = 0;
    let canvasH = 0;
    let lastExact = -1;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resizeCanvas = () => {
      canvasW = canvas.clientWidth;
      canvasH = canvas.clientHeight;
      canvas.width = Math.max(1, Math.round(canvasW * dpr));
      canvas.height = Math.max(1, Math.round(canvasH * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      lastExact = -1;
    };

    onTickRef.current = () => {
      const exact = Math.min(
        frameCount - 1,
        Math.max(0, Math.round(pinProgress(section) * (frameCount - 1))),
      );
      if (exact === lastExact) return;

      const frame = findNearestLoadedFrame(framesRef.current, exact);
      if (!frame) return;

      const scale = Math.max(canvasW / frame.naturalWidth, canvasH / frame.naturalHeight);
      const dw = frame.naturalWidth * scale;
      const dh = frame.naturalHeight * scale;
      ctx.drawImage(frame, (canvasW - dw) / 2, (canvasH - dh) / 2, dw, dh);
      lastExact = exact;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    return () => window.removeEventListener("resize", resizeCanvas);
  }, [ready, mobile, frameCount]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || !ready) return;

    let rafId = 0;
    let active = true;

    const tick = () => {
      if (active) onTickRef.current();
      rafId = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        active = entry.isIntersecting;
      },
      { rootMargin: "100px 0px" },
    );
    observer.observe(section);
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      observer.disconnect();
    };
  }, [ready, mobile]);

  if (!ready) {
    return (
      <section className="relative w-full bg-ink" style={{ height: `${SECTION_VH_MOBILE}dvh` }} aria-hidden>
        <div className="sticky top-0 h-[100dvh] w-full overflow-hidden bg-ink supports-[height:100svh]:h-[100svh]">
          {videoPoster && (
            <img
              src={videoPoster}
              alt=""
              className="pointer-events-none absolute inset-0 h-full w-full object-cover"
              draggable={false}
            />
          )}
        </div>
      </section>
    );
  }

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
        {mobile ? (
          <img
            ref={imgRef}
            src={videoPoster ?? frameSrc(base, 0)}
            alt=""
            aria-hidden
            className="pointer-events-none absolute inset-0 z-[1] h-full w-full object-cover"
            draggable={false}
            decoding="async"
          />
        ) : (
          <canvas
            ref={canvasRef}
            className="pointer-events-none absolute inset-0 z-[1] h-full w-full object-cover"
            aria-hidden
          />
        )}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-32 bg-gradient-to-t from-ink to-transparent" />
      </div>
    </section>
  );
}
