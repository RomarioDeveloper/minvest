"use client";

import { useEffect, useRef } from "react";

type Props = {
  scrubSrc: string;
  poster?: string;
};

/** Scroll distance while pinned — controls how long the hero stays on screen. */
const SECTION_VH = 350;

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

function pinProgress(section: HTMLElement): number {
  const scrollable = section.offsetHeight - window.innerHeight;
  if (scrollable <= 0) return 0;
  return clamp01(-section.getBoundingClientRect().top / scrollable);
}

export default function BrandFilm({ scrubSrc, poster }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;

    // Prevent the browser from ever trying to "play" the video
    video.pause();

    let lastProgress = -1;
    let rafId = 0;

    const tick = () => {
      const progress = pinProgress(section);

      // Only write currentTime when it actually changes (avoids redundant seeks)
      if (Math.abs(progress - lastProgress) > 0.0004) {
        lastProgress = progress;
        const duration = video.duration;
        if (Number.isFinite(duration) && duration > 0 && video.readyState >= 1) {
          video.currentTime = progress * Math.max(0, duration - 0.05);
        }
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-ink"
      style={{ height: `${SECTION_VH}vh` }}
      aria-label="Видео о доме, управляемое скроллом"
    >
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden bg-ink">
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          src={scrubSrc}
          poster={poster}
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-ink to-transparent" />
      </div>
    </section>
  );
}
