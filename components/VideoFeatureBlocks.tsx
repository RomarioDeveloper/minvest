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
        title="Самые удобные квадратуры и гибкие планировки"
        video="/16745051196022.mp4"
      />
      <FeatureBlock
        title="Закрытые детские площадки — ваши дети будут в безопасности"
        video="/entrance-gate.mp4"
      />
      <FeatureBlock
        title="Тишина и уют"
        video="/16745009121910.mp4"
      />
      <FeatureBlock
        title="Экибастузский кирпич"
        video="/16744999619190.mp4"
      />
      <SplitFeatureBlock
        title="Объекты которые находятся на этапе ввода в эксплуатацию"
        video="/objects-commissioning.mp4"
      />
    </div>
  );
}

function SplitFeatureBlock({ title, video }: BlockProps) {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const videoY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const videoScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.12, 1.02, 1.12]);
  const copyY = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], ["40px", "0px", "-20px", "-60px"]);
  const copyOpacity = useTransform(scrollYProgress, [0.05, 0.22, 0.82, 1], [0, 1, 1, 0]);

  return (
    <section
      ref={sectionRef}
      data-scroll-snap
      className="relative flex h-[100svh] min-h-[560px] w-full flex-col md:flex-row overflow-hidden bg-ink"
    >
      {/* Mobile background video */}
      <motion.div
        className="absolute inset-0 will-change-transform md:hidden"
        style={{ y: videoY, scale: videoScale }}
      >
        <BackgroundVideo src={video} />
      </motion.div>

      {/* Mobile gradient wash */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent md:hidden" />

      {/* Text Container */}
      <div className="relative z-10 flex h-full w-full items-end p-6 sm:p-10 md:w-1/2 md:items-center md:p-16 lg:p-24">
        <motion.div
          className="max-w-4xl will-change-transform"
          style={{ y: copyY, opacity: copyOpacity }}
        >
          <h2
            className="font-display font-semibold tracking-tightest text-balance text-bone"
            style={{ fontSize: "clamp(32px, 4vw, 64px)", lineHeight: 0.98 }}
          >
            {title}
          </h2>
        </motion.div>
      </div>

      {/* Desktop Video Container */}
      <div className="relative hidden h-full w-1/2 overflow-hidden md:block">
        <motion.div
          className="absolute inset-0 will-change-transform"
          style={{ y: videoY, scale: videoScale }}
        >
          <BackgroundVideo src={video} />
        </motion.div>
      </div>
    </section>
  );
}

function FeatureBlock({ title, video }: BlockProps) {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const videoY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const videoScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.12, 1.02, 1.12]);
  const washOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.5, 0.85, 0.85, 0.5]);
  const copyY = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], ["40px", "0px", "-20px", "-60px"]);
  const copyOpacity = useTransform(scrollYProgress, [0.05, 0.22, 0.82, 1], [0, 1, 1, 0]);

  return (
    <section
      ref={sectionRef}
      data-scroll-snap
      className="relative h-[100svh] min-h-[560px] w-full overflow-hidden bg-ink"
    >
      <motion.div
        className="absolute inset-0 will-change-transform"
        style={{ y: videoY, scale: videoScale }}
      >
        <BackgroundVideo src={video} />
      </motion.div>

      <motion.div
        className="pointer-events-none absolute inset-0"
        style={{
          opacity: washOpacity,
          background:
            "linear-gradient(to top, rgba(8,8,10,0.95) 0%, rgba(8,8,10,0.3) 45%, rgba(8,8,10,0) 75%)",
        }}
      />

      <div className="relative z-10 flex h-full w-full items-end p-6 sm:p-10 lg:p-16">
        <motion.div
          className="max-w-4xl will-change-transform"
          style={{ y: copyY, opacity: copyOpacity }}
        >
          <h2
            className="font-display font-semibold tracking-tightest text-balance text-bone"
            style={{ fontSize: "clamp(32px, 5vw, 80px)", lineHeight: 0.95 }}
          >
            {title}
          </h2>
        </motion.div>
      </div>
    </section>
  );
}

function BackgroundVideo({ src }: { src: string }) {
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
      muted
      loop
      playsInline
      preload="metadata"
      disablePictureInPicture
    />
  );
}
