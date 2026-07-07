"use client";

import { collectNumericSnapPoints, snapDistanceThreshold } from "@/lib/scrollSnapPoints";
import Lenis from "lenis";
import Snap from "lenis/snap";
import { useEffect } from "react";

type LenisWindow = Window & { __lenis?: Lenis; __lenisSnap?: Snap };

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function usesNativeScroll() {
  return (
    window.matchMedia("(pointer: coarse)").matches || window.matchMedia("(max-width: 767px)").matches
  );
}

function nearestSnapPoint(y: number, points: number[]) {
  if (points.length === 0) return null;

  let nearest = points[0];
  let minDist = Math.abs(y - nearest);

  for (let i = 1; i < points.length; i += 1) {
    const dist = Math.abs(y - points[i]);
    if (dist < minDist) {
      minDist = dist;
      nearest = points[i];
    }
  }

  return { value: nearest, distance: minDist };
}

/**
 * Magnetic scroll zones across the landing page.
 * Desktop: Lenis Snap on section markers + numeric step points.
 * Mobile / touch: native scroll-snap CSS + scroll-end magnet for step points.
 */
export default function ScrollSnapMagnet() {
  useEffect(() => {
    if (prefersReducedMotion()) return;

    const w = window as LenisWindow;
    let snap: Snap | null = null;
    let removeSnapFns: (() => void)[] = [];
    let resizeTimer: number | undefined;
    let nativeTimer: number | undefined;
    let rafId = 0;

    const destroyLenisSnap = () => {
      removeSnapFns.forEach((fn) => fn());
      removeSnapFns = [];
      snap?.destroy();
      snap = null;
      delete w.__lenisSnap;
    };

    const buildLenisSnap = (lenis: Lenis) => {
      destroyLenisSnap();

      snap = new Snap(lenis, {
        type: "proximity",
        debounce: 420,
        duration: 0.95,
        distanceThreshold: "28%",
      });
      w.__lenisSnap = snap;

      document.querySelectorAll<HTMLElement>("[data-scroll-snap]").forEach((el) => {
        removeSnapFns.push(snap!.addElement(el, { align: "start" }));
      });

      collectNumericSnapPoints().forEach((value) => {
        removeSnapFns.push(snap!.add(value));
      });

      snap.resize();
    };

    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        if (w.__lenis) buildLenisSnap(w.__lenis);
        else snap?.resize();
      }, 250);
    };

    const waitForLenis = () => {
      if (usesNativeScroll()) return;
      if (w.__lenis) {
        buildLenisSnap(w.__lenis);
        return;
      }
      rafId = window.requestAnimationFrame(waitForLenis);
    };

    const supportsScrollEnd = "onscrollend" in window;
    
    if (!usesNativeScroll()) {
      document.documentElement.classList.add("scroll-snap-magnet");
      waitForLenis();
    }
    
    window.addEventListener("resize", onResize);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.clearTimeout(resizeTimer);
      window.clearTimeout(nativeTimer);
      window.removeEventListener("resize", onResize);
      document.documentElement.classList.remove("scroll-snap-magnet");
      destroyLenisSnap();
    };
  }, []);

  return null;
}
