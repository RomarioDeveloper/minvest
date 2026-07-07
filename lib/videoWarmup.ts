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

async function warmWithFetch(src: string) {
  const resp = await fetch(src);
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

async function warmOne(src: string) {
  if (ready.has(src)) return;

  try {
    const head = await fetch(src, { method: "HEAD" });
    const size = Number(head.headers.get("content-length") ?? 0);
    if (size > 0 && size <= BLOB_MAX_BYTES) {
      await warmWithFetch(src);
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

async function runPool(srcs: string[], onProgress?: (fraction: number) => void) {
  const queue = srcs.filter((s) => !ready.has(s));
  const total = srcs.length;
  let done = srcs.filter((s) => ready.has(s)).length;
  onProgress?.(done / total);

  let index = 0;
  async function worker() {
    while (index < queue.length) {
      const src = queue[index++];
      await warmOne(src);
      done += 1;
      onProgress?.(done / total);
    }
  }

  const workers = Array.from({ length: Math.min(WARM_CONCURRENCY, queue.length || 1) }, () =>
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
  void runPool([...new Set(srcs)]);
}
