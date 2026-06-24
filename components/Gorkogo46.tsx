"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import RevealOnView from "@/components/RevealOnView";

/* ─── helpers ─── */
const enc = (s: string) => encodeURIComponent(s);
const BASE = "/gorgogo47";
const FACADE = `${BASE}/${enc("Полный фасад территории")}`;
const ENTRANCE = `${BASE}/${enc("Входная дверь, внутрянка")}`;
const GARAGES = `${BASE}/${enc("Гаражи")}`;
const PLAYGROUND = `${BASE}/${enc("Детская площадка")}`;
const VIDEOS = `${BASE}/Video`;

/* ─── data ─── */
const FEATURES = [
  { icon: "⬛", label: "5 этажей", sub: "бизнес-класс" },
  { icon: "↕", label: "3 м потолки", sub: "во всех квартирах" },
  { icon: "🔲", label: "Стены 62 см", sub: "экибастузский кирпич" },
  { icon: "◻", label: "Face ID", sub: "вход в дом" },
  { icon: "🔑", label: "Умные замки", sub: "в каждой квартире" },
  { icon: "🚗", label: "Гаражи", sub: "собственные боксы" },
];

type Tab = "facade" | "entrance" | "garages" | "playground";

const TABS: { id: Tab; label: string }[] = [
  { id: "facade", label: "Фасад" },
  { id: "entrance", label: "Подъезд" },
  { id: "garages", label: "Гаражи" },
  { id: "playground", label: "Площадка" },
];

const GALLERY: Record<Tab, string[]> = {
  facade: [
    `${FACADE}/41b6768d010586018f82b0599388ee87_f00633db-fee7-4294-afb1-8f5249c41033.png`,
    `${FACADE}/884b9cde6abe5acff6acdca51ff98611_01bb4eba-a93d-4e21-b418-5b7cc51b79ab.png`,
    `${FACADE}/19086718317f3e5a196967033b163ebf_27ece1ff-b826-4aa3-9941-763ce558d334.png`,
    `${FACADE}/5b43565591a74ce208225cb74fbb6926_470adef1-f7ee-44e0-b9e5-db7788e4f2fc.png`,
    `${FACADE}/7b3aef5a98199018116dfc82b023f7da_930f09ae-5722-462a-8880-2d498132476d.png`,
    `${FACADE}/88b321f5ceeecb55f2d35ed2598c3e2f_65567578-29b5-45e8-8456-a1ea24bed0e0.png`,
    `${FACADE}/9e27ad1b2a6e559311e9cd2f31399cf3_b0eec14a-5300-487a-9855-d69b9226e8a6.png`,
    `${FACADE}/a0bdbfa78d0e9e9bce4ba5c27047fa61_8f7602db-e457-4bc3-896b-ce929391456f.png`,
    `${FACADE}/34e8b126450f03bc75749cc86655fcde_349e2f67-d696-46a3-bc65-64445557ea36.png`,
    `${FACADE}/d35e2dd9ea5b85af4ae941f145210ab0_e67ec5ac-c3ee-4941-b36f-1902f98521b0.png`,
    `${FACADE}/d8acdf54501cf768e20eb02848d822ff_12e5751c-a425-49cf-87ad-b55f03a90aca.png`,
    `${FACADE}/da54d15b01f2b830a33dabea43642029_7cbfc151-4e98-4a94-953b-af8989eb8808.png`,
    `${FACADE}/dd54c08850a98fb706a805585bb226ca_591ee229-3407-4d4a-a44e-e3e9afb8ac00.png`,
    `${FACADE}/e23826c868683d844315d08a53909223_83fd141d-ecd7-429b-a381-4be2128c94c5.png`,
  ],
  entrance: [
    `${ENTRANCE}/124ff09e7dc6c177fbe814461e08cdf1_db043c37-390e-4974-9f33-d8e943653299.png`,
    `${ENTRANCE}/1ff9060b0dcbd7a611e46981ec8b26d4_4c4c2ced-df3a-4f82-a43a-233a7f4a9b48.jpeg`,
    `${ENTRANCE}/2291e420cae69caf3fb8d5c47741aa85_a6f3a6e6-6c07-4834-9010-0d98b177e589.png`,
    `${ENTRANCE}/422c2379d3a72933141ee994111a4737_f4686fd9-d09d-4c10-9247-7df1ea38d088.png`,
    `${ENTRANCE}/4adedb6da6327883ce2ea4f732eb86fd_6a83d1d0-68a8-4c80-833c-98dfff0b3088.png`,
    `${ENTRANCE}/a1363237a0b8e8b582fb3403ecdb66ff_3ea6281a-adc0-4b89-841f-70f6c62204d0.png`,
    `${ENTRANCE}/d6587687f251d8f849ca3ba835a3222a_d52a0412-7d34-4a89-bce4-e879edc3176f.png`,
    `${ENTRANCE}/eb3572a213674a790538667bda9bc5bd_220f9feb-2795-4a1e-bd9c-b3d13ff1e177.png`,
  ],
  garages: [
    `${GARAGES}/3af31198-00f7-4aae-96c6-180b7fef755e.png`,
    `${GARAGES}/add4057e-4477-40dd-8129-be50c97bb335.png`,
  ],
  playground: [
    `${PLAYGROUND}/298ff71b-9791-4543-b9ba-5d14ff3673e5.png`,
    `${PLAYGROUND}/7fb8c7fc7dfcce22f1016d28564b9403_80a5003a-f79f-4372-acd2-039bc6caeaaa.png`,
    `${PLAYGROUND}/a1234809-3714-45a3-a431-ff096ee7760b.png`,
  ],
};

const VIDEO_LIST = [
  `${VIDEOS}/20ccb794aeb21275b8d983568c44db6f_4b08d00e-d854-4fc9-9e76-9307d767f9df.mp4`,
  `${VIDEOS}/6a5922b7df7d8dd64b6d999a1af6a1a8_33eb0e04-68e5-4d3b-907e-c07ab5e89392.mp4`,
  `${VIDEOS}/7cbc54e11cdc649419b66c9ec647ce4d_0342ec69-5c9f-4a10-8d95-0db641b803c5.mp4`,
  `${VIDEOS}/8e979b8925467381f0e1b5eaa82a9948_0a55c949-cf63-4bb5-b0a8-589300d6ed64.mp4`,
];

/* ─── lightbox state ─── */
type LightboxState = { images: string[]; index: number } | null;

export default function Gorkogo46() {
  const [activeTab, setActiveTab] = useState<Tab>("facade");
  const [lightbox, setLightbox] = useState<LightboxState>(null);

  const openLightbox = (images: string[], index: number) =>
    setLightbox({ images, index });

  return (
    <section
      id="gorkogo46"
      className="relative bg-ink"
    >
      {/* ── HERO ── */}
      <div className="relative h-[70svh] min-h-[480px] overflow-hidden">
        <img
          src={GALLERY.facade[0]}
          alt="Горького, 46 — фасад"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-transparent" />

        <div className="absolute inset-x-0 bottom-0 px-6 pb-14 sm:px-10 lg:px-16">
          <div className="mx-auto max-w-7xl">
            <RevealOnView className="text-eyebrow uppercase text-bone/50">
              Горького, 46 · г. Павлодар
            </RevealOnView>
            <RevealOnView
              as="div"
              delay={120}
              className="mt-4 font-display font-semibold tracking-tightest text-bone"
            >
              <h2 style={{ fontSize: "clamp(36px, 6vw, 80px)", lineHeight: 0.96 }}>
                Дом бизнес-класса,<br />
                <span className="text-bone/50">где эстетика —</span><br />
                <span className="text-bone/50">образ жизни.</span>
              </h2>
            </RevealOnView>
          </div>
        </div>
      </div>

      {/* ── FEATURES ── */}
      <div className="border-y border-bone/10 bg-ink-deep px-6 py-12 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-2 gap-px sm:grid-cols-3 lg:grid-cols-6">
            {FEATURES.map((f, i) => (
              <RevealOnView key={f.label} delay={80 + i * 60}
                className="flex flex-col gap-1 bg-ink-panel px-5 py-5">
                <div className="text-xl">{f.icon}</div>
                <div className="mt-1 font-display text-lg font-semibold tracking-tightest text-bone">
                  {f.label}
                </div>
                <div className="text-[11px] uppercase tracking-widest text-bone/40">{f.sub}</div>
              </RevealOnView>
            ))}
          </div>
        </div>
      </div>

      {/* ── DESCRIPTION ── */}
      <div className="px-6 py-16 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 md:grid-cols-2">
            <RevealOnView>
              <h3 className="font-display text-2xl font-semibold tracking-tightest text-bone sm:text-3xl">
                Современный 5-этажный жилой комплекс бизнес-класса
              </h3>
              <p className="mt-5 leading-relaxed text-bone/60">
                Создан для тех, кто ценит комфорт, приватность и безупречный стиль.
                Каждая деталь продумана до мелочей — архитектура и интерьерные решения
                подчёркивают высокий статус жителей.
              </p>
            </RevealOnView>
            <RevealOnView delay={120}>
              <ul className="space-y-3">
                {[
                  "Витражные окна — максимум естественного света",
                  "Высота потолков 3 метра во всех квартирах",
                  "Фиброцементный фасад — эстетика и долговечность",
                  "Трёхкамерные окна с тепло- и шумоизоляцией",
                  "Дизайнерский ремонт подъездов и общих зон",
                  "Закрытая территория с контролем доступа",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-bone/70">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-bone/50" />
                    {item}
                  </li>
                ))}
              </ul>
            </RevealOnView>
          </div>
        </div>
      </div>

      {/* ── GALLERY WITH TABS ── */}
      <div className="px-6 pb-16 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-7xl">
          {/* Tabs */}
          <RevealOnView className="flex flex-wrap gap-2 border-b border-bone/10 pb-0">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-4 py-3 text-eyebrow uppercase transition ${
                  activeTab === tab.id ? "text-bone" : "text-bone/40 hover:text-bone/70"
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="tab-underline"
                    className="absolute inset-x-0 bottom-0 h-px bg-bone"
                  />
                )}
              </button>
            ))}
          </RevealOnView>

          {/* Grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4"
            >
              {GALLERY[activeTab].map((src, i) => (
                <button
                  key={src}
                  onClick={() => openLightbox(GALLERY[activeTab], i)}
                  className="group relative aspect-square overflow-hidden bg-ink-panel"
                >
                  <img
                    src={src}
                    alt=""
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 transition duration-300 group-hover:bg-black/20" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 transition duration-300 group-hover:opacity-100">
                    <svg className="h-8 w-8 text-bone" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                    </svg>
                  </div>
                </button>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ── VIDEOS ── */}
      <div className="border-t border-bone/10 px-6 py-16 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <RevealOnView className="text-eyebrow uppercase text-bone/40">
            Видео с объекта
          </RevealOnView>
          <RevealOnView delay={80} as="div"
            className="mt-6 font-display text-2xl font-semibold tracking-tightest text-bone sm:text-3xl">
            Посмотрите дом изнутри.
          </RevealOnView>

          <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {VIDEO_LIST.map((src, i) => (
              <RevealOnView key={src} delay={100 + i * 80}>
                <VideoCard src={src} index={i} />
              </RevealOnView>
            ))}
          </div>
        </div>
      </div>

      {/* ── CTA ── */}
      <div className="border-t border-bone/10 bg-ink-deep px-6 py-16 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <RevealOnView className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-eyebrow uppercase text-bone/40">Горького, 46</div>
              <h3 className="mt-2 font-display text-2xl font-semibold tracking-tightest text-bone sm:text-3xl">
                Хотите посмотреть вживую?
              </h3>
            </div>
            <a
              href="#contact"
              className="shrink-0 bg-bone px-8 py-4 text-eyebrow uppercase text-ink transition hover:bg-bone/90 active:scale-[0.98]"
            >
              Записаться на показ →
            </a>
          </RevealOnView>
        </div>
      </div>

      {/* ── LIGHTBOX ── */}
      <AnimatePresence>
        {lightbox && (
          <Lightbox
            images={lightbox.images}
            startIndex={lightbox.index}
            onClose={() => setLightbox(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

/* ─── VideoCard ─── */
function VideoCard({ src, index }: { src: string; index: number }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const toggle = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) { v.play(); setPlaying(true); }
    else { v.pause(); setPlaying(false); }
  };

  return (
    <div className="group relative aspect-video cursor-pointer overflow-hidden bg-ink-panel" onClick={toggle}>
      <video
        ref={videoRef}
        src={src}
        className="h-full w-full object-cover"
        loop
        playsInline
        preload="metadata"
        onEnded={() => setPlaying(false)}
      />
      <AnimatePresence>
        {!playing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-black/40"
          >
            <div className="flex h-14 w-14 items-center justify-center bg-bone/90 transition group-hover:bg-bone">
              <svg className="ml-1 h-5 w-5 text-ink" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6.3 2.841A1.5 1.5 0 004 4.11v11.78a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"/>
              </svg>
            </div>
            <div className="absolute bottom-3 left-4 text-[11px] font-semibold uppercase tracking-widest text-bone/60">
              Видео {index + 1}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Lightbox ─── */
function Lightbox({ images, startIndex, onClose }: { images: string[]; startIndex: number; onClose: () => void }) {
  const [idx, setIdx] = useState(startIndex);
  const [dir, setDir] = useState(0);

  const go = (next: number) => {
    setDir(next > idx ? 1 : -1);
    setIdx((next + images.length) % images.length);
  };

  return (
    <>
      <motion.div
        className="fixed inset-0 z-[70] bg-black/95 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <div className="fixed inset-0 z-[71] flex items-center justify-center p-4">
        {/* Close */}
        <button onClick={onClose}
          className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center text-bone/60 transition hover:text-bone">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M3 3L17 17M17 3L3 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>

        {/* Counter */}
        <div className="absolute left-1/2 top-5 -translate-x-1/2 text-eyebrow uppercase text-bone/40">
          {idx + 1} / {images.length}
        </div>

        {/* Prev */}
        <button onClick={() => go(idx - 1)}
          className="absolute left-4 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center bg-white/10 text-bone transition hover:bg-white/20">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* Image */}
        <AnimatePresence mode="wait" custom={dir}>
          <motion.img
            key={idx}
            src={images[idx]}
            alt=""
            custom={dir}
            variants={{
              enter: (d: number) => ({ x: d * 100, opacity: 0 }),
              center: { x: 0, opacity: 1 },
              exit: (d: number) => ({ x: d * -100, opacity: 0 }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.28, ease: [0.32, 0, 0.18, 1] }}
            className="max-h-[85svh] max-w-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </AnimatePresence>

        {/* Next */}
        <button onClick={() => go(idx + 1)}
          className="absolute right-4 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center bg-white/10 text-bone transition hover:bg-white/20">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </>
  );
}
