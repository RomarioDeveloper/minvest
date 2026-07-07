"use client";

import { cn } from "@/lib/utils";

const DEFAULT_COLORS = [
  "#f4f4f5",
  "rgba(244,244,245,0.06)",
  "#d4d4d8",
  "rgba(244,244,245,0.04)",
  "#f4f4f5",
];

type Props = {
  /** Цвета conic-градиента, из которых состоит вращающееся свечение. */
  colors?: string[];
  /** Длительность полного оборота, в секундах. */
  duration?: number;
  /** Сила размытия, px. */
  blur?: number;
  className?: string;
};

/**
 * Вращающееся свечение (аналог GlowEffect из unlumen-ui в режиме rotate).
 * Кладётся абсолютом за карточку с отрицательным inset — наружу выглядывает
 * только тонкое анимированное кольцо с мягким ореолом.
 */
export function GlowEffect({
  colors = DEFAULT_COLORS,
  duration = 6,
  blur = 20,
  className,
}: Props) {
  const gradient = `conic-gradient(from 0deg, ${colors.join(", ")}, ${colors[0]})`;

  return (
    <div className={cn("absolute inset-0 overflow-hidden", className)} aria-hidden>
      {/* Квадрат 200% ширины, чтобы при вращении углы не оголялись */}
      <div
        className="glow-rotator absolute left-1/2 top-1/2 aspect-square w-[200%]"
        style={{
          background: gradient,
          filter: `blur(${blur}px)`,
          animationDuration: `${duration}s`,
        }}
      />
    </div>
  );
}
