"use client";

import RevealOnView from "@/components/RevealOnView";

type Item = {
  index: string;
  eyebrow: string;
  title: string;
  body: string;
  specs: string[];
  image: string;
};

const ITEMS: Item[] = [
  {
    index: "01",
    eyebrow: "Стены",
    title: "Экибастузский кирпич",
    body: "Несущие стены из экибастузского кирпича с двойным утеплением и фиброцементными панелями — тепло, тихо, долговечно.",
    specs: ["Толщина стен 620 мм", "Двойной утеплитель", "Фиброцементный фасад"],
    image: `/${encodeURIComponent("Дюсенова 304")}/IMG_1325.webp`,
  },
  {
    index: "02",
    eyebrow: "Окна",
    title: "Витражное остекление",
    body: "Панорамные и витражные окна с трёхкамерным стеклопакетом — максимум естественного света и высокая теплоизоляция.",
    specs: ["3-камерный стеклопакет", "Витражные и панорамные окна", "Высокая шумоизоляция"],
    image: "/okna.jpg",
  },
  {
    index: "03",
    eyebrow: "Перегородки и двери",
    title: "Кирпич внутри",
    body: "Межкомнатные перегородки из кирпича — настоящая звукоизоляция между комнатами. Дизайнерские входные группы с умными замками.",
    specs: ["Кирпичные перегородки", "Умные замки в квартирах", "Дизайнерские подъезды"],
    image: "/smart-locks.jpg",
  },
  {
    index: "04",
    eyebrow: "Потолки",
    title: "Высота и свет",
    body: "Потолки от 2,8 до 3 метров — ощущение пространства и свободы в каждой квартире. Ровные перекрытия под любой дизайн.",
    specs: ["Высота от 2,8 до 3 м", "Ровные перекрытия", "Готово под чистовую"],
    image: "/blockanimation/woman-book.jpg",
  },
];

export default function ConstructionSpec() {
  return (
    <section
      id="construction"
      className="relative bg-ink px-6 py-24 sm:px-10 sm:py-32 lg:px-16"
    >
      <div className="mx-auto max-w-7xl">
        <RevealOnView variant="wipe" className="text-eyebrow uppercase text-bone-mute">
          Конструктив
        </RevealOnView>
        <RevealOnView
          as="div"
          variant="blur"
          delay={120}
          className="mt-6 max-w-3xl font-display font-semibold tracking-tightest text-balance text-bone"
        >
          <h2 style={{ fontSize: "clamp(34px, 5.4vw, 72px)", lineHeight: 0.98 }}>
            Из чего построен дом.
            <br />
            <span className="text-bone-mute">Надёжно, на десятилетия.</span>
          </h2>
        </RevealOnView>

        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2">
          {ITEMS.map((item, i) => (
            <RevealOnView
              key={item.index}
              variant={i % 2 === 0 ? "slide-left" : "slide-right"}
              delay={120 + i * 90}
              className="h-full"
            >
              <article className="group flex h-full flex-col overflow-hidden border border-bone/12 bg-ink-panel md:flex-row">
                <div className="relative aspect-[4/3] overflow-hidden md:aspect-auto md:w-2/5">
                  <img
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col p-7">
                  <div className="flex items-center justify-between">
                    <span className="text-eyebrow uppercase text-bone-mute">
                      {item.eyebrow}
                    </span>
                  </div>
                  <h3 className="mt-3 font-display text-2xl font-semibold tracking-tightest text-bone">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-bone-soft">
                    {item.body}
                  </p>
                  <ul className="mt-5 space-y-2 border-t border-bone/10 pt-4">
                    {item.specs.map((s) => (
                      <li key={s} className="flex items-center gap-3 text-sm text-bone-soft">
                        <span className="h-1 w-1 rounded-full bg-bone-mute" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            </RevealOnView>
          ))}
        </div>
      </div>
    </section>
  );
}
