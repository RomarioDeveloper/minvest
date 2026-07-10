"use client";

import {
  createSlidingFrameLoader,
  frameHeight,
  frameWidth,
  pinProgress,
  snapFrameIndex,
  type Frame,
} from "@/lib/scrollCanvas";
import { DiaTextReveal } from "@/components/ui/dia-text-reveal";
import { motion } from "framer-motion";
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
  const overlayRef = useRef<HTMLDivElement>(null);
  const isMobile = useMobileViewport();

  const loaderRef = useRef<ReturnType<typeof createSlidingFrameLoader> | null>(null);
  const [frameReady, setFrameReady] = useState(false);
  // Заголовок бренда запускаем только после подъёма прелоадера,
  // иначе анимация отыграет за занавесом и никто её не увидит.
  const [titleVisible, setTitleVisible] = useState(false);

  useEffect(() => {
    let timer = 0;
    // Событие приходит в момент, когда занавес прелоадера только начинает
    // подниматься (сам подъём ~0.9s). Ждём, пока экран полностью откроется,
    // и только потом стартуем — иначе половина анимации играет за занавесом.
    const show = () => {
      timer = window.setTimeout(() => setTitleVisible(true), 1000);
    };
    window.addEventListener("preloader:done", show, { once: true });
    // Страховка: если событие не пришло (например, компонент перемонтировался
    // уже после прелоадера) — всё равно показываем заголовок.
    const fallback = window.setTimeout(show, 6000);
    return () => {
      window.removeEventListener("preloader:done", show);
      window.clearTimeout(fallback);
      window.clearTimeout(timer);
    };
  }, []);

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
    const windowRadius = mobile ? 24 : 40;
    const batchSize = mobile ? 4 : 8;

    const loader = createSlidingFrameLoader({
      base,
      count,
      extension: "webp",
      step: frameStep,
      windowRadius,
      batchSize,
      onFirstFrame: () => setFrameReady(true),
    });

    loader.setCenter(startCenter);
    loaderRef.current = loader;

    // Прогреваем начальное окно кадров под прелоадером — первый скролл
    // не ждёт сеть. ready шлём только когда окно готово (или по таймауту).
    let cancelled = false;
    const PREFETCH_CAP_MS = 8000;
    const cap = window.setTimeout(() => {
      if (cancelled) return;
      window.dispatchEvent(new CustomEvent("brandfilm:ready"));
    }, PREFETCH_CAP_MS);

    void loader
      .prefetchWindow(windowRadius, (fraction) => {
        if (!cancelled) {
          window.dispatchEvent(new CustomEvent("brandfilm:progress", { detail: fraction }));
        }
      })
      .then(() => {
        if (cancelled) return;
        window.clearTimeout(cap);
        window.dispatchEvent(new CustomEvent("brandfilm:progress", { detail: 1 }));
        window.dispatchEvent(new CustomEvent("brandfilm:ready"));
      });

    return () => {
      cancelled = true;
      window.clearTimeout(cap);
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
      // На мобилке DPR-кап 1.5 и smoothing "medium": кадры и так меньше экрана
      // в физических пикселях, разница не видна, а fill rate падает почти вдвое.
      const dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 2);
      canvasW = canvas.clientWidth;
      canvasH = canvas.clientHeight;
      canvas.width = Math.max(1, Math.round(canvasW * dpr));
      canvas.height = Math.max(1, Math.round(canvasH * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = mobile ? "medium" : "high";
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
      // На мобилке кросс-блендинг выключен: это второй полноэкранный drawImage
      // на каждый тик, мобильные GPU на нём заметно проседают.
      const blend = !mobile && velocity < BLEND_MAX_VELOCITY;
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

      // Брендовый заголовок растворяется на первых ~10% скролла,
      // чтобы не мешать смотреть сам фильм.
      const overlay = overlayRef.current;
      if (overlay) {
        const fade = Math.min(1, Math.max(0, 1 - smooth / 0.1));
        overlay.style.opacity = fade.toFixed(3);
        overlay.style.visibility = fade <= 0.001 ? "hidden" : "visible";
      }

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
      // svh, а не dvh: dvh меняется при скрытии адресной строки на мобилке,
      // и вся пиннед-секция меняла высоту прямо во время скролла (рывки кадра).
      style={{ height: `${sectionVh}svh` }}
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

        {/* Брендовый заголовок — только на ПК, поверх облаков */}
        {!isMobile && titleVisible && (
          <div
            ref={overlayRef}
            className="pointer-events-none absolute inset-0 z-[3] hidden md:flex items-center justify-center"
          >
            <motion.h1
              className="font-display font-bold tracking-tightest text-center whitespace-nowrap"
              style={{
                fontSize: "clamp(48px, 6.5vw, 120px)",
                lineHeight: 1,
                filter: "drop-shadow(0 4px 40px rgba(5,5,6,0.45))",
              }}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            >
              <DiaTextReveal
                text="MALAYSARY INVEST"
                textColor="#f4f4f5"
                colors={["#f7dfae", "#f3b268", "#e8875f", "#fbeedb", "#f7dfae"]}
                duration={2}
                delay={0.4}
                startOnView={false}
              />
            </motion.h1>
          </div>
        )}
      </div>
    </section>
  );
}
