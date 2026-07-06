/** Clamp to [0, 1]. */
const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

/**
 * Remaps linear scroll progress into stepped "hold zones".
 * Within each zone the value stays flat for `holdRatio`, then eases to the next step.
 */
export function steppedProgress(linear: number, steps: number, holdRatio = 0.62): number {
  if (steps <= 1) return clamp01(linear);

  const v = clamp01(linear);
  const zoneSize = 1 / steps;
  const zoneIndex = Math.min(Math.floor(v / zoneSize), steps - 1);
  const local = (v - zoneIndex * zoneSize) / zoneSize;
  const from = zoneIndex / (steps - 1);
  const to = Math.min(1, (zoneIndex + 1) / (steps - 1));

  if (local <= holdRatio) return from;

  const t = (local - holdRatio) / (1 - holdRatio);
  return from + (to - from) * t;
}
