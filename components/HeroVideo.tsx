"use client";

import EagerLoopVideo from "@/components/EagerLoopVideo";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

import { useI18n } from "@/lib/i18n";

type Props = {
  src: string;
};

/**
 * Full-bleed looping hero with a scroll-driven cinematic exit:
 *   • The video itself slowly zooms in as the user scrolls (depth illusion)
 *   • Title and subtitle drift up and fade with different speeds (parallax)
 *   • Vignette deepens, so the next section "fades through" the bottom
 *
 * This is the trick TAG Heuer / Apple Pro pages use: the hero doesn't just
 * scroll away, it transforms in place.
 */
export default function HeroVideo({ src }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const { t } = useI18n();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Layered transforms for the parallax feel
  const videoY = useTransform(scrollYProgress, [0, 1], ["0%", "0%"]);
  const titleY = useTransform(scrollYProgress, [0, 1], ["0%", "0%"]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 1]);
  const subtitleY = useTransform(scrollYProgress, [0, 1], ["0%", "0%"]);
  const subtitleOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 1]);
  const vignetteOpacity = useTransform(scrollYProgress, [0, 1], [0.55, 1]);

  return (
    <section
      ref={sectionRef}
      className="relative h-[100svh] min-h-[640px] w-full overflow-hidden bg-ink-deep"
    >
      <div
        className="absolute inset-0"
      >
        {/* Poster as base layer — instantly visible, then crossfaded under the video */}
        <img
          src={`${src}.jpg`}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover"
        />

        <EagerLoopVideo base={src} className="absolute inset-0 h-full w-full object-cover" />
      </div>

      {/* Vignette that deepens on scroll */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        style={{
          opacity: vignetteOpacity,
          background:
            "radial-gradient(ellipse at center, transparent 25%, rgba(0,0,0,0.6) 100%)",
        }}
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-ink-deep via-ink-deep/70 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[30%] bg-gradient-to-b from-ink-deep/70 via-ink-deep/20 to-transparent" />

      {/* Copy with multi-layer parallax */}
      <div className="relative z-10 flex h-full flex-col justify-end px-6 pb-20 sm:px-10 sm:pb-24 lg:px-16 lg:pb-28">
        <div className="max-w-5xl">
          <motion.div
            className="text-eyebrow uppercase text-bone-mute"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            {t("hero.start")}
          </motion.div>

          <motion.h1
            className="mt-5 font-display font-semibold text-bone tracking-tightest text-balance"
            style={{ fontSize: "clamp(48px, 9vw, 148px)", lineHeight: 0.9 }}
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.38, ease: [0.22, 1, 0.36, 1] }}
          >
            {t("hero.title1")}
            <br />
            <span className="text-bone-soft">{t("hero.title2")}</span>
          </motion.h1>

          <motion.p
            className="mt-6 max-w-xl text-pretty text-bone-soft"
            style={{ fontSize: "clamp(15px, 1.2vw, 19px)", lineHeight: 1.55 }}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.58, ease: [0.22, 1, 0.36, 1] }}
          >
            {t("hero.subtitle")}
          </motion.p>
        </div>
      </div>

      {/* Scroll cue */}
      <motion.div
        className="pointer-events-none absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-eyebrow uppercase text-bone-dim"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.9, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
        style={{ opacity: useTransform(scrollYProgress, [0, 0.15], [1, 0]) }}
      >
        <span>Scroll</span>
        <motion.div
          className="h-10 w-[1px] origin-top bg-gradient-to-b from-bone-mute to-transparent"
          animate={{ scaleY: [1, 0.4, 1], opacity: [1, 0.4, 1] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </section>
  );
}
