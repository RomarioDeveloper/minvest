"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";

type BlockProps = {
  title: string;
  video: string;
};

export default function VideoFeatureBlocks() {
  return (
    <div className="flex flex-col">
      <FeatureBlock
        title="Закрытые детские площадки — ваши дети будут в безопасности"
        video="/entrance-gate.mp4"
        objectPosition="center top"
      />
      <FeatureBlock
        title="Тишина и уют"
        video="/16745009121910.mp4"
        objectPosition="center"
      />
      <FeatureBlock
        title="Экибастузский кирпич"
        video="/16744999619190.mp4"
        objectPosition="center"
      />
      <SplitFeatureBlock
        title="Объекты которые находятся на этапе ввода в эксплуатацию"
        video="/objects-commissioning.mp4"
        objectPosition="center"
      />
    </div>
  );
}

function SplitFeatureBlock({ title, video, objectPosition = "center" }: BlockProps & { objectPosition?: string }) {
  return (
    <section className="relative flex h-[100svh] w-full flex-col md:flex-row overflow-hidden bg-ink">
      {/* Mobile background video */}
      <div className="absolute inset-0 md:hidden">
        <BackgroundVideo src={video} objectPosition={objectPosition} />
      </div>

      {/* Mobile gradient wash */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent md:hidden" />

      {/* Text Container */}
      <div className="relative z-10 flex h-full w-full items-end p-6 pb-20 sm:p-10 md:w-1/2 md:items-center md:p-16 lg:p-24">
        <div className="max-w-4xl">
          <h2
            className="font-display font-semibold tracking-tightest text-balance text-bone"
            style={{ fontSize: "clamp(32px, 4vw, 64px)", lineHeight: 0.98 }}
          >
            {title}
          </h2>
        </div>
      </div>

      {/* Desktop Video Container */}
      <div className="relative hidden h-full w-1/2 overflow-hidden md:block">
        <div className="absolute inset-0">
          <BackgroundVideo src={video} objectPosition={objectPosition} />
        </div>
      </div>
    </section>
  );
}

function FeatureBlock({ title, video, objectPosition = "center" }: BlockProps & { objectPosition?: string }) {
  return (
    <section className="relative h-[100svh] w-full overflow-hidden bg-ink">
      <div className="absolute inset-0">
        <BackgroundVideo src={video} objectPosition={objectPosition} />
      </div>

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: "linear-gradient(to top, rgba(8,8,10,0.9) 0%, rgba(8,8,10,0.4) 30%, rgba(8,8,10,0) 60%)",
        }}
      />

      <div className="relative z-10 flex h-full w-full items-end p-6 pb-20 sm:p-10 lg:p-16">
        <div className="max-w-4xl">
          <h2
            className="font-display font-semibold tracking-tightest text-balance text-bone"
            style={{ fontSize: "clamp(32px, 5vw, 80px)", lineHeight: 0.95 }}
          >
            {title}
          </h2>
        </div>
      </div>
    </section>
  );
}

function BackgroundVideo({ src, objectPosition = "center" }: { src: string; objectPosition?: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      },
      { rootMargin: "120px" },
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      src={src}
      className="absolute inset-0 h-full w-full object-cover"
      style={{ objectPosition }}
      muted
      loop
      playsInline
      preload="metadata"
      disablePictureInPicture
    />
  );
}
