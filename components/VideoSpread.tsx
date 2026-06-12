"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import LoopVideo from "@/components/LoopVideo";

type Props = {
  /** Base path without extension, e.g. "/video/brand". */
  src: string;
  eyebrow: string;
  title: React.ReactNode;
  body?: React.ReactNode;
};

/**
 * Full-bleed looping video spread with the same scroll grammar as
 * EditorialSpread: the video parallaxes and breathes, the copy writes
 * itself in as the section crosses the viewport.
 */
export default function VideoSpread({ src, eyebrow, title, body }: Props) {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const videoY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const videoScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.14, 1.02, 1.14]);
  const washOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.5, 0.75, 0.75, 0.5]);
  const copyY = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], ["36px", "0px", "-16px", "-48px"]);
  const copyOpacity = useTransform(scrollYProgress, [0.05, 0.22, 0.82, 1], [0, 1, 1, 0]);

  return (
    <section
      ref={sectionRef}
      className="relative h-[110svh] min-h-[640px] w-full overflow-hidden bg-ink"
    >
      <motion.div
        className="absolute inset-0 will-change-transform"
        style={{ y: videoY, scale: videoScale }}
      >
        <LoopVideo src={src} className="absolute inset-0 h-full w-full object-cover" />
      </motion.div>

      <motion.div
        className="pointer-events-none absolute inset-0"
        style={{
          opacity: washOpacity,
          background:
            "linear-gradient(to top, rgba(8,8,10,0.95) 0%, rgba(8,8,10,0.25) 45%, rgba(8,8,10,0) 75%)",
        }}
      />

      <div className="relative z-10 flex h-full w-full items-end p-6 sm:p-10 lg:p-16">
        <motion.div
          className="max-w-2xl will-change-transform"
          style={{ y: copyY, opacity: copyOpacity }}
        >
          <div className="flex items-baseline gap-3 text-eyebrow uppercase text-bone-mute">
            <span className="h-[1px] w-8 bg-bone/40" />
            <span>{eyebrow}</span>
          </div>
          <h2
            className="mt-5 font-display font-semibold text-bone tracking-tightest text-balance"
            style={{ fontSize: "clamp(36px, 6vw, 92px)", lineHeight: 0.95 }}
          >
            {title}
          </h2>
          {body && (
            <div
              className="mt-6 max-w-xl text-pretty text-bone-soft"
              style={{ fontSize: "clamp(15px, 1.15vw, 18px)", lineHeight: 1.6 }}
            >
              {body}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
