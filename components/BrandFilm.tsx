"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import VideoSpread from "@/components/VideoSpread";

type Props = {
  /** All-intra mp4 for frame-accurate scrubbing (desktop). */
  scrubSrc: string;
  /** Base path (no extension) of the looped version for mobile. */
  loopSrc: string;
  poster: string;
  eyebrow: string;
  title: React.ReactNode;
  body?: React.ReactNode;
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
 * Brand film section.
 *
 * Desktop: the video is pinned fullscreen and scrubbed by scroll — the same
 * cinematic grammar as the opening 3D tour. The mp4 is encoded all-intra
 * (every frame a keyframe), so seeking is instant and the scrub reads as
 * buttery playback.
 *
 * Mobile: scrubbing via currentTime is unreliable on touch Safari/Chrome,
 * so phones get the auto-playing looped spread instead.
 */
export default function BrandFilm({ scrubSrc, loopSrc, poster, eyebrow, title, body }: Props) {
  const [mobile, setMobile] = useState<boolean | null>(null);

  useEffect(() => {
    setMobile(window.matchMedia("(max-width: 767px)").matches);
  }, []);

  if (mobile === null) {
    return <section className="h-[100svh] w-full bg-ink" aria-hidden="true" />;
  }

  if (mobile) {
    return <VideoSpread src={loopSrc} eyebrow={eyebrow} title={title} body={body} />;
  }

  return (
    <ScrubFilm scrubSrc={scrubSrc} poster={poster} eyebrow={eyebrow} title={title} body={body} />
  );
}

function ScrubFilm({ scrubSrc, poster, eyebrow, title, body }: Omit<Props, "loopSrc">) {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Copy fades in for the middle of the scrub and back out near the end,
  // so the titles embedded in the film itself stay legible at the edges.
  const copyOpacity = useTransform(scrollYProgress, [0.08, 0.22, 0.8, 0.95], [0, 1, 1, 0]);
  const copyY = useTransform(scrollYProgress, [0, 1], ["24px", "-24px"]);
  const barScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

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

        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(8,8,10,0.45) 0%, transparent 22%, transparent 70%, rgba(8,8,10,0.85) 100%)",
          }}
        />

        <div className="relative z-10 flex h-full w-full items-end p-6 sm:p-10 lg:p-16">
          <motion.div
            className="max-w-2xl will-change-transform"
            style={{ y: copyY, opacity: copyOpacity }}
          >
            <div className="flex items-baseline gap-3 text-eyebrow uppercase text-bone-mute">
              <span className="h-[1px] w-8 bg-bone/40" />
              <span>{eyebrow}</span>
            </div>
            <h2
              className="mt-5 font-display font-semibold text-bone tracking-tightest text-balance"
              style={{ fontSize: "clamp(36px, 6vw, 92px)", lineHeight: 0.95 }}
            >
              {title}
            </h2>
            {body && (
              <div
                className="mt-6 max-w-xl text-pretty text-bone-soft"
                style={{ fontSize: "clamp(15px, 1.15vw, 18px)", lineHeight: 1.6 }}
              >
                {body}
              </div>
            )}
          </motion.div>
        </div>

        {/* Scrub progress */}
        <div className="pointer-events-none absolute inset-x-6 bottom-6 z-10 sm:inset-x-10 lg:inset-x-16">
          <div className="h-[1px] w-full overflow-hidden bg-bone/10">
            <motion.div className="h-full origin-left bg-bone/70" style={{ scaleX: barScale }} />
          </div>
        </div>
      </div>
    </section>
  );
}
