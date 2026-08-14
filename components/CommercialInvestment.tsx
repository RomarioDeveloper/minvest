"use client";

import RevealOnView from "@/components/RevealOnView";
import { useI18n } from "@/lib/i18n";

export default function CommercialInvestment() {
  const { t } = useI18n();

  return (
    <section className="relative overflow-hidden border-t border-bone/10 bg-ink px-6 py-24 sm:px-10 sm:py-32 lg:px-16">
      {/* Мягкое фоновое свечение */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 right-0 h-[600px] w-[800px] rounded-full bg-bone/[0.03] blur-[150px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-0 h-[500px] w-[600px] rounded-full bg-emerald-900/[0.04] blur-[150px]"
      />

      <div className="relative mx-auto max-w-7xl">
        <div className="grid gap-16 lg:grid-cols-[1fr_1.2fr] lg:items-start lg:gap-24">
          {/* Левая колонка: Заголовок */}
          <div className="lg:sticky lg:top-32">
            <RevealOnView variant="wipe" className="text-eyebrow uppercase tracking-widest text-bone-mute">
              {t("invest.title")}
            </RevealOnView>

            <RevealOnView
              as="div"
              variant="blur"
              delay={100}
              className="mt-8 font-display font-semibold tracking-tightest text-balance text-bone"
            >
              <h2 style={{ fontSize: "clamp(36px, 5vw, 64px)", lineHeight: 1.05 }}>
                {t("invest.subtitle1")}
                <br />
                <span className="text-bone-mute">{t("invest.subtitle2")}</span>
              </h2>
            </RevealOnView>

            <RevealOnView variant="blur" delay={200} className="mt-10 hidden lg:block">
              <p className="max-w-md text-base leading-relaxed text-bone-soft">
                {t("invest.intro")}
              </p>
            </RevealOnView>
          </div>

          {/* Правая колонка: Карточки */}
          <div className="grid gap-6 sm:gap-8">
            {/* Карточка 1: Обычные квартиры */}
            <RevealOnView variant="block" delay={160}>
              <article className="group relative overflow-hidden rounded-[2rem] border border-bone/10 bg-ink-panel p-8 transition-all duration-500 hover:border-bone/30 sm:p-10">
                {/* Декоративный градиент при наведении */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-bone/[0.03] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                <div className="relative z-10 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
                  <div>
                    <div className="flex items-center gap-4">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full border border-bone/20 bg-ink text-xs font-bold text-bone-mute">
                        01
                      </span>
                      <h3 className="font-display text-2xl font-semibold tracking-tight text-bone sm:text-3xl">
                        {t("invest.apt.title1")} {t("invest.apt.title2")}
                      </h3>
                    </div>
                  </div>
                  
                  <div className="text-left sm:text-right">
                    <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-bone-dim">
                      {t("invest.yield")}
                    </div>
                    <div className="mt-1 font-display text-4xl font-semibold tracking-tightest text-bone sm:text-5xl">
                      4–7<span className="text-bone-mute">%</span>
                    </div>
                  </div>
                </div>

                <div className="relative z-10 mt-10 grid grid-cols-2 gap-6 border-t border-bone/10 pt-8 sm:mt-12 sm:gap-10">
                  <Stat
                    label={t("invest.payback")}
                    value={t("invest.payback.apt")}
                  />
                  <Stat
                    label={t("invest.income")}
                    value={t("invest.income.apt")}
                  />
                </div>

                <p className="relative z-10 mt-8 max-w-2xl text-sm leading-relaxed text-bone-soft sm:mt-10">
                  {t("invest.desc.apt")}
                </p>
              </article>
            </RevealOnView>

            {/* Карточка 2: Коммерческое помещение */}
            <RevealOnView variant="block" delay={240}>
              <article className="group relative overflow-hidden rounded-[2rem] bg-bone p-8 text-ink transition-transform duration-500 hover:-translate-y-1 sm:p-10 shadow-2xl shadow-bone/5">
                {/* Абстрактный фон */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute -right-10 -top-10 font-display text-[240px] font-bold leading-none tracking-tighter text-ink/[0.03] select-none transition-transform duration-700 group-hover:scale-110 group-hover:text-ink/[0.04]"
                >
                  %
                </div>

                <div className="relative z-10 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
                  <div>
                    <div className="flex items-center gap-4">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full border border-ink/20 bg-bone-soft text-xs font-bold text-ink/60">
                        02
                      </span>
                      <h3 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
                        {t("invest.comm.title1")} {t("invest.comm.title2")}
                      </h3>
                    </div>
                  </div>
                  
                  <div className="text-left sm:text-right">
                    <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink/50">
                      {t("invest.yield")}
                    </div>
                    <div className="mt-1 font-display text-4xl font-semibold tracking-tightest text-emerald-800 sm:text-5xl">
                      10–15<span className="text-emerald-800/50">%</span>
                    </div>
                  </div>
                </div>

                <div className="relative z-10 mt-10 grid grid-cols-2 gap-6 border-t border-ink/10 pt-8 sm:mt-12 sm:gap-10">
                  <Stat
                    label={t("invest.payback")}
                    value={t("invest.payback.comm")}
                    dark
                  />
                  <Stat
                    label={t("invest.income")}
                    value={t("invest.income.comm")}
                    dark
                  />
                </div>

                <p className="relative z-10 mt-8 max-w-2xl text-sm leading-relaxed text-ink/70 sm:mt-10">
                  {t("invest.desc.comm")}
                </p>
              </article>
            </RevealOnView>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({
  label,
  value,
  dark = false,
}: {
  label: string;
  value: string;
  dark?: boolean;
}) {
  return (
    <div>
      <div
        className={`text-[10px] font-bold uppercase tracking-[0.2em] ${
          dark ? "text-ink/50" : "text-bone-dim"
        }`}
      >
        {label}
      </div>
      <div
        className={`mt-2 font-display text-xl font-semibold tracking-tight sm:text-2xl ${
          dark ? "text-ink" : "text-bone"
        }`}
      >
        {value}
      </div>
    </div>
  );
}