function viewportHeight() {
  return window.visualViewport?.height ?? window.innerHeight;
}

function sectionTop(el: HTMLElement) {
  return el.getBoundingClientRect().top + window.scrollY;
}

function scrollableHeight(el: HTMLElement) {
  return Math.max(0, el.offsetHeight - viewportHeight());
}

/** Absolute Y positions for stepped snaps inside a tall section. */
export function stepsSnapPoints(el: HTMLElement, steps: number): number[] {
  const scrollable = scrollableHeight(el);
  const top = sectionTop(el);
  if (scrollable <= 0 || steps <= 1) return [Math.round(top)];

  const points: number[] = [];
  for (let i = 0; i < steps; i += 1) {
    points.push(Math.round(top + (scrollable * i) / (steps - 1)));
  }
  return points;
}

/** Absolute Y positions every `stepVh` within a tall pinned section. */
export function vhSnapPoints(el: HTMLElement, stepVh: number): number[] {
  const scrollable = scrollableHeight(el);
  const top = sectionTop(el);
  if (scrollable <= 0) return [Math.round(top)];

  const stepPx = (stepVh / 100) * viewportHeight();
  const points: number[] = [];
  for (let y = 0; y < scrollable; y += stepPx) {
    points.push(Math.round(top + y));
  }
  points.push(Math.round(top + scrollable));
  return points;
}

export function collectNumericSnapPoints(root: ParentNode = document): number[] {
  const points = new Set<number>();

  root.querySelectorAll<HTMLElement>("[data-scroll-snap-steps]").forEach((el) => {
    const steps = Number.parseInt(el.dataset.scrollSnapSteps ?? "1", 10);
    stepsSnapPoints(el, Number.isFinite(steps) ? steps : 1).forEach((p) => points.add(p));
  });

  root.querySelectorAll<HTMLElement>("[data-scroll-snap-step-vh]").forEach((el) => {
    const stepVh = Number.parseFloat(el.dataset.scrollSnapStepVh ?? "80");
    vhSnapPoints(el, Number.isFinite(stepVh) ? stepVh : 80).forEach((p) => points.add(p));
  });

  return [...points].sort((a, b) => a - b);
}

export function snapDistanceThreshold() {
  return viewportHeight() * 0.28;
}
