"use client";

import {
  createSlidingFrameLoader,
  frameDrawable,
  frameHeight,
  frameWidth,
  snapFrameIndex,
  type Frame,
} from "@/lib/scrollCanvas";
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
  img: Frame,
  w: number,
  h: number,
  zoom = 1,
): boolean {
  if (!frameDrawable(img)) return false;
  const iw = frameWidth(img);
  const ih = frameHeight(img);
  const scale = Math.min(w / iw, h / ih) * zoom;
  const dw = iw * scale;
  const dh = ih * scale;
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
  const loaderRef = useRef<ReturnType<typeof createSlidingFrameLoader> | null>(null);
  const [frameReady, setFrameReady] = useState(false);

  const ready = isMobile !== null;
  const mobile = isMobile === true;
  const base = mobile ? (frameBaseMobile ?? frameBase) : frameBase;
  const framePoster = mobile ? (posterMobile ?? poster) : poster;
  const sectionVh = isMobile === false ? SECTION_VH_DESKTOP : SECTION_VH_MOBILE;
  const frameStep = mobile ? 2 : 1;

  useEffect(() => {
    if (!ready || !base) return;

    setFrameReady(false);

    const section = sectionRef.current;
    const startCenter = section ? Math.round(pinProgress(section) * (frameCount - 1)) : 0;

    const loader = createSlidingFrameLoader({
      base,
      count: frameCount,
      extension: "jpg",
      step: frameStep,
      windowRadius: mobile ? 20 : 32,
      batchSize: mobile ? 4 : 6,
      preloadAll: mobile, // На мобилках (3МБ) грузим и держим все кадры в памяти
      onFirstFrame: () => setFrameReady(true),
    });

    loader.setCenter(startCenter);
    // На мобилках сразу запускаем фоновую загрузку всех кадров (активируем лоадер),
    // чтобы не ждать пока секция появится в IntersectionObserver
    if (mobile) {
      loader.setActive(true);
    }
    loaderRef.current = loader;

    return () => {
      loader.destroy();
      loaderRef.current = null;
    };
  }, [ready, base, frameCount, frameStep, mobile]);

  useEffect(() => {
    if (!ready) return;

    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let canvasW = 0;
    let canvasH = 0;
    let rafId = 0;
    let lastExact = -1;
    const zoom = mobile ? 1.25 : 1;

    const resizeCanvas = () => {
      canvasW = canvas.clientWidth;
      canvasH = canvas.clientHeight;
      canvas.width = Math.max(1, canvasW);
      canvas.height = Math.max(1, canvasH);
      lastExact = -1;
    };

    const draw = (progress: number) => {
      const loader = loaderRef.current;
      if (!loader) return;

      const exact = snapFrameIndex(
        Math.min(frameCount - 1, Math.max(0, Math.round(progress * (frameCount - 1)))),
        frameCount,
        frameStep,
      );
      if (exact === lastExact) return;

      const frameIndex = loader.nearestLoaded(exact);
      if (frameIndex === -1) return;

      const frame = loader.frames[frameIndex];
      if (frame && drawContain(ctx, frame, canvasW, canvasH, zoom)) {
        lastExact = exact;
        if (!frameReady) setFrameReady(true);
      }
    };

    resizeCanvas();
    draw(pinProgress(section));

    let lastScrollY = -1;
    let isIntersecting = false;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isIntersecting = entry.isIntersecting;
        // На десктопе загружаем кадры только когда блок близко к видимости.
        // На мобилках мы хотим, чтобы фоновая загрузка всех кадров не прерывалась.
        if (!mobile) {
          loaderRef.current?.setActive(entry.isIntersecting);
        }
      },
      { rootMargin: "100% 0px" },
    );
    observer.observe(section);

    const tick = () => {
      if (isIntersecting && window.scrollY !== lastScrollY) {
        lastScrollY = window.scrollY;
        const progress = pinProgress(section);
        loaderRef.current?.setCenter(Math.round(progress * (frameCount - 1)));
        draw(progress);
      }
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    window.addEventListener("resize", resizeCanvas);
    window.visualViewport?.addEventListener("resize", resizeCanvas);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resizeCanvas);
      window.visualViewport?.removeEventListener("resize", resizeCanvas);
    };
  }, [ready, frameCount, frameReady, frameStep, mobile]);

  return (
    <section
      ref={sectionRef}
      id="layouts"
      className="relative w-full bg-transparent"
      style={{ height: `${sectionVh}dvh` }}
      aria-label="Планировки квартир, управляемые скроллом"
    >
      <div className="sticky top-0 flex h-[100dvh] w-full items-center supports-[height:100svh]:h-[100svh]">
        <div className="mx-auto flex h-full w-full max-w-[1600px] flex-col px-6 pb-8 pt-24 sm:px-10 lg:flex-row lg:items-center lg:gap-12 lg:px-16 lg:py-24">
          {/* On phones the canvas goes full-bleed and takes all free height;
              on lg it returns to the framed 16:9 column next to the text. */}
          <div className="relative -mx-6 min-h-0 flex-1 overflow-hidden border-y border-current/10 bg-[#050506] sm:-mx-10 lg:mx-0 lg:aspect-[16/9] lg:w-full lg:flex-[1.35] lg:border transition-colors duration-1000">
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

          <div className="mt-6 flex flex-col justify-center lg:mt-0 lg:flex-1">
            <div className="text-eyebrow uppercase text-current opacity-60 transition-colors duration-1000">Планировки</div>
            <h2
              className="mt-4 font-display font-semibold tracking-tightest text-current transition-colors duration-1000 lg:mt-5"
              style={{ fontSize: "clamp(28px, 3.8vw, 52px)", lineHeight: 1.02 }}
            >
              Самые удобные
              <br />
              квадратуры и гибкие
              <br />
              <span className="opacity-50">планировки.</span>
            </h2>
            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-current opacity-70 transition-colors duration-1000 lg:mt-6">
              Листайте вниз, чтобы посмотреть варианты планировок. Свободная планировка,
              продуманные метражи и комфортные решения для разного образа жизни.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
