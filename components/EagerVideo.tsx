"use client";

import { getVideoSrc, isVideoReady } from "@/lib/videoWarmup";
import { useEffect, useRef, useState } from "react";

type Props = {
  src: string;
  className?: string;
  style?: React.CSSProperties;
  objectPosition?: string;
};

/**
 * Background loop video.
 * - Source is attached only when the section is near the viewport (saves CPU).
 * - Data is already in cache from the preloader, so it appears instantly.
 * - Pauses while scrolling to keep scroll smooth on fullscreen sections.
 */
export default function EagerVideo({ src, className = "", style, objectPosition }: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const [activeSrc, setActiveSrc] = useState<string | null>(() =>
    isVideoReady(src) ? getVideoSrc(src) : null,
  );

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    let scrollTimer: number | undefined;
    let visible = false;

    const playIfVisible = () => {
      if (visible) video.play().catch(() => {});
    };

    const pauseForScroll = () => {
      video.pause();
      window.clearTimeout(scrollTimer);
      scrollTimer = window.setTimeout(playIfVisible, 120);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;

        if (entry.isIntersecting) {
          if (!activeSrc) setActiveSrc(getVideoSrc(src));
          playIfVisible();
        } else {
          video.pause();
        }
      },
      { rootMargin: "80% 0px", threshold: 0.05 },
    );
    observer.observe(video);

    window.addEventListener("scroll", pauseForScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", pauseForScroll);
      window.clearTimeout(scrollTimer);
      video.pause();
    };
  }, [activeSrc, src]);

  return (
    <video
      ref={ref}
      src={activeSrc ?? undefined}
      className={className}
      style={{ objectPosition, contain: "strict", ...style }}
      muted
      loop
      playsInline
      preload={activeSrc ? "auto" : "none"}
      disablePictureInPicture
    />
  );
}
