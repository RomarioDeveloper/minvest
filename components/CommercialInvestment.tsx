"use client";

import { motion } from "framer-motion";
import RevealOnView from "@/components/RevealOnView";

export default function CommercialInvestment() {
  return (
    <section className="relative border-t border-bone/10 bg-ink px-6 py-24 sm:px-10 sm:py-32 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <RevealOnView variant="wipe" className="text-eyebrow uppercase text-bone-mute mb-8">
          Инвестиции
        </RevealOnView>

        <RevealOnView variant="zoom" delay={100}>
          <div className="rounded-3xl bg-bone p-6 sm:p-10 shadow-2xl flex flex-col gap-10">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-display font-semibold text-ink max-w-3xl leading-tight">
              Ваши вложения могут стать источником стабильного дохода, который начнёт работать на вас на долгие годы
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Обычные квартиры */}
              <div className="bg-[#f4f4f5] rounded-2xl p-6 sm:p-8 flex flex-col justify-between transition-transform duration-500 hover:-translate-y-1">
                <div>
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-ink">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                      <polyline points="9 22 9 12 15 12 15 22"></polyline>
                    </svg>
                  </div>
                  <h3 className="mt-6 text-2xl font-bold text-ink tracking-tight">Обычные<br />квартиры</h3>
                </div>

                <div className="grid grid-cols-2 gap-6 mt-10">
                  <div>
                    <div className="text-[11px] uppercase text-ink/50 font-bold tracking-widest">Окупаемость</div>
                    <div className="text-lg font-bold text-ink mt-1.5">15–20 лет</div>
                  </div>
                  <div>
                    <div className="text-[11px] uppercase text-ink/50 font-bold tracking-widest">Доход в год</div>
                    <div className="text-lg font-bold text-ink mt-1.5">1.7–2.5 млн ₸</div>
                  </div>
                  <div className="col-span-2">
                    <div className="text-[11px] uppercase text-ink/50 font-bold tracking-widest">Доходность</div>
                    <div className="text-lg font-bold text-ink mt-1.5">4–7%</div>
                  </div>
                </div>

                <p className="text-[11px] text-ink/40 mt-8 leading-relaxed font-medium">
                  Срок окупаемости — до 20 лет. Среднегодовая прибыль — до 2.5 млн тенге. Доходность — в среднем около 5%.
                </p>
              </div>

              {/* Коммерческое помещение */}
              <div className="bg-[#4F46E5] rounded-2xl p-6 sm:p-8 flex flex-col justify-between text-white relative overflow-hidden transition-transform duration-500 hover:-translate-y-1 shadow-[0_20px_40px_-15px_rgba(79,70,229,0.5)]">
                {/* Абстрактный паттерн здания на фоне */}
                <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none translate-x-1/4 translate-y-1/4">
                  <svg width="200" height="200" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 21h18v-2H3v2zm4-16h2v14H7V5zm6 0h2v14h-2V5zm-6-4h8v2H7V1z"/>
                    <rect x="5" y="7" width="14" height="12"/>
                  </svg>
                </div>

                <div className="relative z-10">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                    </svg>
                  </div>
                  <h3 className="mt-6 text-2xl font-bold tracking-tight">Коммерческое<br />помещение</h3>
                </div>

                <div className="grid grid-cols-2 gap-6 mt-10 relative z-10">
                  <div>
                    <div className="text-[11px] uppercase text-white/60 font-bold tracking-widest">Окупаемость</div>
                    <div className="text-lg font-bold mt-1.5">7–10 лет</div>
                  </div>
                  <div>
                    <div className="text-[11px] uppercase text-white/60 font-bold tracking-widest">Доход в год</div>
                    <div className="text-lg font-bold mt-1.5">5–14 млн ₸</div>
                  </div>
                  <div className="col-span-2">
                    <div className="text-[11px] uppercase text-white/60 font-bold tracking-widest">Доходность</div>
                    <div className="text-lg font-bold mt-1.5 text-green-300">10–15%</div>
                  </div>
                </div>

                <p className="text-[11px] text-white/60 mt-8 leading-relaxed font-medium relative z-10">
                  Срок окупаемости — до 10 лет. Среднегодовая прибыль — до 14 млн тенге. Доходность — в среднем около 12%.
                </p>
              </div>
            </div>
          </div>
        </RevealOnView>
      </div>
    </section>
  );
}
