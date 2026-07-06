"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";

type Props = {
  index: string;
  title: string;
  body: string;
  video: string;
  videoPosition?: string;
  reverse?: boolean;
};

export default function AdvantageWideBlock({
  index,
  title,
  body,
  video,
  videoPosition = "center",
  reverse = false,
}: Props) {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const videoY = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);
  const videoScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.1, 1, 1.1]);
  const copyY = useTransform(scrollYProgress, [0, 0.3, 1], [40, 0, -30]);
  const copyOpacity = useTransform(scrollYProgress, [0.08, 0.25, 0.85, 1], [0, 1, 1, 0]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full border-t border-bone/10 bg-ink-deep"
    >
      <div
        className={`mx-auto flex max-w-[1600px] flex-col lg:min-h-[85svh] lg:flex-row lg:items-stretch ${
          reverse ? "lg:flex-row-reverse" : ""
        }`}
      >
        <div className="flex items-start gap-6 px-6 pt-10 sm:px-10 lg:w-[52%] lg:px-16 lg:py-16">
          <span className="hidden shrink-0 font-display text-5xl font-semibold tracking-tightest text-bone/20 lg:block lg:text-6xl">
            {index}
          </span>

          <motion.div
            style={{ y: videoY, scale: videoScale }}
            className="relative aspect-[16/10] w-full overflow-hidden will-change-transform lg:aspect-auto lg:min-h-[420px] lg:flex-1"
          >
            <WideBlockVideo src={video} objectPosition={videoPosition} />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-deep/30 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-ink-deep/20" />
          </motion.div>
        </div>

        <motion.div
          style={{ y: copyY, opacity: copyOpacity }}
          className="flex flex-1 flex-col justify-center px-6 pb-12 pt-8 will-change-transform sm:px-10 lg:px-16 lg:py-16"
        >
          <span className="font-display text-5xl font-semibold tracking-tightest text-bone/15 lg:hidden">
            {index}
          </span>
          <h3
            className="mt-4 font-display font-semibold tracking-tightest text-balance text-bone lg:mt-0"
            style={{ fontSize: "clamp(28px, 3.8vw, 52px)", lineHeight: 1.05 }}
          >
            {title}
          </h3>
          <p className="mt-5 max-w-lg text-pretty text-base leading-relaxed text-bone-soft sm:text-[17px]">
            {body}
          </p>
        </motion.div>
      </div>
    </section>
  );
}

function WideBlockVideo({ src, objectPosition }: { src: string; objectPosition: string }) {
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
