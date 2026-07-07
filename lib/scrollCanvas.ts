export const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

export function pinProgress(section: HTMLElement): number {
  const viewport = window.visualViewport?.height ?? window.innerHeight;
  const scrollable = section.offsetHeight - viewport;
  if (scrollable <= 0) return 0;
  return clamp01(-section.getBoundingClientRect().top / scrollable);
}

export function findNearestLoadedFrame(
  frames: (HTMLImageElement | null)[],
  target: number,
): HTMLImageElement | null {
  const frame = frames[target];
  if (frame?.complete && frame.naturalWidth > 0) return frame;

  for (let d = 1; d < frames.length; d++) {
    const prev = frames[target - d];
    if (prev?.complete && prev.naturalWidth > 0) return prev;
    const next = frames[target + d];
    if (next?.complete && next.naturalWidth > 0) return next;
  }
  return null;
}

export function priorityFrameOrder(center: number, total: number): number[] {
  const order: number[] = [];
  const clamped = Math.min(total - 1, Math.max(0, center));
  order.push(clamped);
  for (let d = 1; d < total; d++) {
    const left = clamped - d;
    const right = clamped + d;
    if (left >= 0) order.push(left);
    if (right < total) order.push(right);
  }
  return order;
}

export function snapFrameIndex(index: number, count: number, step = 1): number {
  const snapped = Math.round(index / step) * step;
  return Math.min(count - 1, Math.max(0, snapped));
}

export function frameFileSrc(base: string, index: number, extension: "webp" | "jpg") {
  return `${base}/${String(index + 1).padStart(4, "0")}.${extension}`;
}

type SlidingFrameLoaderOptions = {
  base: string;
  count: number;
  extension: "webp" | "jpg";
  step?: number;
  windowRadius?: number;
  batchSize?: number;
  onFirstFrame?: () => void;
};

/** Loads only frames near the current scroll position instead of the whole sequence. */
export function createSlidingFrameLoader({
  base,
  count,
  extension,
  step = 1,
  windowRadius = 20,
  batchSize = 3,
  onFirstFrame,
}: SlidingFrameLoaderOptions) {
  const frames: (HTMLImageElement | null)[] = Array.from({ length: count }, () => null);
  const loading = new Set<number>();
  let center = 0;
  let active = false;
  let cancelled = false;
  let firstFired = false;
  let pumpTimer: number | undefined;

  const shouldLoad = (index: number) => index % step === 0;

  const loadFrame = (index: number) => {
    const i = snapFrameIndex(index, count, step);
    if (frames[i] || loading.has(i) || cancelled || !shouldLoad(i)) return;

    loading.add(i);
    const img = new Image();
    img.decoding = "async";

    const finish = () => loading.delete(i);

    img.onload = () => {
      if (!cancelled) {
        frames[i] = img;
        if (!firstFired) {
          firstFired = true;
          onFirstFrame?.();
        }
      }
      finish();
    };
    img.onerror = finish;
    img.src = frameFileSrc(base, i, extension);
  };

  const pump = () => {
    if (cancelled || !active) return;

    const c = snapFrameIndex(center, count, step);
    const order = priorityFrameOrder(c, count).filter(
      (i) => shouldLoad(i) && Math.abs(i - c) <= windowRadius,
    );

    let queued = 0;
    for (const i of order) {
      if (!frames[i] && !loading.has(i)) {
        loadFrame(i);
        if (++queued >= batchSize) break;
      }
    }
  };

  const startPump = () => {
    if (pumpTimer !== undefined) return;
    const run = () => {
      pump();
      if (!cancelled) pumpTimer = window.setTimeout(run, 100);
    };
    run();
  };

  const stopPump = () => {
    if (pumpTimer !== undefined) {
      window.clearTimeout(pumpTimer);
      pumpTimer = undefined;
    }
  };

  const nearestLoaded = (target: number): number => {
    const snapped = snapFrameIndex(target, count, step);
    if (frames[snapped]) return snapped;
    for (let d = step; d < count; d += step) {
      if (snapped - d >= 0 && frames[snapped - d]) return snapped - d;
      if (snapped + d < count && frames[snapped + d]) return snapped + d;
    }
    return -1;
  };

  return {
    frames,
    setCenter(index: number) {
      center = index;
      if (active) pump();
    },
    setActive(next: boolean) {
      active = next;
      if (next) {
        pump();
        startPump();
      } else {
        stopPump();
      }
    },
    nearestLoaded,
    destroy() {
      cancelled = true;
      stopPump();
    },
  };
}

export function drawCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  w: number,
  h: number,
): boolean {
  if (!img.complete || img.naturalWidth === 0) return false;
  const scale = Math.max(w / img.naturalWidth, h / img.naturalHeight);
  const dw = img.naturalWidth * scale;
  const dh = img.naturalHeight * scale;
  ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh);
  return true;
}

export function drawContain(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  w: number,
  h: number,
): boolean {
  if (!img.complete || img.naturalWidth === 0) return false;
  const scale = Math.min(w / img.naturalWidth, h / img.naturalHeight);
  const dw = img.naturalWidth * scale;
  const dh = img.naturalHeight * scale;
  ctx.fillStyle = "#050506";
  ctx.fillRect(0, 0, w, h);
  ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh);
  return true;
}

/** RAF loop that pauses when section leaves the viewport. */
export function usePinRafLoop(
  section: HTMLElement | null,
  onTick: () => void,
): () => void {
  if (!section) return () => {};

  let rafId = 0;
  let active = true;

  const tick = () => {
    if (active) onTick();
    rafId = requestAnimationFrame(tick);
  };

  const observer = new IntersectionObserver(
    ([entry]) => {
      active = entry.isIntersecting;
    },
    { rootMargin: "100px 0px" },
  );
  observer.observe(section);
  rafId = requestAnimationFrame(tick);

  return () => {
    cancelAnimationFrame(rafId);
    observer.disconnect();
  };
}
