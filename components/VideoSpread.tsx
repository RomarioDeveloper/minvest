"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import LoopVideo from "@/components/LoopVideo";

type Props = {
  /** Base path without extension, e.g. "/video/brand". */
  src: string;
  eyebrow: string;
  title: React.ReactNode;
  body?: React.ReactNode;
};

/**
 * Full-bleed looping video spread with the same scroll grammar as
 * EditorialSpread: the video parallaxes and breathes, the copy writes
 * itself in as the section crosses the viewport.
 */
export default function VideoSpread({ src, eyebrow, title, body }: Props) {
  return (
    <section className="relative h-[100svh] w-full overflow-hidden bg-ink">
      <div className="absolute inset-0">
        <LoopVideo src={src} className="absolute inset-0 h-full w-full object-cover" />
      </div>

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: "linear-gradient(to top, rgba(8,8,10,0.9) 0%, rgba(8,8,10,0.4) 30%, rgba(8,8,10,0) 60%)",
        }}
      />

      <div className="relative z-10 flex h-full w-full items-end p-6 pb-20 sm:p-10 lg:p-16">
        <div className="max-w-2xl">
          <div className="flex items-baseline gap-3 text-eyebrow uppercase text-bone-mute">
            <span className="h-[1px] w-8 bg-bone/40" />
            <span>{eyebrow}</span>
          </div>
          <h2
            className="mt-5 font-display font-semibold text-bone tracking-tightest text-balance"
            style={{ fontSize: "clamp(36px, 6vw, 92px)", lineHeight: 0.95 }}
          >
            {title}
          </h2>
          {body && (
            <div
              className="mt-6 max-w-xl text-pretty text-bone-soft"
              style={{ fontSize: "clamp(15px, 1.15vw, 18px)", lineHeight: 1.6 }}
            >
              {body}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
