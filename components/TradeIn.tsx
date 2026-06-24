"use client";

import RevealOnView from "@/components/RevealOnView";

const STEPS = [
  { n: "01", t: "Оставляете заявку", d: "Указываете марку, год и пробег автомобиля." },
  { n: "02", t: "Бесплатная оценка", d: "Эксперт оценивает авто по рынку за 30 минут." },
  { n: "03", t: "Зачёт в стоимость", d: "Сумма авто идёт в счёт первого взноса за квартиру." },
  { n: "04", t: "Бронируете квартиру", d: "Фиксируете цену и планировку, остаток — в рассрочку." },
];

export default function TradeIn() {
  return (
    <section
      id="tradein"
      className="relative overflow-hidden bg-ink px-6 py-24 sm:px-10 sm:py-32 lg:px-16"
    >
      <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-2 lg:items-center">
        <div>
          <RevealOnView className="text-eyebrow uppercase text-bone-mute">
            Trade-in
          </RevealOnView>
          <RevealOnView
            as="div"
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
          <RevealOnView delay={280} className="mt-10">
            <a
              href="#contact"
              className="inline-flex items-center gap-3 bg-bone px-7 py-4 text-eyebrow uppercase text-ink transition hover:bg-bone-soft"
            >
              Оценить мой автомобиль →
            </a>
          </RevealOnView>
        </div>

        <div className="grid grid-cols-1 gap-px overflow-hidden border border-bone/12 bg-bone/10 sm:grid-cols-2">
          {STEPS.map((s, i) => (
            <RevealOnView key={s.n} delay={140 + i * 90} className="bg-ink-panel">
              <div className="flex h-full flex-col gap-4 p-7">
                <span className="font-display text-3xl font-semibold tracking-tightest text-bone/20">
                  {s.n}
                </span>
                <div>
                  <h3 className="font-display text-lg font-semibold tracking-tightest text-bone">
                    {s.t}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-bone-soft">{s.d}</p>
                </div>
              </div>
            </RevealOnView>
          ))}
        </div>
      </div>
    </section>
  );
}
