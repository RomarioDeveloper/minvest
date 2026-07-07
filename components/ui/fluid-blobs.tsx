"use client";

import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

const DEFAULT_COLORS = [
  "rgba(244,244,245,0.34)",
  "rgba(212,212,216,0.26)",
  "rgba(161,161,170,0.30)",
  "rgba(244,244,245,0.20)",
];

type Props = {
  /** Цвета «капель» (radial-градиенты, растворяющиеся к краям). */
  colors?: string[];
  /** Сила размытия всего слоя, px. */
  blur?: number;
  /** Выключает движение (например, на слабых устройствах). */
  animate?: boolean;
  className?: string;
};

/**
 * Плавающие размытые «капли» в шапке карточки (аналог FluidBlobs из
 * unlumen-ui). Капли расположены у верхнего края и медленно дрейфуют,
 * движение остаётся внутри области шапки.
 */
export function FluidBlobs({
  colors = DEFAULT_COLORS,
  blur = 36,
  animate = true,
  className,
}: Props) {
  return (
    <div
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      style={{ filter: `blur(${blur}px)` }}
      aria-hidden
    >
      {colors.map((color, i) => (
        <motion.div
          key={i}
          className="absolute aspect-square w-[55%] rounded-full"
          style={{
            background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
            left: `${i * 24 - 8}%`,
            top: "-42%",
          }}
          animate={
            animate
              ? {
                  x: ["-12%", "14%"],
                  y: ["-8%", "12%"],
                  scale: [1, 1.18],
                }
              : undefined
          }
          transition={{
            duration: 5.5 + i * 1.7,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
