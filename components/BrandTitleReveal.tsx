"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

const TEXT_COLOR = "#f4f4f5";
const GOLD = "#f7dfae";
const GOLD_MID = "#f3b268";
const GOLD_HOT = "#e8875f";

type Props = {
  text?: string;
  duration?: number;
  delay?: number;
  className?: string;
};

/**
 * Похожий на десктоп эффект: золотая волна слева направо по буквам,
 * потом буквы становятся белыми. Только color/opacity/transform —
 * без background-clip (на мобилке он не работал).
 */
export default function BrandTitleReveal({
  text = "MALAYSARY INVEST",
  duration = 2.2,
  delay = 0.2,
  className,
}: Props) {
  const chars = useMemo(() => Array.from(text), [text]);
  const perChar = Math.max(0.04, (duration * 0.55) / Math.max(chars.length, 1));

  return (
    <span
      className={className}
      style={{
        position: "relative",
        display: "inline-block",
        whiteSpace: "nowrap",
        lineHeight: 1,
      }}
    >
      {chars.map((ch, i) => (
        <motion.span
          key={`${ch}-${i}`}
          style={{
            display: "inline-block",
            whiteSpace: "pre",
          }}
          initial={{
            opacity: 0,
            y: 14,
            color: GOLD_HOT,
            textShadow: `0 0 18px ${GOLD_HOT}99`,
          }}
          animate={{
            opacity: 1,
            y: 0,
            color: [GOLD_HOT, GOLD_MID, GOLD, TEXT_COLOR],
            textShadow: [
              `0 0 22px ${GOLD_HOT}aa`,
              `0 0 14px ${GOLD_MID}88`,
              `0 0 8px ${GOLD}55`,
              "0 0 0px transparent",
            ],
          }}
          transition={{
            duration: Math.min(0.9, duration * 0.4),
            delay: delay + i * perChar,
            ease: [0.22, 1, 0.36, 1],
            color: {
              duration: Math.min(1.1, duration * 0.5),
              delay: delay + i * perChar,
              times: [0, 0.35, 0.65, 1],
              ease: "easeOut",
            },
            textShadow: {
              duration: Math.min(1.1, duration * 0.5),
              delay: delay + i * perChar,
              times: [0, 0.35, 0.65, 1],
            },
          }}
        >
          {ch}
        </motion.span>
      ))}

      {/* Блик поверх — как золотая полоса на десктопе */}
      <motion.span
        aria-hidden
        style={{
          pointerEvents: "none",
          position: "absolute",
          top: "-10%",
          bottom: "-10%",
          width: "28%",
          background: `linear-gradient(90deg, transparent 0%, ${GOLD}55 35%, ${GOLD_HOT}99 50%, ${GOLD}55 65%, transparent 100%)`,
          mixBlendMode: "screen",
          filter: "blur(2px)",
        }}
        initial={{ left: "-35%", opacity: 0 }}
        animate={{ left: "110%", opacity: [0, 1, 1, 0] }}
        transition={{
          duration: duration * 0.95,
          delay: delay * 0.5,
          ease: [0.22, 1, 0.36, 1],
          opacity: { times: [0, 0.12, 0.85, 1], duration: duration * 0.95 },
        }}
      />
    </span>
  );
}
