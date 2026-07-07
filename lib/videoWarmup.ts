const ready = new Set<string>();
const warming = new Map<string, Promise<void>>();

let container: HTMLDivElement | null = null;

function getContainer() {
  if (typeof document === "undefined") return null;
  if (!container) {
    container = document.createElement("div");
    container.setAttribute("aria-hidden", "true");
    container.style.cssText =
      "position:absolute;left:0;top:0;width:0;height:0;overflow:hidden;opacity:0;pointer-events:none;";
    document.body.appendChild(container);
  }
  return container;
}

export function isVideoReady(src: string) {
  return ready.has(src);
}

function warmOne(src: string): Promise<void> {
  const existing = warming.get(src);
  if (existing) return existing;
  if (ready.has(src)) return Promise.resolve();

  const promise = new Promise<void>((resolve) => {
    const host = getContainer();
    if (!host) {
      resolve();
      return;
    }

    const video = document.createElement("video");
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.preload = "auto";
    video.src = src;

    let settled = false;
    const done = () => {
      if (settled) return;
      settled = true;
      ready.add(src);
      video.removeEventListener("canplay", done);
      video.removeEventListener("loadeddata", done);
      video.removeEventListener("error", done);
      resolve();
    };

    video.addEventListener("canplay", done);
    video.addEventListener("loadeddata", done);
    video.addEventListener("error", done);

    host.appendChild(video);
    video.load();

    if (video.readyState >= 2) done();
  }).finally(() => {
    warming.delete(src);
  });

  warming.set(src, promise);
  return promise;
}

/**
 * Preloads videos during the preloader so fullscreen blocks don't visibly
 * buffer while the visitor scrolls. Hidden elements stay in the DOM so the
 * browser keeps the data in cache for the visible <video> tags on the page.
 */
export function warmSiteVideos(
  srcs: readonly string[],
  onProgress?: (readyFraction: number) => void,
): Promise<void> {
  if (typeof document === "undefined" || srcs.length === 0) {
    return Promise.resolve();
  }

  const unique = [...new Set(srcs)];
  let loaded = unique.filter((src) => ready.has(src)).length;
  onProgress?.(loaded / unique.length);

  const jobs = unique
    .filter((src) => !ready.has(src))
    .map((src) =>
      warmOne(src).then(() => {
        loaded += 1;
        onProgress?.(loaded / unique.length);
      }),
    );

  return Promise.all(jobs).then(() => undefined);
}
