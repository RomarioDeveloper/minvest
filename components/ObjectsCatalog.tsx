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
        className="fixed inset-0 z-[60] bg-black/75 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={onClose}
      />

      {/* Panel — slides up from bottom on mobile, from right on desktop */}
      <motion.div
        className="fixed inset-x-0 bottom-0 z-[61] flex h-[88svh] flex-col bg-[#111113] md:inset-x-auto md:inset-y-0 md:right-0 md:h-full md:w-[520px]"
        initial={{ y: "100%", opacity: 0.6 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: "100%", opacity: 0 }}
        transition={{ type: "spring", stiffness: 380, damping: 40, mass: 0.85 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Gallery (fixed height) ── */}
        <div className="relative h-[220px] w-full shrink-0 overflow-hidden bg-ink sm:h-[260px] md:h-[300px]">
          <AnimatePresence initial={false} custom={dir}>
            <motion.img
              key={slide}
              src={obj.gallery[slide]}
              alt={`${obj.name} — фото ${slide + 1}`}
              className="absolute inset-0 h-full w-full object-cover"
              custom={dir}
              variants={{
                enter: (d: number) => ({ x: d * 80, opacity: 0 }),
                center: { x: 0, opacity: 1 },
                exit: (d: number) => ({ x: d * -80, opacity: 0 }),
              }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.32, ease: [0.32, 0, 0.18, 1] }}
            />
          </AnimatePresence>

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

          {/* Status */}
          <div className="absolute left-3 top-3 flex items-center gap-1.5 bg-black/60 px-2.5 py-1 backdrop-blur-sm">
            <span className={`h-1.5 w-1.5 rounded-full ${statusDot[obj.status]}`} />
            <span className="text-eyebrow uppercase text-bone-soft">{STATUS_LABEL[obj.status]}</span>
          </div>

          {/* Flagship */}
          {obj.flagship && (
            <div className="absolute left-3 bottom-10 bg-bone px-2.5 py-1 text-eyebrow uppercase text-ink">
              Флагман
            </div>
          )}

          {/* Close */}
          <button
            onClick={onClose}
            aria-label="Закрыть"
            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center bg-black/60 text-bone backdrop-blur-sm transition hover:bg-black"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>

          {/* Arrows */}
          {obj.gallery.length > 1 && (
            <>
              <button onClick={prev} aria-label="Назад"
                className="absolute left-3 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center bg-black/50 text-bone backdrop-blur-sm transition hover:bg-black/80">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M9 2L4 7L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <button onClick={next} aria-label="Вперёд"
                className="absolute right-3 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center bg-black/50 text-bone backdrop-blur-sm transition hover:bg-black/80">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M5 2L10 7L5 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </>
          )}

          {/* Dots */}
          {obj.gallery.length > 1 && (
            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
              {obj.gallery.map((_, i) => (
                <button key={i} onClick={() => go(i)}
                  className={`h-1 rounded-full transition-all duration-300 ${i === slide ? "w-5 bg-bone" : "w-1.5 bg-bone/40"}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* ── Scrollable content ── */}
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          <div className="px-5 pb-4 pt-5 sm:px-6">

            {/* Header */}
            <div className="text-[11px] font-semibold uppercase tracking-widest text-bone/40">
              {obj.district}
            </div>
            <h2 className="mt-1.5 font-display text-2xl font-semibold tracking-tightest text-bone sm:text-3xl">
              {obj.name}
            </h2>

            {/* Price pill */}
            <div className="mt-4 inline-flex items-baseline gap-1.5">
              <span className="font-display text-3xl font-semibold tracking-tightest text-bone">
                {obj.priceFrom} млн ₸
              </span>
              <span className="text-eyebrow uppercase text-bone/40">от</span>
            </div>

            {/* Description */}
            {obj.description && (
              <p className="mt-4 text-[15px] leading-relaxed text-bone/60">
                {obj.description}
              </p>
            )}

            {/* Specs grid */}
            <div className="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-none border border-bone/10">
              {[
                { label: "Этажность", value: `${obj.floors} эт.` },
                { label: "Квартир", value: `${obj.apartments}` },
                { label: "Планировки", value: obj.rooms },
                { label: "Срок сдачи", value: obj.deadline },
              ].map((s) => (
                <div key={s.label} className="bg-ink/40 px-4 py-3">
                  <div className="text-[10px] font-semibold uppercase tracking-widest text-bone/35">
                    {s.label}
                  </div>
                  <div className="mt-1 text-sm font-semibold text-bone">{s.value}</div>
                </div>
              ))}
            </div>

            {/* Extra padding so content isn't hidden behind sticky footer */}
            <div className="h-4" />
          </div>
        </div>

        {/* ── Sticky CTA ── */}
        <div className="shrink-0 border-t border-bone/10 bg-[#111113] px-5 pb-6 pt-4 sm:px-6">
          <a
            href="#contact"
            onClick={onClose}
            className="flex w-full items-center justify-center bg-bone py-3.5 text-eyebrow font-semibold uppercase tracking-wider text-ink transition hover:bg-bone/90 active:scale-[0.98]"
          >
            Записаться на показ →
          </a>
          <button
            onClick={onClose}
            className="mt-2.5 w-full py-3 text-[11px] font-semibold uppercase tracking-widest text-bone/40 transition hover:text-bone/70"
          >
            Закрыть
          </button>
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
