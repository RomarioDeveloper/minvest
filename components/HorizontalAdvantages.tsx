"use client";

import EagerVideo from "@/components/EagerVideo";
import { motion, useScroll, useTransform, useSpring, type MotionValue } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";

type Advantage = {
  title: string;
  body: string;
  icon: (props: { className?: string }) => ReactNode;
  video?: string;
  videoPosition?: string;
};

const ADVANTAGES: Advantage[] = [
  {
    title: "Бесшумные лифты",
    body: "Современные бесшумные лифты.",
    icon: IconElevator,
    video: "/01.mp4",
  },
  {
    title: "Трёхкамерные окна",
    body: "Трёхкамерные окна с высокой тепло- и шумоизоляцией.",
    icon: IconWindow,
    video: "/okna.mp4",
  },
  {
    title: "Удобные планировки",
    body: "Удобные и функциональные планировки квартир.",
    icon: IconLayout,
    video: "/sleek-modern-kitchen-interior-design-2025-12-17-13-06-28-utc.mp4",
  },
  {
    title: "Гаражи и парковки",
    body: "Собственные гаражи и парковочные решения.",
    icon: IconGarage,
    video: "/car-parked-crooked-in-empty-parking-lot-aerial-2025-12-17-21-25-21-utc.mp4",
    videoPosition: "center top",
  },
  {
    title: "Коммерческие помещения",
    body: "Коммерческие помещения на первых и цокольных этажах в отдельных проектах.",
    icon: IconStore,
    video: "/commercial.mp4",
  },
  {
    title: "Закрытая территория",
    body: "Закрытые территории с контролем доступа.",
    icon: IconFence,
    video: "/cctv.mp4",
  },
  {
    title: "Системы Face ID",
    body: "Системы Face ID в премиальных проектах.",
    icon: IconFaceId,
    video: "/face-id.mp4",
  },
  {
    title: "Умные замки",
    body: "Умные замки в квартирах.",
    icon: IconSmartLock,
    video: "/smart-locks.mp4",
  },
  {
    title: "Приватность и безопасность",
    body: "Продуманная система приватности и безопасности для жителей.",
    icon: IconShield,
    video: "/security-guard.mp4",
  },
];

export default function HorizontalAdvantages() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [scrollRange, setScrollRange] = useState(0);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.matchMedia("(max-width: 767px)").matches);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const measure = () => {
      if (trackRef.current) {
        setScrollRange(Math.max(0, trackRef.current.scrollWidth - window.innerWidth));
      }
    };
    measure();
    const observer = new ResizeObserver(measure);
    if (trackRef.current) observer.observe(trackRef.current);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // ВАЖНО: Добавляем физическую плавность (spring) к скроллу. 
  // Это убирает лаги от пальца/мыши и делает свайп роскошным, как у Apple.
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 150,
    damping: 25,
    mass: 0.5,
    restDelta: 0.001
  });

  const x = useTransform(smoothProgress, [0, 1], [0, -scrollRange]);
  const sectionVh = isMobile ? 35 : 45;

  return (
    <section
      id="advantages"
      ref={sectionRef}
      className="relative bg-ink-deep"
      style={{ height: `${ADVANTAGES.length * sectionVh}vh` }}
    >
      <div className="sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden">
        {/* Уменьшены отступы на мобильных, чтобы заголовок не выталкивал карточки за пределы экрана */}
        <div className="mx-auto w-full max-w-7xl px-6 pb-4 pt-12 sm:pb-8 sm:pt-0 sm:px-10 lg:px-16">
          <div className="text-eyebrow uppercase text-bone-mute">Преимущества</div>
          <h2
            className="mt-4 max-w-3xl font-display font-semibold tracking-tightest text-balance text-bone"
            style={{ fontSize: "clamp(30px, 4.6vw, 64px)", lineHeight: 0.98 }}
          >
            Почему выбирают
            <span className="text-bone-mute"> Malaysary Invest.</span>
          </h2>
        </div>

        <motion.div
          ref={trackRef}
          style={{ x }}
          className={`flex w-max gap-5 sm:gap-6 will-change-transform ${
            isMobile ? "px-6" : "px-[6vw] sm:px-[calc(50vw-260px)]"
          }`}
        >
          {ADVANTAGES.map((a, i) => (
            <Card
              key={a.title}
              a={a}
              cardIndex={i}
              scrollProgress={smoothProgress}
              isMobile={isMobile}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function Card({
  a,
  cardIndex,
  scrollProgress,
}: {
  a: Advantage;
  cardIndex: number;
  scrollProgress: MotionValue<number>;
}) {
  const spread = 0.15;
  const peak = cardIndex / Math.max(1, ADVANTAGES.length - 1);

  const active = useTransform(scrollProgress, (v) => {
    return 1 - Math.min(1, Math.abs(v - peak) / spread);
  });

  const iconScale = useTransform(active, [0, 1], [0.8, 1.12]);
  const iconOpacity = useTransform(active, [0, 1], [0.4, 1]);
  const iconY = useTransform(active, [0, 1], [10, 0]);
  const ringScale = useTransform(active, [0, 1], [0.8, 1.35]);
  const ringOpacity = useTransform(active, [0, 1], [0, 0.35]);

  const videoScale = useTransform(active, [0, 1], [1.05, 1]);
  const videoOpacity = useTransform(active, [0, 1], [0.4, 1]);

  const Icon = a.icon;
  const hasVideo = !!a.video;

  return (
    <article className="relative flex h-[52svh] max-h-[560px] min-h-[340px] w-[84vw] shrink-0 flex-col justify-end overflow-hidden border border-bone/12 bg-ink-panel p-6 sm:h-[58vh] sm:min-h-[420px] sm:w-[520px] sm:p-10 rounded-2xl transform-gpu">
      {hasVideo ? (
        <motion.div
          style={{ 
            scale: isMobile ? 1 : videoScale, 
            opacity: isMobile ? 1 : videoOpacity 
          }}
          className="pointer-events-none absolute inset-0 overflow-hidden will-change-transform"
        >
          <EagerVideo
            src={a.video!}
            objectPosition={a.videoPosition}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-x-0 top-0 h-2/5 bg-gradient-to-b from-black/35 to-transparent" />
          {/* Добавлен градиент снизу, чтобы текст читался на белом фоне видео */}
          <div className="absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-ink-panel/90 via-ink-panel/30 to-transparent" />
        </motion.div>
      ) : (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <motion.div
            style={{ 
              scale: isMobile ? 1 : ringScale, 
              opacity: isMobile ? 1 : ringOpacity 
            }}
            className="absolute h-44 w-44 rounded-full border border-bone/20 bg-bone/[0.03] will-change-transform"
          />
          <motion.div
            style={{ 
              scale: isMobile ? 1 : iconScale, 
              opacity: isMobile ? 1 : iconOpacity, 
              y: isMobile ? 0 : iconY 
            }}
            className="relative flex h-24 w-24 items-center justify-center rounded-2xl border border-bone/15 bg-bone/[0.04] backdrop-blur-sm will-change-transform"
          >
            <Icon className="h-11 w-11 text-bone/80" />
          </motion.div>
        </div>
      )}

      <div
        className={`relative z-10 ${
          hasVideo ? "" : "bg-gradient-to-t from-ink-panel via-ink-panel/95 to-transparent"
        }`}
      >
        <h3 className="font-display text-[1.65rem] font-semibold leading-tight tracking-tightest text-bone sm:text-3xl drop-shadow-md">
          {a.title}
        </h3>
        <p className="mt-3 text-pretty text-[15px] leading-relaxed text-bone-soft sm:mt-4 sm:text-[17px] drop-shadow-md">
          {a.body}
        </p>
      </div>
    </article>
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
