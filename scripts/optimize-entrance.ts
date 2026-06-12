/**
 * Portrait entrance flythrough video → web-ready scroll frames (mobile).
 *
 *   Realistic/entrance-flythrough.mp4  →  public/entrance-frames/{0001..}.webp
 */
import { execFileSync } from "node:child_process";
import { mkdir, mkdtemp, readdir, rm, stat, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const SRC_VIDEO = path.join(ROOT, "Realistic/entrance-flythrough.mp4");
const OUT = path.join(ROOT, "public/entrance-frames");

/** Take every Nth video frame — 24fps × 15s source. */
const STEP = 2;
const WIDTH = 720;
const QUALITY = 72;

function fmtKb(n: number) {
  return `${Math.round(n / 1024)} KB`.padStart(8);
}

async function main() {
  if (!existsSync(SRC_VIDEO)) {
    console.error(`! source video not found: ${SRC_VIDEO}`);
    process.exit(1);
  }

  const tmp = await mkdtemp(path.join(os.tmpdir(), "entrance-frames-"));
  console.log(`\n▸ Extracting frames (step ${STEP}) from ${path.basename(SRC_VIDEO)}…`);
  execFileSync(
    "ffmpeg",
    [
      "-y",
      "-v", "error",
      "-i", SRC_VIDEO,
      "-vf", `select='not(mod(n\\,${STEP}))'`,
      "-vsync", "vfr",
      path.join(tmp, "%04d.png"),
    ],
    { stdio: "inherit" },
  );

  const pngs = (await readdir(tmp)).filter((f) => f.endsWith(".png")).sort();
  if (pngs.length === 0) {
    console.error("! ffmpeg produced no frames");
    process.exit(1);
  }

  await mkdir(OUT, { recursive: true });
  console.log(`▸ Converting ${pngs.length} frames → webp @${WIDTH}px (q${QUALITY})`);

  let totalOut = 0;
  let height = 0;

  for (let i = 0; i < pngs.length; i++) {
    const outName = `${String(i + 1).padStart(4, "0")}.webp`;
    const outPath = path.join(OUT, outName);

    const info = await sharp(path.join(tmp, pngs[i]))
      .resize({ width: WIDTH, withoutEnlargement: true })
      .webp({ quality: QUALITY, effort: 4 })
      .toFile(outPath);
    height = info.height;

    const outSize = (await stat(outPath)).size;
    totalOut += outSize;

    if (i % 20 === 0 || i === pngs.length - 1) {
      console.log(`  ${pngs[i].padEnd(10)} → ${outName}  ${fmtKb(outSize)}  (${i + 1}/${pngs.length})`);
    }
  }

  const manifest = {
    count: pngs.length,
    width: WIDTH,
    height,
    sourceStep: STEP,
  };
  await writeFile(path.join(OUT, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);
  await rm(tmp, { recursive: true, force: true });

  console.log(`\n  out ${(totalOut / 1024 / 1024).toFixed(1)} MB`);
  console.log(`  ✓ manifest → public/entrance-frames/manifest.json\n`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
