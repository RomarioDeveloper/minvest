/**
 * Hero scroll video → desktop + mobile JPEG frame sequences.
 *
 *   public/hero-scroll.mp4  →  public/hero-desktop-frames/{0001..}.jpg
 *                             public/hero-mobile-frames/{0001..}.jpg
 */
import { execFileSync } from "node:child_process";
import { mkdir, readdir, stat, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const SRC = path.join(ROOT, process.argv[2] ?? "public/hero-scrub-temp.mp4");
const OUT_DESKTOP = path.join(ROOT, "public/hero-desktop-frames");
const OUT_MOBILE = path.join(ROOT, "public/hero-mobile-frames");
const POSTER_DESKTOP = path.join(ROOT, "public/hero-scrub-temp.jpg");
const POSTER_MOBILE = path.join(ROOT, "public/hero-scrub-mobile-temp.jpg");

/** Every Nth frame from 30fps source — keeps scrub smooth without 900 images. */
const STEP = 2;
const DESKTOP_VF = `select='not(mod(n\\,${STEP}))',scale=1920:-2:flags=lanczos`;
/** Portrait center-crop for fullscreen mobile hero (720×1280). */
const MOBILE_VF = `select='not(mod(n\\,${STEP}))',scale=-2:1280:flags=lanczos,crop=720:1280:(iw-720)/2:0`;

function ffmpeg(args: string[]) {
  execFileSync("ffmpeg", args, { stdio: "inherit" });
}

async function extract(outDir: string, vf: string) {
  await mkdir(outDir, { recursive: true });
  ffmpeg([
    "-y",
    "-hide_banner",
    "-loglevel",
    "warning",
    "-i",
    SRC,
    "-vf",
    vf,
    "-vsync",
    "vfr",
    "-q:v",
    "3",
    path.join(outDir, "%04d.jpg"),
  ]);

  const files = (await readdir(outDir)).filter((f) => f.endsWith(".jpg")).sort();
  let total = 0;
  for (const f of files) total += (await stat(path.join(outDir, f))).size;

  return { count: files.length, bytes: total };
}

async function poster(outPath: string, vf: string) {
  ffmpeg([
    "-y",
    "-hide_banner",
    "-loglevel",
    "error",
    "-i",
    SRC,
    "-ss",
    "0.5",
    "-frames:v",
    "1",
    "-update",
    "1",
    "-vf",
    vf,
    outPath,
  ]);
}

async function main() {
  if (!existsSync(SRC)) {
    console.error(`! source not found: ${SRC}`);
    process.exit(1);
  }

  console.log(`\n▸ hero frames — step ${STEP} from ${path.basename(SRC)}\n`);

  console.log("▸ desktop @1920px");
  const desktop = await extract(OUT_DESKTOP, DESKTOP_VF);

  console.log("\n▸ mobile @720px (portrait crop via scale)");
  const mobile = await extract(OUT_MOBILE, MOBILE_VF);

  console.log("\n▸ posters");
  await poster(POSTER_DESKTOP, "scale=1920:-2:flags=lanczos");
  await poster(POSTER_MOBILE, "scale=720:-2:flags=lanczos");

  const manifest = {
    count: desktop.count,
    step: STEP,
    desktopWidth: 1920,
    mobileWidth: 720,
    posterDesktop: "/hero-scrub-temp.jpg",
    posterMobile: "/hero-scrub-mobile-temp.jpg",
  };
  await writeFile(path.join(OUT_DESKTOP, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);

  console.log(`\n✓ ${desktop.count} frames`);
  console.log(`  desktop ${(desktop.bytes / 1024 / 1024).toFixed(1)} MB`);
  console.log(`  mobile  ${(mobile.bytes / 1024 / 1024).toFixed(1)} MB\n`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
