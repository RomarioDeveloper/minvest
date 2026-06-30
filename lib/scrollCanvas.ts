export const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

export function pinProgress(section: HTMLElement): number {
  const viewport = window.visualViewport?.height ?? window.innerHeight;
  const scrollable = section.offsetHeight - viewport;
  if (scrollable <= 0) return 0;
  return clamp01(-section.getBoundingClientRect().top / scrollable);
}

export function canvasDpr(mobile: boolean): number {
  const raw = window.devicePixelRatio || 1;
  if (mobile) return Math.min(raw, 2);
  return Math.min(raw, 2);
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

/** Scroll/resize-driven updates — no idle RAF loop. */
export function bindScrollCanvas(
  section: HTMLElement,
  onUpdate: () => void,
): () => void {
  let rafId = 0;
  let ticking = false;
  let visible = true;

  const schedule = () => {
    if (!visible || ticking) return;
    ticking = true;
    rafId = requestAnimationFrame(() => {
      ticking = false;
      onUpdate();
    });
  };

  const observer = new IntersectionObserver(
    ([entry]) => {
      visible = entry.isIntersecting;
      if (visible) schedule();
    },
    { rootMargin: "50% 0px" },
  );
  observer.observe(section);

  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule, { passive: true });
  window.visualViewport?.addEventListener("scroll", schedule, { passive: true });
  window.visualViewport?.addEventListener("resize", schedule, { passive: true });

  schedule();

  return () => {
    cancelAnimationFrame(rafId);
    observer.disconnect();
    window.removeEventListener("scroll", schedule);
    window.removeEventListener("resize", schedule);
    window.visualViewport?.removeEventListener("scroll", schedule);
    window.visualViewport?.removeEventListener("resize", schedule);
  };
}
