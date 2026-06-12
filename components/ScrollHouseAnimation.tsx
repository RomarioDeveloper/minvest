"use client";

import { useEffect, useRef, useState } from "react";

type RenderManifest = {
  count: number;
  width: number;
  height: number;
};

/** Scroll distance while pinned — longer = smoother scrubbing. */
const SECTION_VH = 620;

/**
 * Desktop gets the landscape 3D orbit renders; mobile gets the portrait
 * entrance→lobby flythrough (landscape orbit crops terribly on tall screens).
 */
type Variant = "orbit" | "entrance";

type Caption = {
  from: number;
  to: number;
  index: string;
  eyebrow: string;
  title: string;
  body: string;
};

const ORBIT_CAPTIONS: Caption[] = [
  {
    from: 0,
    to: 0.16,
    index: "01",
    eyebrow: "Фасад · низкий ракурс",
    title: "С неба\nна корпус.",
    body: "Первый вид — шестиэтажный монолит с террасами на кровле. Масштаб читается сразу: спокойная геометрия, тёмные карнизы и чистый силуэт против неба.",
  },
  {
    from: 0.16,
    to: 0.32,
    index: "02",
    eyebrow: "Фасад · крупный план",
    title: "Кирпич\nи тёмный металл.",
    body: "Крупная кладка, контрастные балконные ограждения и тёмные вставки между этажами. Материалы, которые выглядят солидно и вблизи, и издалека.",
  },
  {
    from: 0.32,
    to: 0.5,
    index: "03",
    eyebrow: "Двор · вид сверху",
    title: "Двор\nбез посторонних.",
    body: "Внутренний периметр: брусчатка, кустарники, скамейки и проходы между секциями. Закрытая территория — только для жильцов и гостей по приглашению.",
  },
  {
    from: 0.5,
    to: 0.66,
    index: "04",
    eyebrow: "Этажи · балконы",
    title: "Свет\nна каждом уровне.",
    body: "Ряд за рядом — балконы с металлическими ограждениями и широкие окна. Много естественного света, воздуха и вид на двор с любого этажа.",
  },
  {
    from: 0.66,
    to: 0.82,
    index: "05",
    eyebrow: "Двор · наземный уровень",
    title: "Площадка\nи подъезды.",
    body: "Прорезиненное покрытие, теневые навесы и игровые формы прямо во дворе. Стеклянные козырьки над входами — сухо и светло даже в ненастье.",
  },
  {
    from: 0.82,
    to: 1.0001,
    index: "06",
    eyebrow: "Обзор · весь комплекс",
    title: "Дом\nцеликом.",
    body: "U-образная планировка, озеленение, площадка и подъезды — всё в одном кадре. Полный обход корпуса, прежде чем спускаться к деталям проекта.",
  },
];

const ENTRANCE_CAPTIONS: Caption[] = [
  {
    from: 0,
    to: 0.3,
    index: "01",
    eyebrow: "Входная группа",
    title: "Навес\nи тёплый свет.",
    body: "Вход в подъезд встречает латунным навесом, тёмным камнем и светом из панорамных окон первого этажа.",
  },
  {
    from: 0.3,
    to: 0.56,
    index: "02",
    eyebrow: "Двери · стекло в пол",
    title: "Прозрачный\nпервый этаж.",
    body: "Остеклённые двери и витражи: лобби и лестница просматриваются прямо с улицы — светло и безопасно.",
  },
  {
    from: 0.56,
    to: 0.8,
    index: "03",
    eyebrow: "Лобби",
    title: "Как в отеле,\nа не в подъезде.",
    body: "Тёплые оттенки, дерево и мягкая подсветка потолка. Пространство, в которое приятно возвращаться.",
  },
  {
    from: 0.8,
    to: 1.0001,
    index: "04",
    eyebrow: "Лифтовой холл",
    title: "Латунь\nи камень.",
    body: "Лифты с латунными порталами, каменный пол и место, где можно присесть. Детали уровня бизнес-класса.",
  },
];

const VARIANTS: Record<
  Variant,
  { base: string; captions: Caption[]; eyebrow: string }
> = {
  orbit: { base: "/render-frames", captions: ORBIT_CAPTIONS, eyebrow: "3D-обзор" },
  entrance: { base: "/entrance-frames", captions: ENTRANCE_CAPTIONS, eyebrow: "Видеопроход" },
};

const frameSrc = (base: string, index: number) =>
  `${base}/${String(index + 1).padStart(4, "0")}.webp`;

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

function activeCaption(captions: Caption[], progress: number): Caption {
  const p = clamp01(progress);
  const hit = captions.find((c) => p >= c.from && p < c.to);
  return hit ?? captions[captions.length - 1];
}

function computePinProgress(section: HTMLElement): number {
  const scrollable = section.offsetHeight - window.innerHeight;
  if (scrollable <= 0) return 0;
  return clamp01(-section.getBoundingClientRect().top / scrollable);
}

export default function ScrollHouseAnimation() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const framesRef = useRef<(HTMLImageElement | null)[]>([]);
  const progressRef = useRef(0);
  const uiProgressRef = useRef(-1);

  const [variant, setVariant] = useState<Variant | null>(null);
  const [manifest, setManifest] = useState<RenderManifest | null>(null);
  const [loaded, setLoaded] = useState(0);
  const [ready, setReady] = useState(false);
  const [displayProgress, setDisplayProgress] = useState(0);

  const frameCount = manifest?.count ?? 0;
  const config = variant ? VARIANTS[variant] : null;
  const captions = config?.captions ?? ORBIT_CAPTIONS;
  const stage = activeCaption(captions, displayProgress);

  useEffect(() => {
    setVariant(window.matchMedia("(max-width: 767px)").matches ? "entrance" : "orbit");
  }, []);

  useEffect(() => {
    if (!config) return;
    let cancelled = false;
    fetch(`${config.base}/manifest.json`)
      .then((r) => r.json())
      .then((data: RenderManifest) => {
        if (!cancelled) setManifest(data);
      })
      .catch(() => {
        if (!cancelled) setManifest({ count: 0, width: 0, height: 0 });
      });
    return () => {
      cancelled = true;
    };
  }, [config]);

  useEffect(() => {
    if (!manifest || manifest.count === 0 || !config) return;

    let cancelled = false;
    const frames: (HTMLImageElement | null)[] = Array.from({ length: manifest.count }, () => null);
    let done = 0;

    const finish = (index: number, img: HTMLImageElement | null) => {
      if (cancelled) return;
      frames[index] = img;
      done += 1;
      setLoaded(done);
      if (done === manifest.count) {
        framesRef.current = frames;
        setReady(true);
      }
    };

    for (let i = 0; i < manifest.count; i++) {
      const img = new Image();
      img.decoding = "async";
      img.src = frameSrc(config.base, i);
      img.onload = () => finish(i, img);
      img.onerror = () => finish(i, null);
    }

    return () => {
      cancelled = true;
    };
  }, [manifest, config]);

  useEffect(() => {
    if (!ready || frameCount === 0) return;
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let canvasW = 0;
    let canvasH = 0;
    let rafId = 0;
    let lastExact = -1;
    let smooth = computePinProgress(section);
    // The flythrough has continuous camera motion, so blending adjacent
    // frames reads as real video. Orbit renders jump between angles and
    // would ghost, so they stay on a single crisp frame.
    const blend = variant === "entrance";

    const drawFrame = (img: HTMLImageElement, alpha = 1) => {
      if (!img.complete || img.naturalWidth === 0) return;
      const scale = Math.max(canvasW / img.naturalWidth, canvasH / img.naturalHeight);
      const dw = img.naturalWidth * scale;
      const dh = img.naturalHeight * scale;
      ctx.globalAlpha = alpha;
      ctx.drawImage(img, (canvasW - dw) / 2, (canvasH - dh) / 2, dw, dh);
      ctx.globalAlpha = 1;
    };

    const draw = (progress: number) => {
      const exact = clamp01(progress) * (frameCount - 1);

      if (blend) {
        if (Math.abs(exact - lastExact) < 0.003) return;
        lastExact = exact;

        const i = Math.min(frameCount - 1, Math.floor(exact));
        const next = Math.min(frameCount - 1, i + 1);
        const frac = exact - i;

        ctx.fillStyle = "#08080a";
        ctx.fillRect(0, 0, canvasW, canvasH);

        const a = framesRef.current[i];
        const b = framesRef.current[next];
        if (a) drawFrame(a);
        if (b && next !== i && frac > 0.001) drawFrame(b, frac);
        return;
      }

      const frameIndex = Math.min(frameCount - 1, Math.round(exact));
      if (frameIndex === lastExact) return;
      lastExact = frameIndex;

      ctx.fillStyle = "#08080a";
      ctx.fillRect(0, 0, canvasW, canvasH);

      const frame = framesRef.current[frameIndex];
      if (frame) drawFrame(frame);
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvasW = canvas.clientWidth;
      canvasH = canvas.clientHeight;
      canvas.width = Math.max(1, Math.round(canvasW * dpr));
      canvas.height = Math.max(1, Math.round(canvasH * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      lastExact = -1;
    };

    let lastTime = performance.now();

    const tick = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      const target = computePinProgress(section);
      // Framerate-independent ease toward the scroll position — gives the
      // scrub inertia and absorbs abrupt wheel/touch jumps.
      const k = 1 - Math.exp(-7 * dt);
      smooth += (target - smooth) * k;
      if (Math.abs(target - smooth) < 0.0003) smooth = target;
      progressRef.current = smooth;
      draw(smooth);

      if (Math.abs(smooth - uiProgressRef.current) > 0.004) {
        uiProgressRef.current = smooth;
        setDisplayProgress(smooth);
      }

      rafId = requestAnimationFrame(tick);
    };

    resize();
    rafId = requestAnimationFrame(tick);

    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(rafId);
    };
  }, [ready, frameCount, variant]);

  return (
    <section
      ref={sectionRef}
      id="tour"
      className="relative w-full bg-ink"
      style={{ height: `${SECTION_VH}vh` }}
      aria-label="Анимированный показ дома при скролле"
    >
      <div className="sticky top-0 h-[100dvh] w-full overflow-hidden bg-ink">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 block h-full w-full"
          aria-hidden="true"
        />

        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(8,8,10,0.55) 0%, transparent 18%, transparent 68%, rgba(8,8,10,0.82) 100%)",
          }}
        />

        {!ready && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 bg-ink">
            <div className="text-eyebrow uppercase text-bone-mute">
              {manifest ? "Загрузка обзора" : "Подготовка модели"}
            </div>
            <div className="h-[1px] w-56 overflow-hidden bg-bone/10">
              <div
                className="h-full bg-bone/80 transition-[width] duration-200 ease-out"
                style={{
                  width: `${frameCount > 0 ? (loaded / frameCount) * 100 : 0}%`,
                }}
              />
            </div>
            {frameCount > 0 && (
              <div className="text-xs tabular-nums text-bone-dim">
                {loaded} / {frameCount}
              </div>
            )}
          </div>
        )}

        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex flex-col items-center gap-3 px-6 pb-4 pt-24 sm:px-10 sm:pt-28">
          <div className="flex items-center gap-3 text-eyebrow uppercase text-bone-mute">
            <span className="font-display text-sm font-semibold tracking-tightest text-bone">
              {stage.index}
            </span>
            <span>/ {captions.length}</span>
            <span className="hidden h-3 w-px bg-bone/20 sm:block" aria-hidden="true" />
            <span className="hidden sm:inline">{stage.eyebrow}</span>
          </div>
          <div className="text-eyebrow uppercase text-bone-dim sm:hidden">{stage.eyebrow}</div>
          <div className="flex w-full max-w-xl items-center gap-3 text-eyebrow uppercase text-bone-dim">
            {variant === "entrance" ? (
              <span>вход</span>
            ) : (
              <span className="tabular-nums">
                {String(Math.round(displayProgress * 360)).padStart(3, "0")}°
              </span>
            )}
            <div className="h-[1px] flex-1 overflow-hidden bg-bone/10">
              <div
                className="h-full origin-left bg-bone/80"
                style={{ transform: `scaleX(${displayProgress})` }}
              />
            </div>
            {variant === "entrance" ? (
              <span>лобби</span>
            ) : (
              <span className="tabular-nums">
                {String(Math.round(displayProgress * 100)).padStart(3, "0")}%
              </span>
            )}
          </div>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex items-end p-6 sm:p-10 lg:p-14">
          <div key={stage.index} className="w-full max-w-md lg:max-w-lg">
            <div className="flex items-baseline gap-3 text-eyebrow uppercase text-bone-dim">
              <span className="font-display text-base font-semibold tracking-tightest text-bone">
                {stage.index}
              </span>
              <span>{stage.eyebrow}</span>
            </div>
            <h2
              className="mt-4 whitespace-pre-line font-display font-semibold leading-[0.95] tracking-tightest text-balance text-bone"
              style={{ fontSize: "clamp(28px, 3.6vw, 52px)" }}
            >
              {stage.title}
            </h2>
            <p
              className="mt-4 max-w-md text-pretty leading-relaxed text-bone-soft"
              style={{ fontSize: "clamp(14px, 1vw, 16px)" }}
            >
              {stage.body}
            </p>
          </div>

          <div className="ml-auto hidden text-right sm:block">
            <div className="text-eyebrow uppercase text-bone-mute">
              {config?.eyebrow ?? "3D-обзор"}
            </div>
            <div className="mt-1 text-eyebrow uppercase text-bone-dim">
              ЖК Minvest · Корпус 1
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
