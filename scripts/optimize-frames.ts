/**
 * One-shot asset pipeline for the landing.
 *
 * Reads from the source folders the photographer/3D artist drops next to the
 * project root and produces web-ready assets in `public/`:
 *
 *   3d modeling/{1..20}.png                       → public/frames/{01..20}.webp
 *     • Resized, WebP-encoded, *background removed* via a soft chroma key so
 *       the building can float over the dark editorial layout.
 *
 *   Realistic/Полный фасад территории/*.png       → public/photos/exterior/*.webp
 *   Realistic/Гаражи/*.png                        → public/photos/garages/*.webp
 *   Realistic/Детская площадка/*.png              → public/photos/playground/*.webp
 *   Realistic/Входная дверь, внутрянка/*.{png,jpeg} → public/photos/entrance/*.webp
 *
 *   Realistic/Video/*.mp4                         → public/video/{n}.mp4 + .webm + .jpg poster
 *     • Compressed to H.264 + VP9, ≤1080p, no audio. Skipped if ffmpeg is
 *       unavailable (in that case copy the smallest original instead).
 */
import { execFileSync, spawnSync } from "node:child_process";
import { copyFile, mkdir, readdir, stat, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const PUBLIC_DIR = path.join(ROOT, "public");

const SRC_FRAMES = path.join(ROOT, "3d modeling");
const OUT_FRAMES = path.join(PUBLIC_DIR, "frames");

const PHOTO_SRC: Record<string, string> = {
  exterior: path.join(ROOT, "Realistic", "Полный фасад территории"),
  garages: path.join(ROOT, "Realistic", "Гаражи"),
  playground: path.join(ROOT, "Realistic", "Детская площадка"),
  entrance: path.join(ROOT, "Realistic", "Входная дверь, внутрянка"),
};

const SRC_VIDEO = path.join(ROOT, "Realistic", "Video");
const OUT_VIDEO = path.join(PUBLIC_DIR, "video");

const FRAME_WIDTH = 2400;
const PHOTO_WIDTH = 2880;
const FRAME_QUALITY = 90;
const PHOTO_QUALITY = 88;

// ---- helpers -----------------------------------------------------------

function fmtKb(n: number) {
  return `${Math.round(n / 1024)} KB`.padStart(8);
}
function fmtMb(n: number) {
  return `${(n / 1024 / 1024).toFixed(1)} MB`;
}

function hasFfmpeg() {
  const r = spawnSync("which", ["ffmpeg"], { encoding: "utf8" });
  return r.status === 0 && r.stdout.trim().length > 0;
}

function sortByLeadingNumber(a: string, b: string) {
  const na = Number.parseInt(path.parse(a).name, 10);
  const nb = Number.parseInt(path.parse(b).name, 10);
  if (Number.isFinite(na) && Number.isFinite(nb)) return na - nb;
  return a.localeCompare(b);
}

// ---- orbit frames: chroma-key cut + WebP -------------------------------

async function sampleBackground(srcPath: string) {
  // Pull a strip from the very top — guaranteed background in the dataset.
  const { data, info } = await sharp(srcPath)
    .extract({ left: 0, top: 0, width: 240, height: 6 })
    .raw()
    .toBuffer({ resolveWithObject: true });
  let r = 0;
  let g = 0;
  let b = 0;
  const ch = info.channels;
  const px = data.length / ch;
  for (let i = 0; i < data.length; i += ch) {
    r += data[i];
    g += data[i + 1];
    b += data[i + 2];
  }
  return { r: Math.round(r / px), g: Math.round(g / px), b: Math.round(b / px) };
}

/**
 * Plain resize → WebP. We *keep* the studio gray backdrop the 3D artist
 * rendered against — chroma-keying produced a cut-out look that read as a
 * cheap collage on dark layouts. The animation component instead places the
 * frames inside a matching studio "card" so the gray is intentional, not a bug.
 */
async function processOrbitFrame(src: string, out: string) {
  await sharp(src)
    .resize({ width: FRAME_WIDTH, withoutEnlargement: true })
    .webp({ quality: FRAME_QUALITY, effort: 6 })
    .toFile(out);
}

async function buildOrbit() {
  if (!existsSync(SRC_FRAMES)) {
    console.warn("  ! '3d modeling/' not found — skipping orbit frames.");
    return;
  }
  await mkdir(OUT_FRAMES, { recursive: true });

  const files = (await readdir(SRC_FRAMES))
    .filter((f) => /^\d+\.png$/i.test(f))
    .sort(sortByLeadingNumber);

  if (files.length === 0) {
    console.warn("  ! no numbered PNGs in '3d modeling/' — skipping orbit.");
    return;
  }

  // We still sample the bg color so the page can match the studio card
  // exactly to the render's neutral gray.
  const samples = await Promise.all(
    [files[0], files[Math.floor(files.length / 2)], files[files.length - 1]]
      .map((f) => path.join(SRC_FRAMES, f))
      .map(sampleBackground),
  );
  const bg = {
    r: Math.round(samples.reduce((s, c) => s + c.r, 0) / samples.length),
    g: Math.round(samples.reduce((s, c) => s + c.g, 0) / samples.length),
    b: Math.round(samples.reduce((s, c) => s + c.b, 0) / samples.length),
  };
  const bgHex = `#${[bg.r, bg.g, bg.b].map((v) => v.toString(16).padStart(2, "0")).join("")}`;

  console.log(`\n▸ Orbit frames  @${FRAME_WIDTH}px  (studio bg ${bgHex})`);
  let totalIn = 0;
  let totalOut = 0;
  for (let i = 0; i < files.length; i++) {
    const src = path.join(SRC_FRAMES, files[i]);
    const idx = String(i + 1).padStart(2, "0");
    const out = path.join(OUT_FRAMES, `${idx}.webp`);
    const inSize = (await stat(src)).size;
    totalIn += inSize;
    await processOrbitFrame(src, out);
    const outSize = (await stat(out)).size;
    totalOut += outSize;
    console.log(
      `  ${files[i].padEnd(8)} ${fmtKb(inSize)} → ${idx}.webp ${fmtKb(outSize)}`,
    );
  }

  await writeFile(
    path.join(OUT_FRAMES, "manifest.json"),
    JSON.stringify(
      { count: files.length, width: FRAME_WIDTH, backgroundColor: bgHex, hasAlpha: false },
      null,
      2,
    ),
  );
  console.log(`  Σ ${fmtMb(totalIn)} → ${fmtMb(totalOut)}`);
}

// ---- realistic photos: just resize + WebP ------------------------------

async function buildPhotos() {
  for (const [bucket, src] of Object.entries(PHOTO_SRC)) {
    if (!existsSync(src)) continue;
    const out = path.join(PUBLIC_DIR, "photos", bucket);
    await mkdir(out, { recursive: true });

    const files = (await readdir(src))
      .filter((f) => /\.(png|jpe?g)$/i.test(f))
      .sort();

    if (files.length === 0) continue;
    console.log(`\n▸ Photos — ${bucket}`);

    const manifest: { src: string; width: number; height: number }[] = [];
    for (const f of files) {
      const srcPath = path.join(src, f);
      const outName = `${path.parse(f).name}.webp`;
      const outPath = path.join(out, outName);

      const meta = await sharp(srcPath)
        .resize({ width: PHOTO_WIDTH, withoutEnlargement: true })
        .webp({ quality: PHOTO_QUALITY, effort: 5 })
        .toFile(outPath);
      manifest.push({
        src: `/photos/${bucket}/${outName}`,
        width: meta.width,
        height: meta.height,
      });

      const outSize = (await stat(outPath)).size;
      console.log(`  ${f.slice(0, 32).padEnd(34)} → ${outName.slice(0, 32).padEnd(34)} ${fmtKb(outSize)}`);
    }
    await writeFile(path.join(out, "manifest.json"), JSON.stringify(manifest, null, 2));
  }
}

// ---- video -------------------------------------------------------------

function transcode(src: string, outBase: string) {
  // 1080p H.264 + AAC stripped, faststart for streaming, two-pass quality.
  execFileSync(
    "ffmpeg",
    [
      "-y", "-hide_banner", "-loglevel", "warning",
      "-i", src,
      "-vf", "scale='min(1920,iw)':-2",
      "-c:v", "libx264",
      "-preset", "slow",
      "-crf", "26",
      "-pix_fmt", "yuv420p",
      "-movflags", "+faststart",
      "-an",
      `${outBase}.mp4`,
    ],
    { stdio: "inherit" },
  );
  // VP9 fallback (smaller in many cases; useful for non-Safari).
  execFileSync(
    "ffmpeg",
    [
      "-y", "-hide_banner", "-loglevel", "warning",
      "-i", src,
      "-vf", "scale='min(1920,iw)':-2",
      "-c:v", "libvpx-vp9",
      "-b:v", "0",
      "-crf", "34",
      "-row-mt", "1",
      "-an",
      `${outBase}.webm`,
    ],
    { stdio: "inherit" },
  );
  // Poster frame.
  execFileSync(
    "ffmpeg",
    [
      "-y", "-hide_banner", "-loglevel", "warning",
      "-i", src,
      "-ss", "1",
      "-frames:v", "1",
      "-update", "1",
      "-vf", "scale='min(1920,iw)':-2",
      `${outBase}.jpg`,
    ],
    { stdio: "inherit" },
  );
}

async function buildVideos() {
  if (!existsSync(SRC_VIDEO)) return;
  await mkdir(OUT_VIDEO, { recursive: true });

  const files = (await readdir(SRC_VIDEO))
    .filter((f) => /\.mp4$/i.test(f))
    .sort();
  if (files.length === 0) return;

  const ffmpegAvailable = hasFfmpeg();
  console.log(
    `\n▸ Videos — ${ffmpegAvailable ? "transcoding with ffmpeg" : "ffmpeg not found, copying smallest original"}`,
  );

  if (ffmpegAvailable) {
    let n = 1;
    for (const f of files) {
      const src = path.join(SRC_VIDEO, f);
      const base = path.join(OUT_VIDEO, String(n));
      console.log(`  [${n}] ${f}  →  ${n}.mp4 + .webm + .jpg`);
      transcode(src, base);
      n += 1;
    }
  } else {
    // Sort by size, copy the smallest as fallback hero footage.
    const withSize = await Promise.all(
      files.map(async (f) => ({ f, size: (await stat(path.join(SRC_VIDEO, f))).size })),
    );
    withSize.sort((a, b) => a.size - b.size);
    const pick = withSize[0];
    const dest = path.join(OUT_VIDEO, "1.mp4");
    await copyFile(path.join(SRC_VIDEO, pick.f), dest);
    console.log(`  copied ${pick.f} → 1.mp4 (${fmtMb(pick.size)})`);
  }
}

// ---- main --------------------------------------------------------------

async function main() {
  // Allow skipping slow steps when iterating. Example:
  //   tsx scripts/optimize-frames.ts --only=orbit
  //   tsx scripts/optimize-frames.ts --only=orbit,photos
  const onlyArg = process.argv.find((a) => a.startsWith("--only="));
  const only = onlyArg ? new Set(onlyArg.slice("--only=".length).split(",")) : null;
  const should = (k: string) => !only || only.has(k);

  console.log("Optimizing landing assets…");
  await mkdir(PUBLIC_DIR, { recursive: true });
  if (should("orbit")) await buildOrbit();
  if (should("photos")) await buildPhotos();
  if (should("video") || should("videos")) await buildVideos();
  console.log("\nDone.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
