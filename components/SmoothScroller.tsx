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

    // Native scroll keeps scroll-scrub video in sync on both phone and desktop.
    return;

    const lenis = new Lenis({
      duration: 0.85,
      // ease-out-expo — smooth but settles quickly enough to feel responsive
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      // Native touch scrolling: hijacking touch (syncTouch) feels broken on
      // phones — momentum fights the browser and pinned sections stall. The
      // canvas scrub has its own inertia, so native flicks still look smooth.
      syncTouch: false,
    });

    // Let other components (e.g. the preloader) pause scrolling properly.
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;

    let frameId: number;
    const raf = (time: number) => {
      lenis.raf(time);
      frameId = requestAnimationFrame(raf);
    };
    frameId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frameId);
      lenis.destroy();
      delete (window as unknown as { __lenis?: Lenis }).__lenis;
    };
  }, []);

  return null;
}
