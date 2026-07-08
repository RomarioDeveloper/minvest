"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  type MotionValue,
} from "framer-motion";

const CAR_SRC = "/103F2-removebg-preview.png";

/** Отметки шагов trade-in вдоль дороги: машина «проезжает» их по мере скролла. */
const MILESTONES = [
  { at: 0.16, n: "01" },
  { at: 0.4, n: "02" },
  { at: 0.64, n: "03" },
  { at: 0.88, n: "04" },
];

function Milestone({
  progress,
  at,
  n,
}: {
  progress: MotionValue<number>;
  at: number;
  n: string;
}) {
  // Отметка «загорается», когда машина доезжает до неё.
  const opacity = useTransform(progress, [at - 0.04, at + 0.01], [0.28, 1]);
  const y = useTransform(progress, [at - 0.04, at + 0.01], [0, -4]);

  return (
    <motion.div
      style={{ left: `${(1 - at) * 100}%`, x: "-50%", opacity, y }}
      className="absolute bottom-2 flex flex-col items-center gap-1.5"
    >
      <span className="font-display text-[11px] font-semibold tracking-[0.2em] text-bone sm:text-xs">
        {n}
      </span>
      <span className="h-2 w-px bg-bone/40" />
    </motion.div>
  );
}

/**
 * Scroll-driven сцена: автомобиль едет по дороге вслед за скроллом,
 * с инерцией, наклоном корпуса, линиями скорости и отражением.
 * В конце пути над машиной появляется бейдж «первый взнос».
 */
export default function TradeInCarScene() {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "start 0.35"],
  });

  // Пружина даёт инерцию: машина плавно докатывается после остановки скролла.
  const progress = useSpring(scrollYProgress, {
    stiffness: 64,
    damping: 17,
    mass: 0.5,
  });

  // left (% контейнера) + x (% собственной ширины) — машина въезжает с
  // правого края и едет влево, без измерения размеров.
  const left = useTransform(progress, (v) => `${106 - v * 112}%`);
  const x = useTransform(progress, (v) => `${-100 + v * 100}%`);

  // Наклон корпуса от «ускорения» (знак скорости скролла).
  const velocity = useVelocity(progress);
  const tilt = useSpring(useTransform(velocity, [-1.2, 1.2], [-2.2, 2.2]), {
    stiffness: 220,
    damping: 22,
  });

  // Линии скорости позади машины — видны только в движении.
  const speed = useTransform(velocity, (v) => Math.min(Math.abs(v) * 1.4, 1));
  const linesOpacity = useSpring(speed, { stiffness: 140, damping: 28 });
  const linesStretch = useTransform(linesOpacity, [0, 1], [0.3, 1]);

  // Лёгкий параллакс дорожной разметки (в такт движению влево).
  const dashX = useTransform(progress, (v) => `${v * 220}px`);

  // Финальный бейдж: машина доехала — авто стало первым взносом.
  const badgeOpacity = useTransform(progress, [0.84, 0.96], [0, 1]);
  const badgeY = useTransform(progress, [0.84, 0.96], [10, 0]);

  if (reducedMotion) {
    return (
      <div className="pointer-events-none relative mt-14 w-full sm:mt-16" aria-hidden>
        <div className="relative h-[clamp(150px,24vw,260px)] w-full">
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-bone/25 to-transparent" />
          <img
            src={CAR_SRC}
            alt=""
            draggable={false}
            className="absolute bottom-0 left-1/2 h-[74%] w-auto max-w-none -translate-x-1/2 select-none"
            style={{ filter: "drop-shadow(0 20px 36px rgba(0,0,0,0.5))" }}
          />
        </div>
      </div>
    );
  }

  return (
    <div ref={ref} className="pointer-events-none relative mt-14 w-full sm:mt-16" aria-hidden>
      <div className="relative h-[clamp(150px,24vw,260px)] w-full">
        {/* Отметки шагов вдоль дороги */}
        {MILESTONES.map((m) => (
          <Milestone key={m.n} progress={progress} at={m.at} n={m.n} />
        ))}

        {/* Дорога */}
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-bone/30 to-transparent" />
        <motion.div
          className="absolute inset-x-0 -bottom-[5px] h-[2px] opacity-30 [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]"
          style={{
            backgroundPositionX: dashX,
            backgroundImage:
              "repeating-linear-gradient(90deg, rgba(244,244,245,0.5) 0 34px, transparent 34px 82px)",
          }}
        />

        {/* Машина */}
        <motion.div style={{ left, x }} className="absolute bottom-0 h-[74%]">
          <motion.div style={{ rotate: tilt }} className="relative h-full origin-bottom">
            {/* Линии скорости позади машины (тянутся вправо — авто едет влево) */}
            <motion.div
              style={{ opacity: linesOpacity }}
              className="absolute left-[86%] top-[26%] flex w-[52%] flex-col items-end gap-[14%]"
            >
              <motion.div
                style={{ scaleX: linesStretch }}
                className="h-px w-full origin-left bg-gradient-to-r from-bone/60 to-transparent"
              />
              <motion.div
                style={{ scaleX: linesStretch }}
                className="mr-[12%] h-px w-full origin-left bg-gradient-to-r from-bone/40 to-transparent"
              />
              <motion.div
                style={{ scaleX: linesStretch }}
                className="mr-[4%] h-px w-full origin-left bg-gradient-to-r from-bone/50 to-transparent"
              />
            </motion.div>

            {/* Тень под машиной */}
            <div className="absolute inset-x-[10%] -bottom-1 h-3 rounded-[100%] bg-black/70 blur-md" />

            <img
              src={CAR_SRC}
              alt=""
              draggable={false}
              className="relative h-full w-auto max-w-none select-none"
              style={{ filter: "drop-shadow(0 18px 30px rgba(0,0,0,0.45))" }}
            />

            {/* Бейдж в конце пути */}
            <motion.div
              style={{ opacity: badgeOpacity, y: badgeY }}
              className="absolute -top-11 right-0 whitespace-nowrap rounded-full border border-bone/25 bg-ink/80 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-bone backdrop-blur-sm sm:text-[11px]"
            >
              ≈ первый взнос за квартиру
            </motion.div>
          </motion.div>

          {/* Отражение на «полу» */}
          <img
            src={CAR_SRC}
            alt=""
            draggable={false}
            className="absolute left-0 top-full h-full w-auto max-w-none -scale-y-100 select-none opacity-[0.08] [mask-image:linear-gradient(to_top,black,transparent_55%)]"
          />
        </motion.div>
      </div>

      {/* Место под отражение */}
      <div className="h-10 sm:h-14" />
    </div>
  );
}
