"use client";

import RevealOnView from "@/components/RevealOnView";
import { useI18n } from "@/lib/i18n";

export default function CommercialInvestment() {
  const { t } = useI18n();

  return (
    <section className="relative overflow-hidden border-t border-bone/10 bg-ink px-6 py-24 sm:px-10 sm:py-32 lg:px-16">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 right-0 h-[420px] w-[520px] rounded-full bg-bone/[0.04] blur-[120px]"
      />

      <div className="relative mx-auto max-w-6xl">
        <RevealOnView variant="wipe" className="text-eyebrow uppercase text-bone-mute">
          {t("invest.title")}
        </RevealOnView>

        <RevealOnView
          as="div"
          variant="blur"
          delay={100}
          className="mt-6 max-w-4xl font-display font-semibold tracking-tightest text-pretty text-bone"
        >
          <h2 style={{ fontSize: "clamp(30px, 4.8vw, 56px)", lineHeight: 1.02 }}>
            {t("invest.subtitle1")}
            <br />
            <span className="text-bone-mute">{t("invest.subtitle2")}</span>
          </h2>
        </RevealOnView>

        <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Обычные квартиры */}
          <RevealOnView variant="block" delay={160}>
            <article className="flex h-full flex-col justify-between border border-bone/10 bg-ink-panel p-7 sm:p-9 transition-colors duration-500 hover:border-bone/30">
              <div>
                <div className="text-eyebrow uppercase tracking-[0.18em] text-bone-dim">01</div>
                <h3
                  className="mt-4 font-display font-semibold tracking-tightest text-bone"
                  style={{ fontSize: "clamp(28px, 3.2vw, 40px)", lineHeight: 0.98 }}
                >
                  {t("invest.apt.title1")}
                  <br />
                  <span className="text-bone-mute">{t("invest.apt.title2")}</span>
                </h3>
              </div>

              <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-8">
                <Stat
                  label={t("invest.payback")}
                  value={t("invest.payback.apt")}
                />
                <Stat
                  label={t("invest.income")}
                  value={t("invest.income.apt")}
                />
                <div className="col-span-2 border-t border-bone/10 pt-6">
                  <div className="text-eyebrow uppercase tracking-[0.18em] text-bone-dim">
                    {t("invest.yield")}
                  </div>
                  <div
                    className="mt-2 font-display font-semibold tracking-tightest text-bone"
                    style={{ fontSize: "clamp(40px, 5vw, 56px)", lineHeight: 0.92 }}
                  >
                    4–7%
                  </div>
                </div>
              </div>

              <p className="mt-8 border-t border-bone/10 pt-5 text-[13px] leading-relaxed text-bone-soft">
                {t("invest.desc.apt")}
              </p>
            </article>
          </RevealOnView>

          {/* Коммерческое помещение */}
          <RevealOnView variant="block" delay={240}>
            <article className="relative flex h-full flex-col justify-between overflow-hidden bg-bone p-7 text-ink sm:p-9 transition-transform duration-500 hover:-translate-y-1">
              <div
                aria-hidden
                className="pointer-events-none absolute -right-8 -bottom-10 font-display text-[180px] font-semibold leading-none tracking-tightest text-ink/[0.06] select-none"
              >
                %
              </div>

              <div className="relative z-10">
                <div className="text-eyebrow uppercase tracking-[0.18em] text-ink/45">02</div>
                <h3
                  className="mt-4 font-display font-semibold tracking-tightest"
                  style={{ fontSize: "clamp(28px, 3.2vw, 40px)", lineHeight: 0.98 }}
                >
                  {t("invest.comm.title1")}
                  <br />
                  <span className="text-ink/55">{t("invest.comm.title2")}</span>
                </h3>
              </div>

              <div className="relative z-10 mt-12 grid grid-cols-2 gap-x-6 gap-y-8">
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
                <div className="col-span-2 border-t border-ink/10 pt-6">
                  <div className="text-eyebrow uppercase tracking-[0.18em] text-ink/45">
                    {t("invest.yield")}
                  </div>
                  <div
                    className="mt-2 font-display font-semibold tracking-tightest text-emerald-800"
                    style={{ fontSize: "clamp(40px, 5vw, 56px)", lineHeight: 0.92 }}
                  >
                    10–15%
                  </div>
                </div>
              </div>

              <p className="relative z-10 mt-8 border-t border-ink/10 pt-5 text-[13px] leading-relaxed text-ink/65">
                {t("invest.desc.comm")}
              </p>
            </article>
          </RevealOnView>
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
        className={`text-eyebrow uppercase tracking-[0.18em] ${
          dark ? "text-ink/45" : "text-bone-dim"
        }`}
      >
        {label}
      </div>
      <div
        className={`mt-2 font-display font-semibold tracking-tightest ${
          dark ? "text-ink" : "text-bone"
        }`}
        style={{ fontSize: "clamp(20px, 2.2vw, 26px)", lineHeight: 1.05 }}
      >
        {value}
      </div>
    </div>
  );
}
