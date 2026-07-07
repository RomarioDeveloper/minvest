"use client";

import { getVideoSrc } from "@/lib/videoWarmup";
import { useEffect, useRef, useState } from "react";

type Props = {
  src: string;
  className?: string;
  style?: React.CSSProperties;
  objectPosition?: string;
};

/** Background loop video — load and play only in view. */
export default function EagerVideo({ src, className = "", style, objectPosition }: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const posterSrc = src.endsWith(".mp4") ? src.replace(".mp4", ".jpg") : undefined;

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          // Small timeout ensures src is updated before play is called
          setTimeout(() => {
            if (ref.current) ref.current.play().catch(() => {});
          }, 50);
        } else {
          video.pause();
        }
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
      src={shouldLoad ? getVideoSrc(src) : undefined}
      className={className}
      style={{ objectPosition, ...style }}
      muted
      loop
      playsInline
      preload="none"
      poster={posterSrc}
      disablePictureInPicture
    />
  );
}
