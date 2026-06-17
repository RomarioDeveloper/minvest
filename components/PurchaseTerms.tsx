"use client";

import RevealOnView from "@/components/RevealOnView";

type Term = {
  title: string;
  rate: string;
  rateNote: string;
  points: string[];
};

const TERMS: Term[] = [
  {
    title: "Ипотека",
    rate: "от 7%",
    rateNote: "годовых",
    points: ["Одобрение за 1 день", "Первый взнос от 20%", "Банки-партнёры"],
  },
  {
    title: "Рассрочка",
    rate: "0%",
    rateNote: "без переплат",
    points: ["До 24 месяцев", "Без процентов", "По графику от застройщика"],
  },
  {
    title: "Trade-in",
    rate: "авто → кв",
    rateNote: "зачёт стоимости",
    points: ["Оценка за 30 минут", "Зачёт авто в счёт квартиры", "Подробнее ниже"],
  },
];

export default function PurchaseTerms() {
  return (
    <section
      id="terms"
      className="relative border-y border-bone/10 bg-ink-deep px-6 py-24 sm:px-10 sm:py-32 lg:px-16"
    >
      <div className="mx-auto max-w-7xl">
        <RevealOnView className="text-eyebrow uppercase text-bone-mute">
          Условия покупки
        </RevealOnView>
        <RevealOnView
          as="div"
          delay={120}
          className="mt-6 max-w-3xl font-display font-semibold tracking-tightest text-balance text-bone"
        >
          <h2 style={{ fontSize: "clamp(34px, 5.4vw, 72px)", lineHeight: 0.98 }}>
            Платите так,
            <br />
            <span className="text-bone-mute">как вам удобно.</span>
          </h2>
        </RevealOnView>

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
          {TERMS.map((t, i) => (
            <RevealOnView key={t.title} delay={160 + i * 90} className="h-full">
              <div className="flex h-full flex-col border border-bone/12 bg-ink-panel p-8">
                <div className="text-eyebrow uppercase text-bone-mute">{t.title}</div>
                <div className="mt-6 flex items-baseline gap-2">
                  <span className="font-display text-5xl font-semibold tracking-tightest text-bone">
                    {t.rate}
                  </span>
                  <span className="text-sm text-bone-dim">{t.rateNote}</span>
                </div>
                <ul className="mt-8 space-y-3 border-t border-bone/10 pt-6">
                  {t.points.map((p) => (
                    <li key={p} className="flex items-center gap-3 text-sm text-bone-soft">
                      <span className="h-1 w-1 rounded-full bg-bone-mute" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </RevealOnView>
          ))}
        </div>

        <RevealOnView delay={200} className="mt-10">
          <a
            href="#contact"
            className="inline-flex items-center gap-3 bg-bone px-7 py-4 text-eyebrow uppercase text-ink transition hover:bg-bone-soft"
          >
            Рассчитать платёж →
          </a>
        </RevealOnView>
      </div>
    </section>
  );
}
