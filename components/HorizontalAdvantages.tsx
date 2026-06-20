"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";

type Advantage = {
  index: string;
  title: string;
  body: string;
};

const ADVANTAGES: Advantage[] = [
  {
    index: "01",
    title: "Экибастузский кирпич",
    body: "Несущие стены 62 см с двойным утеплением и фиброцементными панелями — тепло зимой, прохладно летом, тишина круглый год.",
  },
  {
    index: "02",
    title: "Бесшумные лифты",
    body: "Современные тихие лифты в каждом подъезде — плавный ход, быстрое обслуживание, без шума и ожиданий.",
  },
  {
    index: "03",
    title: "Трёхкамерные окна",
    body: "Высокая тепло- и шумоизоляция. Витражное и панорамное остекление — максимум естественного света в каждой квартире.",
  },
  {
    index: "04",
    title: "Функциональные планировки",
    body: "От студий до трёхкомнатных. Потолки от 2,8 до 3 метров, ровные перекрытия — свобода для любого дизайна.",
  },
  {
    index: "05",
    title: "Гаражи и парковка",
    body: "Собственные капитальные гаражи и парковочные решения во дворе — место для машины есть у каждого жителя.",
  },
  {
    index: "06",
    title: "Коммерция в доме",
    body: "Коммерческие помещения на первых и цокольных этажах в отдельных проектах — кафе, аптека, магазин прямо под рукой.",
  },
  {
    index: "07",
    title: "Закрытая территория",
    body: "Контроль доступа на въезде и у подъездов — только жители и их гости. Шлагбаум, видеонаблюдение 24/7.",
  },
  {
    index: "08",
    title: "Face ID в подъезде",
    body: "Системы распознавания лиц в премиальных проектах — вход без ключа и кода. Быстро, удобно, надёжно.",
  },
  {
    index: "09",
    title: "Умные замки",
    body: "Электронные замки с управлением со смартфона — временные ключи для гостей, история входов, полный контроль.",
  },
];

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
    <article className="flex h-[44vh] max-h-[380px] w-[72vw] shrink-0 flex-col justify-between border border-bone/12 bg-ink-panel p-7 sm:w-[240px]">
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
