"use client";

import { useEffect, useRef, type ComponentPropsWithoutRef } from "react";
import { useInView, useMotionValue, useSpring } from "framer-motion";

import { cn } from "@/lib/utils";

interface NumberTickerProps extends ComponentPropsWithoutRef<"span"> {
  /** Целевое значение счётчика. */
  value: number;
  /** Начальное значение (по умолчанию 0). */
  startValue?: number;
  /** Направление счёта. */
  direction?: "up" | "down";
  /** Задержка перед стартом, в секундах. */
  delay?: number;
  /** Количество знаков после запятой. */
  decimalPlaces?: number;
}

/**
 * Счётчик в стиле Magic UI Number Ticker: число на spring-физике быстро
 * разгоняется и плавно «дотикивает» до цели, когда блок попадает в вьюпорт.
 */
export function NumberTicker({
  value,
  startValue = 0,
  direction = "up",
  delay = 0,
  decimalPlaces = 0,
  className,
  ...props
}: NumberTickerProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(direction === "down" ? value : startValue);
  const springValue = useSpring(motionValue, {
    damping: 60,
    stiffness: 100,
  });
  const isInView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });

  useEffect(() => {
    if (!isInView) return;
    const timer = setTimeout(() => {
      motionValue.set(direction === "down" ? startValue : value);
    }, delay * 1000);
    return () => clearTimeout(timer);
  }, [motionValue, isInView, delay, value, direction, startValue]);

  useEffect(
    () =>
      springValue.on("change", (latest) => {
        if (ref.current) {
          ref.current.textContent = Intl.NumberFormat("ru-RU", {
            minimumFractionDigits: decimalPlaces,
            maximumFractionDigits: decimalPlaces,
          }).format(Number(latest.toFixed(decimalPlaces)));
        }
      }),
    [springValue, decimalPlaces],
  );

  return (
    <span
      ref={ref}
      className={cn("inline-block tabular-nums", className)}
      {...props}
    >
      {Intl.NumberFormat("ru-RU", {
        minimumFractionDigits: decimalPlaces,
        maximumFractionDigits: decimalPlaces,
      }).format(direction === "down" ? value : startValue)}
    </span>
  );
}
