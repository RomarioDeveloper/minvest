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
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

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
          }, 100);
        } else {
          video.pause();
        }
      },
      // rootMargin: сжимаем зону видимости по краям экрана, чтобы видео, 
      // которые только выезжают сбоку слайдера, еще не начинали проигрываться 
      // и не перегружали телефон.
      { threshold: 0, rootMargin: "0px -15% 0px -15%" },
    );
    observer.observe(video);

    return () => {
      observer.disconnect();
      video.pause();
    };
  }, []);

  // Если это мобильное устройство, подменяем расширение на -mobile.mp4, если это mp4
  const finalSrc =
    isMobile && src.endsWith(".mp4") ? src.replace(".mp4", "-mobile.mp4") : src;

  return (
    <video
      ref={ref}
      src={shouldLoad ? getVideoSrc(finalSrc) : undefined}
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
