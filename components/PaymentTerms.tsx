"use client";

import RevealOnView from "@/components/RevealOnView";

export default function PaymentTerms() {
  return (
    <section
      id="payment"
      className="relative border-t border-bone/10 bg-ink px-6 py-24 sm:px-10 sm:py-32 lg:px-16"
    >
      <div className="mx-auto max-w-7xl">
        <RevealOnView variant="wipe" className="text-eyebrow uppercase text-bone-mute">
          Условия оплаты
        </RevealOnView>
        <RevealOnView
          as="div"
          variant="blur"
          delay={120}
          className="mt-6 max-w-4xl font-display font-semibold tracking-tightest text-balance text-bone"
        >
          <h2 style={{ fontSize: "clamp(30px, 4.8vw, 64px)", lineHeight: 0.98 }}>
            Выгодная рассрочка
            <br />
            <span className="text-bone-mute">от застройщика.</span>
          </h2>
        </RevealOnView>
        
        <RevealOnView delay={200} className="mt-8 max-w-2xl">
          <p className="text-lg sm:text-xl text-bone-soft leading-relaxed">
            50% оплачивается сразу и оставшиеся 50% в рассрочку на 12 - 24 месяца без процентов и переплат.
          </p>
        </RevealOnView>
      </div>
    </section>
  );
}
