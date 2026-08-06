"use client";

import { motion } from "framer-motion";
import RevealOnView from "@/components/RevealOnView";
import { useI18n } from "@/lib/i18n";

export default function CommercialInvestment() {
  const { t } = useI18n();

  return (
    <section className="relative border-t border-bone/10 bg-ink px-6 py-24 sm:px-10 sm:py-32 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <RevealOnView variant="wipe" className="text-eyebrow uppercase text-bone-mute mb-8">
          {t("invest.title")}
        </RevealOnView>

        <RevealOnView variant="blur" delay={100}>
          <div className="flex flex-col gap-10">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-semibold text-bone max-w-3xl leading-tight">
              {t("invest.subtitle")}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Обычные квартиры */}
              <div className="bg-ink-panel border border-bone/10 rounded-2xl p-6 sm:p-8 flex flex-col justify-between transition-colors duration-500 hover:border-bone/30">
                <div>
                  <div className="w-12 h-12 bg-ink border border-bone/15 rounded-full flex items-center justify-center text-bone-soft">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                      <polyline points="9 22 9 12 15 12 15 22"></polyline>
                    </svg>
                  </div>
                  <h3 className="mt-6 text-2xl font-bold text-bone tracking-tight">{t("invest.apt.title1")}<br />{t("invest.apt.title2")}</h3>
                </div>

                <div className="grid grid-cols-2 gap-6 mt-10">
                  <div>
                    <div className="text-[11px] uppercase text-bone-dim font-bold tracking-widest">{t("invest.payback")}</div>
                    <div className="text-lg font-bold text-bone mt-1.5">{t("invest.payback.apt")}</div>
                  </div>
                  <div>
                    <div className="text-[11px] uppercase text-bone-dim font-bold tracking-widest">{t("invest.income")}</div>
                    <div className="text-lg font-bold text-bone mt-1.5">{t("invest.income.apt")}</div>
                  </div>
                  <div className="col-span-2">
                    <div className="text-[11px] uppercase text-bone-dim font-bold tracking-widest">{t("invest.yield")}</div>
                    <div className="text-lg font-bold text-bone mt-1.5">4–7%</div>
                  </div>
                </div>

                <p className="text-[11px] text-bone-soft mt-8 leading-relaxed font-medium border-t border-bone/10 pt-5">
                  {t("invest.desc.apt")}
                </p>
              </div>

              {/* Коммерческое помещение */}
              <div className="bg-bone rounded-2xl p-6 sm:p-8 flex flex-col justify-between text-ink relative overflow-hidden transition-transform duration-500 hover:-translate-y-1">
                {/* Абстрактный паттерн здания на фоне */}
                <div className="absolute right-0 bottom-0 opacity-5 pointer-events-none translate-x-1/4 translate-y-1/4">
                  <svg width="200" height="200" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 21h18v-2H3v2zm4-16h2v14H7V5zm6 0h2v14h-2V5zm-6-4h8v2H7V1z"/>
                    <rect x="5" y="7" width="14" height="12"/>
                  </svg>
                </div>

                <div className="relative z-10">
                  <div className="w-12 h-12 bg-ink/5 border border-ink/10 rounded-full flex items-center justify-center text-ink">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                    </svg>
                  </div>
                  <h3 className="mt-6 text-2xl font-bold tracking-tight">{t("invest.comm.title1")}<br />{t("invest.comm.title2")}</h3>
                </div>

                <div className="grid grid-cols-2 gap-6 mt-10 relative z-10">
                  <div>
                    <div className="text-[11px] uppercase text-ink/60 font-bold tracking-widest">{t("invest.payback")}</div>
                    <div className="text-lg font-bold mt-1.5">{t("invest.payback.comm")}</div>
                  </div>
                  <div>
                    <div className="text-[11px] uppercase text-ink/60 font-bold tracking-widest">{t("invest.income")}</div>
                    <div className="text-lg font-bold mt-1.5">{t("invest.income.comm")}</div>
                  </div>
                  <div className="col-span-2">
                    <div className="text-[11px] uppercase text-ink/60 font-bold tracking-widest">{t("invest.yield")}</div>
                    <div className="text-lg font-bold mt-1.5 text-emerald-700">10–15%</div>
                  </div>
                </div>

                <p className="text-[11px] text-ink/70 mt-8 leading-relaxed font-medium relative z-10 border-t border-ink/10 pt-5">
                  {t("invest.desc.comm")}
                </p>
              </div>
            </div>
          </div>
        </RevealOnView>
      </div>
    </section>
  );
}
