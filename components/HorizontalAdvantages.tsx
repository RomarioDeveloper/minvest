"use client";

import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";

type Advantage = {
  index: string;
  title: string;
  body: string;
  icon: (props: { className?: string }) => ReactNode;
};

const ADVANTAGES: Advantage[] = [
  {
    index: "01",
    title: "Бесшумные лифты",
    body: "Современные бесшумные лифты.",
    icon: IconElevator,
  },
  {
    index: "02",
    title: "Трёхкамерные окна",
    body: "Трёхкамерные окна с высокой тепло- и шумоизоляцией.",
    icon: IconWindow,
  },
  {
    index: "03",
    title: "Удобные планировки",
    body: "Удобные и функциональные планировки квартир.",
    icon: IconLayout,
  },
  {
    index: "04",
    title: "Гаражи и парковки",
    body: "Собственные гаражи и парковочные решения.",
    icon: IconGarage,
  },
  {
    index: "05",
    title: "Коммерческие помещения",
    body: "Коммерческие помещения на первых и цокольных этажах в отдельных проектах.",
    icon: IconStore,
  },
  {
    index: "06",
    title: "Закрытая территория",
    body: "Закрытые территории с контролем доступа.",
    icon: IconFence,
  },
  {
    index: "07",
    title: "Системы Face ID",
    body: "Системы Face ID в премиальных проектах.",
    icon: IconFaceId,
  },
  {
    index: "08",
    title: "Умные замки",
    body: "Умные замки в квартирах.",
    icon: IconSmartLock,
  },
  {
    index: "09",
    title: "Приватность и безопасность",
    body: "Продуманная система приватности и безопасности для жителей.",
    icon: IconShield,
  },
];

const CARD_COUNT = ADVANTAGES.length;

export default function HorizontalAdvantages() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [endX, setEndX] = useState(0);

  useEffect(() => {
    const measure = () => {
      if (!trackRef.current) return;
      const overflow = trackRef.current.scrollWidth - window.innerWidth;
      setEndX(overflow > 0 ? -overflow : 0);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const x = useTransform(scrollYProgress, [0, 1], [0, endX]);

  return (
    <section
      id="advantages"
      ref={sectionRef}
      className="relative bg-ink-deep"
      style={{ height: `${CARD_COUNT * 55}vh` }}
    >
      <div className="sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden">
        <div className="px-6 pb-8 sm:px-10 lg:px-16">
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
          className="flex gap-5 px-6 will-change-transform sm:gap-6 sm:px-10 lg:px-16"
        >
          {ADVANTAGES.map((a, i) => (
            <Card key={a.index} a={a} cardIndex={i} scrollYProgress={scrollYProgress} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function Card({
  a,
  cardIndex,
  scrollYProgress,
}: {
  a: Advantage;
  cardIndex: number;
  scrollYProgress: MotionValue<number>;
}) {
  const spread = 0.11;
  const peak = cardIndex / Math.max(1, CARD_COUNT - 1);

  const active = useTransform(scrollYProgress, (v) => {
    const t = 1 - Math.min(1, Math.abs(v - peak) / spread);
    return t;
  });

  const iconScale = useTransform(active, [0, 1], [0.5, 1.12]);
  const iconOpacity = useTransform(active, [0, 1], [0.12, 1]);
  const iconY = useTransform(active, [0, 1], [18, 0]);
  const ringScale = useTransform(active, [0, 1], [0.6, 1.35]);
  const ringOpacity = useTransform(active, [0, 1], [0, 0.35]);

  const Icon = a.icon;

  return (
    <article className="relative flex h-[58vh] max-h-[560px] min-h-[420px] w-[88vw] shrink-0 flex-col justify-between overflow-hidden border border-bone/12 bg-ink-panel p-9 sm:w-[520px] sm:p-10">
      <div className="relative z-10 font-display text-6xl font-semibold tracking-tightest text-bone/15">
        {a.index}
      </div>

      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <motion.div
          style={{ scale: ringScale, opacity: ringOpacity }}
          className="absolute h-44 w-44 rounded-full border border-bone/20 bg-bone/[0.03]"
        />
        <motion.div
          style={{ scale: iconScale, opacity: iconOpacity, y: iconY }}
          className="relative flex h-24 w-24 items-center justify-center rounded-2xl border border-bone/15 bg-bone/[0.04] backdrop-blur-sm"
        >
          <Icon className="h-11 w-11 text-bone/80" />
        </motion.div>
      </div>

      <div className="relative z-10 bg-gradient-to-t from-ink-panel via-ink-panel/95 to-transparent pt-12">
        <h3 className="font-display text-[1.65rem] font-semibold leading-tight tracking-tightest text-bone sm:text-3xl">
          {a.title}
        </h3>
        <p className="mt-4 text-pretty text-base leading-relaxed text-bone-soft sm:text-[17px]">{a.body}</p>
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
