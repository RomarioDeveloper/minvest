"use client";

import EagerVideo from "@/components/EagerVideo";
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
  return (
    <section id="advantages" className="relative bg-ink-deep py-24 sm:py-32 overflow-hidden">
      <div className="mx-auto w-full max-w-7xl px-6 pb-12 sm:px-10 lg:px-16">
        <div className="text-eyebrow uppercase text-bone-mute">Преимущества</div>
        <h2
          className="mt-4 max-w-3xl font-display font-semibold tracking-tightest text-balance text-bone"
          style={{ fontSize: "clamp(30px, 4.6vw, 64px)", lineHeight: 0.98 }}
        >
          Почему выбирают
          <span className="text-bone-mute"> Malaysary Invest.</span>
        </h2>
      </div>

      <div className="flex w-full overflow-x-auto snap-x snap-mandatory gap-5 sm:gap-6 px-6 sm:px-[10vw] pb-10 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {/* Spacer for mobile to center the first card */}
        <div className="w-[1vw] shrink-0 sm:w-[calc(50vw-280px)]" aria-hidden />
        {ADVANTAGES.map((a, i) => (
          <Card key={a.title} a={a} />
        ))}
        {/* Spacer for mobile to center the last card */}
        <div className="w-[1vw] shrink-0 sm:w-[calc(50vw-280px)]" aria-hidden />
      </div>
    </section>
  );
}

function Card({ a }: { a: Advantage }) {
  const ref = useRef<HTMLElement>(null);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Включаем активное состояние (анимации внутри карточки),
    // когда карточка на 60% видна на экране
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsActive(entry.isIntersecting);
      },
      { root: null, threshold: 0.6 }
    );
    
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const hasVideo = !!a.video;
  const Icon = a.icon;

  return (
    <article
      ref={ref}
      className="snap-center relative flex h-[58vh] max-h-[560px] min-h-[420px] w-[84vw] shrink-0 flex-col justify-end overflow-hidden border border-bone/12 bg-ink-panel p-9 sm:w-[520px] sm:p-10 transform-gpu rounded-3xl transition-transform duration-700"
    >
      {hasVideo ? (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className={`absolute inset-0 h-full w-full transition-transform duration-1000 ${
              isActive ? "scale-100 opacity-100" : "scale-[1.05] opacity-40"
            }`}
          >
            <EagerVideo
              src={a.video!}
              objectPosition={a.videoPosition}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
          <div className="absolute inset-x-0 top-0 h-2/5 bg-gradient-to-b from-black/35 to-transparent" />
        </div>
      ) : (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div
            className={`absolute h-44 w-44 rounded-full border border-bone/20 bg-bone/[0.03] transition-all duration-700 ${
              isActive ? "scale-125 opacity-30" : "scale-75 opacity-0"
            }`}
          />
          <div
            className={`relative flex h-24 w-24 items-center justify-center rounded-2xl border border-bone/15 bg-bone/[0.04] backdrop-blur-sm transition-all duration-700 ${
              isActive ? "scale-110 opacity-100 translate-y-0" : "scale-90 opacity-50 translate-y-4"
            }`}
          >
            <Icon className="h-11 w-11 text-bone/80" />
          </div>
        </div>
      )}

      <div
        className={`relative z-10 ${
          hasVideo ? "" : "bg-gradient-to-t from-ink-panel via-ink-panel/95 to-transparent"
        }`}
      >
        <h3 className="font-display text-[1.65rem] font-semibold leading-tight tracking-tightest text-bone sm:text-3xl">
          {a.title}
        </h3>
        <p className="mt-4 text-pretty text-base leading-relaxed text-bone-soft sm:text-[17px]">
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
