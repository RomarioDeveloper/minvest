"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

export default function Header() {
  const { scrollY } = useScroll();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Fade in header after scrolling past 100px
  const opacity = useTransform(scrollY, [100, 300], [0, 1]);
  // Slide down slightly
  const y = useTransform(scrollY, [100, 300], [-20, 0]);
  // Only apply pointer events when visible
  const pointerEvents = useTransform(scrollY, (val) => (val > 150 ? "auto" : "none"));

  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-6 py-5 sm:px-10"
      style={{
        opacity: isMounted ? opacity : 0,
        y: isMounted ? y : -20,
        pointerEvents: isMounted ? pointerEvents : "none",
      }}
    >
      {/* Background blur that fades in */}
      <div className="absolute inset-0 -z-10 bg-ink/40 backdrop-blur-md" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-ink/80 to-transparent" />

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