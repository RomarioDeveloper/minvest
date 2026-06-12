"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  /** All-intra mp4 for frame-accurate scrubbing (desktop). */
  scrubSrc: string;
  poster: string;
};

/** Scroll distance while pinned. */
const SECTION_VH = 300;

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

function pinProgress(section: HTMLElement): number {
  const scrollable = section.offsetHeight - window.innerHeight;
  if (scrollable <= 0) return 0;
  return clamp01(-section.getBoundingClientRect().top / scrollable);
}

/**
 * Brand film section — clean, no overlays: the film carries its own titles.
 *
 * Desktop: the video is pinned fullscreen and scrubbed by scroll — the same
 * cinematic grammar as the opening 3D tour. The mp4 is encoded all-intra
 * (every frame a keyframe), so seeking is instant and the scrub reads as
 * buttery playback.
 *
 * Mobile: the section is omitted entirely — desktop only.
 */
export default function BrandFilm({ scrubSrc, poster }: Props) {
  const [mobile, setMobile] = useState<boolean | null>(null);

  useEffect(() => {
    setMobile(window.matchMedia("(max-width: 767px)").matches);
  }, []);

  if (mobile === null || mobile) return null;

  return <ScrubFilm scrubSrc={scrubSrc} poster={poster} />;
}

function ScrubFilm({ scrubSrc, poster }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;

    let rafId = 0;
    let smooth = pinProgress(section);
    let lastTime = performance.now();

    const tick = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      const target = pinProgress(section);
      // Framerate-independent inertia — same feel as the opening tour scrub.
      const k = 1 - Math.exp(-5 * dt);
      smooth += (target - smooth) * k;
      if (Math.abs(target - smooth) < 0.0003) smooth = target;

      const duration = video.duration;
      if (Number.isFinite(duration) && duration > 0 && video.readyState >= 1) {
        const t = smooth * Math.max(0, duration - 0.05);
        if (Math.abs(video.currentTime - t) > 1 / 50) {
          video.currentTime = t;
        }
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-ink"
      style={{ height: `${SECTION_VH}vh` }}
      aria-label="Фильм о застройщике, управляемый скроллом"
    >
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden bg-ink">
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          src={scrubSrc}
          poster={poster}
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
        />
      </div>
    </section>
  );
}
