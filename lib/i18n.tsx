"use client";

import { createContext, useContext } from "react";

export type Locale = "ru" | "kk";

type Dict = Record<string, string>;

interface I18nContextType {
  lang: Locale;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({ lang, dict, children }: { lang: Locale; dict: Dict; children: React.ReactNode }) {
  const t = (key: string) => dict[key] || key;
  return <I18nContext.Provider value={{ lang, t }}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) throw new Error("useI18n must be used within I18nProvider");
  return context;
}
