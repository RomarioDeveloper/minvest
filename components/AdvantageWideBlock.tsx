"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";

type Props = {
  title: string;
  body: string;
  video: string;
  videoPosition?: string;
};

export default function AdvantageWideBlock({
  title,
  body,
  video,
  videoPosition = "center",
}: Props) {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const videoY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const washOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.55, 0.8, 0.8, 0.55]);
  const copyY = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], ["32px", "0px", "-12px", "-40px"]);
  const copyOpacity = useTransform(scrollYProgress, [0.05, 0.22, 0.82, 1], [0, 1, 1, 0]);

  return (
    <section
      ref={sectionRef}
      className="relative h-[100svh] min-h-[560px] w-full overflow-hidden bg-ink"
    >
      <motion.div
        className="absolute inset-0 will-change-transform"
        style={{ y: videoY, scale: 1.05 }}
      >
        <WideBlockVideo src={video} objectPosition={videoPosition} />
      </motion.div>

      <motion.div
        className="pointer-events-none absolute inset-0"
        style={{
          opacity: washOpacity,
          background:
            "linear-gradient(to top, rgba(8,8,10,0.92) 0%, rgba(8,8,10,0.35) 42%, rgba(8,8,10,0) 68%)",
        }}
      />

      <div className="relative z-10 flex h-full w-full items-end p-6 sm:p-10 lg:p-16">
        <motion.div
          className="max-w-2xl will-change-transform"
          style={{ y: copyY, opacity: copyOpacity }}
        >
          <h3
            className="font-display font-semibold tracking-tightest text-balance text-bone"
            style={{ fontSize: "clamp(32px, 5.5vw, 72px)", lineHeight: 0.98 }}
          >
            {title}
          </h3>
          <p
            className="mt-5 max-w-xl text-pretty text-bone-soft"
            style={{ fontSize: "clamp(15px, 1.15vw, 18px)", lineHeight: 1.6 }}
          >
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
