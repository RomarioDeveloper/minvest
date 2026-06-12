"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";

type Props = {
  /** Base path without extension, e.g. "/video/1". Looks up .mp4/.webm/.jpg. */
  src: string;
  eyebrow: string;
  title: React.ReactNode;
  subtitle?: string;
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
export default function HeroVideo({ src, eyebrow, title, subtitle }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [loaded, setLoaded] = useState(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Layered transforms for the parallax feel
  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.18]);
  const videoY = useTransform(scrollYProgress, [0, 1], ["0%", "-8%"]);
  const titleY = useTransform(scrollYProgress, [0, 1], ["0%", "-60%"]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const subtitleY = useTransform(scrollYProgress, [0, 1], ["0%", "-100%"]);
  const subtitleOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  const vignetteOpacity = useTransform(scrollYProgress, [0, 1], [0.55, 1]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onCanPlay = () => setLoaded(true);
    v.addEventListener("canplay", onCanPlay);
    v.addEventListener("loadeddata", onCanPlay);
    return () => {
      v.removeEventListener("canplay", onCanPlay);
      v.removeEventListener("loadeddata", onCanPlay);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-[100svh] min-h-[640px] w-full overflow-hidden bg-ink-deep"
    >
      <motion.div
        className="absolute inset-0 will-change-transform"
        style={{ scale: videoScale, y: videoY }}
      >
        {/* Poster as base layer — instantly visible, then crossfaded under the video */}
        <img
          src={`${src}.jpg`}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover"
        />

        <video
          ref={videoRef}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1200ms] ease-out ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={`${src}.jpg`}
        >
          <source src={`${src}.webm`} type="video/webm" />
          <source src={`${src}.mp4`} type="video/mp4" />
        </video>
      </motion.div>

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
            {eyebrow}
          </motion.div>

          <motion.h1
            className="mt-5 font-display font-semibold text-bone tracking-tightest text-balance will-change-transform"
            style={{ fontSize: "clamp(48px, 9vw, 148px)", lineHeight: 0.9, y: titleY, opacity: titleOpacity }}
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.38, ease: [0.22, 1, 0.36, 1] }}
          >
            {title}
          </motion.h1>

          {subtitle && (
            <motion.p
              className="mt-6 max-w-xl text-pretty text-bone-soft will-change-transform"
              style={{ fontSize: "clamp(15px, 1.2vw, 19px)", lineHeight: 1.55, y: subtitleY, opacity: subtitleOpacity }}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.1, delay: 0.58, ease: [0.22, 1, 0.36, 1] }}
            >
              {subtitle}
            </motion.p>
          )}
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
