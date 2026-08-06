"use client";

import { usePathname, useRouter } from "next/navigation";
import { useI18n, Locale } from "@/lib/i18n";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function LangSwitcher() {
  const { lang } = useI18n();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const toggleLang = (newLang: Locale) => {
    if (newLang === lang) {
      setOpen(false);
      return;
    }
    
    // Replace the current locale in the path with the new one
    const newPath = pathname.replace(`/${lang}`, `/${newLang}`);
    router.push(newPath || `/${newLang}`);
    setOpen(false);
  };

  return (
    <div className="relative z-[62] hidden lg:block ml-2 mr-4">
      <button 
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-bone transition hover:text-bone-mute"
      >
        {lang === 'ru' ? 'РУС' : 'ҚАЗ'}
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className={`transition-transform duration-300 ${open ? 'rotate-180' : ''}`}>
          <path d="M2.5 3.5L5 6L7.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-1/2 -translate-x-1/2 mt-4 flex flex-col bg-ink-panel border border-bone/10 rounded-xl overflow-hidden shadow-2xl"
          >
            <button
              onClick={() => toggleLang('ru')}
              className={`px-4 py-2.5 text-[11px] font-bold uppercase tracking-widest transition-colors whitespace-nowrap text-left
                ${lang === 'ru' ? 'bg-bone text-ink' : 'text-bone hover:bg-white/5'}`}
            >
              Русский
            </button>
            <button
              onClick={() => toggleLang('kk')}
              className={`px-4 py-2.5 text-[11px] font-bold uppercase tracking-widest transition-colors whitespace-nowrap text-left border-t border-bone/5
                ${lang === 'kk' ? 'bg-bone text-ink' : 'text-bone hover:bg-white/5'}`}
            >
              Қазақша
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
