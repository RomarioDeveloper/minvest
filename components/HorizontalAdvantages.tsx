"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import gsap from "gsap";
import { cn } from "@/lib/utils";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import EagerVideo from "@/components/EagerVideo";
import { useI18n } from "@/lib/i18n";

gsap.registerPlugin(ScrollTrigger);

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function computeFocusIntensity(
  progress: number,
  index: number,
  total: number,
  influence = 0.2
) {
  if (total <= 1) return 0;
  const safeInfluence = clamp(influence, 0.04, 1);
  const center = index / (total - 1);
  return clamp(Math.abs(progress - center) / safeInfluence, 0, 1);
}

function applyScrollSensitivity(progress: number, sensitivity: number) {
  const safeSensitivity = clamp(sensitivity, 0.25, 1.6);
  const exponent = 1 / safeSensitivity;
  return Math.pow(clamp(progress, 0, 1), exponent);
}

export interface Advantage {
  title: string;
  body: string;
  icon: (props: { className?: string }) => ReactNode;
  video?: string;
  videoPosition?: string;
}

export default function HorizontalAdvantages() {
  const sectionRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [maxShift, setMaxShift] = useState(0);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const { t } = useI18n();

  const ADVANTAGES: Advantage[] = [
    {
      title: t("horiz.title1"),
      body: t("horiz.body1"),
      icon: IconElevator,
      video: "/01.mp4",
      videoPosition: "80% center", 
    },
    {
      title: t("horiz.title2"),
      body: t("horiz.body2"),
      icon: IconWindow,
      video: "/okna.mp4",
    },
    {
      title: t("horiz.title3"),
      body: t("horiz.body3"),
      icon: IconLayout,
      video: "/sleek-modern-kitchen-interior-design-2025-12-17-13-06-28-utc.mp4",
    },
    {
      title: t("horiz.title4"),
      body: t("horiz.body4"),
      icon: IconGarage,
      video: "/car-parked-crooked-in-empty-parking-lot-aerial-2025-12-17-21-25-21-utc.mp4",
      videoPosition: "center top",
    },
    {
      title: t("horiz.title5"),
      body: t("horiz.body5"),
      icon: IconStore,
      video: "/commercial.mp4",
    },
    {
      title: t("horiz.title6"),
      body: t("horiz.body6"),
      icon: IconFence,
      video: "/cctv.mp4",
    },
    {
      title: t("horiz.title7"),
      body: t("horiz.body7"),
      icon: IconFaceId,
      video: "/face-id.mp4",
    },
    {
      title: t("horiz.title8"),
      body: t("horiz.body8"),
      icon: IconSmartLock,
      video: "/smart-locks.mp4",
      videoPosition: "18% center",
    },
    {
      title: t("horiz.title9"),
      body: t("horiz.body9"),
      icon: IconShield,
      video: "/security-guard.mp4",
    },
  ];

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.matchMedia("(max-width: 767px)").matches);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Track overflow width
  useEffect(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return;

    const update = () => {
      const overflow = Math.max(0, track.scrollWidth - viewport.clientWidth);
      setMaxShift(overflow);
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(viewport);
    observer.observe(track);
    return () => observer.disconnect();
  }, [isMobile]); // Re-calculate if layout breaks

  // Animation constants (Unlumen cinematic values)
  // Блюр убран полностью: анимированный blur() поверх играющих видео пересчитывает
  // гауссово размытие на каждый кадр скролла и роняет FPS даже на средних ПК.
  // Глубину кадра передаём затемнением + десатурацией — это дёшево для GPU.
  const dim = 25; 
  const brightnessBoost = isMobile ? 0 : 40;
  const darknessStrength = 1.4;
  const minSaturation = 20; 
  const saturationStrength = 1.5;
  const focusSpread = 0.18;
  const scaleEffect = 0.1;
  const scrollSensitivity = 0.6;
  // Увеличиваем высоту скролла на мобильных (snap), чтобы листать было легче и дольше
  const scrollLength = isMobile ? 550 : 450; 

  // Create GSAP ScrollTrigger
  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track || maxShift === 0) return;

    const context = gsap.context(() => {
      const cards = Array.from(track.querySelectorAll<HTMLElement>(".hbs-item"));

      const applyState = (rawProgress: number) => {
        const p = applyScrollSensitivity(rawProgress, scrollSensitivity);

        // Move track horizontally
        gsap.set(track, {
          x: -maxShift * p,
        });

        cards.forEach((card, index) => {
          const intensity = computeFocusIntensity(p, index, cards.length, focusSpread);
          const boostedIntensity = clamp(intensity * darknessStrength, 0, 1);

          const peakBrightness = clamp(100 + brightnessBoost, 100, 220);
          const currentBrightness = dim + (1 - boostedIntensity) * (peakBrightness - dim);
          
          const boostedSaturationIntensity = clamp(intensity * saturationStrength, 0, 1);
          const currentSaturation = minSaturation + (1 - boostedSaturationIntensity) * (100 - minSaturation);
          
          // На мобилках делаем scale-эффект слабее, чтобы карточки не казались слишком мелкими
          const currentScale = 1 - boostedIntensity * (isMobile ? 0.05 : scaleEffect);

          const bg = card.querySelector(".hbs-bg");
          const content = card.querySelector(".hbs-content");

          if (bg) {
            gsap.set(bg, {
              filter: `brightness(${currentBrightness}%) saturate(${currentSaturation}%)`,
            });
          }
          
          gsap.set(card, {
            scale: currentScale,
          });

          if (content) {
            gsap.set(content, {
              opacity: 1 - boostedIntensity * 0.8, // Dim text slightly on unfocused cards
            });
          }
        });
      };

      // Initial state
      applyState(0);

      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        // Магнитизм (snap): чтобы карточка всегда дотягивалась до центра на телефоне.
        // GSAP ScrollTrigger не принимает `false` для свойства snap, если мы хотим его отключить, лучше передать `undefined` или просто не передавать.
        // snap: isMobile ? ADVANTAGES.map((_, i) => i / (ADVANTAGES.length - 1)) : undefined,
        snap: undefined,
        onUpdate: (self) => applyState(self.progress),
      });
    }, sectionRef);

    return () => context.revert();
  }, [maxShift, isMobile]);

  return (
    <section
      id="advantages"
      ref={sectionRef}
      className="relative w-full bg-ink-deep"
      style={{ height: `${scrollLength}vh` }}
    >
      <div ref={viewportRef} className="sticky top-0 flex h-[100svh] w-full flex-col overflow-hidden">
        
        {/* Заголовок */}
        <div className="w-full z-20 pointer-events-none shrink-0 pt-24 sm:pt-28 pb-4 sm:pb-6">
          <div className="mx-auto w-full max-w-7xl px-6 sm:px-10 lg:px-16">
            <div className="text-[11px] sm:text-eyebrow uppercase text-bone-mute tracking-wider font-semibold">{t("horiz.section_title")}</div>
            <h2
              className="mt-2 sm:mt-4 max-w-3xl font-display font-semibold tracking-tight text-balance text-bone drop-shadow-md"
              style={{ fontSize: "clamp(26px, 4vw, 64px)", lineHeight: 1 }}
            >
              {t("horiz.section_subtitle")}
              <br className="sm:hidden" />
              <span className="text-bone-mute"> {t("horiz.section_subtitle2")}</span>
            </h2>
          </div>
        </div>

        {/* Track with cards */}
        <div className="flex flex-1 w-full items-end pb-8 sm:items-center sm:pb-12">
          {/* Сдвигаем трек на мобилке, чтобы первая карточка была в центре, а не сбоку */}
          <div ref={trackRef} className="flex w-max items-center px-[10vw] sm:px-[15vw]" style={{ gap: isMobile ? "1rem" : "2rem" }}>
            {ADVANTAGES.map((a, i) => {
              const hasVideo = !!a.video;
              const Icon = a.icon;

              return (
                <article
                  key={a.title}
                  // Фиксируем высоту для мобильных, чтобы карточки не пытались растянуться до центра экрана
                  className="hbs-item relative flex h-[55vh] max-h-[500px] min-h-[380px] w-[82vw] sm:h-[58vh] sm:max-h-[600px] sm:w-[480px] lg:w-[540px] shrink-0 flex-col justify-end overflow-hidden rounded-[2rem] border border-bone/15 bg-ink-panel p-6 pb-8 sm:p-10 transform-gpu"
                >
                  <div className="hbs-bg absolute inset-0 w-full h-full transform-gpu overflow-hidden bg-ink-panel">
                    {hasVideo ? (
                      <>
                        <EagerVideo
                          src={a.video!}
                          objectPosition={a.videoPosition}
                          className="absolute inset-0 h-full w-full object-cover"
                          // Узкая зона: одновременно декодируются только карточки у экрана,
                          // а не полтрека — девять параллельных видео душат GPU и сеть.
                          preloadMargin="0px 15% 0px 15%"
                        />
                        <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-black/40 to-transparent" />
                        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink-panel via-ink-panel/70 to-transparent" />
                      </>
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="absolute h-56 w-56 rounded-full border border-bone/20 bg-bone/[0.03]" />
                        <div className="relative flex h-28 w-28 items-center justify-center rounded-[1.5rem] border border-bone/15 bg-bone/[0.04] backdrop-blur-md">
                          <Icon className="h-12 w-12 text-bone/80" />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="hbs-content relative z-10 pointer-events-none">
                    <h3 className="font-display text-[1.4rem] font-semibold leading-tight tracking-tight text-bone sm:text-4xl drop-shadow-lg">
                      {a.title}
                    </h3>
                    <p className="mt-1.5 text-pretty text-[14px] leading-relaxed text-bone-soft sm:mt-5 sm:text-[18px] drop-shadow-md">
                      {a.body}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Inline SVG icons ── */

function IconFence({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
      <path d="M4 22V6l4-4 4 4v16M12 22V6l4-4 4 4v16" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 10h16M4 16h16" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconElevator({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
      <rect x="5" y="3" width="14" height="18" rx="1.5" />
      <path d="M12 7v10M9 10l3-3 3 3M9 14l3 3 3-3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconWindow({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
      <rect x="3" y="4" width="18" height="16" rx="1.5" />
      <path d="M3 12h18M12 4v16" />
    </svg>
  );
}

function IconLayout({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
      <rect x="3" y="3" width="18" height="18" rx="1.5" />
      <path d="M3 12h18M12 3v18M12 12h9M12 12v9" />
    </svg>
  );
}

function IconGarage({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
      <path d="M3 10l9-7 9 7" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="4" y="10" width="16" height="10" rx="1" />
      <path d="M8 20v-4h8v4" />
      <circle cx="8.5" cy="17" r="1" fill="currentColor" stroke="none" />
      <circle cx="15.5" cy="17" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function IconStore({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
      <path d="M3 9l2-5h14l2 5" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="4" y="9" width="16" height="11" rx="1" />
      <path d="M9 14h6M12 11v6" strokeLinecap="round" />
    </svg>
  );
}

function IconShield({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
      <path d="M12 3l8 3v6c0 5-3.5 8.5-8 9-4.5-.5-8-4-8-9V6l8-3z" strokeLinejoin="round" />
      <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconFaceId({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
      <rect x="4" y="4" width="16" height="16" rx="2" strokeDasharray="3 2" />
      <circle cx="9" cy="10" r="1" fill="currentColor" stroke="none" />
      <circle cx="15" cy="10" r="1" fill="currentColor" stroke="none" />
      <path d="M9 15c1 1.5 5 1.5 6 0" strokeLinecap="round" />
      <path d="M4 8V6M8 4H6M18 4h-2M20 8V6M20 16v2M18 20h-2M8 20H6M4 16v2" strokeLinecap="round" />
    </svg>
  );
}

function IconSmartLock({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V8a4 4 0 118 0v3" strokeLinecap="round" />
      <circle cx="12" cy="16" r="1.5" fill="currentColor" stroke="none" />
      <path d="M18 6a2 2 0 014 0v1" strokeLinecap="round" />
      <path d="M20 7v2" strokeLinecap="round" />
    </svg>
  );
}
