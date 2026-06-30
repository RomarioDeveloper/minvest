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

/** Scroll/resize-driven updates. Falls back to a short RAF burst after each scroll tick. */
export function bindScrollCanvas(
  section: HTMLElement,
  onUpdate: () => void,
): () => void {
  let rafId = 0;
  let ticking = false;
  let burstLeft = 0;

  const tick = () => {
    ticking = false;
    onUpdate();
    if (burstLeft > 0) {
      burstLeft--;
      rafId = requestAnimationFrame(tick);
      ticking = true;
    }
  };

  const schedule = (burst = 0) => {
    if (burst > burstLeft) burstLeft = burst;
    if (ticking) return;
    ticking = true;
    rafId = requestAnimationFrame(tick);
  };

  const onScroll = () => schedule(8);

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  window.visualViewport?.addEventListener("scroll", onScroll, { passive: true });
  window.visualViewport?.addEventListener("resize", onScroll, { passive: true });

  schedule(1);

  return () => {
    cancelAnimationFrame(rafId);
    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("resize", onScroll);
    window.visualViewport?.removeEventListener("scroll", onScroll);
    window.visualViewport?.removeEventListener("resize", onScroll);
  };
}
