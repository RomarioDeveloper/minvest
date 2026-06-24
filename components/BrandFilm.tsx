"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

type Props = {
  scrubSrc: string;
  poster?: string;
  scrubSrcMobile?: string;
  posterMobile?: string;
};

/** Scroll distance while pinned — controls how long the hero stays on screen. */
const SECTION_VH = 350;

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

function pinProgress(section: HTMLElement): number {
  const scrollable = section.offsetHeight - window.innerHeight;
  if (scrollable <= 0) return 0;
  return clamp01(-section.getBoundingClientRect().top / scrollable);
}

function useScrollScrub(sectionRef: RefObject<HTMLElement | null>, videoRef: RefObject<HTMLVideoElement | null>) {
  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;

    video.pause();

    let lastProgress = -1;
    let rafId = 0;

    const tick = () => {
      const progress = pinProgress(section);

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
  }, [sectionRef, videoRef]);
}

/** Matches Tailwind `md:` — one video per viewport, no double download. */
function useMobileViewport() {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return isMobile;
}

export default function BrandFilm({ scrubSrc, poster, scrubSrcMobile, posterMobile }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isMobile = useMobileViewport();

  useScrollScrub(sectionRef, videoRef);

  const src = isMobile ? (scrubSrcMobile ?? scrubSrc) : scrubSrc;
  const videoPoster = isMobile ? (posterMobile ?? poster) : poster;

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-ink"
      style={{ height: `${SECTION_VH}vh` }}
      aria-label="Видео о доме, управляемое скроллом"
    >
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden bg-ink">
        {isMobile !== null && (
          <video
            ref={videoRef}
            key={src}
            className="absolute inset-0 h-full w-full object-cover"
            src={src}
            poster={videoPoster}
            muted
            playsInline
            preload="auto"
            disablePictureInPicture
          />
        )}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-ink to-transparent" />
      </div>
    </section>
  );
}
