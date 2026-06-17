"use client";

import { useState } from "react";
import RevealOnView from "@/components/RevealOnView";
import { OBJECTS, STATUS_LABEL, type ObjectStatus, type RealtyObject } from "@/lib/objects";

type Filter = "all" | ObjectStatus;

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "Все" },
  { id: "sales", label: "В продаже" },
  { id: "soon", label: "Скоро" },
  { id: "done", label: "Сданы" },
];

const statusDot: Record<ObjectStatus, string> = {
  sales: "bg-emerald-400",
  soon: "bg-amber-400",
  done: "bg-bone-dim",
};

export default function ObjectsCatalog() {
  const [filter, setFilter] = useState<Filter>("all");
  const visible = OBJECTS.filter((o) => filter === "all" || o.status === filter);

  return (
    <section
      id="objects"
      className="relative border-y border-bone/10 bg-ink px-6 py-24 sm:px-10 sm:py-32 lg:px-16"
    >
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <RevealOnView className="text-eyebrow uppercase text-bone-mute">
              Каталог объектов
            </RevealOnView>
            <RevealOnView
              as="div"
              delay={120}
              className="mt-6 max-w-3xl font-display font-semibold tracking-tightest text-balance text-bone"
            >
              <h2 style={{ fontSize: "clamp(34px, 5.4vw, 72px)", lineHeight: 0.98 }}>
                {OBJECTS.length} объектов
                <br />
                <span className="text-bone-mute">в одном застройщике.</span>
              </h2>
            </RevealOnView>
          </div>

          <RevealOnView delay={200} className="flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`border px-4 py-2 text-eyebrow uppercase transition ${
                  filter === f.id
                    ? "border-bone bg-bone text-ink"
                    : "border-bone/20 text-bone-soft hover:border-bone/50"
                }`}
              >
                {f.label}
              </button>
            ))}
          </RevealOnView>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((o, i) => (
            <RevealOnView key={o.slug} delay={120 + i * 80} className="h-full">
              <ObjectCard obj={o} />
            </RevealOnView>
          ))}
        </div>
      </div>
    </section>
  );
}

function ObjectCard({ obj }: { obj: RealtyObject }) {
  return (
    <a
      href="#contact"
      className="group flex h-full flex-col overflow-hidden border border-bone/12 bg-ink-panel transition hover:border-bone/30"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={obj.image}
          alt={obj.name}
          loading="lazy"
          className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
        <div className="absolute left-4 top-4 flex items-center gap-2 bg-ink/70 px-3 py-1.5 backdrop-blur-sm">
          <span className={`h-1.5 w-1.5 rounded-full ${statusDot[obj.status]}`} />
          <span className="text-eyebrow uppercase text-bone-soft">
            {STATUS_LABEL[obj.status]}
          </span>
        </div>
        {obj.flagship && (
          <div className="absolute right-4 top-4 bg-bone px-3 py-1.5 text-eyebrow uppercase text-ink">
            Флагман
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="text-eyebrow uppercase text-bone-dim">{obj.district}</div>
        <h3 className="mt-2 font-display text-2xl font-semibold tracking-tightest text-bone">
          {obj.name}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-bone-soft">{obj.tagline}</p>

        <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-3 border-t border-bone/10 pt-5 text-sm">
          <Spec label="Этажность" value={`${obj.floors} этажей`} />
          <Spec label="Квартир" value={`${obj.apartments}`} />
          <Spec label="Планировки" value={obj.rooms} />
          <Spec label="Срок сдачи" value={obj.deadline} />
        </dl>

        <div className="mt-6 flex items-end justify-between border-t border-bone/10 pt-5">
          <div>
            <div className="text-eyebrow uppercase text-bone-dim">Цена от</div>
            <div className="mt-1 font-display text-xl font-semibold tracking-tightest text-bone">
              {obj.priceFrom} млн ₸
            </div>
          </div>
          <span className="text-eyebrow uppercase text-bone-mute transition group-hover:text-bone">
            Подробнее →
          </span>
        </div>
      </div>
    </a>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-eyebrow uppercase text-bone-dim">{label}</dt>
      <dd className="mt-1 font-medium text-bone">{value}</dd>
    </div>
  );
}
