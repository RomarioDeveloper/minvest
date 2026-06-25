"use client";

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

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

function pinProgress(section: HTMLElement): number {
  const viewport = window.visualViewport?.height ?? window.innerHeight;
  const scrollable = section.offsetHeight - viewport;
  if (scrollable <= 0) return 0;
  return clamp01(-section.getBoundingClientRect().top / scrollable);
}

function drawCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  w: number,
  h: number,
): boolean {
  if (!img.complete || img.naturalWidth === 0) return false;
  // Считаем масштаб так, чтобы картинка ВСЕГДА полностью закрывала холст (object-fit: cover)
  const scale = Math.max(w / img.naturalWidth, h / img.naturalHeight);
  const dw = img.naturalWidth * scale;
  const dh = img.naturalHeight * scale;
  
  // Так как картинка гарантированно закрывает весь w и h, 
  // нам НЕ НУЖНО делать заливку (fillRect). Это экономит 50% ресурсов видеокарты!
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

export default function BrandFilm({ frameBase, frameBaseMobile, frameCount, poster, posterMobile }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isMobile = useMobileViewport();
  
  // Ref for loaded frames
  const framesRef = useRef<(HTMLImageElement | null)[]>([]);
  const [loadedCount, setLoadedCount] = useState(0);
  const [frameReady, setFrameReady] = useState(false);

  const ready = isMobile !== null;
  const mobile = isMobile === true;
  const base = mobile ? (frameBaseMobile ?? frameBase) : frameBase;
  const videoPoster = mobile ? (posterMobile ?? poster) : poster;
  const sectionVh = isMobile === false ? SECTION_VH_DESKTOP : SECTION_VH_MOBILE;

  // 1. Предзагрузка всех кадров
  useEffect(() => {
    if (!ready || !base) return;
    
    let cancelled = false;
    const frames: (HTMLImageElement | null)[] = Array.from({ length: frameCount }, () => null);
    framesRef.current = frames; // СРАЗУ отдаем массив для рендера, не ждем конца загрузки!
    let done = 0;
    let readyFired = false;

    setLoadedCount(0);
    setFrameReady(false);
    
    // Эвенты для прилоадера (показываем реальный прогресс загрузки картинок)
    window.dispatchEvent(new CustomEvent('brandfilm:progress', { detail: 0 }));

    const checkFinished = () => {
      // Пускаем пользователя на сайт, как только загрузился ПЕРВЫЙ кадр!
      // Раньше код ждал загрузки ВСЕХ 450 кадров (что занимало те самые 8-10 секунд задержки)
      if (!readyFired && frames[0]) {
        readyFired = true;
        window.dispatchEvent(new CustomEvent('brandfilm:ready'));
      }
    };

    // Чтобы браузер не завис, пытаясь мгновенно создать 450 сетевых запросов (что вешает вкладку),
    // мы загружаем их аккуратными "пачками" (батчами) по 15 штук за кадр анимации.
    let currentIndex = 0;
    const loadBatch = () => {
      if (cancelled) return;
      const end = Math.min(currentIndex + 15, frameCount);
      
      for (; currentIndex < end; currentIndex++) {
        const i = currentIndex;
        const img = new Image();
        img.decoding = "async"; // Асинхронный декод не блочит скролл
        
        img.onload = () => {
          if (cancelled) return;
          frames[i] = img;
          done++;
          setLoadedCount(done);
          window.dispatchEvent(new CustomEvent('brandfilm:progress', { detail: done / frameCount }));
          checkFinished();
        };
        
        img.onerror = () => {
          if (cancelled) return;
          frames[i] = null;
          done++;
          setLoadedCount(done);
          window.dispatchEvent(new CustomEvent('brandfilm:progress', { detail: done / frameCount }));
          checkFinished();
        };

        img.src = `${base}/${String(i + 1).padStart(4, "0")}.jpg`;
      }

      if (currentIndex < frameCount) {
        requestAnimationFrame(loadBatch); // Продолжаем загрузку в следующем свободном кадре
      }
    };

    loadBatch();

    return () => {
      cancelled = true;
    };
  }, [ready, base, frameCount]);

  // 2. Логика скролла и отрисовки
  useEffect(() => {
    if (!ready || loadedCount < 1) return; // Начинаем рисовать, как только загружен первый кадр

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
      // Отключаем Retina-масштабирование (dpr).
      // Рисовать 1080p картинку на 4K холсте 60 раз в секунду — это убийство для видеокарты.
      // Для видео/анимаций 1x масштаб выглядит отлично и работает в 4 раза быстрее!
      const dpr = 1;
      canvasW = canvas.clientWidth;
      canvasH = canvas.clientHeight;
      canvas.width = Math.max(1, Math.round(canvasW * dpr));
      canvas.height = Math.max(1, Math.round(canvasH * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      lastExact = -1; // Форсируем перерисовку
    };

    const draw = (progress: number) => {
      const exact = Math.min(frameCount - 1, Math.max(0, Math.round(progress * (frameCount - 1))));
      if (exact === lastExact) return; // Не рисуем тот же кадр дважды
      
      const frame = framesRef.current[exact];
      if (frame && drawCover(ctx, frame, canvasW, canvasH)) {
        lastExact = exact;
        if (!frameReady) setFrameReady(true);
      }
    };

    resizeCanvas();
    draw(pinProgress(section));

    const tick = () => {
      // Полностью убираем математическое сглаживание (инерцию).
      // Библиотека Lenis УЖЕ делает скролл плавным. 
      // Когда мы накладываем сглаживание поверх сглаженного скролла — получается конфликт фаз кадров (jitter/микролаги).
      // Теперь мы рисуем ровно тот кадр, где физически находится скролл.
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
            <canvas ref={canvasRef} className="absolute inset-0 z-[1] h-full w-full object-cover" aria-hidden />
          </>
        )}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-32 bg-gradient-to-t from-ink to-transparent" />
      </div>
    </section>
  );
}
