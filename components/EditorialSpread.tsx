"use client";

import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef, useEffect, useState } from "react";

type Props = {
  imageSrc: string;
  imageAlt: string;
  eyebrow: string;
  title: React.ReactNode;
  body: React.ReactNode;
  placement?: "bottom-left" | "bottom-right" | "top-left" | "top-right" | "center";
  height?: "screen" | "tall" | "short";
  meta?: { label: string; value: string }[];
};

const placementClasses: Record<NonNullable<Props["placement"]>, string> = {
  "bottom-left": "items-end justify-start text-left",
  "bottom-right": "items-end justify-end text-left",
  "top-left": "items-start justify-start text-left",
  "top-right": "items-start justify-end text-left",
  center: "items-center justify-center text-center",
};

const heightClasses: Record<NonNullable<Props["height"]>, string> = {
  screen: "h-[110svh] min-h-[700px]",
  tall: "h-[130svh] min-h-[820px]",
  short: "h-[85svh] min-h-[560px]",
};

/**
 * Editorial scroll spread.
 *
 * Several things move at different speeds as you scroll through this section,
 * which is what makes it read as *animated* rather than just a static slide:
 *
 *   • Background image: parallaxes vertically (-12% → +12%) and zooms 1.15→1.0
 *   • Foreground wash: opacity ramps up the closer the section is to centered
 *   • Eyebrow / title / body: enter from below at staggered offsets, then
 *     gently drift while pinned in view
 *   • Meta row: enters last, slides from the side
 */
export default function EditorialSpread({
  imageSrc,
  imageAlt,
  eyebrow,
  title,
  body,
  placement = "bottom-left",
  height = "screen",
  meta,
}: Props) {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsRevealed(true);
          observer.unobserve(el);
        }
      },
      { rootMargin: "0px 0px -15% 0px" } // Reveal when 15% into viewport
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Image: depth illusion
  // const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "0%"]);

  // Wash deepens around the middle, fades at edges
  const washOpacity = useTransform(
    scrollYProgress,
    [0, 0.3, 0.7, 1],
    [0.4, 0.85, 0.85, 0.4],
  );

  // Copy block enters from below + drifts up while pinned
  const copyY = useTransform(
    scrollYProgress,
    [0, 0.25, 0.75, 1],
    ["0px", "0px", "0px", "0px"],
  );
  const copyOpacity = useTransform(
    scrollYProgress,
    [0, 0.18, 0.82, 1],
    [1, 1, 1, 1],
  );

  return (
    <section
      ref={sectionRef}
      className={`relative w-full overflow-hidden bg-ink ${heightClasses[height]}`}
    >
      <div 
        className="absolute inset-0 z-20 pointer-events-none"
        style={{
          background: "#08080a",
          transformOrigin: "bottom",
          transform: isRevealed ? "scaleY(0)" : "scaleY(1)",
          transition: "transform 1.2s cubic-bezier(0.76, 0, 0.24, 1)"
        }}
      />
      <img
        src={imageSrc}
        alt={imageAlt}
        className="absolute inset-0 h-full w-full object-cover"
        loading="lazy"
      />

      {/* Legibility wash — direction picks the heaviest side away from copy */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        style={{
          opacity: washOpacity,
          background:
            placement.startsWith("top")
              ? "linear-gradient(to bottom, rgba(8,8,10,0.95) 0%, rgba(8,8,10,0.1) 45%, rgba(8,8,10,0) 70%, rgba(8,8,10,0.55) 100%)"
              : "linear-gradient(to top, rgba(8,8,10,0.95) 0%, rgba(8,8,10,0.3) 45%, rgba(8,8,10,0) 75%)",
        }}
      />

      <div
        className={`relative z-10 flex h-full w-full p-6 sm:p-10 lg:p-16 ${placementClasses[placement]}`}
      >
        <motion.div
          className="max-w-2xl"
        >
          {/* Eyebrow wipes in horizontally like a caption being typed */}
          <RevealLine progress={scrollYProgress} from={0.05} to={0.18} mode="wipe">
            <div className="flex items-baseline gap-3 text-eyebrow uppercase text-bone-mute">
              <span className="h-[1px] w-8 bg-bone/40" />
              <span>{eyebrow}</span>
            </div>
          </RevealLine>

          {/* Title resolves out of blur instead of sliding */}
          <RevealLine progress={scrollYProgress} from={0.1} to={0.28} mode="blur">
            <h2
              className="mt-5 font-display font-semibold text-bone tracking-tightest text-balance"
              style={{ fontSize: "clamp(36px, 6vw, 92px)", lineHeight: 0.95 }}
            >
              {title}
            </h2>
          </RevealLine>

          <RevealLine progress={scrollYProgress} from={0.16} to={0.34}>
            <div
              className="mt-6 max-w-xl text-pretty text-bone-soft"
              style={{ fontSize: "clamp(15px, 1.15vw, 18px)", lineHeight: 1.6 }}
            >
              {body}
            </div>
          </RevealLine>

          {/* Meta cells cascade in from the side, one after another */}
          {meta && meta.length > 0 && (
            <div className="mt-10 grid grid-cols-2 gap-x-8 gap-y-3 sm:grid-cols-4">
              {meta.map((m, i) => (
                <RevealLine
                  key={m.label}
                  progress={scrollYProgress}
                  from={0.2 + i * 0.035}
                  to={0.38 + i * 0.035}
                  mode="slide"
                >
                  <div className="border-t border-bone/15 pt-3">
                    <div className="text-eyebrow uppercase text-bone-dim">
                      {m.label}
                    </div>
                    <div className="mt-1 font-display text-xl font-semibold tracking-tightest text-bone">
                      {m.value}
                    </div>
                  </div>
                </RevealLine>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}

/**
 * Per-line reveal driven by the parent section's scroll progress.
 * Each child block enters over its own sub-range of the scroll, so the copy
 * "writes itself in" as the section enters view — not all at once.
 * `mode` picks how it enters: rise from below (default), horizontal wipe,
 * blur-into-focus, or slide from the side.
 */
function RevealLine({
  progress,
  from,
  to,
  mode = "rise",
  children,
}: {
  progress: MotionValue<number>;
  from: number;
  to: number;
  mode?: "rise" | "wipe" | "blur" | "slide";
  children: React.ReactNode;
}) {
  const opacity = useTransform(progress, [from - 0.03, from, to, to + 0.02], [0, 0, 1, 1]);
  const y = useTransform(progress, [from, to], [24, 0]);
  const x = useTransform(progress, [from, to], [40, 0]);
  const clipPath = useTransform(
    progress,
    [from, to],
    ["inset(0 100% 0 0)", "inset(0 0% 0 0)"],
  );
  const filter = useTransform(progress, [from, to], ["blur(12px)", "blur(0px)"]);

  // Only attach the expensive per-frame styles the chosen mode actually uses.
  const style =
    mode === "wipe"
      ? { opacity, clipPath }
      : mode === "blur"
        ? { opacity, filter }
        : mode === "slide"
          ? { opacity, x }
          : { opacity, y };

  return (
    <motion.div style={style} className="will-change-transform">
      {children}
    </motion.div>
  );
}
