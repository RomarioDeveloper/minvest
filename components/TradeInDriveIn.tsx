"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

/**
 * Lightweight trade-in visual: car drives in on scroll instead of looping video.
 */
export default function TradeInDriveIn() {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const carX = useTransform(scrollYProgress, [0.12, 0.55, 0.9], ["-82%", "8%", "18%"]);
  const carOpacity = useTransform(scrollYProgress, [0.1, 0.28], [0, 1]);
  const roadOpacity = useTransform(scrollYProgress, [0.08, 0.25], [0, 1]);
  const glowOpacity = useTransform(scrollYProgress, [0.2, 0.5], [0, 0.6]);
  const dustOpacity = useTransform(scrollYProgress, [0.18, 0.35, 0.55], [0, 0.5, 0]);

  return (
    <section
      ref={sectionRef}
      className="relative h-[72svh] min-h-[400px] w-full overflow-hidden bg-ink-deep"
      aria-hidden
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink-deep via-ink to-ink-deep" />

      <motion.div
        className="pointer-events-none absolute inset-x-0 bottom-[22%] flex flex-col items-center"
        style={{ opacity: roadOpacity }}
      >
        <div className="h-[2px] w-[min(92%,1100px)] bg-gradient-to-r from-transparent via-bone/30 to-transparent" />
        <div className="mt-3 h-16 w-[min(88%,900px)] bg-gradient-to-t from-bone/[0.06] to-transparent blur-2xl" />
      </motion.div>

      <motion.div
        className="pointer-events-none absolute bottom-[18%] left-[8%] h-40 w-40 rounded-full bg-bone/[0.04] blur-3xl sm:left-[18%] sm:h-56 sm:w-56"
        style={{ opacity: glowOpacity }}
      />

      <motion.div
        className="pointer-events-none absolute bottom-[24%] left-0 h-8 w-32 bg-gradient-to-r from-bone/10 to-transparent blur-md"
        style={{ x: carX, opacity: dustOpacity }}
      />

      <motion.img
        src="/103F2-removebg-preview.png"
        alt=""
        draggable={false}
        className="absolute bottom-[14%] left-0 h-[clamp(130px,32vw,340px)] w-auto max-w-none select-none"
        style={{
          x: carX,
          opacity: carOpacity,
          filter: "drop-shadow(0 24px 40px rgba(0,0,0,0.55))",
        }}
      />
    </section>
  );
}
