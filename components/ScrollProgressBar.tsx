"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/**
 * Hairline progress bar pinned to the top edge of the viewport. Reads the
 * window's overall scroll progress and renders a single white line that
 * grows from 0% → 100% width as you read the page.
 */
export default function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 220,
    damping: 40,
    mass: 0.6,
  });

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[60] h-[2px] w-full origin-left bg-bone"
      style={{ scaleX }}
    />
  );
}
