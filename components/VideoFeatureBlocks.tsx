"use client";

import EagerVideo from "@/components/EagerVideo";
import { getVideoSrc } from "@/lib/videoWarmup";
import { useI18n } from "@/lib/i18n";
import { useEffect, useRef, useState } from "react";

type BlockProps = {
  title: string;
  body?: string;
  video: string;
  compactBody?: boolean;
};

const LIFESTYLE_VIDEOS = [
  "/blockanimation/woman-tea.mp4",
  "/blockanimation/woman-book.mp4",
] as const;

export default function VideoFeatureBlocks() {
  const { t } = useI18n();

  return (
    <div className="flex flex-col">
      <FeatureBlock
        title={t("feat.title1")}
        body={t("feat.body1")}
        compactBody
        video="/entrance-gate.mp4"
        objectPosition="center top"
      />
      <CrossfadeFeatureBlock
        title={t("feat.title2")}
        videos={[...LIFESTYLE_VIDEOS]}
      />
      <FeatureBlock
        title={t("feat.title3")}
        body={t("feat.body3")}
        video="/16744999619190.mp4"
        objectPosition="center"
      />
      <SplitFeatureBlock
        title={t("feat.title4")}
        video="/objects-commissioning.mp4"
        // Зум + сдвиг влево/вверх: режем соседние частные дома справа и стройку у цоколя.
        objectPosition="12% 38%"
        videoClassName="scale-[1.38] origin-[12%_38%]"
      />
    </div>
  );
}

function SplitFeatureBlock({
  title,
  video,
  objectPosition = "center",
  videoClassName = "",
}: BlockProps & { objectPosition?: string; videoClassName?: string }) {
  return (
    <section className="relative isolate flex h-[100svh] min-h-[100svh] w-full flex-col overflow-hidden bg-ink md:flex-row">
      <div className="absolute inset-0 overflow-hidden md:left-1/2 md:w-1/2">
        <EagerVideo
          src={video}
          objectPosition={objectPosition}
          className={`h-full w-full object-cover ${videoClassName}`}
        />
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-[45%] bg-gradient-to-t from-ink via-ink/40 to-transparent md:hidden" />

      <div className="relative z-10 flex h-full w-full items-end p-6 pb-20 sm:p-10 md:w-1/2 md:items-center md:p-16 lg:p-24">
        <div className="max-w-4xl">
          <h2
            className="font-display font-semibold tracking-tightest text-balance text-bone"
            style={{ fontSize: "clamp(32px, 4vw, 64px)", lineHeight: 0.98 }}
          >
            {title}
          </h2>
        </div>
      </div>
    </section>
  );
}

function FeatureBlock({
  title,
  body,
  video,
  objectPosition = "center",
  compactBody = false,
}: BlockProps & { objectPosition?: string }) {
  return (
    <section className="relative isolate h-[100svh] min-h-[100svh] w-full overflow-hidden bg-ink">
      <EagerVideo
        src={video}
        objectPosition={objectPosition}
        className="absolute inset-0 h-full w-full min-h-full min-w-full object-cover"
      />

      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-[45%]"
        style={{
          background: "linear-gradient(to top, rgba(8,8,10,0.92) 0%, rgba(8,8,10,0.35) 28%, transparent 55%)",
        }}
      />

      <div className="relative z-10 flex h-full w-full items-end p-6 pb-20 sm:p-10 lg:p-16">
        <div className="max-w-3xl">
          <h2
            className="font-display font-semibold tracking-tightest text-pretty text-bone"
            style={{ fontSize: "clamp(32px, 5vw, 72px)", lineHeight: 0.98 }}
          >
            {title}
          </h2>
          {body && (
            <p
              className={`mt-5 max-w-xl text-pretty ${
                compactBody
                  ? "text-bone/70"
                  : "font-display font-medium tracking-tight text-bone/80"
              }`}
              style={{
                fontSize: compactBody ? "clamp(14px, 1.3vw, 18px)" : "clamp(18px, 2.2vw, 28px)",
                lineHeight: compactBody ? 1.5 : 1.25,
              }}
            >
              {body}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

/** Fullscreen lifestyle block: soft crossfade between two real-life clips. */
function CrossfadeFeatureBlock({
  title,
  videos,
}: {
  title: string;
  videos: string[];
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          videoRefs.current.forEach((v) => v?.play().catch(() => {}));
        } else {
          videoRefs.current.forEach((v) => v?.pause());
        }
      },
      { threshold: 0.15, rootMargin: "0px 50% 0px 50%" },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  // Crossfade on a calm cadence — hold each clip, then dissolve into the next.
  useEffect(() => {
    if (!shouldLoad || videos.length < 2) return;
    const HOLD_MS = 7000;
    const id = window.setInterval(() => {
      setActive((prev) => {
        const next = (prev + 1) % videos.length;
        const nextVideo = videoRefs.current[next];
        if (nextVideo) {
          nextVideo.currentTime = 0;
          nextVideo.play().catch(() => {});
        }
        return next;
      });
    }, HOLD_MS);
    return () => window.clearInterval(id);
  }, [shouldLoad, videos.length]);

  const resolveSrc = (src: string) => {
    const path =
      isMobile && src.endsWith(".mp4") ? src.replace(".mp4", "-mobile.mp4") : src;
    return shouldLoad ? getVideoSrc(path) : undefined;
  };

  return (
    <section
      ref={sectionRef}
      className="relative isolate h-[100svh] min-h-[100svh] w-full overflow-hidden bg-ink"
    >
      {videos.map((src, i) => {
        const poster = src.endsWith(".mp4") ? src.replace(".mp4", ".jpg") : undefined;
        const isActive = i === active;
        return (
          <div
            key={src}
            className="absolute inset-0 transition-opacity duration-[1400ms] ease-[cubic-bezier(0.4,0,0.2,1)]"
            style={{ opacity: isActive ? 1 : 0 }}
          >
            {poster && (
              <img
                src={poster}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
                style={{ zIndex: -1 }}
              />
            )}
            <video
              ref={(el) => {
                videoRefs.current[i] = el;
              }}
              src={resolveSrc(src)}
              className="absolute inset-0 h-full w-full min-h-full min-w-full object-cover transition-transform duration-[7000ms] ease-out"
              style={{
                transform: isActive ? "scale(1.06)" : "scale(1)",
                objectPosition: "center",
              }}
              autoPlay={shouldLoad && isActive}
              muted
              loop
              playsInline
              preload="none"
              poster={poster}
              disablePictureInPicture
            />
          </div>
        );
      })}

      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-[45%]"
        style={{
          background: "linear-gradient(to top, rgba(8,8,10,0.92) 0%, rgba(8,8,10,0.35) 28%, transparent 55%)",
        }}
      />

      <div className="relative z-10 flex h-full w-full items-end p-6 pb-20 sm:p-10 lg:p-16">
        <div className="max-w-4xl">
          <h2
            className="font-display font-semibold tracking-tightest text-balance text-bone"
            style={{ fontSize: "clamp(32px, 5vw, 80px)", lineHeight: 0.95 }}
          >
            {title}
          </h2>
        </div>
      </div>
    </section>
  );
}
