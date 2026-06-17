"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

type Advantage = {
  index: string;
  title: string;
  body: string;
};

const ADVANTAGES: Advantage[] = [
  {
    index: "01",
    title: "Закрытая территория",
    body: "Каждый двор без машин и посторонних: единый въезд, шлагбаум и видеонаблюдение 24/7.",
  },
  {
    index: "02",
    title: "Капитальный кирпич",
    body: "Несущие стены и фасады из керамического кирпича — тепло зимой, прохладно летом, тишина круглый год.",
  },
  {
    index: "03",
    title: "Свой паркинг и гаражи",
    body: "Капитальные кирпичные боксы и гостевые места внутри периметра — машина всегда рядом и под охраной.",
  },
  {
    index: "04",
    title: "Детская инфраструктура",
    body: "Прорезиненные площадки, игровые формы и зоны отдыха — на виду с балконов и от подъездов.",
  },
  {
    index: "05",
    title: "Готовая отделка",
    body: "Варианты с чистовой отделкой под ключ: заезжайте с мебелью, без ремонтных хлопот.",
  },
  {
    index: "06",
    title: "Сдаём в срок",
    body: "Строим сами и отвечаем за каждый этап — от котлована до ключей. Дома сдаются по графику.",
  },
];

/**
 * Pinned horizontal scroll. The section is tall; while it's pinned the row of
 * cards translates left as you scroll down — the premium "scroll → sideways"
 * trick. On touch devices it falls back to a normal horizontal swipe strip.
 */
export default function HorizontalAdvantages() {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Translate the track from 0 to the overflow width. We approximate the
  // overflow with viewport-relative units so it works without measuring.
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-78%"]);

  return (
    <section
      id="advantages"
      ref={sectionRef}
      className="relative bg-ink-deep"
      style={{ height: "320vh" }}
    >
      <div className="sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden">
        <div className="px-6 pb-10 sm:px-10 lg:px-16">
          <div className="text-eyebrow uppercase text-bone-mute">Преимущества</div>
          <h2
            className="mt-4 max-w-3xl font-display font-semibold tracking-tightest text-balance text-bone"
            style={{ fontSize: "clamp(30px, 4.6vw, 64px)", lineHeight: 0.98 }}
          >
            Почему выбирают
            <span className="text-bone-mute"> Malaysary Invest.</span>
          </h2>
        </div>

        {/* Desktop: scroll-driven horizontal track */}
        <motion.div
          style={{ x }}
          className="hidden gap-6 px-6 will-change-transform sm:flex sm:px-10 lg:px-16"
        >
          {ADVANTAGES.map((a) => (
            <Card key={a.index} a={a} />
          ))}
        </motion.div>

        {/* Mobile: native swipe strip */}
        <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-4 [scrollbar-width:none] sm:hidden">
          {ADVANTAGES.map((a) => (
            <div key={a.index} className="snap-start">
              <Card a={a} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Card({ a }: { a: Advantage }) {
  return (
    <article className="flex h-[44vh] max-h-[420px] w-[78vw] shrink-0 flex-col justify-between border border-bone/12 bg-ink-panel p-8 sm:w-[420px]">
      <div className="font-display text-5xl font-semibold tracking-tightest text-bone/15">
        {a.index}
      </div>
      <div>
        <h3 className="font-display text-2xl font-semibold leading-tight tracking-tightest text-bone sm:text-3xl">
          {a.title}
        </h3>
        <p className="mt-4 text-pretty leading-relaxed text-bone-soft">{a.body}</p>
      </div>
    </article>
  );
}
