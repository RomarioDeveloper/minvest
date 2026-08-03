"use client";

import { motion } from "framer-motion";
import RevealOnView from "@/components/RevealOnView";

export default function ConsultationBanner() {
  return (
    <section className="relative bg-ink px-6 pb-24 sm:px-10 sm:pb-32 lg:px-16">
      <div className="mx-auto max-w-5xl">
        <RevealOnView variant="zoom" delay={200}>
          <div className="relative overflow-hidden rounded-[32px] bg-[#4F46E5] px-8 py-10 sm:px-14 sm:py-12 flex flex-col md:flex-row items-center justify-between gap-10 shadow-[0_20px_40px_-15px_rgba(79,70,229,0.4)]">
            
            {/* Анимированный персонаж (плейсхолдер) */}
            <div className="relative flex shrink-0 items-center justify-center">
              <motion.div 
                className="relative z-10 w-28 h-28 sm:w-32 sm:h-32 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20"
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
              <div className="absolute inset-0 bg-white/5 rounded-full scale-150 animate-pulse pointer-events-none" />
              <div className="absolute inset-0 bg-white/5 rounded-full scale-110 pointer-events-none" />
              
              {/* Подпись для заказчика */}
              <div className="absolute -bottom-8 whitespace-nowrap text-[9px] uppercase tracking-widest text-white/40 font-bold">
                Персонаж обсуждается
              </div>
            </div>

            {/* Контент и кнопка */}
            <div className="flex-1 flex flex-col md:flex-row items-center md:items-start md:justify-between w-full gap-8 text-center md:text-left z-10">
              <div className="max-w-md">
                <h3 className="font-display text-xl sm:text-2xl font-bold text-white leading-tight">
                  Нужна консультация по выбору помещения?
                </h3>
                <p className="mt-3 text-sm text-indigo-200">
                  Мы поможем вам быстро найти подходящий вариант под ваши задачи и бюджет.
                </p>
              </div>

              <a
                href="#contact"
                className="shrink-0 group inline-flex items-center gap-3 rounded-full bg-white px-6 py-4 text-[13px] font-bold tracking-widest uppercase text-[#4F46E5] transition-all hover:bg-bone-soft hover:shadow-lg hover:shadow-white/20"
              >
                Оставить заявку
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </a>
            </div>
            
            {/* Декоративный паттерн */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 opacity-20 pointer-events-none">
              <svg width="400" height="400" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <path fill="#FFFFFF" d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,81.1,-46.3C90.4,-33.5,96,-18,95.4,-2.8C94.8,12.4,88.1,27.3,78.2,39.3C68.3,51.3,55.1,60.4,41.2,67.3C27.3,74.2,12.7,78.9,-1.9,82C-16.5,85.1,-33.1,86.6,-46.8,80.1C-60.5,73.6,-71.4,59,-78.9,43.3C-86.4,27.6,-90.6,10.8,-88.7,-5.4C-86.8,-21.6,-78.8,-37.2,-68,-49.4C-57.2,-61.6,-43.5,-70.4,-29.6,-77.3C-15.7,-84.2,0.6,-89.2,16.2,-87C31.8,-84.8,44.7,-76.4,44.7,-76.4Z" transform="translate(100 100) scale(1.1)" />
              </svg>
            </div>
          </div>
        </RevealOnView>
      </div>
    </section>
  );
}
