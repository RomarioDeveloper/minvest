"use client";

import { disableScrollRestoration, scrollToTop } from "@/lib/scrollRestoration";
import { useEffect } from "react";

/**
 * Гарантирует старт с верха страницы при перезагрузке. На мобильных одного
 * scrollTo в <head> недостаточно: браузер восстанавливает позицию после
 * гидрации, scroll anchoring сдвигает viewport при подгрузке медиа, а
 * overflow:hidden у прелоадера сохраняет «запомненный» scrollY.
 */
export default function ScrollRestoration() {
  useEffect(() => {
    disableScrollRestoration();
    scrollToTop();

    const reinforce = () => scrollToTop();

    window.addEventListener("pageshow", reinforce);
    window.addEventListener("load", reinforce, { once: true });

    const raf = requestAnimationFrame(() => {
      requestAnimationFrame(scrollToTop);
    });
    const t1 = window.setTimeout(scrollToTop, 50);
    const t2 = window.setTimeout(scrollToTop, 300);

    return () => {
      window.removeEventListener("pageshow", reinforce);
      window.removeEventListener("load", reinforce);
      cancelAnimationFrame(raf);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, []);

  return null;
}
