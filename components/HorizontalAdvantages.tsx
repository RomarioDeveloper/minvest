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
  const scrollerRef = useRef<HTMLDivElement>(null);

  // Pointer-drag scrolling for mouse users. Native touch/trackpad scrolling
  // already works; this only adds click-and-drag on desktop. It touches the
  // DOM only while the pointer is down, so it never runs during page scroll.
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    let down = false;
    let startX = 0;
    let startLeft = 0;
    let moved = false;

    const onDown = (e: PointerEvent) => {
      down = true;
      moved = false;
      startX = e.clientX;
      startLeft = el.scrollLeft;
      el.classList.add("cursor-grabbing");
    };

    const onMove = (e: PointerEvent) => {
      if (!down) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 4) moved = true;
      // Disable snap while dragging so the strip follows the pointer smoothly.
      el.style.scrollSnapType = "none";
      el.scrollLeft = startLeft - dx;
    };

    const onUp = () => {
      if (!down) return;
      down = false;
      el.classList.remove("cursor-grabbing");
      el.style.scrollSnapType = "";
    };

    // Prevent accidental link/text selection after a drag.
    const onClick = (e: MouseEvent) => {
      if (moved) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    el.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    el.addEventListener("click", onClick, true);

    return () => {
      el.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      el.removeEventListener("click", onClick, true);
    };
  }, []);

  return (
    <section id="advantages" className="relative bg-ink-deep py-20 sm:py-28">
      <div className="mx-auto w-full max-w-7xl px-6 sm:px-10 lg:px-16">
        <div className="text-eyebrow uppercase text-bone-mute">Преимущества</div>
        <h2
          className="mt-4 max-w-3xl font-display font-semibold tracking-tightest text-balance text-bone"
          style={{ fontSize: "clamp(30px, 4.6vw, 64px)", lineHeight: 0.98 }}
        >
          Почему выбирают
          <span className="text-bone-mute"> Malaysary Invest.</span>
        </h2>
      </div>

      <div
        ref={scrollerRef}
        className="mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto overscroll-x-contain px-6 pb-4 sm:mt-12 sm:gap-6 sm:px-10 lg:px-16 md:cursor-grab [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {ADVANTAGES.map((a) => (
          <Card key={a.title} a={a} />
        ))}
        {/* Trailing spacer so the last card can scroll fully into view. */}
        <div aria-hidden className="w-px shrink-0" />
      </div>
    </section>
  );
}

function Card({ a }: { a: Advantage }) {
  const Icon = a.icon;
  const hasVideo = !!a.video;

  return (
    <article className="relative flex h-[58vh] max-h-[560px] min-h-[420px] w-[84vw] shrink-0 snap-start flex-col justify-end overflow-hidden border border-bone/12 bg-ink-panel p-9 sm:w-[480px] sm:p-10">
      {hasVideo ? (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <AdvantageVideo src={a.video!} objectPosition={a.videoPosition} />
          <div className="absolute inset-x-0 top-0 h-2/5 bg-gradient-to-b from-black/35 to-transparent" />
        </div>
      ) : (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="absolute h-44 w-44 scale-[1.35] rounded-full border border-bone/20 bg-bone/[0.03] opacity-35" />
          <div className="relative flex h-24 w-24 items-center justify-center rounded-2xl border border-bone/15 bg-bone/[0.04]">
            <Icon className="h-11 w-11 text-bone/80" />
          </div>
        </div>
      )}

      <div className={`relative z-10 ${hasVideo ? "" : "bg-gradient-to-t from-ink-panel via-ink-panel/95 to-transparent"}`}>
        <h3 className="font-display text-[1.65rem] font-semibold leading-tight tracking-tightest text-bone sm:text-3xl">
          {a.title}
        </h3>
        <p className="mt-4 text-pretty text-base leading-relaxed text-bone-soft sm:text-[17px]">{a.body}</p>
      </div>
    </article>
  );
}

function AdvantageVideo({ src, objectPosition = "center" }: { src: string; objectPosition?: string }) {
  return (
    <EagerVideo
      src={src}
      objectPosition={objectPosition}
      className="absolute inset-0 h-full w-full object-cover"
    />
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
