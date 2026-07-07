type VideoEntry = {
  ratio: number;
  priority: boolean;
};

const videos = new Map<HTMLVideoElement, VideoEntry>();

const MIN_RATIO_TO_PLAY = 0.35;
const MIN_RATIO_TO_PRELOAD = 0.08;

function maxConcurrent() {
  if (typeof window === "undefined") return 1;
  return window.matchMedia("(max-width: 767px)").matches ? 1 : 2;
}

function effectiveRatio(entry: VideoEntry) {
  return entry.ratio + (entry.priority ? 0.25 : 0);
}

function syncPlayback() {
  const ranked = [...videos.entries()]
    .filter(([, entry]) => entry.ratio > 0)
    .sort((a, b) => effectiveRatio(b[1]) - effectiveRatio(a[1]));

  const winners = new Set(
    ranked
      .filter(([, entry]) => effectiveRatio(entry) >= MIN_RATIO_TO_PLAY)
      .slice(0, maxConcurrent())
      .map(([el]) => el),
  );

  for (const [el, entry] of videos) {
    if (entry.ratio >= MIN_RATIO_TO_PRELOAD && el.preload === "none") {
      el.preload = "metadata";
    }

    if (winners.has(el)) {
      el.play().catch(() => {});
      continue;
    }

    el.pause();
  }
}

/** Register a background video — only the most visible 1–2 play at once. */
export function registerLazyVideo(
  video: HTMLVideoElement,
  options: { priority?: boolean } = {},
) {
  if (!video.dataset.src && video.getAttribute("src")) {
    video.dataset.src = video.getAttribute("src")!;
  }

  video.preload = "none";

  videos.set(video, { ratio: 0, priority: !!options.priority });

  const observer = new IntersectionObserver(
    ([entry]) => {
      const current = videos.get(video);
      if (!current) return;
      current.ratio = entry.intersectionRatio;
      syncPlayback();
    },
    { threshold: [0, 0.15, 0.35, 0.55, 0.75, 1] },
  );

  observer.observe(video);

  return () => {
    observer.disconnect();
    videos.delete(video);
    video.pause();
    syncPlayback();
  };
}
