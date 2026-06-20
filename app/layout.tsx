import type { Metadata, Viewport } from "next";
import Preloader from "@/components/Preloader";
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
      </head>
      <body>
        <SmoothScroller />
        <Preloader />
        {children}
      </body>
    </html>
  );
}
