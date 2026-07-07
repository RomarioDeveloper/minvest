"use client";

import { getVideoSrc } from "@/lib/videoWarmup";
import { useEffect, useRef } from "react";

type Props = {
  base: string;
  className?: string;
  poster?: string;
};

/** Hero / multi-format loop — sources always set, play only in view. */
export default function EagerLoopVideo({ base, className = "", poster }: Props) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.15 },
    );
    observer.observe(video);

    return () => {
      observer.disconnect();
      video.pause();
    };
  }, []);

  return (
    <video
      ref={ref}
      className={className}
      muted
      loop
      playsInline
      preload="auto"
      poster={poster ?? `${base}.jpg`}
      disablePictureInPicture
    >
      <source src={getVideoSrc(`${base}.webm`)} type="video/webm" />
      <source src={getVideoSrc(`${base}.mp4`)} type="video/mp4" />
    </video>
  );
}
