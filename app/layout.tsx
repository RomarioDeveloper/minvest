import type { Metadata, Viewport } from "next";
import Preloader from "@/components/Preloader";
import SmoothScroller from "@/components/SmoothScroller";
import "./globals.css";

export const metadata: Metadata = {
  title: "MINVEST — Жилой дом",
  description:
    "Шестиэтажный жилой комплекс с закрытой территорией, гаражами и детской площадкой.",
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
          href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700;800&family=Inter:wght@400;500;600&family=Cormorant+Garamond:ital,wght@0,500;0,600;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Preloader />
        <SmoothScroller />
        {children}
      </body>
    </html>
  );
}
