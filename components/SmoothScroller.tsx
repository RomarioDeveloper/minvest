"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Page-wide smooth scrolling. Mounting this once at the root replaces the
 * browser's native step scroll with an interpolated one — the same trick
 * luxury product pages (TAG Heuer Connected, Bang & Olufsen, etc.) use to
 * make every other scroll-driven animation feel like it has weight.
 *
 * Lenis dispatches native scroll events for compatibility, so anything in
 * the page that listens to scroll (framer-motion's useScroll, custom IO
 * observers, our canvas animation) keeps working.
 */
export default function SmoothScroller() {
  useEffect(() => {
    // Respect users who explicitly ask for less motion.
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.05,
      // ease-out-expo — smooth but settles quickly enough to feel responsive
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.2,
      syncTouch: true,
    });

    let frameId: number;
    const raf = (time: number) => {
      lenis.raf(time);
      frameId = requestAnimationFrame(raf);
    };
    frameId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frameId);
      lenis.destroy();
    };
  }, []);

  return null;
}
