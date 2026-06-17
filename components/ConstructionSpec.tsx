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
    title: "Керамический кирпич",
    body: "Несущие стены и межквартирные перегородки из полнотелого кирпича — лучшая звукоизоляция и тепло.",
    specs: ["Толщина стен 510 мм", "Класс энергоэффективности A", "Без газоблока в несущих"],
    image: "/photos/exterior/884b9cde6abe5acff6acdca51ff98611_01bb4eba-a93d-4e21-b418-5b7cc51b79ab.webp",
  },
  {
    index: "02",
    eyebrow: "Окна",
    title: "Тёплое остекление",
    body: "Двухкамерные стеклопакеты с энергосберегающим напылением и широкий профиль — тихо и тепло.",
    specs: ["2-камерный стеклопакет", "Профиль 70 мм", "Микропроветривание"],
    image: "/photos/entrance/124ff09e7dc6c177fbe814461e08cdf1_db043c37-390e-4974-9f33-d8e943653299.webp",
  },
  {
    index: "03",
    eyebrow: "Двери",
    title: "Входные группы",
    body: "Стальные входные двери в квартиры и остеклённые подъездные группы с домофоном и доводчиком.",
    specs: ["Сейф-двери в квартиры", "Витражные входы", "Видеодомофон"],
    image: "/photos/entrance/4adedb6da6327883ce2ea4f732eb86fd_6a83d1d0-68a8-4c80-833c-98dfff0b3088.webp",
  },
  {
    index: "04",
    eyebrow: "Потолки",
    title: "Высота и свет",
    body: "Потолки от 2,9 м, ровные монолитные перекрытия — простор для любого дизайна и освещения.",
    specs: ["Высота от 2,9 м", "Монолитные перекрытия", "Готово под чистовую"],
    image: "/photos/entrance/a1363237a0b8e8b582fb3403ecdb66ff_3ea6281a-adc0-4b89-841f-70f6c62204d0.webp",
  },
];

export default function ConstructionSpec() {
  return (
    <section
      id="construction"
      className="relative bg-ink px-6 py-24 sm:px-10 sm:py-32 lg:px-16"
    >
      <div className="mx-auto max-w-7xl">
        <RevealOnView className="text-eyebrow uppercase text-bone-mute">
          Конструктив
        </RevealOnView>
        <RevealOnView
          as="div"
          delay={120}
          className="mt-6 max-w-3xl font-display font-semibold tracking-tightest text-balance text-bone"
        >
          <h2 style={{ fontSize: "clamp(34px, 5.4vw, 72px)", lineHeight: 0.98 }}>
            Из чего построен дом.
            <br />
            <span className="text-bone-mute">Честно, до миллиметра.</span>
          </h2>
        </RevealOnView>

        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2">
          {ITEMS.map((item, i) => (
            <RevealOnView key={item.index} delay={120 + i * 90} className="h-full">
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
                    <span className="font-display text-lg font-semibold text-bone/20">
                      {item.index}
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
