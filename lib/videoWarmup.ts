let warmed = false;

/**
 * Warms a set of videos up front (during the preloader) so they don't visibly
 * pop in while the visitor scrolls. The returned promise resolves once every
 * video has its first frame (or metadata) ready — which is cheap because the
 * files are faststart (moov at the front). Full buffering keeps going in the
 * background afterwards via hidden elements kept alive for the session.
 */
export function warmAdvantageVideos(
  srcs: readonly string[],
  onProgress?: (readyFraction: number) => void,
): Promise<void> {
  if (warmed || typeof document === "undefined") return Promise.resolve();
  warmed = true;

  if (srcs.length === 0) return Promise.resolve();

  const mobile = window.matchMedia("(max-width: 767px)").matches;

  const container = document.createElement("div");
  container.setAttribute("aria-hidden", "true");
  container.style.cssText =
    "position:absolute;left:0;top:0;width:0;height:0;overflow:hidden;opacity:0;pointer-events:none;";
  document.body.appendChild(container);

  const total = srcs.length;
  let ready = 0;

  return new Promise((resolve) => {
    let settled = 0;

    const settleOne = () => {
      ready += 1;
      onProgress?.(ready / total);
      settled += 1;
      if (settled >= total) resolve();
    };

    srcs.forEach((src) => {
      const video = document.createElement("video");
      video.muted = true;
      video.defaultMuted = true;
      video.playsInline = true;
      // Phones shouldn't eagerly pull ~200 MB of full videos; metadata is
      // enough to have the first frame decode instantly on scroll. Desktop can
      // afford to buffer the whole clip.
      video.preload = mobile ? "metadata" : "auto";
      video.src = src;

      let handled = false;
      const done = () => {
        if (handled) return;
        handled = true;
        video.removeEventListener("loadeddata", done);
        video.removeEventListener("loadedmetadata", done);
        video.removeEventListener("error", done);
        settleOne();
      };

      video.addEventListener("loadeddata", done);
      video.addEventListener("loadedmetadata", done);
      video.addEventListener("error", done);

      container.appendChild(video);
      video.load();
    });
  });
}
