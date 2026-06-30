"use client";

import {
  bindScrollCanvas,
  canvasDpr,
  drawCover,
  findNearestLoadedFrame,
  pinProgress,
  priorityFrameOrder,
} from "@/lib/scrollCanvas";
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
  const isMobile = useMobileViewport();

  const framesRef = useRef<(HTMLImageElement | null)[]>([]);
  const loadingRef = useRef<Set<number>>(new Set());
  const frameReadyRef = useRef(false);
  const [loadedCount, setLoadedCount] = useState(0);
  const [frameReady, setFrameReady] = useState(false);

  const ready = isMobile !== null;
  const mobile = isMobile === true;
  const base = mobile ? (frameBaseMobile ?? frameBase) : frameBase;
  const videoPoster = mobile ? (posterMobile ?? poster) : poster;
  const sectionVh = isMobile === false ? SECTION_VH_DESKTOP : SECTION_VH_MOBILE;

  useEffect(() => {
    if (!ready || !base) return;

    let cancelled = false;
    const frames: (HTMLImageElement | null)[] = Array.from({ length: frameCount }, () => null);
    framesRef.current = frames;
    loadingRef.current = new Set();
    frameReadyRef.current = false;
    let done = 0;
    let readyFired = false;
    let queueIndex = 0;
    let priority: number[] = [];

    setLoadedCount(0);
    setFrameReady(false);
    window.dispatchEvent(new CustomEvent("brandfilm:progress", { detail: 0 }));

    const rebuildPriority = () => {
      const section = sectionRef.current;
      if (!section) return;
      const center = Math.round(pinProgress(section) * (frameCount - 1));
      priority = priorityFrameOrder(center, frameCount);
      queueIndex = 0;
    };

    const checkFinished = () => {
      if (!readyFired && frames[0]) {
        readyFired = true;
        window.dispatchEvent(new CustomEvent("brandfilm:ready"));
      }
    };

    const loadFrame = (i: number) => {
      if (cancelled || frames[i] || loadingRef.current.has(i)) return;
      loadingRef.current.add(i);

      const img = new Image();
      img.decoding = "async";

      const finish = () => {
        if (cancelled) return;
        loadingRef.current.delete(i);
        done++;
        setLoadedCount(done);
        window.dispatchEvent(new CustomEvent("brandfilm:progress", { detail: done / frameCount }));
        checkFinished();
      };

      img.onload = () => {
        frames[i] = img;
        finish();
      };
      img.onerror = () => {
        frames[i] = null;
        finish();
      };

      img.src = `${base}/${String(i + 1).padStart(4, "0")}.jpg`;
    };

    const loadBatch = () => {
      if (cancelled) return;
      if (queueIndex === 0) rebuildPriority();

      const batchSize = mobile ? 20 : 15;
      let loaded = 0;

      while (loaded < batchSize && queueIndex < priority.length) {
        loadFrame(priority[queueIndex]);
        queueIndex++;
        loaded++;
      }

      if (queueIndex < priority.length) requestAnimationFrame(loadBatch);
    };

    rebuildPriority();
    loadBatch();

    const reprioritize = () => {
      if (cancelled) return;
      rebuildPriority();
      queueIndex = 0;
      requestAnimationFrame(loadBatch);
    };

    window.addEventListener("scroll", reprioritize, { passive: true });
    window.visualViewport?.addEventListener("scroll", reprioritize, { passive: true });

    return () => {
      cancelled = true;
      window.removeEventListener("scroll", reprioritize);
      window.visualViewport?.removeEventListener("scroll", reprioritize);
    };
  }, [ready, base, frameCount, mobile]);

  useEffect(() => {
    if (!ready || loadedCount < 1) return;

    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let canvasW = 0;
    let canvasH = 0;
    let lastExact = -1;

    const resizeCanvas = () => {
      const dpr = canvasDpr(mobile);
      canvasW = canvas.clientWidth;
      canvasH = canvas.clientHeight;
      canvas.width = Math.max(1, Math.round(canvasW * dpr));
      canvas.height = Math.max(1, Math.round(canvasH * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      lastExact = -1;
    };

    const draw = () => {
      const progress = pinProgress(section);
      const exact = Math.min(frameCount - 1, Math.max(0, Math.round(progress * (frameCount - 1))));
      if (exact === lastExact) return;

      const frame = findNearestLoadedFrame(framesRef.current, exact);
      if (frame && drawCover(ctx, frame, canvasW, canvasH)) {
        lastExact = exact;
        if (!frameReadyRef.current) {
          frameReadyRef.current = true;
          setFrameReady(true);
        }
      }
    };

    resizeCanvas();
    const unbind = bindScrollCanvas(section, draw);
    window.addEventListener("resize", resizeCanvas);

    return () => {
      unbind();
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [ready, loadedCount, frameCount, mobile]);

  if (!ready) {
    return (
      <section
        className="relative w-full bg-ink"
        style={{ height: `${SECTION_VH_MOBILE}dvh` }}
        aria-hidden
      >
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
        <canvas
          ref={canvasRef}
          className="pointer-events-none absolute inset-0 z-[1] h-full w-full object-cover"
          aria-hidden
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-32 bg-gradient-to-t from-ink to-transparent" />
      </div>
    </section>
  );
}
