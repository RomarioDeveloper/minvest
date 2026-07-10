"use client";

import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

const NAV_LINKS = [
  { href: "#objects", label: "Объекты" },
  { href: "#advantages", label: "Преимущества" },
  { href: "#company", label: "О компании" },
  { href: "#contact", label: "Контакты" },
];

export default function Header() {
  const { scrollY } = useScroll();
  const [isMounted, setIsMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [threshold, setThreshold] = useState(1000);

  useEffect(() => {
    setIsMounted(true);
    const updateThreshold = () => {
      const isMobile = window.matchMedia("(max-width: 767px)").matches;
      setThreshold(window.innerHeight * (isMobile ? 3 : 5.2));
    };
    updateThreshold();
    window.addEventListener("resize", updateThreshold);
    return () => window.removeEventListener("resize", updateThreshold);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const opacity = useTransform(scrollY, [threshold - 100, threshold + 100], [0, 1]);
  const y = useTransform(scrollY, [threshold - 100, threshold + 100], [-20, 0]);
  const pointerEvents = useTransform(scrollY, (val) => (val > threshold ? "auto" : "none"));

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6"
        style={{
          opacity: isMounted ? opacity : 0,
          y: isMounted ? y : -20,
          pointerEvents: isMounted ? pointerEvents : "none",
        }}
      >
        {/* backdrop-blur пересчитывается на каждый кадр скролла (под шапкой канвас и видео).
            На мобилке блюра нет вообще — плотный фон, на десктопе md вместо xl +
            transform-gpu, чтобы блюр жил на собственном слое композитора. */}
        <div className="relative mx-auto flex max-w-6xl transform-gpu items-center justify-between rounded-full border border-bone/10 bg-ink/90 py-2 pl-5 pr-2 shadow-[0_8px_32px_rgba(0,0,0,0.35)] md:bg-ink/60 md:backdrop-blur-md sm:pl-6">
          <a href="#top" className="relative z-[62] flex items-center gap-3 text-bone">
            <img src="/logo-mark.webp" alt="" aria-hidden className="h-7 w-auto" />
            <span className="font-display text-[13px] font-bold tracking-[0.14em]">
              MALAYSARY
              <span className="ml-1.5 font-medium text-bone-mute">INVEST</span>
            </span>
          </a>

          <nav className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-8 text-[13px] font-medium text-bone-soft lg:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="relative py-2 transition-colors duration-300 after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-bone after:transition-all after:duration-300 hover:text-bone hover:after:w-full"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="relative z-[62] flex items-center gap-2">
            <a
              href="#contact"
              className="group hidden items-center gap-2.5 rounded-full bg-bone py-2.5 pl-5 pr-4 text-[12px] font-semibold tracking-[0.04em] text-ink transition-colors duration-300 hover:bg-bone-soft lg:inline-flex"
            >
              Записаться на показ
              <span className="transition-transform duration-300 group-hover:translate-x-0.5">→</span>
            </a>

            <button
              type="button"
              aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
              className="relative flex h-10 w-10 items-center justify-center rounded-full border border-bone/15 text-bone transition hover:border-bone/40 hover:bg-bone/5 lg:hidden"
            >
            <span className="sr-only">{menuOpen ? "Закрыть" : "Меню"}</span>
            <span className="relative h-3.5 w-5">
              <motion.span
                className="absolute left-0 top-0 block h-[1.5px] w-full origin-center bg-bone"
                animate={menuOpen ? { y: 7, rotate: 45 } : { y: 0, rotate: 0 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              />
              <motion.span
                className="absolute left-0 top-[7px] block h-[1.5px] w-full bg-bone"
                animate={menuOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.2 }}
              />
              <motion.span
                className="absolute bottom-0 left-0 block h-[1.5px] w-full origin-center bg-bone"
                animate={menuOpen ? { y: -7, rotate: -45 } : { y: 0, rotate: 0 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              />
            </span>
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-[61] lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Фон уже почти непрозрачный — полноэкранный backdrop-blur на телефоне
                стоил дорого и визуально ничего не добавлял. */}
            <motion.div
              className="absolute inset-0 bg-ink-deep/[0.98]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMenu}
            />

            <motion.nav
              className="relative flex h-full flex-col justify-between px-6 pb-10 pt-28 sm:px-10"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex flex-col gap-1">
                {NAV_LINKS.map((link, i) => (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    onClick={closeMenu}
                    className="group border-b border-bone/10 py-5 font-display text-3xl font-semibold tracking-tightest text-bone transition hover:text-bone-mute sm:text-4xl"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.08 + i * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <span className="flex items-baseline justify-between">
                      {link.label}
                      <span className="text-eyebrow text-bone-dim transition group-hover:text-bone-mute">→</span>
                    </span>
                  </motion.a>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.4 }}
              >
                <a
                  href="#contact"
                  onClick={closeMenu}
                  className="flex w-full items-center justify-center bg-bone px-7 py-4 text-eyebrow uppercase text-ink transition hover:bg-bone-soft"
                >
                  Забронировать →
                </a>
                <p className="mt-5 text-center text-eyebrow uppercase text-bone-dim">
                  Malaysary Invest · Павлодар
                </p>
              </motion.div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}