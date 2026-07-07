"use client";

import EagerVideo from "@/components/EagerVideo";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
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
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.matchMedia("(max-width: 767px)").matches);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  return (
    <section id="advantages" className="relative bg-ink-deep overflow-hidden">
      <div className="mx-auto w-full max-w-7xl px-6 pb-12 pt-24 sm:px-10 lg:px-16">
        <div className="text-eyebrow uppercase text-bone-mute">Преимущества</div>
        <h2
          className="mt-4 max-w-3xl font-display font-semibold tracking-tightest text-balance text-bone"
          style={{ fontSize: "clamp(30px, 4.6vw, 64px)", lineHeight: 0.98 }}
        >
          Почему выбирают
          <span className="text-bone-mute"> Malaysary Invest.</span>
        </h2>
      </div>

      <div className="relative mx-auto w-full max-w-lg pb-32 px-6 sm:max-w-2xl sm:px-10" style={{ height: `${ADVANTAGES.length * 60}vh` }}>
        {ADVANTAGES.map((a, i) => (
          <StackedCard
            key={a.title}
            a={a}
            index={i}
            total={ADVANTAGES.length}
            isMobile={isMobile}
          />
        ))}
      </div>
    </section>
  );
}

function StackedCard({
  a,
  index,
  total,
  isMobile,
}: {
  a: Advantage;
  index: number;
  total: number;
  isMobile: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "start start"],
  });

  // Эффект наслоения: когда карточка доезжает до верха, она прилипает 
  // и немного уменьшается по мере того, как сверху наезжают следующие карточки
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.92]);
  const opacity = useTransform(scrollYProgress, [0, 0.7, 1], [1, 1, 0.3]);

  const hasVideo = !!a.video;
  const Icon = a.icon;

  return (
    <motion.div
      ref={cardRef}
      style={{
        scale,
        opacity,
        // Карточка прилипает к верху с небольшим смещением для эффекта "стопки"
        top: `calc(15vh + ${index * 8}px)`,
        zIndex: index,
      }}
      className="sticky mb-32 origin-top"
    >
      <article className="relative flex h-[58vh] max-h-[600px] min-h-[420px] w-full flex-col justify-end overflow-hidden rounded-[2rem] border border-bone/15 bg-ink-panel p-8 shadow-2xl sm:p-10 transform-gpu"
        style={{
          boxShadow: `0 -10px 40px -10px rgba(0,0,0, ${0.4 + index * 0.05})`,
        }}
      >
        {hasVideo ? (
          <div className="pointer-events-none absolute inset-0 overflow-hidden bg-ink-panel">
            <EagerVideo
              src={a.video!}
              objectPosition={a.videoPosition}
              className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500"
            />
            <div className="absolute inset-x-0 top-0 h-2/5 bg-gradient-to-b from-black/40 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-ink-panel/95 via-ink-panel/40 to-transparent" />
          </div>
        ) : (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="absolute h-56 w-56 rounded-full border border-bone/20 bg-bone/[0.03]" />
            <div className="relative flex h-28 w-28 items-center justify-center rounded-[1.5rem] border border-bone/15 bg-bone/[0.04] backdrop-blur-md">
              <Icon className="h-12 w-12 text-bone/80" />
            </div>
          </div>
        )}

        <div
          className={`relative z-10 ${
            hasVideo ? "" : "bg-gradient-to-t from-ink-panel via-ink-panel/95 to-transparent"
          }`}
        >
          <div className="mb-4 inline-flex items-center rounded-full border border-bone/20 bg-bone/5 px-3 py-1 text-[11px] font-semibold tracking-wider text-bone-soft uppercase backdrop-blur-md">
            {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </div>
          <h3 className="font-display text-[1.85rem] font-semibold leading-tight tracking-tightest text-bone sm:text-4xl drop-shadow-lg">
            {a.title}
          </h3>
          <p className="mt-3 max-w-md text-pretty text-[16px] leading-relaxed text-bone-soft sm:mt-5 sm:text-[18px] drop-shadow-md">
            {a.body}
          </p>
        </div>
      </article>
    </motion.div>
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
