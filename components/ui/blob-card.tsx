"use client";

import { useEffect, useState, type ReactNode } from "react";

import { FluidBlobs } from "@/components/ui/fluid-blobs";
import { GlowEffect } from "@/components/ui/glow-effect";
import { cn } from "@/lib/utils";

type Props = {
  /** Контент поверх «капель» в шапке (иконка, цифра и т.п.). */
  header?: ReactNode;
  /** Контент тела карточки под шапкой. */
  children?: ReactNode;
  /** Высота блоба-шапки, px. */
  headerHeight?: number;
  className?: string;
};

/**
 * Белая версия Blob Card (unlumen-ui): плавающие светлые «капли» в шапке
 * и вращающаяся светящаяся рамка вокруг карточки. На мобильных анимации
 * отключаются — размытые слои слишком дороги для телефонного GPU.
 */
export function BlobCard({ header, children, headerHeight = 120, className }: Props) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return (
    <div className={cn("relative w-full", className)}>
      {/* Вращающаяся рамка: наружу выглядывает только кольцо в 1.5px + ореол */}
      {!isMobile && (
        <div className="absolute -inset-[1.5px] z-0 overflow-hidden rounded-[21.5px] opacity-50">
          <GlowEffect />
        </div>
      )}

      <div className="relative z-10 overflow-hidden rounded-[20px] border border-bone/10 bg-ink-panel">
        <div className="relative overflow-hidden" style={{ height: headerHeight }}>
          <FluidBlobs animate={!isMobile} />
          {/* Растворяем низ шапки в фон карточки — без этого стык режет глаз */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-ink-panel" />
          {header && <div className="relative z-10 p-6 pb-0 sm:p-7 sm:pb-0">{header}</div>}
        </div>

        {children}
      </div>
    </div>
  );
}
