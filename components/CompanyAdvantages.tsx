"use client";

import RevealOnView from "@/components/RevealOnView";
import StatsCountUp from "@/components/StatsCountUp";

const STATS = [
  { to: 6, suffix: "", label: "объектов в работе" },
  { to: 1200, suffix: "+", label: "квартир продано" },
  { to: 11, suffix: "", label: "лет на рынке" },
  { to: 100, suffix: "%", label: "сдаём в срок" },
];

const PERKS = [
  {
    title: "Строим сами",
    body: "Собственные бригады и техника — без субподрядчиков, к которым нет вопросов.",
  },
  {
    title: "Эскроу и ДДУ",
    body: "Деньги дольщиков на эскроу-счетах в банке. Покупка по договору, защищённому законом.",
  },
  {
    title: "Полный цикл",
    body: "От проектирования и котлована до благоустройства двора и выдачи ключей.",
  },
  {
    title: "Сервис после сдачи",
    body: "Своя управляющая компания и гарантия на дом — мы остаёмся рядом после заселения.",
  },
];

export default function CompanyAdvantages() {
  return (
    <section
      id="company"
      className="relative border-y border-bone/10 bg-ink-deep px-6 py-24 sm:px-10 sm:py-32 lg:px-16"
    >
      <div className="mx-auto max-w-7xl">
        <RevealOnView className="text-eyebrow uppercase text-bone-mute">
          О компании
        </RevealOnView>
        <RevealOnView
          as="div"
          delay={120}
          className="mt-6 max-w-4xl font-display font-semibold tracking-tightest text-balance text-bone"
        >
          <h2 style={{ fontSize: "clamp(34px, 5.4vw, 72px)", lineHeight: 0.98 }}>
            Malaysary Invest —
            <br />
            <span className="text-bone-mute">надёжный застройщик.</span>
          </h2>
        </RevealOnView>

        {/* Infographics */}
        <div className="mt-16 grid grid-cols-2 gap-x-8 gap-y-10 lg:grid-cols-4">
          {STATS.map((s, i) => (
            <RevealOnView key={s.label} delay={160 + i * 80} className="border-t border-bone/15 pt-4">
              <StatsCountUp
                to={s.to}
                suffix={s.suffix}
                className="font-display text-4xl font-semibold tracking-tightest text-bone sm:text-5xl"
              />
              <div className="mt-2 text-eyebrow uppercase text-bone-dim">{s.label}</div>
            </RevealOnView>
          ))}
        </div>

        {/* Perks */}
        <div className="mt-20 grid grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-2">
          {PERKS.map((p, i) => (
            <RevealOnView key={p.title} delay={140 + i * 80} className="flex gap-5">
              <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-bone" />
              <div>
                <h3 className="font-display text-xl font-semibold tracking-tightest text-bone">
                  {p.title}
                </h3>
                <p className="mt-2 max-w-md text-pretty leading-relaxed text-bone-soft">
                  {p.body}
                </p>
              </div>
            </RevealOnView>
          ))}
        </div>
      </div>
    </section>
  );
}
