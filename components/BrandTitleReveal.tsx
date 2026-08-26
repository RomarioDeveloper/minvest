"use client";

import { useEffect, useState } from "react";

const TEXT_COLOR = "#f4f4f5";
const GOLD = "#f7dfae";
const GOLD_MID = "#f3b268";
const GOLD_HOT = "#e8875f";
const BAND = 0.16;

const sweepEase = (t: number) =>
  t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2;

type Props = {
  text?: string;
  duration?: number;
  delay?: number;
  className?: string;
};

/**
 * Золотая волна по буквам БЕЗ background-clip:text.
 * Белый текст + цветная полоса через clip-path — стабильно на мобилках.
 */
export default function BrandTitleReveal({
  text = "MALAYSARY INVEST",
  duration = 2.2,
  delay = 0.2,
  className,
}: Props) {
  const [pos, setPos] = useState(0);

  useEffect(() => {
    let raf = 0;
    let startAt = 0;
    const durationMs = duration * 1000;
    const delayMs = delay * 1000;

    setPos(0);

    const tick = (now: number) => {
      if (!startAt) startAt = now + delayMs;
      if (now < startAt) {
        raf = requestAnimationFrame(tick);
        return;
      }
      const t = Math.min(1, (now - startAt) / durationMs);
      setPos(sweepEase(t));
      if (t < 1) raf = requestAnimationFrame(tick);
      else setPos(1);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [duration, delay, text]);

  const done = pos >= 0.999;
  // Белый открывается чуть позади золотого фронта
  const whiteClipRight = Math.max(0, (1 - Math.max(0, pos - BAND * 0.25)) * 100);
  const goldClipLeft = Math.max(0, (pos - BAND) * 100);
  const goldClipRight = Math.max(0, (1 - pos) * 100);

  return (
    <span
      className={className}
      role="text"
      aria-label={text}
      style={{
        position: "relative",
        display: "inline-block",
        whiteSpace: "nowrap",
        lineHeight: 1,
      }}
    >
      <span style={{ visibility: "hidden" }} aria-hidden>
        {text}
      </span>

      {/* Белая проявленная часть */}
      <span
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          color: TEXT_COLOR,
          clipPath: done ? undefined : `inset(0 ${whiteClipRight}% 0 0)`,
          WebkitClipPath: done ? undefined : `inset(0 ${whiteClipRight}% 0 0)`,
          willChange: "clip-path",
        }}
      >
        {text}
      </span>

      {/* Золотая полоса на фронте — обычный color, без background-clip */}
      {!done && (
        <>
          <span
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              color: GOLD_MID,
              clipPath: `inset(0 ${goldClipRight}% 0 ${goldClipLeft}%)`,
              WebkitClipPath: `inset(0 ${goldClipRight}% 0 ${goldClipLeft}%)`,
              willChange: "clip-path",
            }}
          >
            {text}
          </span>
          {/* Более горячий край фронта */}
          <span
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              color: GOLD_HOT,
              clipPath: `inset(0 ${goldClipRight}% 0 ${Math.min(100, goldClipLeft + BAND * 50)}%)`,
              WebkitClipPath: `inset(0 ${goldClipRight}% 0 ${Math.min(100, goldClipLeft + BAND * 50)}%)`,
              willChange: "clip-path",
            }}
          >
            {text}
          </span>
          <span
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              color: GOLD,
              opacity: 0.7,
              clipPath: `inset(0 ${Math.min(100, goldClipRight + BAND * 30)}% 0 ${goldClipLeft}%)`,
              WebkitClipPath: `inset(0 ${Math.min(100, goldClipRight + BAND * 30)}% 0 ${goldClipLeft}%)`,
              willChange: "clip-path",
            }}
          >
            {text}
          </span>
        </>
      )}
    </span>
  );
}
