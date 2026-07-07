"use client";

import { useEffect, useRef } from "react";

type Props = {
  src: string;
  className?: string;
  style?: React.CSSProperties;
  objectPosition?: string;
};

/** Background loop video — preloaded up front, plays only while in view. */
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
      src={src}
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
