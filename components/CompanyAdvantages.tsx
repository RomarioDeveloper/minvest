"use client";

import RevealOnView from "@/components/RevealOnView";
import { BlobCard } from "@/components/ui/blob-card";
import { NumberTicker } from "@/components/ui/number-ticker";
import { useI18n } from "@/lib/i18n";

export default function CompanyAdvantages() {
  const { t } = useI18n();
  
  const STATS = [
    { value: 6, suffix: "", label: t("adv.stat1.label"), note: t("adv.stat1.note") },
    { value: 1200, suffix: "+", label: t("adv.stat2.label"), note: t("adv.stat2.note") },
    { value: 9, suffix: "", label: t("adv.stat3.label"), note: t("adv.stat3.note") },
    { value: 100, suffix: "%", label: t("adv.stat4.label"), note: t("adv.stat4.note") },
  ];

  const PERKS = [
    {
      title: t("adv.perk1.title"),
      body: t("adv.perk1.body"),
    },
    {
      title: t("adv.perk2.title"),
      body: t("adv.perk2.body"),
    },
    {
      title: t("adv.perk3.title"),
      body: t("adv.perk3.body"),
    },
    {
      title: t("adv.perk4.title"),
      body: t("adv.perk4.body"),
    },
  ];

  return (
    <section
      id="company"
      className="relative border-y border-bone/10 bg-ink-deep px-6 py-24 sm:px-10 sm:py-32 lg:px-16"
    >
      <div className="mx-auto max-w-7xl">
        <RevealOnView variant="wipe" className="text-eyebrow uppercase text-bone-mute">
          {t("adv.title")}
        </RevealOnView>
        <RevealOnView
          as="div"
          variant="blur"
          delay={120}
          className="mt-6 max-w-4xl font-display font-semibold tracking-tightest text-balance text-bone"
        >
          <h2 style={{ fontSize: "clamp(34px, 5.4vw, 72px)", lineHeight: 0.98 }}>
            {t("adv.subtitle1")}
            <br />
            <span className="text-bone-mute">{t("adv.subtitle2")}</span>
          </h2>
        </RevealOnView>

        {/* Infographics */}
        <div className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((s, i) => (
            <RevealOnView key={s.label} variant="block" delay={160 + i * 100}>
              <BlobCard
                headerHeight={112}
                header={
                  <div className="flex items-baseline font-display font-semibold tracking-tightest text-bone">
                    <NumberTicker
                      value={s.value}
                      delay={0.15 + i * 0.12}
                      className="text-5xl leading-none sm:text-6xl"
                    />
                    {s.suffix && (
                      <span className="ml-1 text-3xl leading-none text-bone-mute sm:text-4xl">
                        {s.suffix}
                      </span>
                    )}
                  </div>
                }
              >
                <div className="px-6 pb-6 sm:px-7 sm:pb-7">
                  <div className="border-t border-bone/10 pt-4">
                    <div className="text-[13px] font-semibold text-bone-soft">{s.label}</div>
                    <div className="mt-1 text-[12px] text-bone-dim">{s.note}</div>
                  </div>
                </div>
              </BlobCard>
            </RevealOnView>
          ))}
        </div>

        {/* Perks */}
        <div className="mt-20 grid grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-2">
          {PERKS.map((p, i) => (
            <RevealOnView
              key={p.title}
              variant={i % 2 === 0 ? "slide-left" : "slide-right"}
              delay={140 + i * 80}
              className="flex gap-5"
            >
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
