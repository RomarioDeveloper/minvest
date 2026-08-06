"use client";

import { motion } from "framer-motion";
import RevealOnView from "@/components/RevealOnView";

export default function ConsultationBanner() {
  return (
    <section className="relative bg-ink px-6 pb-24 sm:px-10 sm:pb-32 lg:px-16">
      <div className="mx-auto max-w-5xl">
        <RevealOnView variant="zoom" delay={200}>
          <div className="relative overflow-hidden rounded-[32px] bg-ink-panel border border-bone/10 px-8 py-10 sm:px-14 sm:py-12 flex flex-col md:flex-row items-center justify-between gap-10">
            
            {/* Анимированный персонаж (плейсхолдер) */}
            <div className="relative flex shrink-0 items-center justify-center">
              <motion.div 
                className="relative z-10 w-28 h-28 sm:w-32 sm:h-32 bg-ink border border-bone/15 rounded-full flex items-center justify-center shadow-inner"
                animate={{ y: [-5, 5, -5] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <span className="text-5xl sm:text-6xl" role="img" aria-label="Консультант">💁‍♀️</span>
                
                {/* Указательный палец вправо */}
                <motion.div 
                  className="absolute -right-4 top-1/2 -translate-y-1/2 text-4xl"
                  animate={{ x: [0, 10, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  👉
                </motion.div>
              </motion.div>
              
              {/* Декоративные круги позади */}
              <div className="absolute inset-0 border border-bone/5 rounded-full scale-150 animate-pulse pointer-events-none" />
              <div className="absolute inset-0 border border-bone/5 rounded-full scale-125 pointer-events-none" />
              
              {/* Подпись для заказчика */}
              <div className="absolute -bottom-8 whitespace-nowrap text-[9px] uppercase tracking-widest text-bone-dim font-bold">
                Персонаж обсуждается
              </div>
            </div>

            {/* Контент и кнопка */}
            <div className="flex-1 flex flex-col md:flex-row items-center md:items-start md:justify-between w-full gap-8 text-center md:text-left z-10">
              <div className="max-w-md">
                <h3 className="font-display text-xl sm:text-2xl font-semibold text-bone leading-tight">
                  Нужна консультация по выбору помещения?
                </h3>
                <p className="mt-3 text-sm text-bone-soft">
                  Мы поможем вам быстро найти подходящий вариант под ваши задачи и бюджет.
                </p>
              </div>

              <a
                href="#contact"
                className="shrink-0 group inline-flex items-center gap-3 rounded-full bg-bone px-6 py-4 text-[13px] font-bold tracking-widest uppercase text-ink transition-all hover:bg-bone-soft"
              >
                Оставить заявку
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
