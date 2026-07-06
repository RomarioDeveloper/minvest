import type { Metadata, Viewport } from "next";
import Preloader from "@/components/Preloader";
import ScrollRestoration from "@/components/ScrollRestoration";
import ScrollSnapMagnet from "@/components/ScrollSnapMagnet";
import SmoothScroller from "@/components/SmoothScroller";
import "./globals.css";

export const metadata: Metadata = {
  title: "Malaysary Invest — застройщик",
  description:
    "Надёжный застройщик Malaysary Invest: жилые комплексы с закрытой территорией, гаражами и детскими площадками. Ипотека, рассрочка, trade-in.",
};

export const viewport: Viewport = {
  themeColor: "#08080a",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
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
          href="/hero-scrub-mobile-temp.jpg"
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
        <ScrollRestoration />
        <SmoothScroller />
        <ScrollSnapMagnet />
        <Preloader />
        {children}
      </body>
    </html>
  );
}
