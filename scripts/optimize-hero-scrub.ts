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
const SRC = path.join(ROOT, "public/hero-scroll.mp4");
const OUT_MP4 = path.join(ROOT, "public/hero-scrub.mp4");
const OUT_JPG = path.join(ROOT, "public/hero-scrub.jpg");

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

  console.log("\n▸ hero-scrub — 1080p all-keyframe encode");
  run([
    "-y",
    "-hide_banner",
    "-loglevel",
    "warning",
    "-i",
    SRC,
    "-vf",
    "scale=1920:-2:flags=lanczos",
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
    "scale=1920:-2:flags=lanczos",
    OUT_JPG,
  ]);

  console.log(`\n✓ ${path.relative(ROOT, OUT_MP4)}`);
  console.log(`✓ ${path.relative(ROOT, OUT_JPG)}\n`);
}

main();
