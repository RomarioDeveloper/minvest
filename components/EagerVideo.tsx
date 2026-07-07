"use client";

import { getVideoSrc } from "@/lib/videoWarmup";
import { useEffect, useRef } from "react";

type Props = {
  src: string;
  className?: string;
  style?: React.CSSProperties;
  objectPosition?: string;
};

/** Background loop video — src is always set (preloaded in cache), play only in view. */
export default function EagerVideo({ src, className = "", style, objectPosition }: Props) {
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
      src={getVideoSrc(src)}
      className={className}
      style={{ objectPosition, ...style }}
      muted
      loop
      playsInline
      preload="auto"
      disablePictureInPicture
    />
  );
}
