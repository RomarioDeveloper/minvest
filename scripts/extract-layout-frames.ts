/**
 * Layout flythrough video → scroll frames (desktop + mobile).
 *
 *   public/16744863697526.mp4  →  public/layout-frames/{0001..}.jpg
 *                                 public/layout-frames-mobile/{0001..}.jpg
 */
import { execFileSync } from "node:child_process";
import { mkdir, readdir, stat, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const SRC = path.join(ROOT, "public/16744863697526.mp4");
const OUT_DESKTOP = path.join(ROOT, "public/layout-frames");
const OUT_MOBILE = path.join(ROOT, "public/layout-frames-mobile");
const POSTER = path.join(ROOT, "public/layout-scroll-poster.jpg");

/** Every Nth frame — 30fps × 30s = 900 source frames. */
const STEP = 3;
const DESKTOP_VF = `select='not(mod(n\\,${STEP}))',scale=1280:-2:flags=lanczos`;
const MOBILE_VF = `select='not(mod(n\\,${STEP}))',scale=480:-2:flags=lanczos`;

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

async function main() {
  if (!existsSync(SRC)) {
    console.error(`! source not found: ${SRC}`);
    process.exit(1);
  }

  console.log(`\n▸ layout frames — step ${STEP} from ${path.basename(SRC)}\n`);

  console.log("▸ desktop @1280px");
  const desktop = await extract(OUT_DESKTOP, DESKTOP_VF);

  console.log("\n▸ mobile @480px");
  const mobile = await extract(OUT_MOBILE, MOBILE_VF);

  console.log("\n▸ poster");
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
    "scale=1280:-2:flags=lanczos",
    POSTER,
  ]);

  const manifest = {
    count: desktop.count,
    step: STEP,
    desktopWidth: 1280,
    mobileWidth: 480,
    poster: "/layout-scroll-poster.jpg",
  };
  await writeFile(path.join(OUT_DESKTOP, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);

  console.log(`\n✓ ${desktop.count} frames`);
  console.log(`  desktop ${(desktop.bytes / 1024 / 1024).toFixed(1)} MB`);
  console.log(`  mobile  ${(mobile.bytes / 1024 / 1024).toFixed(1)} MB`);
  console.log(`  poster  ${path.relative(ROOT, POSTER)}\n`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
