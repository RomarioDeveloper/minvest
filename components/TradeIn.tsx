"use client";

import RevealOnView from "@/components/RevealOnView";
import TradeInCarScene from "@/components/TradeInCarScene";
import {
  ArrowRightLeft,
  ClipboardList,
  Gauge,
  KeyRound,
  type LucideIcon,
} from "lucide-react";

type Step = {
  n: string;
  t: string;
  d: string;
  icon: LucideIcon;
};

const STEPS: Step[] = [
  {
    n: "01",
    t: "Оставляете заявку",
    d: "Указываете марку, год и пробег автомобиля.",
    icon: ClipboardList,
  },
  {
    n: "02",
    t: "Бесплатная оценка",
    d: "Эксперт оценивает авто по рынку за 30 минут.",
    icon: Gauge,
  },
  {
    n: "03",
    t: "Зачёт в стоимость",
    d: "Сумма авто идёт в счёт первого взноса за квартиру.",
    icon: ArrowRightLeft,
  },
  {
    n: "04",
    t: "Бронируете квартиру",
    d: "Фиксируете цену и планировку, остаток — в рассрочку.",
    icon: KeyRound,
  },
];

const TRUST = ["Оценка за 30 минут", "Без обязательств", "Онлайн-заявка"];

export default function TradeIn() {
  return (
    <section
      id="tradein"
      className="relative overflow-hidden bg-ink px-6 py-24 sm:px-10 sm:py-32 lg:px-16"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-14 lg:grid-cols-[1fr_1.05fr] lg:items-center">
          <div>
            <RevealOnView variant="wipe" className="text-eyebrow uppercase text-bone-mute">
              Trade-in
            </RevealOnView>
            <RevealOnView
              as="div"
              variant="blur"
              delay={120}
              className="mt-6 font-display font-semibold tracking-tightest text-balance text-bone"
            >
              <h2 style={{ fontSize: "clamp(34px, 5.2vw, 68px)", lineHeight: 0.98 }}>
                Меняем авто
                <br />
                <span className="text-bone-mute">на квадратные метры.</span>
              </h2>
            </RevealOnView>
            <RevealOnView delay={200} className="mt-6 max-w-md text-pretty leading-relaxed text-bone-soft">
              Сдайте автомобиль в зачёт стоимости квартиры. Мы оценим машину по
              рыночной цене и оформим всё за один визит — пересаживайтесь из авто
              в новую квартиру.
            </RevealOnView>

            {/* Акцент результата: авто превращается в первый взнос */}
            <RevealOnView
              as="div"
              variant="block"
              delay={240}
              className="mt-8 inline-flex items-center gap-3 border border-bone/12 bg-ink-panel px-4 py-3"
            >
              <span className="text-sm font-semibold text-bone">Ваше авто</span>
              <ArrowRightLeft className="h-4 w-4 text-bone-mute" aria-hidden />
              <span className="text-sm font-semibold text-bone">Первый взнос за квартиру</span>
            </RevealOnView>

            <RevealOnView delay={300} className="mt-8">
              <a
                href="#contact"
                className="group inline-flex items-center gap-3 bg-bone px-7 py-4 text-eyebrow uppercase text-ink transition hover:bg-bone-soft"
              >
                Оценить мой автомобиль
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </a>
            </RevealOnView>

            <RevealOnView delay={360} className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2">
              {TRUST.map((t) => (
                <span key={t} className="flex items-center gap-2 text-xs text-bone-dim">
                  <span className="h-1 w-1 rounded-full bg-bone-mute" />
                  {t}
                </span>
              ))}
            </RevealOnView>
          </div>

          {/* Машина въезжает справа — на месте прежнего блока шагов */}
          <RevealOnView variant="zoom" delay={160} className="lg:pl-4">
            <TradeInCarScene />
          </RevealOnView>
        </div>

        {/* Шаги процесса — на всю ширину под сценой */}
        <ol className="mt-16 grid grid-cols-1 gap-x-8 gap-y-10 sm:mt-20 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            const isLast = i === STEPS.length - 1;
            return (
              <RevealOnView
                as="li"
                key={s.n}
                variant="slide-right"
                delay={140 + i * 90}
                className="group relative"
              >
                {/* Маркер + горизонтальный соединитель к следующему шагу */}
                <div className="flex items-center gap-4">
                  <span className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center border border-bone/15 bg-ink-panel text-bone transition-colors duration-300 group-hover:border-bone/40">
                    <Icon className="h-5 w-5 text-bone-mute transition-colors duration-300 group-hover:text-bone" aria-hidden />
                  </span>
                  {!isLast && (
                    <span className="hidden h-px flex-1 bg-gradient-to-r from-bone/20 to-bone/5 lg:block" />
                  )}
                </div>

                <div className="mt-5">
                  <div className="flex items-baseline gap-3">
                    <span className="font-display text-sm font-semibold tracking-[0.2em] text-bone/25 transition-colors duration-300 group-hover:text-bone/50">
                      {s.n}
                    </span>
                    <h3 className="font-display text-lg font-semibold tracking-tightest text-bone">
                      {s.t}
                    </h3>
                  </div>
                  <p className="mt-2 max-w-xs text-sm leading-relaxed text-bone-soft">
                    {s.d}
                  </p>
                </div>
              </RevealOnView>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
