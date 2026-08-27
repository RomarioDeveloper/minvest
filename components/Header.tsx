"use client";

import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n";
import LangSwitcher from "./LangSwitcher";

const SOCIAL_LINKS = [
  {
    href: "https://instagram.com/malaysary_invest",
    label: "Instagram",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-[18px] w-[18px]">
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    href: "https://wa.me/77072343333",
    label: "WhatsApp",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-[18px] w-[18px]">
        <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
        <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1zm0 0a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0-5-5z" />
      </svg>
    ),
  },
  {
    href: "mailto:info@malaysaryinvest.kz",
    label: "Email",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-[18px] w-[18px]">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    ),
  },
];

export default function Header() {
  const { scrollY } = useScroll();
  const { t, lang } = useI18n();

  const NAV_LINKS = [
    { href: `/${lang}#objects`, label: t("nav.objects") },
    { href: `/${lang}#advantages`, label: t("nav.advantages") },
    { href: `/${lang}#company`, label: t("nav.company") },
    { href: `/${lang}#contact`, label: t("nav.contact") },
  ];
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
        className="fixed inset-x-0 top-0 z-[62] px-4 pt-4 sm:px-6"
        style={{
          opacity: isMounted ? opacity : 0,
          y: isMounted ? y : -20,
          pointerEvents: isMounted ? pointerEvents : "none",
        }}
      >
        {/* backdrop-blur пересчитывается на каждый кадр скролла (под шапкой канвас и видео).
            На мобилке блюра нет вообще — плотный фон, на десктопе md вместо xl +
            transform-gpu, чтобы блюр жил на собственном слое композитора. */}
        <div className="relative mx-auto flex max-w-6xl transform-gpu items-center gap-2 rounded-full border border-bone/10 bg-ink/90 py-2 pl-4 pr-2 shadow-[0_8px_32px_rgba(0,0,0,0.35)] md:gap-3 md:bg-ink/60 md:backdrop-blur-md md:pl-5 sm:pl-6 lg:gap-5">
          <a href="#top" className="relative z-[62] flex min-w-0 shrink-0 items-center gap-2.5 text-bone sm:gap-3" onClick={closeMenu}>
            <img src="/logo-mark.webp" alt="" aria-hidden className="h-7 w-auto shrink-0" />
            <span className="min-w-0 truncate font-display text-[11px] font-bold tracking-[0.12em] sm:text-[13px] sm:tracking-[0.14em]">
              MALAYSARY
              <span className="ml-1 font-medium text-bone-mute sm:ml-1.5">INVEST</span>
            </span>
          </a>

          {/* Полное меню со всех адаптивов кроме мобилки (< md) */}
          <nav
            className={`hidden min-w-0 flex-1 items-center justify-center font-medium text-bone-soft md:flex ${
              lang === "kk"
                ? "gap-3 px-2 text-[12px] lg:gap-5 lg:px-4 lg:text-[13px]"
                : "gap-4 px-3 text-[12px] lg:gap-6 lg:px-6 lg:text-[13px] xl:gap-8"
            }`}
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="relative whitespace-nowrap py-2 transition-colors duration-300 after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-bone after:transition-all after:duration-300 hover:text-bone hover:after:w-full"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="relative z-[62] ml-auto flex shrink-0 items-center justify-end gap-2 sm:gap-3">
            <div className="hidden items-center gap-1 border-l border-bone/15 pl-3 md:flex lg:gap-1.5 lg:pl-4">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="flex h-9 w-9 items-center justify-center rounded-full text-bone-soft transition hover:bg-bone/5 hover:text-bone"
                >
                  {social.icon}
                </a>
              ))}
            </div>
            
            <LangSwitcher />

            <a
              href={`/${lang}#contact`}
              className="group hidden items-center gap-2 rounded-full bg-bone py-2.5 pl-4 pr-3.5 text-[12px] font-semibold tracking-[0.04em] text-ink transition-colors duration-300 hover:bg-bone-soft whitespace-nowrap md:inline-flex lg:pl-5 lg:pr-4"
            >
              {t("nav.book_showing")}
              <span className="transition-transform duration-300 group-hover:translate-x-0.5">→</span>
            </a>

            <button
              type="button"
              aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
              className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-bone/15 text-bone transition hover:border-bone/40 hover:bg-bone/5 md:hidden"
            >
            <span className="sr-only">{menuOpen ? "Закрыть" : "Меню"}</span>
            <span className="relative h-3.5 w-5">
              <motion.span
                className="absolute left-0 top-0 block h-[1.5px] w-full origin-center bg-bone"
                animate={menuOpen ? { y: 6.25, rotate: 45 } : { y: 0, rotate: 0 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              />
              <motion.span
                className="absolute left-0 top-[6.25px] block h-[1.5px] w-full bg-bone"
                animate={menuOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.2 }}
              />
              <motion.span
                className="absolute bottom-0 left-0 block h-[1.5px] w-full origin-center bg-bone"
                animate={menuOpen ? { y: -6.25, rotate: -45 } : { y: 0, rotate: 0 }}
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
            className="fixed inset-0 z-[61] md:hidden"
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
                <div className="flex justify-center mb-8">
                  {/* Мобильный свитчер */}
                  <div className="flex bg-ink border border-bone/10 p-1 rounded-lg shadow-inner">
                    <button
                      onClick={() => {
                        if(lang !== 'ru') window.location.href = '/ru' + window.location.hash;
                      }}
                      className={`px-6 py-2.5 rounded-md text-[11px] font-bold uppercase tracking-widest transition-all ${lang === 'ru' ? 'bg-bone text-ink shadow-sm' : 'text-bone-soft'}`}
                    >
                      Рус
                    </button>
                    <button
                      onClick={() => {
                        if(lang !== 'kk') window.location.href = '/kk' + window.location.hash;
                      }}
                      className={`px-6 py-2.5 rounded-md text-[11px] font-bold uppercase tracking-widest transition-all ${lang === 'kk' ? 'bg-bone text-ink shadow-sm' : 'text-bone-soft'}`}
                    >
                      Қаз
                    </button>
                  </div>
                </div>
                <a
                  href={`/${lang}#contact`}
                  onClick={closeMenu}
                  className="flex w-full items-center justify-center rounded-full bg-bone px-7 py-4 text-[13px] font-bold tracking-widest uppercase text-ink transition hover:bg-bone-soft"
                >
                  {t("nav.book")}
                </a>
                <div className="mt-8 flex justify-center gap-6">
                  {SOCIAL_LINKS.map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className="flex h-12 w-12 items-center justify-center rounded-full border border-bone/15 text-bone-soft transition hover:border-bone/40 hover:bg-bone/5 hover:text-bone"
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>
                <p className="mt-6 text-center text-[11px] uppercase tracking-widest text-bone-dim">
                  {t("nav.city")}
                </p>
              </motion.div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}