"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  frameBase: string;
  frameBaseMobile?: string;
  frameCount: number;
  poster?: string;
  posterMobile?: string;
};

const SECTION_VH_MOBILE = 220;
const SECTION_VH_DESKTOP = 280;

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

function pinProgress(section: HTMLElement): number {
  const viewport = window.visualViewport?.height ?? window.innerHeight;
  const scrollable = section.offsetHeight - viewport;
  if (scrollable <= 0) return 0;
  return clamp01(-section.getBoundingClientRect().top / scrollable);
}

function drawContain(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  w: number,
  h: number,
): boolean {
  if (!img.complete || img.naturalWidth === 0) return false;
  const scale = Math.min(w / img.naturalWidth, h / img.naturalHeight);
  const dw = img.naturalWidth * scale;
  const dh = img.naturalHeight * scale;
  ctx.fillStyle = "#050506";
  ctx.fillRect(0, 0, w, h);
  ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh);
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

export default function LayoutScrollBlock({
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
  const [loadedCount, setLoadedCount] = useState(0);
  const [frameReady, setFrameReady] = useState(false);

  const ready = isMobile !== null;
  const mobile = isMobile === true;
  const base = mobile ? (frameBaseMobile ?? frameBase) : frameBase;
  const framePoster = mobile ? (posterMobile ?? poster) : poster;
  const sectionVh = isMobile === false ? SECTION_VH_DESKTOP : SECTION_VH_MOBILE;

  useEffect(() => {
    if (!ready || !base) return;

    let cancelled = false;
    const frames: (HTMLImageElement | null)[] = Array.from({ length: frameCount }, () => null);
    framesRef.current = frames;
    let done = 0;
    let currentIndex = 0;

    setLoadedCount(0);
    setFrameReady(false);

    const loadBatch = () => {
      if (cancelled) return;
      const end = Math.min(currentIndex + 12, frameCount);

      for (; currentIndex < end; currentIndex++) {
        const i = currentIndex;
        const img = new Image();
        img.decoding = "async";

        const finish = () => {
          if (cancelled) return;
          done++;
          setLoadedCount(done);
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
      }

      if (currentIndex < frameCount) requestAnimationFrame(loadBatch);
    };

    loadBatch();

    return () => {
      cancelled = true;
    };
  }, [ready, base, frameCount]);

  useEffect(() => {
    if (!ready || loadedCount < 1) return;

    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let canvasW = 0;
    let canvasH = 0;
    let rafId = 0;
    let lastExact = -1;

    const resizeCanvas = () => {
      canvasW = canvas.clientWidth;
      canvasH = canvas.clientHeight;
      canvas.width = Math.max(1, canvasW);
      canvas.height = Math.max(1, canvasH);
      lastExact = -1;
    };

    const draw = (progress: number) => {
      const exact = Math.min(frameCount - 1, Math.max(0, Math.round(progress * (frameCount - 1))));
      if (exact === lastExact) return;

      const frame = framesRef.current[exact];
      if (frame && drawContain(ctx, frame, canvasW, canvasH)) {
        lastExact = exact;
        if (!frameReady) setFrameReady(true);
      }
    };

    resizeCanvas();
    draw(pinProgress(section));

    const tick = () => {
      draw(pinProgress(section));
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    window.addEventListener("resize", resizeCanvas);
    window.visualViewport?.addEventListener("resize", resizeCanvas);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resizeCanvas);
      window.visualViewport?.removeEventListener("resize", resizeCanvas);
    };
  }, [ready, loadedCount, frameCount, frameReady]);

  return (
    <section
      ref={sectionRef}
      id="layouts"
      className="relative w-full bg-ink"
      style={{ height: `${sectionVh}dvh` }}
      aria-label="Планировки квартир, управляемые скроллом"
    >
      <div className="sticky top-0 flex h-[100dvh] w-full items-center supports-[height:100svh]:h-[100svh]">
        <div className="mx-auto flex h-full w-full max-w-[1600px] flex-col px-6 py-20 sm:px-10 lg:flex-row lg:items-center lg:gap-12 lg:px-16 lg:py-24">
          <div className="relative aspect-[16/10] w-full overflow-hidden border border-bone/10 bg-[#050506] lg:aspect-[16/9] lg:flex-[1.35]">
            {ready && framePoster && !frameReady && (
              <img
                src={framePoster}
                alt=""
                aria-hidden
                className="absolute inset-0 h-full w-full object-contain"
                draggable={false}
              />
            )}
            <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden />
          </div>

          <div className="mt-8 flex flex-col justify-center lg:mt-0 lg:flex-1">
            <div className="text-eyebrow uppercase text-bone-mute">Планировки</div>
            <h2
              className="mt-5 font-display font-semibold tracking-tightest text-bone"
              style={{ fontSize: "clamp(28px, 3.8vw, 52px)", lineHeight: 1.02 }}
            >
              Самые удобные
              <br />
              квадратуры и гибкие
              <br />
              <span className="text-bone-mute">планировки.</span>
            </h2>
            <p className="mt-6 max-w-md text-[15px] leading-relaxed text-bone-soft">
              Листайте вниз, чтобы посмотреть варианты планировок. Свободная планировка,
              продуманные метражи и комфортные решения для разного образа жизни.
            </p>
            <div className="mt-8 hidden items-center gap-3 text-[11px] font-semibold uppercase tracking-widest text-bone/40 lg:flex">
              <span className="inline-block h-px w-10 bg-bone/20" />
              Листайте для просмотра
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
