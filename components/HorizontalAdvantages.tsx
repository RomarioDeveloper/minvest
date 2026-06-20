"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";

type Advantage = {
  index: string;
  tag: string;
  title: string;
  body: string;
};

const ADVANTAGES: Advantage[] = [
  {
    index: "01",
    tag: "Строительство",
    title: "Экибастузский кирпич и фасад",
    body: "Кирпичная технология с фиброцементными панелями и двойным утеплением — долговечность, энергоэффективность и эстетичный облик на десятилетия.",
  },
  {
    index: "02",
    tag: "Комфорт",
    title: "Современные бесшумные лифты",
    body: "Тихие скоростные лифты в каждом подъезде — никакого шума, плавный ход. Поднимают без ожидания, работают без сбоев.",
  },
  {
    index: "03",
    tag: "Комфорт",
    title: "Трёхкамерные окна",
    body: "Высокая тепло- и шумоизоляция — зимой тепло, летом прохладно, уличный шум не слышен. Витражное и панорамное остекление в каждом проекте.",
  },
  {
    index: "04",
    tag: "Комфорт",
    title: "Функциональные планировки",
    body: "Удобные и продуманные планировки квартир — от студий до трёхкомнатных. Потолки от 2,8 до 3 метров, ровные перекрытия под любой дизайн.",
  },
  {
    index: "05",
    tag: "Комфорт",
    title: "Гаражи и парковка",
    body: "Собственные капитальные гаражи во дворе и организованные парковочные решения — место для машины есть у каждого жителя.",
  },
  {
    index: "06",
    tag: "Комфорт",
    title: "Коммерция на первых этажах",
    body: "Коммерческие помещения на первых и цокольных этажах в отдельных проектах — инфраструктура прямо в доме: кафе, аптека, магазин.",
  },
  {
    index: "07",
    tag: "Безопасность",
    title: "Закрытая территория",
    body: "Контроль доступа на въезде и входе — только жители и их гости. Единственный шлагбаум, видеонаблюдение 24/7 по всему периметру.",
  },
  {
    index: "08",
    tag: "Безопасность",
    title: "Face ID в подъезде",
    body: "Системы распознавания лиц в премиальных проектах — вход без ключа, без кода. Быстро, удобно и надёжно для каждого жителя.",
  },
  {
    index: "09",
    tag: "Безопасность",
    title: "Умные замки в квартирах",
    body: "Электронные замки с приложением — открытие со смартфона, временные ключи для гостей, история входов. Полный контроль без физического ключа.",
  },
];

/**
 * Pinned horizontal scroll. Measures real track overflow so the last card
 * always lands exactly in view regardless of viewport size.
 */
export default function HorizontalAdvantages() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [endX, setEndX] = useState("-60%");

  useEffect(() => {
    const measure = () => {
      if (!trackRef.current) return;
      const overflow = trackRef.current.scrollWidth - window.innerWidth;
      if (overflow > 0) {
        const pct = (overflow / trackRef.current.scrollWidth) * 100;
        setEndX(`-${pct.toFixed(1)}%`);
      }
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const x = useTransform(scrollYProgress, [0, 1], ["0%", endX]);

  return (
    <section
      id="advantages"
      ref={sectionRef}
      className="relative bg-ink-deep"
      style={{ height: `${ADVANTAGES.length * 55}vh` }}
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
          ref={trackRef}
          style={{ x }}
          className="hidden gap-5 px-6 will-change-transform sm:flex sm:px-10 lg:px-16"
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
    <article className="flex h-[42vh] max-h-[360px] w-[72vw] shrink-0 flex-col justify-between border border-bone/12 bg-ink-panel p-7 sm:w-[300px]">
      <div className="flex items-start justify-between gap-3">
        <div className="font-display text-4xl font-semibold tracking-tightest text-bone/15">
          {a.index}
        </div>
        <span className="rounded-full border border-bone/20 px-2.5 py-1 text-[10px] uppercase tracking-wider text-bone-dim">
          {a.tag}
        </span>
      </div>
      <div>
        <h3 className="font-display text-xl font-semibold leading-tight tracking-tightest text-bone sm:text-[22px]">
          {a.title}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-bone-soft">{a.body}</p>
      </div>
    </article>
  );
}
