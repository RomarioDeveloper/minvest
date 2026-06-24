"use client";

import { useEffect, useRef } from "react";

type Props = {
  /** Base path without extension, e.g. "/video/brand". Looks up .webm/.mp4/.jpg. */
  src: string;
  className?: string;
};

/**
 * Looping background video that only plays while on screen — keeps scroll
 * smooth and saves battery: offscreen videos are paused, not decoded.
 */
export default function LoopVideo({ src, className = "" }: Props) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { rootMargin: "120px" },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      className={className}
      muted
      loop
      playsInline
      preload="metadata"
      poster={`${src}.jpg`}
      disablePictureInPicture
    >
      <source src={`${src}.webm`} type="video/webm" />
      <source src={`${src}.mp4`} type="video/mp4" />
    </video>
  );
}
