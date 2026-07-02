/**
 * Hero scroll videos → desktop + mobile WebP frame sequences.
 *
 *   public/hero-scrub-temp.mp4         (1920×1080 @60fps) → public/hero-desktop-frames/{0001..}.webp
 *   public/hero-scrub-mobile-temp.mp4  (1072×1920 @24fps) → public/hero-mobile-frames/{0001..}.webp
 *
 * ffmpeg extracts lossless PNGs, then sharp compresses them to WebP — the
 * local ffmpeg build has no libwebp encoder. WebP q80 beats JPEG q3 on both
 * quality and size. The canvas component blends adjacent frames while
 * scrubbing, so the reduced frame rate still reads as continuous video.
 */
import { execFileSync } from "node:child_process";
import { mkdir, readdir, rm, stat, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const SRC_DESKTOP = path.join(ROOT, "public/hero-scrub-temp.mp4");
const SRC_MOBILE = path.join(ROOT, "public/hero-scrub-mobile-temp.mp4");
const OUT_DESKTOP = path.join(ROOT, "public/hero-desktop-frames");
const OUT_MOBILE = path.join(ROOT, "public/hero-mobile-frames");
const POSTER_DESKTOP = path.join(ROOT, "public/hero-scrub-temp.jpg");
const POSTER_MOBILE = path.join(ROOT, "public/hero-scrub-mobile-temp.jpg");

/** Desktop source is 60fps — every 3rd frame ≈ 20fps timeline. */
const STEP_DESKTOP = 3;
/** Mobile source is 24fps — every 2nd frame ≈ 12fps timeline. */
const STEP_MOBILE = 2;

function ffmpeg(args: string[]) {
  execFileSync("ffmpeg", args, { stdio: "inherit" });
}

async function extract(
  src: string,
  outDir: string,
  vf: string,
  quality: number,
) {
  const tmp = await mkdir(path.join(os.tmpdir(), `hero-png-${Date.now()}`), {
    recursive: true,
  }).then((d) => d ?? path.join(os.tmpdir(), `hero-png-${Date.now()}`));

  ffmpeg([
    "-y",
    "-hide_banner",
    "-loglevel",
    "warning",
    "-i",
    src,
    "-vf",
    vf,
    "-fps_mode",
    "vfr",
    path.join(tmp, "%04d.png"),
  ]);

  await rm(outDir, { recursive: true, force: true });
  await mkdir(outDir, { recursive: true });

  const pngs = (await readdir(tmp)).filter((f) => f.endsWith(".png")).sort();
  const parallel = Math.max(2, os.cpus().length - 2);
  let cursor = 0;

  await Promise.all(
    Array.from({ length: parallel }, async () => {
      for (;;) {
        const i = cursor++;
        if (i >= pngs.length) return;
        const name = pngs[i].replace(/\.png$/, ".webp");
        await sharp(path.join(tmp, pngs[i]))
          .webp({ quality, effort: 4 })
          .toFile(path.join(outDir, name));
      }
    }),
  );

  await rm(tmp, { recursive: true, force: true });

  const files = (await readdir(outDir)).filter((f) => f.endsWith(".webp")).sort();
  let total = 0;
  for (const f of files) total += (await stat(path.join(outDir, f))).size;

  return { count: files.length, bytes: total };
}

async function poster(src: string, outPath: string, vf: string) {
  ffmpeg([
    "-y",
    "-hide_banner",
    "-loglevel",
    "error",
    "-i",
    src,
    "-ss",
    "0.1",
    "-frames:v",
    "1",
    "-update",
    "1",
    "-vf",
    vf,
    "-q:v",
    "3",
    outPath,
  ]);
}

async function main() {
  for (const src of [SRC_DESKTOP, SRC_MOBILE]) {
    if (!existsSync(src)) {
      console.error(`! source not found: ${src}`);
      process.exit(1);
    }
  }

  console.log("\n▸ desktop @1920 webp");
  const desktop = await extract(
    SRC_DESKTOP,
    OUT_DESKTOP,
    `select='not(mod(n\\,${STEP_DESKTOP}))',scale=1920:-2:flags=lanczos`,
    80,
  );

  console.log("\n▸ mobile @720 portrait webp");
  const mobile = await extract(
    SRC_MOBILE,
    OUT_MOBILE,
    `select='not(mod(n\\,${STEP_MOBILE}))',scale=720:-2:flags=lanczos`,
    78,
  );

  console.log("\n▸ posters");
  await poster(SRC_DESKTOP, POSTER_DESKTOP, "scale=1920:-2:flags=lanczos");
  await poster(SRC_MOBILE, POSTER_MOBILE, "scale=720:-2:flags=lanczos");

  const manifest = {
    desktopCount: desktop.count,
    mobileCount: mobile.count,
    ext: "webp",
  };
  await writeFile(
    path.join(OUT_DESKTOP, "manifest.json"),
    `${JSON.stringify(manifest, null, 2)}\n`,
  );

  console.log(`\n✓ desktop ${desktop.count} frames · ${(desktop.bytes / 1024 / 1024).toFixed(1)} MB`);
  console.log(`✓ mobile  ${mobile.count} frames · ${(mobile.bytes / 1024 / 1024).toFixed(1)} MB\n`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
