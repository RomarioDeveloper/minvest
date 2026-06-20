"use client";

import { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import RevealOnView from "@/components/RevealOnView";
import { OBJECTS, STATUS_LABEL, type ObjectStatus, type RealtyObject } from "@/lib/objects";

type Filter = "all" | ObjectStatus;

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "Все" },
  { id: "sales", label: "В продаже" },
  { id: "soon", label: "Скоро" },
  { id: "done", label: "Сданы" },
];

const statusDot: Record<ObjectStatus, string> = {
  sales: "bg-emerald-400",
  soon: "bg-amber-400",
  done: "bg-bone-dim",
};

export default function ObjectsCatalog() {
  const [filter, setFilter] = useState<Filter>("all");
  const [selected, setSelected] = useState<RealtyObject | null>(null);
  const visible = OBJECTS.filter((o) => filter === "all" || o.status === filter);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (selected) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [selected]);

  return (
    <section
      id="objects"
      className="relative border-y border-bone/10 bg-ink px-6 py-24 sm:px-10 sm:py-32 lg:px-16"
    >
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <RevealOnView className="text-eyebrow uppercase text-bone-mute">
              Каталог объектов
            </RevealOnView>
            <RevealOnView
              as="div"
              delay={120}
              className="mt-6 max-w-3xl font-display font-semibold tracking-tightest text-balance text-bone"
            >
              <h2 style={{ fontSize: "clamp(34px, 5.4vw, 72px)", lineHeight: 0.98 }}>
                {OBJECTS.length} объектов
                <br />
                <span className="text-bone-mute">в одном застройщике.</span>
              </h2>
            </RevealOnView>
          </div>

          <RevealOnView delay={200} className="flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`border px-4 py-2 text-eyebrow uppercase transition ${
                  filter === f.id
                    ? "border-bone bg-bone text-ink"
                    : "border-bone/20 text-bone-soft hover:border-bone/50"
                }`}
              >
                {f.label}
              </button>
            ))}
          </RevealOnView>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((o, i) => (
            <RevealOnView key={o.slug} delay={120 + i * 80} className="h-full">
              <ObjectCard obj={o} onOpen={() => setSelected(o)} />
            </RevealOnView>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selected && (
          <ObjectModal obj={selected} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}

/* ─────────────────────────── Card ─────────────────────────── */
function ObjectCard({ obj, onOpen }: { obj: RealtyObject; onOpen: () => void }) {
  return (
    <button
      onClick={onOpen}
      className="group flex h-full w-full flex-col overflow-hidden border border-bone/12 bg-ink-panel text-left transition hover:border-bone/30"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={obj.image}
          alt={obj.name}
          loading="lazy"
          className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
        <div className="absolute left-4 top-4 flex items-center gap-2 bg-ink/70 px-3 py-1.5 backdrop-blur-sm">
          <span className={`h-1.5 w-1.5 rounded-full ${statusDot[obj.status]}`} />
          <span className="text-eyebrow uppercase text-bone-soft">
            {STATUS_LABEL[obj.status]}
          </span>
        </div>
        {obj.flagship && (
          <div className="absolute right-4 top-4 bg-bone px-3 py-1.5 text-eyebrow uppercase text-ink">
            Флагман
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="text-eyebrow uppercase text-bone-dim">{obj.district}</div>
        <h3 className="mt-2 font-display text-2xl font-semibold tracking-tightest text-bone">
          {obj.name}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-bone-soft">{obj.tagline}</p>

        <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-3 border-t border-bone/10 pt-5 text-sm">
          <Spec label="Этажность" value={`${obj.floors} этажей`} />
          <Spec label="Квартир" value={`${obj.apartments}`} />
          <Spec label="Планировки" value={obj.rooms} />
          <Spec label="Срок сдачи" value={obj.deadline} />
        </dl>

        <div className="mt-6 flex items-end justify-between border-t border-bone/10 pt-5">
          <div>
            <div className="text-eyebrow uppercase text-bone-dim">Цена от</div>
            <div className="mt-1 font-display text-xl font-semibold tracking-tightest text-bone">
              {obj.priceFrom} млн ₸
            </div>
          </div>
          <span className="text-eyebrow uppercase text-bone-mute transition group-hover:text-bone">
            Подробнее →
          </span>
        </div>
      </div>
    </button>
  );
}

/* ─────────────────────────── Modal ─────────────────────────── */
function ObjectModal({ obj, onClose }: { obj: RealtyObject; onClose: () => void }) {
  const [slide, setSlide] = useState(0);
  const [dir, setDir] = useState(1);

  const go = useCallback((next: number) => {
    setDir(next > slide ? 1 : -1);
    setSlide(next);
  }, [slide]);

  const prev = () => go((slide - 1 + obj.gallery.length) % obj.gallery.length);
  const next = () => go((slide + 1) % obj.gallery.length);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slide]);

  return (
    <>
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 z-[60] bg-ink-deep/90 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.35 }}
        onClick={onClose}
      />

      {/* Panel */}
      <motion.div
        className="fixed inset-x-0 bottom-0 z-[61] flex max-h-[92svh] flex-col overflow-hidden bg-ink-panel md:inset-x-auto md:inset-y-0 md:right-0 md:max-h-none md:w-[560px] md:max-w-[90vw]"
        initial={{ y: "100%", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: "100%", opacity: 0 }}
        transition={{ type: "spring", stiffness: 320, damping: 34, mass: 0.9 }}
        style={{ willChange: "transform" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Gallery ── */}
        <div className="relative aspect-[16/9] w-full shrink-0 overflow-hidden bg-ink md:aspect-[4/3]">
          <AnimatePresence initial={false} custom={dir}>
            <motion.img
              key={slide}
              src={obj.gallery[slide]}
              alt={`${obj.name} — фото ${slide + 1}`}
              className="absolute inset-0 h-full w-full object-cover"
              custom={dir}
              variants={{
                enter: (d: number) => ({ x: d * 60, opacity: 0, scale: 1.04 }),
                center: { x: 0, opacity: 1, scale: 1 },
                exit: (d: number) => ({ x: d * -60, opacity: 0, scale: 0.97 }),
              }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.38, ease: [0.32, 0, 0.18, 1] }}
            />
          </AnimatePresence>

          {/* Gradient overlay */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-panel/60 via-transparent to-transparent" />

          {/* Status badge */}
          <div className="absolute left-4 top-4 flex items-center gap-2 bg-ink/70 px-3 py-1.5 backdrop-blur-sm">
            <span className={`h-1.5 w-1.5 rounded-full ${statusDot[obj.status]}`} />
            <span className="text-eyebrow uppercase text-bone-soft">{STATUS_LABEL[obj.status]}</span>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Закрыть"
            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center bg-ink/70 text-bone backdrop-blur-sm transition hover:bg-ink"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 2L14 14M14 2L2 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>

          {/* Slider arrows */}
          {obj.gallery.length > 1 && (
            <>
              <button
                onClick={prev}
                aria-label="Назад"
                className="absolute left-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center bg-ink/60 text-bone backdrop-blur-sm transition hover:bg-ink"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <button
                onClick={next}
                aria-label="Вперёд"
                className="absolute right-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center bg-ink/60 text-bone backdrop-blur-sm transition hover:bg-ink"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </>
          )}

          {/* Dot indicators */}
          {obj.gallery.length > 1 && (
            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5">
              {obj.gallery.map((_, i) => (
                <button
                  key={i}
                  onClick={() => go(i)}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    i === slide ? "w-5 bg-bone" : "w-1.5 bg-bone/40"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* ── Content ── */}
        <div className="flex flex-1 flex-col overflow-y-auto">
          <div className="p-6 md:p-8">
            <div className="text-eyebrow uppercase text-bone-dim">{obj.district}</div>
            <h2 className="mt-2 font-display text-3xl font-semibold tracking-tightest text-bone">
              {obj.name}
            </h2>
            {obj.description && (
              <p className="mt-4 leading-relaxed text-bone-soft">{obj.description}</p>
            )}

            <dl className="mt-7 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-bone/10 pt-6">
              <Spec label="Этажность" value={`${obj.floors} этажей`} />
              <Spec label="Квартир" value={`${obj.apartments}`} />
              <Spec label="Планировки" value={obj.rooms} />
              <Spec label="Срок сдачи" value={obj.deadline} />
            </dl>

            <div className="mt-6 flex items-center justify-between rounded-none border border-bone/10 bg-ink px-5 py-4">
              <div>
                <div className="text-eyebrow uppercase text-bone-dim">Цена от</div>
                <div className="mt-1 font-display text-2xl font-semibold tracking-tightest text-bone">
                  {obj.priceFrom} млн ₸
                </div>
              </div>
              {obj.flagship && (
                <div className="bg-bone px-3 py-1.5 text-eyebrow uppercase text-ink">Флагман</div>
              )}
            </div>
          </div>

          {/* CTA */}
          <div className="sticky bottom-0 flex flex-col gap-3 border-t border-bone/10 bg-ink-panel p-6 md:p-8">
            <a
              href="#contact"
              onClick={onClose}
              className="flex w-full items-center justify-center gap-3 bg-bone py-4 text-eyebrow uppercase text-ink transition hover:bg-bone-soft"
            >
              Записаться на показ →
            </a>
            <button
              onClick={onClose}
              className="w-full border border-bone/20 py-3 text-eyebrow uppercase text-bone-soft transition hover:border-bone/50 hover:text-bone"
            >
              Закрыть
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-eyebrow uppercase text-bone-dim">{label}</dt>
      <dd className="mt-1 font-medium text-bone">{value}</dd>
    </div>
  );
}
