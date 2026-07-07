"use client";

import { getVideoSrc, isVideoReady } from "@/lib/videoWarmup";
import { useEffect, useRef, useState } from "react";

type Props = {
  base: string;
  className?: string;
  poster?: string;
};

export default function EagerLoopVideo({ base, className = "", poster }: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const mp4 = `${base}.mp4`;
  const webm = `${base}.webm`;
  const ready = isVideoReady(mp4) || isVideoReady(webm);
  const [active, setActive] = useState(ready);

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
          if (!active) setActive(true);
          playIfVisible();
        } else {
          video.pause();
        }
      },
      { rootMargin: "40% 0px", threshold: 0.05 },
    );
    observer.observe(video);

    window.addEventListener("scroll", pauseForScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", pauseForScroll);
      window.clearTimeout(scrollTimer);
      video.pause();
    };
  }, [active]);

  return (
    <video
      ref={ref}
      className={className}
      muted
      loop
      playsInline
      preload={active ? "auto" : "none"}
      poster={poster ?? `${base}.jpg`}
      disablePictureInPicture
    >
      {active && (
        <>
          <source src={getVideoSrc(webm)} type="video/webm" />
          <source src={getVideoSrc(mp4)} type="video/mp4" />
        </>
      )}
    </video>
  );
}
