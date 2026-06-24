/**
 * Scroll-scrub hero video → web-ready all-keyframe MP4 + poster.
 *
 *   public/hero-scroll.mp4  →  public/hero-scrub.mp4 + hero-scrub.jpg
 *
 * All-keyframe encoding keeps scroll scrubbing sharp; 1080p avoids upscaling
 * artifacts on fullscreen hero sections.
 */
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const SRC = path.join(ROOT, process.argv[2] ?? "public/hero-scroll.mp4");
const OUT_MP4 = path.join(ROOT, process.argv[3] ?? "public/hero-scrub.mp4");
const OUT_JPG = path.join(ROOT, process.argv[4] ?? "public/hero-scrub.jpg");
/** Desktop: scale=1920:-2 · Mobile portrait: scale=-2:1920 · Pass "60" as 6th arg for interpolated fps */
const VF = process.argv[5] ?? "scale=1920:-2:flags=lanczos";
const TARGET_FPS = process.argv[6] ? parseInt(process.argv[6], 10) : 0;

function buildVideoFilter() {
  if (TARGET_FPS > 0) {
    return `minterpolate=fps=${TARGET_FPS}:mi_mode=mci:mc_mode=aobmc:vsbmc=1,${VF}`;
  }
  return VF;
}

function ffmpegBin() {
  return process.env.FFMPEG ?? "ffmpeg";
}

function run(args: string[]) {
  execFileSync(ffmpegBin(), args, { stdio: "inherit" });
}

function main() {
  if (!existsSync(SRC)) {
    console.error(`! source not found: ${SRC}`);
    process.exit(1);
  }

  const vf = buildVideoFilter();
  const label = TARGET_FPS > 0 ? `${TARGET_FPS}fps all-keyframe` : "1080p all-keyframe";
  console.log(`\n▸ hero-scrub — ${label} encode`);
  run([
    "-y",
    "-hide_banner",
    "-loglevel",
    "warning",
    "-i",
    SRC,
    "-vf",
    vf,
    "-c:v",
    "libx264",
    "-preset",
    "slow",
    "-crf",
    "20",
    "-g",
    "1",
    "-keyint_min",
    "1",
    "-pix_fmt",
    "yuv420p",
    "-movflags",
    "+faststart",
    "-an",
    OUT_MP4,
  ]);

  console.log("▸ poster frame");
  run([
    "-y",
    "-hide_banner",
    "-loglevel",
    "error",
    "-i",
    OUT_MP4,
    "-ss",
    "0.5",
    "-frames:v",
    "1",
    "-update",
    "1",
    "-vf",
    VF,
    OUT_JPG,
  ]);

  console.log(`\n✓ ${path.relative(ROOT, OUT_MP4)}`);
  console.log(`✓ ${path.relative(ROOT, OUT_JPG)}\n`);
}

main();
