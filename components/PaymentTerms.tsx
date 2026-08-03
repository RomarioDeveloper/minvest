"use client";

import RevealOnView from "@/components/RevealOnView";

export default function PaymentTerms() {
  return (
    <section
      id="payment"
      className="relative border-t border-bone/10 bg-ink-deep px-6 py-24 sm:px-10 sm:py-32 lg:px-16"
    >
      {/* Мягкое свечение */}
      <div className="pointer-events-none absolute -top-48 left-1/2 h-[480px] w-[820px] -translate-x-1/2 rounded-full bg-bone/[0.03] blur-[140px]" />

      <div className="relative mx-auto max-w-7xl">
        <div className="grid gap-16 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <RevealOnView variant="wipe" className="text-eyebrow uppercase text-bone-mute">
              Условия оплаты
            </RevealOnView>
            <RevealOnView
              as="div"
              variant="blur"
              delay={120}
              className="mt-6 max-w-3xl font-display font-semibold tracking-tightest text-balance text-bone"
            >
              <h2 style={{ fontSize: "clamp(34px, 5.4vw, 72px)", lineHeight: 0.98 }}>
                Выгодная рассрочка
                <br />
                <span className="text-bone-mute">от застройщика.</span>
              </h2>
            </RevealOnView>
          </div>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2">
          {/* Блок 1: Первый взнос */}
          <RevealOnView variant="block" delay={200}>
            <div className="flex h-full flex-col border border-bone/12 bg-ink-panel p-8 transition hover:border-bone/30">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-bone/15 bg-ink text-bone-soft">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="font-display text-4xl font-semibold tracking-tightest text-bone">
                  50%
                </div>
              </div>
              <div className="mt-8 border-t border-bone/10 pt-6">
                <h3 className="font-display text-xl font-medium tracking-tightest text-bone">Первый взнос</h3>
                <p className="mt-2 text-sm leading-relaxed text-bone-soft">
                  Оплачивается сразу при заключении договора для бронирования вашей квартиры.
                </p>
              </div>
            </div>
          </RevealOnView>

          {/* Блок 2: Остаток */}
          <RevealOnView variant="block" delay={300}>
            <div className="flex h-full flex-col border border-bone/12 bg-ink-panel p-8 transition hover:border-bone/30">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-bone/15 bg-ink text-bone-soft">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="12" cy="12" r="10" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 6v6l4 2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="font-display text-4xl font-semibold tracking-tightest text-bone">
                  12 – 24
                </div>
                <div className="text-sm font-medium uppercase tracking-widest text-bone-dim">месяца</div>
              </div>
              <div className="mt-8 border-t border-bone/10 pt-6">
                <h3 className="font-display text-xl font-medium tracking-tightest text-bone">Остаток 50% без переплат</h3>
                <p className="mt-2 text-sm leading-relaxed text-bone-soft">
                  Оформляется в честную рассрочку от застройщика — без участия банков, дополнительных процентов и комиссий.
                </p>
              </div>
            </div>
          </RevealOnView>
        </div>
        
        <RevealOnView delay={400} className="mt-12 flex justify-center sm:justify-start">
          <a
            href="#contact"
            className="group inline-flex items-center gap-3 rounded-full border border-bone/25 px-6 py-3.5 text-[13px] font-semibold tracking-[0.04em] text-bone transition-colors duration-300 hover:border-bone hover:bg-bone hover:text-ink"
          >
            Рассчитать график платежей
            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </a>
        </RevealOnView>
      </div>
    </section>
  );
}
