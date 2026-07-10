const ready = new Set<string>();
const blobUrls = new Map<string, string>();
const warming = new Map<string, Promise<void>>();

/** Videos above this size are warmed via a temp element + HTTP cache, not a blob. */
const BLOB_MAX_BYTES = 25 * 1024 * 1024;
const WARM_CONCURRENCY = 3;

export function isVideoReady(src: string) {
  return ready.has(src);
}

export function getVideoSrc(src: string) {
  return blobUrls.get(src) ?? src;
}

async function warmWithFetch(src: string, lowPriority = false) {
  // priority: "low" — фоновый прогрев не должен отбирать полосу у кадров
  // hero-секвенции, которые грузятся во время первого скролла.
  // (в lib.dom ещё нет типа Priority Hints, поэтому каст)
  const resp = await fetch(src, lowPriority ? ({ priority: "low" } as RequestInit) : undefined);
  if (!resp.ok) throw new Error(`fetch failed: ${src}`);
  const blob = await resp.blob();
  blobUrls.set(src, URL.createObjectURL(blob));
}

async function warmWithElement(src: string) {
  await new Promise<void>((resolve) => {
    const video = document.createElement("video");
    video.muted = true;
    video.playsInline = true;
    video.preload = "auto";
    video.src = src;

    let settled = false;
    const done = () => {
      if (settled) return;
      settled = true;
      video.removeEventListener("canplay", done);
      video.removeEventListener("loadeddata", done);
      video.removeEventListener("error", done);
      video.src = "";
      video.load();
      resolve();
    };

    video.addEventListener("canplay", done);
    video.addEventListener("loadeddata", done);
    video.addEventListener("error", done);
    video.load();
    if (video.readyState >= 2) done();
  });
}

async function warmOne(src: string, lowPriority = false) {
  if (ready.has(src)) return;

  try {
    const head = await fetch(src, { method: "HEAD" });
    const size = Number(head.headers.get("content-length") ?? 0);
    if (size > 0 && size <= BLOB_MAX_BYTES) {
      await warmWithFetch(src, lowPriority);
    } else {
      await warmWithElement(src);
    }
  } catch {
    try {
      await warmWithElement(src);
    } catch {
      /* still mark ready so the preloader doesn't hang forever */
    }
  }

  ready.add(src);
}

async function runPool(
  srcs: string[],
  onProgress?: (fraction: number) => void,
  options?: { lowPriority?: boolean; concurrency?: number },
) {
  const queue = srcs.filter((s) => !ready.has(s));
  const total = srcs.length;
  let done = srcs.filter((s) => ready.has(s)).length;
  onProgress?.(done / total);

  let index = 0;
  async function worker() {
    while (index < queue.length) {
      const src = queue[index++];
      await warmOne(src, options?.lowPriority);
      done += 1;
      onProgress?.(done / total);
    }
  }

  const concurrency = options?.concurrency ?? WARM_CONCURRENCY;
  const workers = Array.from({ length: Math.min(concurrency, queue.length || 1) }, () =>
    worker(),
  );
  await Promise.all(workers);
}

/**
 * Preloads videos during the preloader into memory / HTTP cache.
 * Does NOT keep hidden <video> elements alive — that was causing scroll jank.
 */
export function warmSiteVideos(
  srcs: readonly string[],
  onProgress?: (readyFraction: number) => void,
): Promise<void> {
  if (typeof document === "undefined" || srcs.length === 0) {
    return Promise.resolve();
  }
  return runPool([...new Set(srcs)], onProgress);
}

export function warmSiteVideosBackground(srcs: readonly string[]) {
  // Один поток и низкий приоритет: этот прогрев стартует ровно в момент,
  // когда занавес поднимается и человек делает первый скролл — раньше он
  // конкурировал с загрузкой кадров hero-секвенции и первый скролл дёргался.
  void runPool([...new Set(srcs)], undefined, { lowPriority: true, concurrency: 1 });
}
