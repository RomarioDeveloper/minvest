"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

export default function Header() {
  const { scrollY } = useScroll();
  const [isMounted, setIsMounted] = useState(false);
  const [threshold, setThreshold] = useState(1000);

  useEffect(() => {
    setIsMounted(true);
    const updateThreshold = () => {
      const isMobile = window.matchMedia("(max-width: 767px)").matches;
      // BrandFilm is 300vh on mobile, 520vh on desktop
      // We want the header to appear after this section finishes
      setThreshold(window.innerHeight * (isMobile ? 3 : 5.2));
    };
    updateThreshold();
    window.addEventListener("resize", updateThreshold);
    return () => window.removeEventListener("resize", updateThreshold);
  }, []);

  // Fade in header after scrolling past the BrandFilm section
  const opacity = useTransform(scrollY, [threshold - 100, threshold + 100], [0, 1]);
  // Slide down slightly
  const y = useTransform(scrollY, [threshold - 100, threshold + 100], [-20, 0]);
  // Only apply pointer events when visible
  const pointerEvents = useTransform(scrollY, (val) => (val > threshold ? "auto" : "none"));

  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-6 py-5 sm:px-10"
      style={{
        opacity: isMounted ? opacity : 0,
        y: isMounted ? y : -20,
        pointerEvents: isMounted ? pointerEvents : "none",
      }}
    >
      <a href="#top" className="relative flex items-center gap-3 font-display text-sm font-semibold tracking-tightest text-bone">
        <img src="/logo-mark.webp" alt="" aria-hidden className="h-8 w-auto" />
        <span className="hidden sm:inline">MALAYSARY INVEST</span>
        <span className="sm:hidden">MALAYSARY</span>
      </a>

      <nav className="relative hidden gap-7 text-eyebrow uppercase text-bone-soft lg:flex">
        <a className="transition hover:text-bone" href="#objects">Объекты</a>
        <a className="transition hover:text-bone" href="#advantages">Преимущества</a>
        <a className="transition hover:text-bone" href="#construction">Конструктив</a>
        <a className="transition hover:text-bone" href="#terms">Условия</a>
        <a className="transition hover:text-bone" href="#company">О компании</a>
        <a className="transition hover:text-bone" href="#contact">Контакты</a>
      </nav>

      <a
        href="#contact"
        className="relative border border-bone/20 px-4 py-2 text-eyebrow uppercase text-bone transition hover:border-bone hover:bg-bone hover:text-ink"
      >
        Бронь
      </a>
    </motion.header>
  );
}