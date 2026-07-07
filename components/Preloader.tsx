"use client";

import { scrollToTop } from "@/lib/scrollRestoration";
import { FEATURE_VIDEO_SRCS, SITE_VIDEO_SRCS } from "@/lib/siteVideos";
import { warmSiteVideos, warmSiteVideosBackground } from "@/lib/videoWarmup";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

/** Minimum time the curtain stays up, so the logo never just blinks. */
const MIN_SHOW_MS = 1700;
/** Hard cap — never hold the visitor hostage on slow networks. */
const MAX_SHOW_MS = 4000;

/**
 * Entry preloader: warm paper-toned curtain with the Malaysary Invest logo
 * breathing in, then the whole sheet lifts away to reveal the dark site.
 */
export default function Preloader() {
  const [done, setDone] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const started = performance.now();
    let timer: number;
    let isWindowLoaded = document.readyState === "complete";
    let isBrandfilmReady = false;
    let areVideosReady = false;
    let finished = false;

    let brandfilmProgress = 0;
    let videoProgress = 0;
    const applyProgress = () => {
      setProgress(Math.min(1, brandfilmProgress * 0.5 + videoProgress * 0.5));
    };

    const checkDone = () => {
      if (finished) return;
      // Ждём страницу, кадры героя и все фоновые видео — без lazy
      if (isWindowLoaded && isBrandfilmReady && areVideosReady) {
        finished = true;
        const left = Math.max(0, MIN_SHOW_MS - (performance.now() - started));
        timer = window.setTimeout(() => setDone(true), left);
      }
    };

    const onLoad = () => {
      isWindowLoaded = true;
      checkDone();
    };

    const onBrandfilmReady = () => {
      isBrandfilmReady = true;
      checkDone();
    };

    const onBrandfilmProgress = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (typeof detail === "number") {
        brandfilmProgress = detail;
        applyProgress();
      }
    };

    // Fullscreen-блоки — ждём в прелоадере. Остальные — в фоне, без лагов скролла.
    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    const getMobileSrcs = (srcs: readonly string[]) =>
      srcs.map((s) => (isMobile && s.endsWith(".mp4") ? s.replace(".mp4", "-mobile.mp4") : s));

    warmSiteVideos(getMobileSrcs(FEATURE_VIDEO_SRCS), (fraction) => {
      videoProgress = fraction;
      applyProgress();
    }).then(() => {
      areVideosReady = true;
      checkDone();
      const otherVideos = SITE_VIDEO_SRCS.filter((s) => !new Set<string>(FEATURE_VIDEO_SRCS).has(s));
      warmSiteVideosBackground(getMobileSrcs(otherVideos));
    });

    // Много тяжёлых роликов — даём больше времени, но не блокируем навсегда.
    const cap = window.setTimeout(() => {
      if (!finished) {
        finished = true;
        setDone(true);
      }
    }, 20000);

    if (isWindowLoaded) onLoad();
    else window.addEventListener("load", onLoad, { once: true });

    window.addEventListener("brandfilm:ready", onBrandfilmReady, { once: true });
    window.addEventListener("brandfilm:progress", onBrandfilmProgress);

    return () => {
      window.clearTimeout(timer);
      window.clearTimeout(cap);
      window.removeEventListener("load", onLoad);
      window.removeEventListener("brandfilm:ready", onBrandfilmReady);
      window.removeEventListener("brandfilm:progress", onBrandfilmProgress);
    };
  }, []);

  // Pause scrolling while the curtain is up. Going through Lenis (instead of
  // overflow: hidden) keeps its virtual scroll position in sync — flipping
  // overflow on <html> desynced touch scrolling and froze pinned sections.
  useEffect(() => {
    if (done) {
      scrollToTop();
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      requestAnimationFrame(scrollToTop);
      return;
    }
    type LenisLike = { stop: () => void; start: () => void };
    type SnapLike = { stop: () => void; start: () => void };
    const w = window as unknown as { __lenis?: LenisLike; __lenisSnap?: SnapLike };
    const lenis = w.__lenis;
    const snap = w.__lenisSnap;
    if (lenis) {
      lenis.stop();
      snap?.stop();
      return () => {
        lenis.start();
        snap?.start();
      };
    }
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, [done]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
          style={{ background: "#efeae3", touchAction: "none", overscrollBehavior: "none" }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
          aria-hidden="true"
        >
          <motion.img
            src="/logo.webp"
            alt=""
            className="w-[min(60vw,280px)] select-none"
            draggable={false}
            initial={{ opacity: 0, scale: 0.94, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          />

          <motion.div
            className="mt-10 h-[1px] w-44 overflow-hidden"
            style={{ background: "rgba(74,52,38,0.15)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <motion.div
              className="h-full"
              style={{ background: "rgba(74,52,38,0.7)", originX: 0 }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: Math.max(0.1, progress) }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
