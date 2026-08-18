"use client";

import RevealOnView from "@/components/RevealOnView";
import { useI18n } from "@/lib/i18n";

export default function ConsultationBanner() {
  const { t, lang } = useI18n();

  return (
    <section className="relative bg-ink px-6 pb-24 sm:px-10 sm:pb-32 lg:px-16">
      <div className="mx-auto max-w-5xl">
        <RevealOnView variant="zoom" delay={200}>
          <div className="relative overflow-hidden rounded-[32px] border border-bone/10 bg-ink-panel">
            <div className="flex flex-col items-center md:flex-row md:items-end">
              <div className="relative z-10 w-[210px] shrink-0 pt-6 sm:w-[240px] md:w-[300px] md:pt-6 lg:w-[340px]">
                <img
                  src="/consult-character-down.webp"
                  alt=""
                  className="mx-auto block h-auto w-full select-none object-contain object-bottom md:hidden"
                  draggable={false}
                />
                <img
                  src="/consult-character.webp"
                  alt=""
                  className="mx-auto hidden h-auto w-full select-none object-contain object-bottom md:block"
                  draggable={false}
                />
              </div>

              <div className="relative z-10 flex flex-1 flex-col items-center justify-center gap-7 px-8 pb-10 pt-6 text-center sm:px-12 md:py-12">
                <div className="max-w-md">
                  <h3 className="font-display text-xl font-semibold leading-tight text-bone sm:text-2xl">
                    {t("consult.title")}
                  </h3>
                  <p className="mt-3 text-sm text-bone-soft">
                    {t("consult.desc")}
                  </p>
                </div>

                <a
                  href={`/${lang}#contact`}
                  className="group inline-flex shrink-0 items-center gap-3 rounded-full bg-bone px-6 py-4 text-[13px] font-bold uppercase tracking-widest text-ink transition-all hover:bg-bone-soft"
                >
                  {t("consult.btn")}
                  <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </a>
              </div>
            </div>

            <div className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-bone/[0.02] blur-[60px]" />
          </div>
        </RevealOnView>
      </div>
    </section>
  );
}
