"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

type Item = {
  imageSrc: string;
  imageAlt: string;
  eyebrow: string;
  title: React.ReactNode;
  body: React.ReactNode;
};

/**
 * Two side-by-side full-height feature panels with synced scroll-driven
 * scale + parallax. Each panel's image breathes in and out as it crosses
 * the viewport; copy slides up from below.
 */
export default function TwoUpFeature({ left, right }: { left: Item; right: Item }) {
  return (
    <section className="relative bg-ink">
      <div className="grid grid-cols-1 md:grid-cols-2">
        <Panel item={left} />
        <Panel item={right} />
      </div>
    </section>
  );
}

function Panel({ item }: { item: Item }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const imgY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const imgScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.18, 1.04, 1.18]);
  const copyY = useTransform(scrollYProgress, [0, 0.3, 1], [60, 0, -40]);
  const copyOpacity = useTransform(scrollYProgress, [0.1, 0.3, 0.85, 1], [0, 1, 1, 0]);

  return (
    <div ref={ref} className="relative h-[85svh] min-h-[560px] overflow-hidden">
      <motion.img
        src={item.imageSrc}
        alt={item.imageAlt}
        className="absolute inset-0 h-full w-full object-cover will-change-transform"
        style={{ y: imgY, scale: imgScale }}
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink-deep via-ink-deep/40 to-transparent" />

      <motion.div
        className="absolute inset-x-0 bottom-0 z-10 p-8 lg:p-12"
        style={{ y: copyY, opacity: copyOpacity }}
      >
        <div className="max-w-md">
          <div className="flex items-baseline gap-3 text-eyebrow uppercase text-bone-mute">
            <span className="h-[1px] w-8 bg-bone/40" />
            <span>{item.eyebrow}</span>
          </div>
          <h3
            className="mt-4 font-display font-semibold leading-tight tracking-tightest text-balance text-bone"
            style={{ fontSize: "clamp(28px, 3.4vw, 44px)" }}
          >
            {item.title}
          </h3>
          <p className="mt-4 text-pretty text-bone-soft">{item.body}</p>
        </div>
      </motion.div>
    </div>
  );
}
