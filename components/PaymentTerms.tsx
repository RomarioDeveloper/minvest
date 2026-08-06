"use client";

import { motion } from "framer-motion";
import RevealOnView from "@/components/RevealOnView";
import { useI18n } from "@/lib/i18n";

export default function PaymentTerms() {
  const { t } = useI18n();

  return (
    <section
      id="payment"
      className="relative overflow-hidden border-t border-bone/10 bg-ink px-6 py-24 sm:px-10 sm:py-32 lg:px-16"
    >
      {/* Мягкое свечение на фоне */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-bone/[0.03] blur-[120px]" />

      <div className="relative mx-auto max-w-7xl">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
          
          {/* Левая часть: Типографика и контент */}
          <div>
            <RevealOnView variant="wipe" className="text-eyebrow uppercase text-bone-mute">
              {t("payment.title")}
            </RevealOnView>
            
            <RevealOnView
              as="div"
              variant="blur"
              delay={100}
              className="mt-6 font-display font-semibold tracking-tightest text-balance text-bone"
            >
              <h2 style={{ fontSize: "clamp(34px, 5.4vw, 64px)", lineHeight: 1.05 }}>
                {t("payment.subtitle1")}
                <br />
                <span className="text-bone-mute">{t("payment.subtitle2")}</span>
              </h2>
            </RevealOnView>

            <RevealOnView delay={200} className="mt-10 space-y-8 max-w-md">
              <div className="flex gap-5">
                <div className="flex shrink-0 h-12 w-12 items-center justify-center rounded-full border border-bone/15 bg-ink-panel text-bone shadow-sm">
                  <span className="font-display text-lg font-bold">50%</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-bone">{t("payment.step1.title")}</h3>
                  <p className="mt-1 text-sm text-bone-soft leading-relaxed">
                    {t("payment.step1.desc")}
                  </p>
                </div>
              </div>

              <div className="flex gap-5">
                <div className="flex shrink-0 h-12 w-12 items-center justify-center rounded-full border border-bone/15 bg-ink-panel text-bone shadow-sm">
                  <span className="font-display text-lg font-bold">0%</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-bone">{t("payment.step2.title")}</h3>
                  <p className="mt-1 text-sm text-bone-soft leading-relaxed">
                    {t("payment.step2.desc")}
                  </p>
                </div>
              </div>
            </RevealOnView>

            <RevealOnView delay={300} className="mt-12">
              <a
                href="#contact"
                className="group inline-flex items-center gap-3 rounded-full bg-bone py-3.5 pl-6 pr-5 text-[13px] font-semibold tracking-[0.04em] text-ink transition-colors duration-300 hover:bg-bone-soft"
              >
                {t("payment.calc")}
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </a>
            </RevealOnView>
          </div>

          {/* Правая часть: Визуализация (Чёрная карточка под углом) */}
          <RevealOnView variant="blur" delay={300} className="relative flex justify-center lg:justify-end perspective-[1000px] mt-10 lg:mt-0">
            {/* Декоративное свечение за карточкой */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] h-[250px] sm:w-[350px] sm:h-[350px] bg-bone/5 rounded-full blur-[80px] pointer-events-none z-0" />
            
            <motion.div 
              className="relative z-10 w-[320px] h-[200px] sm:w-[420px] sm:h-[260px] rounded-2xl p-6 sm:p-8 flex flex-col justify-between"
              style={{
                background: "linear-gradient(135deg, #27272a 0%, #09090b 100%)",
                boxShadow: "0 30px 60px -15px rgba(0, 0, 0, 0.8), inset 0 1px 1px rgba(255, 255, 255, 0.15), inset 0 -1px 1px rgba(0, 0, 0, 0.5)",
                transformStyle: "preserve-3d"
              }}
              animate={{
                rotateX: [12, 4, 12],
                rotateY: [-22, -12, -22],
                y: [-8, 8, -8]
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              {/* Шум на карте (если есть) */}
              <div className="pointer-events-none absolute inset-0 opacity-[0.04] mix-blend-overlay rounded-2xl bg-[url('/noise.webp')]" />
              
              {/* Блик стекла */}
              <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-tr from-white/[0.07] via-transparent to-transparent" />

              {/* Верхняя часть карты (Чип и значок бесконтактной оплаты) */}
              <div className="relative z-10 flex justify-between items-start">
                <div className="h-10 w-12 sm:h-12 sm:w-14 rounded-md border border-amber-900/30 bg-gradient-to-br from-amber-500/40 to-amber-700/40 shadow-inner flex items-center justify-center overflow-hidden relative">
                  {/* Линии на чипе */}
                  <div className="absolute w-full h-[1px] bg-amber-900/40 top-[30%]" />
                  <div className="absolute w-full h-[1px] bg-amber-900/40 top-[70%]" />
                  <div className="absolute h-full w-[1px] bg-amber-900/40 left-[30%]" />
                  <div className="absolute h-full w-[1px] bg-amber-900/40 left-[70%]" />
                </div>
                
                {/* Значок бесконтактной оплаты */}
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-bone-mute/40 sm:w-8 sm:h-8">
                  <path d="M8.5 21.6C4 18 1 12.5 1 6.5" />
                  <path d="M12.5 20.2C9 17.2 6.5 12.5 6.5 7.5" />
                  <path d="M16.5 18.7c-2.5-2.5-4-6-4-10" />
                  <path d="M20.5 17c-1.5-2-2.5-4.5-2.5-7.5" />
                </svg>
              </div>

              {/* Нижняя часть карты (Название и VIP) */}
              <div className="relative z-10">
                <div className="font-display text-xl sm:text-2xl font-bold tracking-[0.1em] text-bone-soft opacity-90 drop-shadow-md">
                  {t("payment.card.title")}
                </div>
                <div className="mt-4 sm:mt-6 flex justify-between items-end">
                  <div className="text-[11px] sm:text-[13px] font-semibold tracking-widest text-bone-mute uppercase">
                    Malaysary Invest
                  </div>
                  <div className="text-[9px] sm:text-[11px] font-bold tracking-[0.2em] text-amber-500/80 uppercase">
                    VIP
                  </div>
                </div>
              </div>
            </motion.div>
          </RevealOnView>

        </div>
      </div>
    </section>
  );
}
