"use client";

import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { OBJECTS, STATUS_LABEL } from "@/lib/objects";

const SWIPE_OFFSET = 80;
const SWIPE_VELOCITY = 500;

export default function ObjectsPhotoCarousel() {
  const { t } = useI18n();
  const objects = OBJECTS(t);
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(0);

  const go = useCallback(
    (next: number, explicitDir?: 1 | -1) => {
      const total = objects.length;
      if (total === 0) return;
      const clamped = ((next % total) + total) % total;
      if (clamped === index) return;
      setDir(explicitDir ?? (clamped > index ? 1 : -1));
      setIndex(clamped);
    },
    [index, objects.length],
  );

  const prev = useCallback(() => go(index - 1, -1), [go, index]);
  const next = useCallback(() => go(index + 1, 1), [go, index]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prev, next]);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    const { offset, velocity } = info;
    if (offset.x < -SWIPE_OFFSET || velocity.x < -SWIPE_VELOCITY) next();
    else if (offset.x > SWIPE_OFFSET || velocity.x > SWIPE_VELOCITY) prev();
  };

  const current = objects[index];
  if (!current) return null;

  return (
    <section
      id="objects-gallery"
      className="relative isolate h-[100svh] min-h-[640px] w-full overflow-hidden bg-ink"
      aria-roledescription="carousel"
      aria-label={t("carousel.title")}
    >
      <AnimatePresence initial={false} custom={dir} mode="popLayout">
        <motion.div
          key={current.slug}
          className="absolute inset-0 cursor-grab active:cursor-grabbing"
          custom={dir}
          variants={{
            enter: (d: number) => ({ x: d * 72, opacity: 0, scale: 1.04 }),
            center: { x: 0, opacity: 1, scale: 1 },
            exit: (d: number) => ({ x: d * -72, opacity: 0, scale: 0.98 }),
          }}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.55, ease: [0.32, 0, 0.18, 1] }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.12}
          onDragEnd={onDragEnd}
        >
          <img
            src={current.image}
            alt={current.name}
            className="absolute inset-0 h-full w-full select-none object-cover"
            draggable={false}
          />
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(8,8,10,0.92) 0%, rgba(8,8,10,0.45) 32%, rgba(8,8,10,0.15) 58%, transparent 78%)",
            }}
          />
        </motion.div>
      </AnimatePresence>

      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 px-6 pt-8 sm:px-10 lg:px-16">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <span className="text-eyebrow uppercase text-bone/70">{t("carousel.eyebrow")}</span>
          <span className="text-[11px] font-semibold uppercase tracking-widest text-bone/45">
            {String(index + 1).padStart(2, "0")} / {String(objects.length).padStart(2, "0")}
          </span>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 px-6 pb-24 sm:px-10 sm:pb-28 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.slug + "-copy"}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: [0.32, 0, 0.18, 1] }}
            >
              <div className="mb-3 flex flex-wrap items-center gap-3">
                <span className="text-eyebrow uppercase text-bone/55">{current.district}</span>
                <span className="text-[10px] font-semibold uppercase tracking-widest text-bone/40">
                  {STATUS_LABEL[current.status]}
                </span>
              </div>
              <h2
                className="font-display font-semibold tracking-tightest text-balance text-bone"
                style={{ fontSize: "clamp(36px, 6vw, 80px)", lineHeight: 0.95 }}
              >
                {current.name}
              </h2>
              <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-bone/70 sm:text-base">
                {current.tagline}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-20 flex items-center justify-between px-4 pb-6 sm:px-8 lg:px-14">
        <button
          type="button"
          onClick={prev}
          aria-label={t("carousel.prev")}
          className="flex h-11 w-11 items-center justify-center border border-bone/20 bg-ink/50 text-bone backdrop-blur-sm transition hover:border-bone/50 hover:bg-ink/80"
        >
          <svg width="16" height="16" viewBox="0 0 14 14" fill="none" aria-hidden>
            <path d="M9 2L4 7L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <div className="flex items-center gap-2" role="tablist" aria-label={t("carousel.title")}>
          {objects.map((obj, i) => (
            <button
              key={obj.slug}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={obj.name}
              onClick={() => go(i, i > index ? 1 : -1)}
              className={`h-1 rounded-full transition-all duration-300 ${
                i === index ? "w-7 bg-bone" : "w-1.5 bg-bone/35 hover:bg-bone/60"
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={next}
          aria-label={t("carousel.next")}
          className="flex h-11 w-11 items-center justify-center border border-bone/20 bg-ink/50 text-bone backdrop-blur-sm transition hover:border-bone/50 hover:bg-ink/80"
        >
          <svg width="16" height="16" viewBox="0 0 14 14" fill="none" aria-hidden>
            <path d="M5 2L10 7L5 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </section>
  );
}
