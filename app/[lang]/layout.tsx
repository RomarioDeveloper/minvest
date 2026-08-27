import type { Metadata, Viewport } from "next";
import Preloader from "@/components/Preloader";
import ScrollRestoration from "@/components/ScrollRestoration";
import ScrollSnapMagnet from "@/components/ScrollSnapMagnet";
import SmoothScroller from "@/components/SmoothScroller";
import "../globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { getDictionary } from "@/lib/dictionaries";
import { I18nProvider, Locale } from "@/lib/i18n";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
  const { lang } = await params;
  const t = (key: string) => getDictionary(lang)[key] || key;
  
  return {
    title: "Malaysary Invest — " + (lang === 'ru' ? 'застройщик в Павлодаре' : 'Павлодардағы құрылыс салушы'),
    description: lang === 'ru' 
      ? "Malaysary Invest (Малайсары Инвест) — застройщик в Павлодаре. Жилые комплексы с закрытой территорией, гаражами и детскими площадками. Ипотека и рассрочка."
      : "Malaysary Invest (Малайсары Инвест) — Павлодардағы сенімді құрылыс салушы. Жабық аумағы, гараждары және балалар алаңдары бар тұрғын үй кешендері. Ипотека және бөліп төлеу.",
    keywords: lang === 'ru'
      ? ["Malaysary Invest", "Малайсары Инвест", "застройщик Павлодар", "квартиры Павлодар", "новостройки Павлодар"]
      : ["Malaysary Invest", "Малайсары Инвест", "құрылыс салушы Павлодар", "пәтерлер Павлодар"],
    alternates: {
      canonical: `https://minvest.kz/${lang}`,
      languages: {
        ru: "https://minvest.kz/ru",
        kk: "https://minvest.kz/kk",
      },
    },
    openGraph: {
      title: "Malaysary Invest",
      description: lang === 'ru'
        ? "Застройщик в Павлодаре — жилые комплексы Malaysary Invest"
        : "Павлодардағы құрылыс салушы — Malaysary Invest тұрғын үй кешендері",
      url: `https://minvest.kz/${lang}`,
      siteName: "Malaysary Invest",
      locale: lang === "ru" ? "ru_KZ" : "kk_KZ",
      type: "website",
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#08080a",
  width: "device-width",
  initialScale: 1,
};

export async function generateStaticParams() {
  return [{ lang: "ru" }, { lang: "kk" }];
}

export default async function RootLayout({ 
  children,
  params 
}: { 
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = lang as Locale;
  const dict = getDictionary(locale);

  return (
    <html lang={locale} className={cn("font-sans", geist.variable)}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link
          rel="preload"
          as="image"
          href="/1.jpg"
          media="(max-width: 767px)"
        />
        {/* Всегда начинаем с верха страницы: браузерное восстановление скролла
            ломает пиннед-секции и скролл-анимации при перезагрузке. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){function s(){window.scrollTo(0,0);document.documentElement.scrollTop=0;document.body.scrollTop=0}if("scrollRestoration"in history)history.scrollRestoration="manual";s();window.addEventListener("pageshow",s);window.addEventListener("load",s,{once:true})})();`,
          }}
        />
      </head>
      <body>
        <I18nProvider lang={locale} dict={dict}>
          <ScrollRestoration />
          <SmoothScroller />
          <ScrollSnapMagnet />
          <Preloader />
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}
