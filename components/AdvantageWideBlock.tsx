"use client";

import { registerLazyVideo } from "@/lib/lazyVideo";
import { useEffect, useRef } from "react";

type Props = {
  title: string;
  body: string;
  video: string;
  videoPosition?: string;
};

export default function AdvantageWideBlock({
  title,
  body,
  video,
  videoPosition = "center",
}: Props) {
  return (
    <section className="relative h-[100svh] w-full overflow-hidden bg-ink">
      <div className="absolute inset-0">
        <WideBlockVideo src={video} objectPosition={videoPosition} />
      </div>

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: "linear-gradient(to top, rgba(8,8,10,0.9) 0%, rgba(8,8,10,0.4) 30%, rgba(8,8,10,0) 60%)",
        }}
      />

      <div className="relative z-10 flex h-full w-full items-end p-6 pb-20 sm:p-10 lg:p-16">
        <div className="max-w-2xl">
          <h3
            className="font-display font-semibold tracking-tightest text-balance text-bone"
            style={{ fontSize: "clamp(32px, 5.5vw, 72px)", lineHeight: 0.98 }}
          >
            {title}
          </h3>
          <p
            className="mt-5 max-w-xl text-pretty text-bone-soft"
            style={{ fontSize: "clamp(15px, 1.15vw, 18px)", lineHeight: 1.6 }}
          >
            {body}
          </p>
        </div>
      </div>
    </section>
  );
}

function WideBlockVideo({ src, objectPosition }: { src: string; objectPosition: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    return registerLazyVideo(video);
  }, []);

  return (
    <video
      ref={ref}
      src={src}
      className="absolute inset-0 h-full w-full object-cover"
      style={{ objectPosition }}
      muted
      loop
      playsInline
      preload="none"
      disablePictureInPicture
    />
  );
}
