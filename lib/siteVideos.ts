/** Fullscreen feature blocks (VideoFeatureBlocks). */
export const FEATURE_VIDEO_SRCS = [
  "/entrance-gate.mp4",
  "/blockanimation/woman-tea.mp4",
  "/blockanimation/woman-book.mp4",
  "/16744999619190.mp4",
  "/objects-commissioning.mp4",
] as const;

/** Advantage carousel cards (HorizontalAdvantages). */
export const ADVANTAGE_VIDEO_SRCS = [
  "/01.mp4",
  "/okna.mp4",
  "/sleek-modern-kitchen-interior-design-2025-12-17-13-06-28-utc.mp4",
  "/car-parked-crooked-in-empty-parking-lot-aerial-2025-12-17-21-25-21-utc.mp4",
  "/commercial.mp4",
  "/cctv.mp4",
  "/face-id.mp4",
  "/smart-locks.mp4",
  "/security-guard.mp4",
] as const;

/** Hero section (HeroVideo). */
export const HERO_VIDEO_SRCS = ["/video/1.mp4", "/video/1.webm"] as const;

/** Brand film on mobile — same footage as the scroll sequence, plain playback. */
export const BRAND_VIDEO_MOBILE_SRC = "/hero-scrub-mobile-temp-mobile.mp4";

/** All page videos — preloaded during the entry preloader, no lazy loading. */
export const SITE_VIDEO_SRCS: string[] = [
  ...new Set([...FEATURE_VIDEO_SRCS, ...ADVANTAGE_VIDEO_SRCS, ...HERO_VIDEO_SRCS]),
];
