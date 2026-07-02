"use client";

import { pinProgress } from "@/lib/scrollCanvas";
import { useEffect, useRef, useState } from "react";

type Props = {
  /** Video encoded with all-keyframes (g=1) — required for instant seeking. */
  videoSrc: string;
  videoSrcMobile?: string;
  poster?: string;
  posterMobile?: string;
};

const SECTION_VH_MOBILE = 300;
const SECTION_VH_DESKTOP = 520;

function useMobileViewport() {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return isMobile;
}

/**
 * Scroll-scrubbed fullscreen video (the Apple / TAG Heuer technique):
 *
 *   1. The MP4 is fetched into a Blob first — after that every seek reads
 *      from memory, so there is zero network jitter while scrolling.
 *   2. The file is encoded with every frame as a keyframe (g=1), which makes
 *      currentTime / fastSeek land instantly on the exact frame — full
 *      source quality, no JPEG re-compression, no canvas scaling.
 *   3. Scroll progress is eased with a framerate-independent lerp, so wheel
 *      steps and touch flicks turn into weighted, cinematic motion.
 */
export default function BrandFilm({
  videoSrc,
  videoSrcMobile,
  poster,
  posterMobile,
}: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isMobile = useMobileViewport();

  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [videoReady, setVideoReady] = useState(false);

  const ready = isMobile !== null;
  const mobile = isMobile === true;
  const src = mobile ? (videoSrcMobile ?? videoSrc) : videoSrc;
  const videoPoster = mobile ? (posterMobile ?? poster) : poster;
  const sectionVh = isMobile === false ? SECTION_VH_DESKTOP : SECTION_VH_MOBILE;

  // Download the video into a Blob with progress for the preloader.
  useEffect(() => {
    if (!ready || !src) return;

    let cancelled = false;
    let objectUrl: string | null = null;

    setVideoReady(false);
    setBlobUrl(null);
    window.dispatchEvent(new CustomEvent("brandfilm:progress", { detail: 0 }));

    (async () => {
      try {
        const res = await fetch(src);
        if (!res.ok || !res.body) throw new Error(`fetch failed: ${res.status}`);

        const total = Number(res.headers.get("content-length")) || 0;
        const reader = res.body.getReader();
        const chunks: BlobPart[] = [];
        let received = 0;

        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          if (cancelled) {
            reader.cancel();
            return;
          }
          chunks.push(value);
          received += value.byteLength;
          if (total > 0) {
            window.dispatchEvent(
              new CustomEvent("brandfilm:progress", { detail: received / total }),
            );
          }
        }

        if (cancelled) return;
        objectUrl = URL.createObjectURL(new Blob(chunks, { type: "video/mp4" }));
        window.dispatchEvent(new CustomEvent("brandfilm:progress", { detail: 1 }));
        setBlobUrl(objectUrl);
      } catch {
        // Blob download failed (offline, dev reload) — stream straight from
        // the network instead of blocking the page behind the preloader.
        if (!cancelled) setBlobUrl(src);
      }
    })();

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [ready, src]);

  // Scrub loop: eased progress → seek, never queueing seeks on top of
  // each other (waiting for `seeked` keeps Safari from stuttering).
  useEffect(() => {
    if (!ready || !blobUrl) return;

    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;

    let rafId = 0;
    let active = true;
    let duration = 0;
    let smooth = pinProgress(section);
    let lastTime = performance.now();
    let seekPending = false;

    const onLoaded = () => {
      duration = video.duration || 0;
      // Land on the current scroll position immediately.
      smooth = pinProgress(section);
      if (duration > 0) video.currentTime = smooth * duration;
      setVideoReady(true);
      window.dispatchEvent(new CustomEvent("brandfilm:ready"));
    };

    const onSeeked = () => {
      seekPending = false;
    };

    const seek = (t: number) => {
      if (seekPending) return;
      seekPending = true;
      // fastSeek is exact here because every frame is a keyframe.
      if ("fastSeek" in video) video.fastSeek(t);
      else (video as HTMLVideoElement).currentTime = t;
    };

    const tick = (now: number) => {
      rafId = requestAnimationFrame(tick);
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      if (!active || duration === 0) return;

      const target = pinProgress(section);
      // Framerate-independent ease toward the scroll position — absorbs
      // discrete wheel steps into weighted, continuous motion.
      const k = 1 - Math.exp(-6 * dt);
      smooth += (target - smooth) * k;
      if (Math.abs(target - smooth) < 0.0004) smooth = target;

      const t = smooth * duration;
      // Skip sub-frame seeks (~30fps source) to avoid useless decode work.
      if (Math.abs(video.currentTime - t) > 1 / 60) seek(t);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        active = entry.isIntersecting;
      },
      { rootMargin: "100px 0px" },
    );
    observer.observe(section);

    video.addEventListener("loadedmetadata", onLoaded);
    video.addEventListener("seeked", onSeeked);
    if (video.readyState >= 1) onLoaded();

    video.src = blobUrl;
    video.load();
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      observer.disconnect();
      video.removeEventListener("loadedmetadata", onLoaded);
      video.removeEventListener("seeked", onSeeked);
    };
  }, [ready, blobUrl]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-ink"
      style={{ height: `${sectionVh}dvh` }}
      aria-label="Видео о доме, управляемое скроллом"
    >
      <div className="sticky top-0 h-[100dvh] w-full overflow-hidden bg-ink supports-[height:100svh]:h-[100svh]">
        {videoPoster && !videoReady && (
          <img
            src={videoPoster}
            alt=""
            aria-hidden
            className="pointer-events-none absolute inset-0 h-full w-full object-cover"
            draggable={false}
          />
        )}
        <video
          ref={videoRef}
          className={`pointer-events-none absolute inset-0 z-[1] h-full w-full object-cover transition-opacity duration-300 ${
            videoReady ? "opacity-100" : "opacity-0"
          }`}
          muted
          playsInline
          preload="auto"
          aria-hidden
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-32 bg-gradient-to-t from-ink to-transparent" />
      </div>
    </section>
  );
}
