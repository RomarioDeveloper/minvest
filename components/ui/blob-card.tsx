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
      {/* Кольцо строится через padding 1.5px, а не отрицательный inset:
          так радиусы рамки и карточки всегда совпадают и по углам
          не появляются светлые «серпы». */}
      <div className="relative overflow-hidden rounded-[21px] p-[1.5px] [transform:translateZ(0)]">
        {!isMobile && (
          <div className="absolute inset-0 opacity-40">
            <GlowEffect />
          </div>
        )}

        <div className="relative overflow-hidden rounded-[19.5px] border border-bone/10 bg-ink-panel [transform:translateZ(0)]">
          <div className="relative overflow-hidden" style={{ height: headerHeight }}>
            <FluidBlobs animate={!isMobile} />
            {/* Растворяем низ шапки в фон карточки — без этого стык режет глаз.
                Градиент начинается с половины высоты, чтобы обрезанные краем
                шапки «капли» гарантированно ушли в фон без жёсткой кромки. */}
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "linear-gradient(to bottom, transparent 0%, transparent 40%, #101013 96%)",
              }}
            />
            {header && <div className="relative z-10 p-6 pb-0 sm:p-7 sm:pb-0">{header}</div>}
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}
