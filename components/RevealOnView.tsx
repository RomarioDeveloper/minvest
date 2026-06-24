"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  /** Delay in ms before the reveal animation starts. */
  delay?: number;
  /** Vertical offset (px) the content slides up from. Default 28. */
  offset?: number;
  /** Trigger once and disconnect (default true). */
  once?: boolean;
  className?: string;
  as?: "div" | "section" | "header" | "article" | "span" | "li" | "p";
};

/**
 * Intersection-observer-driven fade-up. Mirrors the editorial feel of
 * premium product sites where text settles into view as you scroll.
 */
export default function RevealOnView({
  children,
  delay = 0,
  offset = 28,
  once = true,
  className,
  as: Tag = "div",
}: Props) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            el.dataset.reveal = "in";
            if (once) io.disconnect();
          } else if (!once) {
            el.dataset.reveal = "out";
          }
        }
      },
      { threshold: 0.18, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [once]);

  const style: CSSProperties & Record<string, string> = {
    "--reveal-delay": `${delay}ms`,
    "--reveal-offset": `${offset}px`,
  };

  return (
    <Tag
      ref={ref as never}
      data-reveal=""
      className={className}
      style={style}
    >
      {children}
    </Tag>
  );
}
