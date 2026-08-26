"use client";

import { useEffect, useRef } from "react";

const BAND_HALF = 17;
const SWEEP_START = -BAND_HALF;
const SWEEP_END = 100 + BAND_HALF;
const COLORS = ["#f7dfae", "#f3b268", "#e8875f", "#fbeedb", "#f7dfae"];
const TEXT_COLOR = "#f4f4f5";

const sweepEase = (t: number) =>
  t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2;

function buildGradient(pos: number) {
  const bandStart = pos - BAND_HALF;
  const bandEnd = pos + BAND_HALF;

  if (bandStart >= 100) {
    return `linear-gradient(90deg, ${TEXT_COLOR}, ${TEXT_COLOR})`;
  }

  const parts: string[] = [];
  if (bandStart > 0) {
    parts.push(`${TEXT_COLOR} 0%`, `${TEXT_COLOR} ${bandStart.toFixed(2)}%`);
  }

  COLORS.forEach((c, i) => {
    const pct =
      COLORS.length === 1
        ? pos
        : bandStart + (i / (COLORS.length - 1)) * BAND_HALF * 2;
    parts.push(`${c} ${pct.toFixed(2)}%`);
  });

  if (bandEnd < 100) {
    parts.push(`transparent ${bandEnd.toFixed(2)}%`, `transparent 100%`);
  }

  return `linear-gradient(90deg, ${parts.join(", ")})`;
}

type Props = {
  text?: string;
  duration?: number;
  delay?: number;
  className?: string;
};

/**
 * Тот же золотой sweep, что DiaTextReveal, но без Framer MotionValue —
 * на мобильном WebKit/Chrome background-clip + MotionValue часто не рисует кадры.
 * Здесь каждый кадр пишется напрямую в DOM через rAF.
 */
export default function BrandTitleReveal({
  text = "MALAYSARY INVEST",
  duration = 2.2,
  delay = 0.2,
  className,
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let raf = 0;
    let startAt = 0;
    const durationMs = duration * 1000;
    const delayMs = delay * 1000;

    el.style.backgroundImage = buildGradient(SWEEP_START);

    const tick = (now: number) => {
      if (!startAt) startAt = now + delayMs;
      if (now < startAt) {
        raf = requestAnimationFrame(tick);
        return;
      }

      const t = Math.min(1, (now - startAt) / durationMs);
      const pos = SWEEP_START + (SWEEP_END - SWEEP_START) * sweepEase(t);
      el.style.backgroundImage = buildGradient(pos);

      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        el.style.backgroundImage = buildGradient(SWEEP_END);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [duration, delay, text]);

  return (
    <span
      ref={ref}
      className={className}
      style={{
        display: "inline-block",
        color: "transparent",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        WebkitBackgroundClip: "text",
        backgroundSize: "100% 100%",
        backgroundRepeat: "no-repeat",
        // стартовый кадр до первого rAF — невидимый, без белой вспышки
        backgroundImage: buildGradient(SWEEP_START),
      }}
    >
      {text}
    </span>
  );
}
