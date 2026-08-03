"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import RevealOnView from "@/components/RevealOnView";
import { OBJECTS, STATUS_LABEL, type ObjectLayout, type ObjectStatus, type RealtyObject } from "@/lib/objects";

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

function StatusBadge({ obj, className = "" }: { obj: RealtyObject; className?: string }) {
  const isHot = !!obj.badgeLabel;
  const label = obj.badgeLabel ?? STATUS_LABEL[obj.status];

  return (
    <div
      className={[
        "flex items-center gap-2 px-3 py-1.5 backdrop-blur-sm",
        isHot
          ? "border border-red-500/50 bg-red-950/90 text-red-100 shadow-[0_0_20px_rgba(239,68,68,0.25)]"
          : "bg-ink/70 text-bone-soft",
        className,
      ].join(" ")}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${isHot ? "animate-pulse bg-red-500" : statusDot[obj.status]}`} />
      <span className="text-eyebrow uppercase">{label}</span>
    </div>
  );
}

export default function ObjectsCatalog() {
  const [filter, setFilter] = useState<Filter>("all");
  const [selected, setSelected] = useState<RealtyObject | null>(null);
  const visible = OBJECTS.filter((o) => filter === "all" || o.status === filter);

  useEffect(() => {
    document.body.style.overflow = selected ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [selected]);

  return (
    <section id="objects" className="relative border-y border-bone/10 bg-ink px-6 py-24 sm:px-10 sm:py-32 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <RevealOnView variant="wipe" className="text-eyebrow uppercase text-bone-mute">Каталог объектов</RevealOnView>
            <RevealOnView as="div" variant="blur" delay={120} className="mt-6 max-w-3xl font-display font-semibold tracking-tightest text-balance text-bone">
              <h2 style={{ fontSize: "clamp(34px, 5.4vw, 72px)", lineHeight: 0.98 }}>
                Проекты<br />
                <span className="text-bone-mute">Malaysary Invest.</span>
              </h2>
            </RevealOnView>
          </div>
          <RevealOnView delay={200} className="flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <button key={f.id} onClick={() => setFilter(f.id)}
                className={`border px-4 py-2 text-eyebrow uppercase transition ${filter === f.id ? "border-bone bg-bone text-ink" : "border-bone/20 text-bone-soft hover:border-bone/50"}`}>
                {f.label}
              </button>
            ))}
          </RevealOnView>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((o, i) => (
            <RevealOnView key={o.slug} variant="zoom" delay={120 + i * 80} className="h-full">
              <ObjectCard obj={o} onOpen={() => setSelected(o)} />
            </RevealOnView>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selected && <ObjectModal obj={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </section>
  );
}

/* ─── Card ─── */
function ObjectCard({ obj, onOpen }: { obj: RealtyObject; onOpen: () => void }) {
  return (
    <button onClick={onOpen} className="group flex h-full w-full flex-col overflow-hidden border border-bone/12 bg-ink-panel text-left transition hover:border-bone/30">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img src={obj.image} alt={obj.name} loading="lazy"
          className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
        <div className="absolute left-4 top-4">
          <StatusBadge obj={obj} />
        </div>
        {obj.flagship && (
          <div className="absolute right-4 top-4 bg-bone px-3 py-1.5 text-eyebrow uppercase text-ink">Флагман</div>
        )}
        {obj.videos?.length && (
          <div className="absolute right-4 bottom-4 flex items-center gap-1.5 bg-black/60 px-2 py-1 backdrop-blur-sm">
            <svg className="h-3 w-3 text-bone/70" fill="currentColor" viewBox="0 0 20 20">
              <path d="M6.3 2.841A1.5 1.5 0 004 4.11v11.78a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"/>
            </svg>
            <span className="text-[10px] uppercase tracking-widest text-bone/60">{obj.videos.length} видео</span>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <div className="text-eyebrow uppercase text-bone-dim">{obj.district}</div>
        <h3 className="mt-2 font-display text-2xl font-semibold tracking-tightest text-bone">{obj.name}</h3>
        <p className="mt-2 text-sm leading-relaxed text-bone-soft">{obj.tagline}</p>
        <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-3 border-t border-bone/10 pt-5 text-sm">
          <Spec label="Этажность" value={`${obj.floors} этажей`} />
          <Spec label="Квартир" value={`${obj.apartments}`} />
          <Spec label="Квадратура" value={obj.rooms} />
          <Spec label="Срок сдачи" value={obj.deadline} />
        </dl>
        <div className="mt-6 flex items-end justify-between border-t border-bone/10 pt-5">
          {obj.priceFrom ? (
            <div>
              <div className="text-eyebrow uppercase text-bone-dim">Цена</div>
              <div className="mt-1 font-display text-xl font-semibold tracking-tightest text-bone">{obj.priceFrom}</div>
            </div>
          ) : (
            <div className="text-sm font-medium text-bone-mute">Свободных квартир нет</div>
          )}
          <span className="text-eyebrow uppercase text-bone-mute transition group-hover:text-bone">Подробнее →</span>
        </div>
      </div>
    </button>
  );
}

/* ─── Modal ─── */
function ObjectModal({ obj, onClose }: { obj: RealtyObject; onClose: () => void }) {
  const [mediaTab, setMediaTab] = useState<"photo" | "video" | "layouts">("photo");
  const [photoSlide, setPhotoSlide] = useState(0);
  const [layoutSlide, setLayoutSlide] = useState(0);
  const [dir, setDir] = useState(1);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [fsVideo, setFsVideo] = useState<string | null>(null);
  const layouts = obj.layouts ?? [];
  const hasVideos = !!obj.videos?.length;
  const hasLayouts = layouts.length > 0;
  const currentLayout = layouts[layoutSlide];

  const goPhoto = useCallback((next: number) => {
    setDir(next > photoSlide ? 1 : -1);
    setPhotoSlide(next);
  }, [photoSlide]);

  const goLayout = useCallback((next: number) => {
    setDir(next > layoutSlide ? 1 : -1);
    setLayoutSlide(next);
  }, [layoutSlide]);

  const prevPhoto = () => goPhoto((photoSlide - 1 + obj.gallery.length) % obj.gallery.length);
  const nextPhoto = () => goPhoto((photoSlide + 1) % obj.gallery.length);
  const prevLayout = () => goLayout((layoutSlide - 1 + layouts.length) % layouts.length);
  const nextLayout = () => goLayout((layoutSlide + 1) % layouts.length);

  useEffect(() => {
    setPhotoSlide(0);
    setLayoutSlide(0);
    setMediaTab("photo");
  }, [obj.slug]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (lightbox !== null || fsVideo) return;
      if (e.key === "Escape") onClose();
      if (mediaTab === "photo") {
        if (e.key === "ArrowRight") nextPhoto();
        if (e.key === "ArrowLeft") prevPhoto();
      }
      if (mediaTab === "layouts" && layouts.length > 1) {
        if (e.key === "ArrowRight") nextLayout();
        if (e.key === "ArrowLeft") prevLayout();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [photoSlide, layoutSlide, mediaTab, lightbox, fsVideo, layouts.length]);

  return (
    <>
      <motion.div className="fixed inset-0 z-[60] bg-black/75 backdrop-blur-sm"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }} onClick={onClose} />

      <motion.div
        className="fixed inset-x-0 bottom-0 z-[61] flex h-[88svh] flex-col bg-[#111113] md:inset-x-auto md:inset-y-0 md:right-0 md:h-full md:w-[520px]"
        initial={{ y: "100%", opacity: 0.6 }} animate={{ y: 0, opacity: 1 }} exit={{ y: "100%", opacity: 0 }}
        transition={{ type: "spring", stiffness: 380, damping: 40, mass: 0.85 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Media area ── */}
        <div className={`relative w-full shrink-0 overflow-hidden bg-ink ${mediaTab === "layouts" ? "h-[260px] sm:h-[300px] md:h-[360px]" : "h-[220px] sm:h-[260px] md:h-[300px]"}`}>

          {mediaTab === "photo" && (
            <>
              <AnimatePresence initial={false} custom={dir}>
                <motion.img key={photoSlide} src={obj.gallery[photoSlide]} alt={`${obj.name} — фото ${photoSlide + 1}`}
                  className="absolute inset-0 h-full w-full cursor-zoom-in object-cover"
                  custom={dir}
                  variants={{
                    enter: (d: number) => ({ x: d * 80, opacity: 0 }),
                    center: { x: 0, opacity: 1 },
                    exit: (d: number) => ({ x: d * -80, opacity: 0 }),
                  }}
                  initial="enter" animate="center" exit="exit"
                  transition={{ duration: 0.32, ease: [0.32, 0, 0.18, 1] }}
                  onClick={() => setLightbox(photoSlide)}
                />
              </AnimatePresence>
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

              {/* Expand button */}
              <button onClick={() => setLightbox(photoSlide)}
                className="absolute bottom-10 right-3 flex items-center gap-1.5 bg-black/60 px-2.5 py-1.5 text-[10px] uppercase tracking-widest text-bone/70 backdrop-blur-sm transition hover:text-bone">
                <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                  <path d="M1 4V1H4M8 1H11V4M11 8V11H8M4 11H1V8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                На весь экран
              </button>

              {obj.gallery.length > 1 && (
                <>
                  <button onClick={prevPhoto} aria-label="Назад"
                    className="absolute left-3 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center bg-black/50 text-bone backdrop-blur-sm transition hover:bg-black/80">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 2L4 7L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </button>
                  <button onClick={nextPhoto} aria-label="Вперёд"
                    className="absolute right-3 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center bg-black/50 text-bone backdrop-blur-sm transition hover:bg-black/80">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M5 2L10 7L5 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </button>
                  <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
                    {obj.gallery.map((_, i) => (
                      <button key={i} onClick={() => goPhoto(i)}
                        className={`h-1 rounded-full transition-all duration-300 ${i === photoSlide ? "w-5 bg-bone" : "w-1.5 bg-bone/40"}`} />
                    ))}
                  </div>
                </>
              )}
              <div className="absolute bottom-3 right-4 text-[11px] font-semibold uppercase tracking-widest text-bone/50">
                {photoSlide + 1} / {obj.gallery.length}
              </div>
            </>
          )}

          {mediaTab === "video" && obj.videos && (
            <div className="absolute inset-0 grid grid-cols-2 gap-0.5 overflow-hidden">
              {obj.videos.map((src, i) => (
                <VideoThumb key={src} src={src} index={i} onFullscreen={() => setFsVideo(src)} />
              ))}
            </div>
          )}

          {mediaTab === "layouts" && currentLayout && (
            <div className="absolute inset-0 flex flex-col bg-gradient-to-b from-[#15151a] to-[#0c0c0f]">
              {/* Плановая «бумага» */}
              <div className="relative flex-1 overflow-hidden px-12 pb-2 pt-11">
                <AnimatePresence initial={false} custom={dir} mode="popLayout">
                  <motion.div
                    key={layoutSlide}
                    className="absolute inset-0 flex items-center justify-center px-12 pb-3 pt-11"
                    custom={dir}
                    variants={{
                      enter: (d: number) => ({ x: d * 48, opacity: 0 }),
                      center: { x: 0, opacity: 1 },
                      exit: (d: number) => ({ x: d * -48, opacity: 0 }),
                    }}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.3, ease: [0.32, 0, 0.18, 1] }}
                  >
                    <button
                      onClick={() => setLightbox(layoutSlide)}
                      className="group relative flex h-full max-h-full w-full items-center justify-center"
                      aria-label="Открыть планировку на весь экран"
                    >
                      <img
                        src={currentLayout.src}
                        alt={currentLayout.label}
                        loading="lazy"
                        className="max-h-full max-w-full rounded-lg bg-white object-contain p-2 shadow-[0_12px_40px_rgba(0,0,0,0.55)] ring-1 ring-black/5"
                      />
                      <span className="pointer-events-none absolute right-2 top-2 flex items-center gap-1 rounded-full bg-ink/85 px-2 py-1 text-[9px] font-semibold uppercase tracking-widest text-bone/80 backdrop-blur-sm">
                        <svg width="11" height="11" viewBox="0 0 14 14" fill="none">
                          <circle cx="6" cy="6" r="4.2" stroke="currentColor" strokeWidth="1.4"/>
                          <path d="M9.2 9.2L12.5 12.5M6 4.2v3.6M4.2 6h3.6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                        </svg>
                        Увеличить
                      </span>
                    </button>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Нижняя панель: подпись + счётчик */}
              <div className="relative z-10 flex items-center justify-between gap-3 border-t border-bone/10 bg-black/30 px-4 py-2.5 backdrop-blur-sm">
                <div className="flex min-w-0 items-center gap-2">
                  <span
                    className={`inline-block h-1.5 w-1.5 shrink-0 rounded-full ${currentLayout.kind === "commercial" ? "bg-amber-400" : "bg-emerald-400"}`}
                  />
                  <span className="truncate text-[12px] font-semibold text-bone">
                    {currentLayout.label}
                  </span>
                </div>
                <span className="shrink-0 text-[11px] font-semibold uppercase tracking-widest text-bone/45">
                  {layoutSlide + 1} / {layouts.length}
                </span>
              </div>

              {layouts.length > 1 && (
                <>
                  <button onClick={prevLayout} aria-label="Предыдущая планировка"
                    className="absolute left-2.5 top-[calc(50%-14px)] flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-ink/80 text-bone shadow-lg ring-1 ring-bone/15 backdrop-blur-sm transition hover:bg-ink hover:ring-bone/40">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 2L4 7L9 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </button>
                  <button onClick={nextLayout} aria-label="Следующая планировка"
                    className="absolute right-2.5 top-[calc(50%-14px)] flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-ink/80 text-bone shadow-lg ring-1 ring-bone/15 backdrop-blur-sm transition hover:bg-ink hover:ring-bone/40">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M5 2L10 7L5 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </button>
                </>
              )}
            </div>
          )}

          <div className="absolute left-3 top-3 z-10">
            <StatusBadge obj={obj} className="px-2.5 py-1" />
          </div>
          {obj.flagship && (
            <div className="absolute left-3 bottom-10 bg-bone px-2.5 py-1 text-eyebrow uppercase text-ink">Флагман</div>
          )}
          <button onClick={onClose} aria-label="Закрыть"
            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center bg-black/60 text-bone backdrop-blur-sm transition hover:bg-black">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          </button>
        </div>

        {/* ── Tabs ── */}
        {(hasVideos || hasLayouts) && (
          <div className="flex shrink-0 border-b border-bone/10 bg-ink-panel/50">
            <button onClick={() => setMediaTab("photo")}
              className={`relative flex-1 py-3.5 text-[11px] font-semibold uppercase tracking-widest transition ${mediaTab === "photo" ? "text-bone bg-white/5" : "text-bone/40 hover:text-bone/70 hover:bg-white/[0.02]"}`}>
              Фото ({obj.gallery.length})
              {mediaTab === "photo" && <motion.div layoutId="modal-tab" className="absolute inset-x-0 bottom-0 h-0.5 bg-bone" />}
            </button>
            {hasVideos && (
              <button onClick={() => setMediaTab("video")}
                className={`relative flex-1 py-3.5 text-[11px] font-semibold uppercase tracking-widest transition ${mediaTab === "video" ? "text-bone bg-white/5" : "text-bone/40 hover:text-bone/70 hover:bg-white/[0.02]"}`}>
                Видео ({obj.videos!.length})
                {mediaTab === "video" && <motion.div layoutId="modal-tab" className="absolute inset-x-0 bottom-0 h-0.5 bg-bone" />}
              </button>
            )}
            {hasLayouts && (
              <button onClick={() => setMediaTab("layouts")}
                className={`relative flex-1 py-3.5 text-[11px] font-semibold uppercase tracking-widest transition ${mediaTab === "layouts" ? "text-bone bg-white/5" : "text-bone/40 hover:text-bone/70 hover:bg-white/[0.02]"}`}>
                Планировки ({layouts.length})
                {mediaTab === "layouts" && <motion.div layoutId="modal-tab" className="absolute inset-x-0 bottom-0 h-0.5 bg-bone" />}
              </button>
            )}
          </div>
        )}

        {/* ── Scrollable content ── */}
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          <div className="px-5 pb-4 pt-5 sm:px-6">
            <div className="text-[11px] font-semibold uppercase tracking-widest text-bone/40">{obj.district}</div>
            <h2 className="mt-1.5 font-display text-2xl font-semibold tracking-tightest text-bone sm:text-3xl">{obj.name}</h2>
            <div className="mt-4 inline-flex items-baseline gap-1.5">
              <span className="font-display text-2xl sm:text-3xl font-semibold tracking-tightest text-bone">{obj.priceFrom}</span>
            </div>
            {obj.description && <p className="mt-4 text-[15px] leading-relaxed text-bone/60">{obj.description}</p>}

            <div className="mt-5 grid grid-cols-2 gap-px overflow-hidden border border-bone/10">
              {[
                { label: "Этажность", value: `${obj.floors} эт.` },
                { label: "Квартир", value: `${obj.apartments}` },
                { label: "Квадратура", value: obj.rooms },
                { label: "Срок сдачи", value: obj.deadline },
              ].map((s) => (
                <div key={s.label} className="bg-ink/40 px-4 py-3">
                  <div className="text-[10px] font-semibold uppercase tracking-widest text-bone/35">{s.label}</div>
                  <div className="mt-1 text-sm font-semibold text-bone">{s.value}</div>
                </div>
              ))}
            </div>

            {mediaTab === "video" && obj.videos && (
              <div className="mt-5 space-y-3">
                {obj.videos.map((src, i) => (
                  <VideoPlayer key={src} src={src} index={i} onFullscreen={() => setFsVideo(src)} />
                ))}
              </div>
            )}

            {mediaTab === "layouts" && layouts.length > 0 && (
              <div className="mt-5">
                <div className="text-[10px] font-semibold uppercase tracking-widest text-bone/35">
                  Все планировки
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {layouts.map((layout, i) => (
                    <LayoutChip
                      key={layout.src}
                      layout={layout}
                      active={i === layoutSlide}
                      onClick={() => goLayout(i)}
                    />
                  ))}
                </div>
              </div>
            )}
            <div className="h-4" />
          </div>
        </div>

        {/* ── CTA ── */}
        <div className="shrink-0 border-t border-bone/10 bg-[#111113] px-5 pb-6 pt-4 sm:px-6">
          <a href="#contact" onClick={onClose}
            className="flex w-full items-center justify-center bg-bone py-3.5 text-eyebrow font-semibold uppercase tracking-wider text-ink transition hover:bg-bone/90 active:scale-[0.98]">
            Записаться на показ →
          </a>
          <button onClick={onClose}
            className="mt-2.5 w-full py-3 text-[11px] font-semibold uppercase tracking-widest text-bone/40 transition hover:text-bone/70">
            Закрыть
          </button>
        </div>
      </motion.div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && mediaTab === "photo" && (
          <PhotoLightbox images={obj.gallery} startIndex={lightbox} onClose={() => setLightbox(null)} />
        )}
        {lightbox !== null && mediaTab === "layouts" && layouts.length > 0 && (
          <PhotoLightbox
            images={layouts.map((layout) => layout.src)}
            labels={layouts.map((layout) => layout.label)}
            startIndex={lightbox}
            paper
            onClose={() => setLightbox(null)}
          />
        )}
      </AnimatePresence>

      {/* Fullscreen video */}
      <AnimatePresence>
        {fsVideo && <FullscreenVideo src={fsVideo} onClose={() => setFsVideo(null)} />}
      </AnimatePresence>
    </>
  );
}

/* ─── VideoThumb ─── */
function VideoThumb({ src, index, onFullscreen }: { src: string; index: number; onFullscreen: () => void }) {
  return (
    <div className="group relative cursor-pointer overflow-hidden bg-ink" onClick={onFullscreen}>
      <video src={src} className="h-full w-full object-cover opacity-60" muted playsInline preload="metadata" />
      <div className="absolute inset-0 flex items-center justify-center bg-black/30 transition group-hover:bg-black/10">
        <div className="flex h-9 w-9 items-center justify-center bg-bone/90 transition group-hover:scale-110">
          <svg className="ml-0.5 h-3.5 w-3.5 text-ink" fill="currentColor" viewBox="0 0 20 20">
            <path d="M6.3 2.841A1.5 1.5 0 004 4.11v11.78a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"/>
          </svg>
        </div>
      </div>
      <div className="absolute bottom-1.5 left-2 text-[9px] font-semibold uppercase tracking-widest text-bone/50">
        Видео {index + 1}
      </div>
    </div>
  );
}

/* ─── VideoPlayer ─── */
function VideoPlayer({ src, index, onFullscreen }: { src: string; index: number; onFullscreen: () => void }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const toggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const v = ref.current;
    if (!v) return;
    if (v.paused) { v.play(); setPlaying(true); }
    else { v.pause(); setPlaying(false); }
  };

  return (
    <div className="group relative aspect-video overflow-hidden bg-ink-panel">
      <video ref={ref} src={src} className="h-full w-full object-cover" loop playsInline preload="metadata"
        onEnded={() => setPlaying(false)} />
      <AnimatePresence>
        {!playing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-black/40" onClick={toggle}>
            <div className="flex h-12 w-12 items-center justify-center bg-bone/90 transition group-hover:bg-bone">
              <svg className="ml-0.5 h-4 w-4 text-ink" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6.3 2.841A1.5 1.5 0 004 4.11v11.78a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"/>
              </svg>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Fullscreen */}
      <button onClick={onFullscreen} aria-label="На весь экран"
        className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center bg-black/60 text-bone/70 backdrop-blur-sm transition hover:bg-black hover:text-bone">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M1 4V1H4M8 1H11V4M11 8V11H8M4 11H1V8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      <div className="absolute bottom-2 left-3 text-[10px] font-semibold uppercase tracking-widest text-bone/50">
        Видео {index + 1}
      </div>
    </div>
  );
}

/* ─── Zoomable image (pinch / pan / double-tap / wheel) ─── */
function ZoomableImage({
  src,
  alt,
  paper,
  onSwipe,
}: {
  src: string;
  alt: string;
  paper?: boolean;
  onSwipe: (dir: number) => void;
}) {
  const MAX = 4;
  const wrapRef = useRef<HTMLDivElement>(null);
  const [t, setT] = useState({ scale: 1, x: 0, y: 0 });
  // Держим актуальный transform в ref, чтобы жесты не зависели от ре-рендера.
  const tRef = useRef(t);
  tRef.current = t;

  const pointers = useRef<Map<number, { x: number; y: number }>>(new Map());
  const pinchStart = useRef<{ dist: number; scale: number } | null>(null);
  const panStart = useRef<{ x: number; y: number; tx: number; ty: number } | null>(null);
  const swipeStart = useRef<{ x: number; y: number; time: number } | null>(null);
  const lastTap = useRef(0);

  const clamp = (next: { scale: number; x: number; y: number }) => {
    const el = wrapRef.current;
    const scale = Math.max(1, Math.min(MAX, next.scale));
    if (!el || scale === 1) return { scale, x: 0, y: 0 };
    const rect = el.getBoundingClientRect();
    const maxX = (rect.width * (scale - 1)) / 2;
    const maxY = (rect.height * (scale - 1)) / 2;
    return {
      scale,
      x: Math.max(-maxX, Math.min(maxX, next.x)),
      y: Math.max(-maxY, Math.min(maxY, next.y)),
    };
  };

  const zoomTo = (scale: number, cx = 0, cy = 0) => {
    const cur = tRef.current;
    const ratio = scale / cur.scale;
    setT(clamp({ scale, x: cx - (cx - cur.x) * ratio, y: cy - (cy - cur.y) * ratio }));
  };

  const relToCenter = (clientX: number, clientY: number) => {
    const el = wrapRef.current;
    if (!el) return { x: 0, y: 0 };
    const r = el.getBoundingClientRect();
    return { x: clientX - (r.left + r.width / 2), y: clientY - (r.top + r.height / 2) };
  };

  const onPointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    (e.target as Element).setPointerCapture?.(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      pinchStart.current = {
        dist: Math.hypot(a.x - b.x, a.y - b.y),
        scale: tRef.current.scale,
      };
      panStart.current = null;
      swipeStart.current = null;
    } else if (pointers.current.size === 1) {
      if (tRef.current.scale > 1) {
        panStart.current = { x: e.clientX, y: e.clientY, tx: tRef.current.x, ty: tRef.current.y };
      } else {
        swipeStart.current = { x: e.clientX, y: e.clientY, time: Date.now() };
      }
    }
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointers.current.size === 2 && pinchStart.current) {
      const [a, b] = [...pointers.current.values()];
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      const mid = relToCenter((a.x + b.x) / 2, (a.y + b.y) / 2);
      zoomTo((dist / pinchStart.current.dist) * pinchStart.current.scale, mid.x, mid.y);
    } else if (pointers.current.size === 1 && panStart.current) {
      setT((cur) =>
        clamp({
          scale: cur.scale,
          x: panStart.current!.tx + (e.clientX - panStart.current!.x),
          y: panStart.current!.ty + (e.clientY - panStart.current!.y),
        }),
      );
    }
  };

  const onPointerUp = (e: React.PointerEvent) => {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) pinchStart.current = null;

    // Свайп между планировками — только когда не увеличено.
    if (swipeStart.current && tRef.current.scale === 1) {
      const dx = e.clientX - swipeStart.current.x;
      const dy = e.clientY - swipeStart.current.y;
      const dt = Date.now() - swipeStart.current.time;
      if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5 && dt < 600) {
        onSwipe(dx < 0 ? 1 : -1);
      } else if (Math.abs(dx) < 8 && Math.abs(dy) < 8 && dt < 250) {
        // Двойной тап — переключить зум.
        const now = Date.now();
        if (now - lastTap.current < 300) {
          const p = relToCenter(e.clientX, e.clientY);
          zoomTo(tRef.current.scale > 1 ? 1 : 2.5, p.x, p.y);
          lastTap.current = 0;
        } else {
          lastTap.current = now;
        }
      }
    }
    swipeStart.current = null;
    panStart.current = null;
  };

  const onWheel = (e: React.WheelEvent) => {
    e.stopPropagation();
    const p = relToCenter(e.clientX, e.clientY);
    zoomTo(tRef.current.scale * (e.deltaY < 0 ? 1.15 : 0.87), p.x, p.y);
  };

  return (
    <div
      ref={wrapRef}
      className="relative z-0 flex h-[82svh] w-[92vw] touch-none items-center justify-center overflow-hidden"
      onClick={(e) => e.stopPropagation()}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onWheel={onWheel}
    >
      <motion.img
        src={src}
        alt={alt}
        draggable={false}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.25 }}
        style={{ transform: `translate3d(${t.x}px, ${t.y}px, 0) scale(${t.scale})` }}
        className={`h-full w-full select-none object-contain drop-shadow-2xl ${t.scale > 1 ? "cursor-grab" : "cursor-zoom-in"} ${paper ? "rounded-xl bg-white p-2 sm:p-4" : ""}`}
      />

      {t.scale > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); setT({ scale: 1, x: 0, y: 0 }); }}
          className="absolute top-14 left-1/2 z-10 -translate-x-1/2 rounded-full bg-white/12 px-4 py-2 text-[10px] font-semibold uppercase tracking-widest text-bone backdrop-blur-sm transition hover:bg-white/20"
        >
          Сбросить масштаб
        </button>
      )}
    </div>
  );
}

/* ─── Photo Lightbox ─── */
function PhotoLightbox({
  images,
  labels,
  startIndex,
  paper = false,
  onClose,
}: {
  images: string[];
  labels?: string[];
  startIndex: number;
  paper?: boolean;
  onClose: () => void;
}) {
  const [idx, setIdx] = useState(startIndex);

  const go = (next: number) => {
    setIdx((next + images.length) % images.length);
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") go(idx + 1);
      if (e.key === "ArrowLeft") go(idx - 1);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx]);

  return (
    <>
      <motion.div className="fixed inset-0 z-[80] bg-black backdrop-blur-md"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        transition={{ duration: 0.22 }} onClick={onClose} />

      <div className="fixed inset-0 z-[81] flex flex-col items-center justify-center" onClick={onClose}>
        {/* Top bar */}
        <div className="absolute inset-x-0 top-0 flex items-center justify-between px-5 py-4">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-widest text-bone/40">
              {idx + 1} / {images.length}
            </div>
            {labels?.[idx] && (
              <div className="mt-1 text-sm font-semibold text-bone/80">{labels[idx]}</div>
            )}
          </div>
          <button className="flex h-10 w-10 items-center justify-center text-bone/50 transition hover:text-bone" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M3 3L17 17M17 3L3 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Prev */}
        <button onClick={(e) => { e.stopPropagation(); go(idx - 1); }}
          className="absolute left-3 top-1/2 z-10 -translate-y-1/2 flex h-12 w-12 items-center justify-center bg-white/10 text-bone transition hover:bg-white/20 sm:left-6">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M12 3L6 9L12 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>

        {/* Main image (pinch / double-tap / wheel to zoom) */}
        <ZoomableImage
          key={idx}
          src={images[idx]}
          alt={labels?.[idx] ?? ""}
          paper={paper}
          onSwipe={(d) => go(idx + d)}
        />

        {/* Next */}
        <button onClick={(e) => { e.stopPropagation(); go(idx + 1); }}
          className="absolute right-3 top-1/2 z-10 -translate-y-1/2 flex h-12 w-12 items-center justify-center bg-white/10 text-bone transition hover:bg-white/20 sm:right-6">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M6 3L12 9L6 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>

        {/* Thumbnail strip */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 overflow-x-auto px-16 pb-1" onClick={(e) => e.stopPropagation()}>
            {images.map((src, i) => (
              <button key={i} onClick={() => go(i)}
                className={`h-12 w-16 shrink-0 overflow-hidden border-2 transition ${paper ? "bg-white" : ""} ${i === idx ? "border-bone" : "border-transparent opacity-40 hover:opacity-70"}`}>
                <img src={src} alt="" className={`h-full w-full ${paper ? "object-contain p-0.5" : "object-cover"}`} />
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

/* ─── Fullscreen Video ─── */
function FullscreenVideo({ src, onClose }: { src: string; onClose: () => void }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    ref.current?.play();
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <motion.div className="fixed inset-0 z-[80] bg-black"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        transition={{ duration: 0.22 }} onClick={onClose} />

      <div className="fixed inset-0 z-[81] flex items-center justify-center" onClick={onClose}>
        <button className="absolute right-5 top-5 z-10 flex h-10 w-10 items-center justify-center text-bone/50 transition hover:text-bone" onClick={onClose}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M3 3L17 17M17 3L3 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
        <video ref={ref} src={src}
          className="max-h-[95svh] max-w-full"
          controls playsInline loop
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    </>
  );
}

function LayoutChip({
  layout,
  active,
  onClick,
}: {
  layout: ObjectLayout;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      title={layout.label}
      className={`rounded-full border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] transition ${
        active
          ? "border-bone bg-bone text-ink"
          : layout.kind === "commercial"
            ? "border-amber-400/30 text-amber-100/80 hover:border-amber-400/60"
            : "border-bone/20 text-bone-soft hover:border-bone/45 hover:text-bone"
      }`}
    >
      {layout.area} м²
      {layout.kind === "commercial" ? " · ком." : ""}
    </button>
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
