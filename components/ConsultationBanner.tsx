"use client";

import { motion } from "framer-motion";
import RevealOnView from "@/components/RevealOnView";
import { useI18n } from "@/lib/i18n";

export default function ConsultationBanner() {
  const { t, lang } = useI18n();

  return (
    <section className="relative bg-ink px-6 pb-24 sm:px-10 sm:pb-32 lg:px-16">
      <div className="mx-auto max-w-5xl">
        <RevealOnView variant="zoom" delay={200}>
          <div className="relative overflow-hidden rounded-[32px] bg-ink-panel border border-bone/10 px-8 py-10 sm:px-14 sm:py-12 flex flex-col md:flex-row items-center justify-between gap-10">
            
            <motion.div
              className="relative z-10 w-36 shrink-0 sm:w-44 md:w-52"
              animate={{ y: [-4, 4, -4] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <img
                src={`/${encodeURIComponent("Gemini_Generated_Image_y7l4imy7l4imy7l4-removebg-preview.png")}`}
                alt=""
                className="h-auto w-full select-none object-contain"
                draggable={false}
              />
            </motion.div>

            {/* Контент и кнопка */}
            <div className="flex-1 flex flex-col md:flex-row items-center md:items-start md:justify-between w-full gap-8 text-center md:text-left z-10">
              <div className="max-w-md">
                <h3 className="font-display text-xl sm:text-2xl font-semibold text-bone leading-tight">
                  {t("consult.title")}
                </h3>
                <p className="mt-3 text-sm text-bone-soft">
                  {t("consult.desc")}
                </p>
              </div>

              <a
                href={`/${lang}#contact`}
                className="shrink-0 group inline-flex items-center gap-3 rounded-full bg-bone px-6 py-4 text-[13px] font-bold tracking-widest uppercase text-ink transition-all hover:bg-bone-soft"
              >
                {t("consult.btn")}
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </a>
            </div>
            
            {/* Декоративное свечение */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-bone/[0.02] rounded-full blur-[60px] pointer-events-none z-0" />
          </div>
        </RevealOnView>
      </div>
    </section>
  );
}
