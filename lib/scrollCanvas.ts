export const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

/** A decoded frame ready to draw without a main-thread decode. */
export type Frame = ImageBitmap | HTMLImageElement;

export function frameWidth(frame: Frame): number {
  return frame instanceof HTMLImageElement ? frame.naturalWidth : frame.width;
}

export function frameHeight(frame: Frame): number {
  return frame instanceof HTMLImageElement ? frame.naturalHeight : frame.height;
}

export function frameDrawable(frame: Frame | null | undefined): frame is Frame {
  if (!frame) return false;
  if (frame instanceof HTMLImageElement) return frame.complete && frame.naturalWidth > 0;
  return frame.width > 0;
}

export function pinProgress(section: HTMLElement): number {
  // Прогресс меряем по фактической высоте sticky-контейнера (первый ребёнок секции),
  // а не по высоте вьюпорта: на мобилке визуальный вьюпорт меняется при скрытии
  // адресной строки, из-за чего прогресс (и кадр) прыгал прямо во время скролла.
  const sticky = section.firstElementChild as HTMLElement | null;
  const pinned =
    sticky?.offsetHeight || (window.visualViewport?.height ?? window.innerHeight);
  const scrollable = section.offsetHeight - pinned;
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
  const frames: (Frame | null)[] = Array.from({ length: count }, () => null);
  const loading = new Map<number, Promise<void>>();
  let center = 0;
  let active = false;
  let cancelled = false;
  let firstFired = false;
  let pumpTimer: number | undefined;

  const shouldLoad = (index: number) => index % step === 0;

  // Frames further than this from the current center are released to keep
  // memory bounded — a 1920×1080 frame costs ~8 MB decoded, so holding all
  // of them would blow past a gigabyte on a long sequence.
  const evictRadius = Math.max(windowRadius * 3, windowRadius + 12);

  const canBitmap = typeof createImageBitmap === "function";
  const isBitmap = (f: unknown): f is ImageBitmap =>
    typeof ImageBitmap !== "undefined" && f instanceof ImageBitmap;

  const freeFrame = (i: number) => {
    const frame = frames[i];
    if (isBitmap(frame)) frame.close();
    frames[i] = null;
  };

  const store = (i: number, frame: Frame) => {
    if (cancelled) {
      if (isBitmap(frame)) frame.close();
      return;
    }
    frames[i] = frame;
    if (!firstFired) {
      firstFired = true;
      onFirstFrame?.();
    }
  };

  const loadFrame = (index: number): Promise<void> => {
    const i = snapFrameIndex(index, count, step);
    if (!shouldLoad(i) || cancelled) return Promise.resolve();
    if (frames[i]) return Promise.resolve();
    const inflight = loading.get(i);
    if (inflight) return inflight;

    const src = frameFileSrc(base, i, extension);
    const task = (async () => {
      try {
        if (canBitmap) {
          // Decode off the main thread: fetch bytes, createImageBitmap on a worker.
          const resp = await fetch(src);
          if (!resp.ok || cancelled) return;
          const blob = await resp.blob();
          if (cancelled) return;
          const bmp = await createImageBitmap(blob);
          store(i, bmp);
          return;
        }

        await new Promise<void>((resolve) => {
          const img = new Image();
          img.decoding = "async";
          img.onload = () => {
            const done = () => {
              store(i, img);
              resolve();
            };
            if (typeof img.decode === "function") {
              img.decode().then(done).catch(done);
            } else {
              done();
            }
          };
          img.onerror = () => resolve();
          img.src = src;
        });
      } catch {
        /* skip failed frame — nearestLoaded will fall back */
      } finally {
        loading.delete(i);
      }
    })();

    loading.set(i, task);
    return task;
  };

  const evict = (c: number) => {
    for (let i = 0; i < count; i++) {
      if (frames[i] && Math.abs(i - c) > evictRadius) freeFrame(i);
    }
  };

  const pump = () => {
    if (cancelled || !active) return;

    const c = snapFrameIndex(center, count, step);
    evict(c);

    const order = priorityFrameOrder(c, count).filter(
      (i) => shouldLoad(i) && Math.abs(i - c) <= windowRadius,
    );

    let queued = 0;
    for (const i of order) {
      if (!frames[i] && !loading.has(i)) {
        void loadFrame(i);
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

  /**
   * Decode the initial scroll window into memory before the user starts scrubbing.
   * Reports 0→1 progress; safe to call while the preloader curtain is still up.
   */
  const prefetchWindow = async (
    radius = windowRadius,
    onProgress?: (fraction: number) => void,
  ) => {
    const c = snapFrameIndex(center, count, step);
    const indices = priorityFrameOrder(c, count).filter(
      (i) => shouldLoad(i) && Math.abs(i - c) <= radius,
    );
    if (indices.length === 0) {
      onProgress?.(1);
      return;
    }

    let done = 0;
    onProgress?.(0);
    const concurrency = Math.min(batchSize, indices.length);
    let cursor = 0;

    await Promise.all(
      Array.from({ length: concurrency }, async () => {
        while (cursor < indices.length && !cancelled) {
          const i = indices[cursor++];
          await loadFrame(i);
          done += 1;
          onProgress?.(done / indices.length);
        }
      }),
    );
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
    prefetchWindow,
    destroy() {
      cancelled = true;
      stopPump();
      for (let i = 0; i < count; i++) {
        if (isBitmap(frames[i])) (frames[i] as ImageBitmap).close();
        frames[i] = null;
      }
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
