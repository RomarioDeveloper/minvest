"use client";

import { registerLazyVideo } from "@/lib/lazyVideo";
import { useEffect, useRef } from "react";

type Props = {
  /** Base path without extension, e.g. "/video/brand". Looks up .webm/.mp4/.jpg. */
  src: string;
  className?: string;
  priority?: boolean;
};

export default function LoopVideo({ src, className = "", priority = false }: Props) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    return registerLazyVideo(video, { priority });
  }, [priority]);

  return (
    <video
      ref={ref}
      className={className}
      muted
      loop
      playsInline
      preload="none"
      poster={`${src}.jpg`}
      disablePictureInPicture
    >
      <source src={`${src}.webm`} type="video/webm" />
      <source src={`${src}.mp4`} type="video/mp4" />
    </video>
  );
}
