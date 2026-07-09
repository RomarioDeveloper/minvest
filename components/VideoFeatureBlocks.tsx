"use client";

import EagerVideo from "@/components/EagerVideo";

type BlockProps = {
  title: string;
  video: string;
};

export default function VideoFeatureBlocks() {
  return (
    <div className="flex flex-col">
      <FeatureBlock
        title="Закрытые детские площадки — ваши дети будут в безопасности"
        video="/entrance-gate.mp4"
        objectPosition="center top"
      />
      <FeatureBlock
        title="Тишина и уют"
        video="/16745009121910.mp4"
        objectPosition="center"
      />
      <FeatureBlock
        title="Экибастузский кирпич"
        video="/16744999619190.mp4"
        objectPosition="center"
      />
      <SplitFeatureBlock
        title="Объекты которые находятся на этапе ввода в эксплуатацию"
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

function FeatureBlock({ title, video, objectPosition = "center" }: BlockProps & { objectPosition?: string }) {
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
