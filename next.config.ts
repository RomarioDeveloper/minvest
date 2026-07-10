import type { NextConfig } from "next";

const config: NextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    // Next по умолчанию отдаёт /public с max-age=0 — браузер переспрашивает
    // каждый кадр при каждом заходе. Год + immutable: повторные визиты и
    // возвраты на страницу читают кадры/видео из кэша мгновенно.
    const immutable = [
      { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
    ];
    return [
      { source: "/hero-desktop-frames/:path*", headers: immutable },
      { source: "/hero-mobile-frames/:path*", headers: immutable },
      { source: "/render-frames/:path*", headers: immutable },
      { source: "/:path*.mp4", headers: immutable },
      { source: "/:path*.webm", headers: immutable },
      { source: "/:path*.webp", headers: immutable },
    ];
  },
};

export default config;
