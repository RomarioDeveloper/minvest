/**
 * Blender orbit renders → web-ready scroll frames.
 *
 *   public/Render/{0001..0528}.png  →  public/render-frames/{0001..}.webp
 */
import { mkdir, readdir, stat, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const SRC = path.join(ROOT, "public/Render");
const OUT = path.join(ROOT, "public/render-frames");

/** All source frames — crossfade in the player handles smooth scrubbing. */
const STEP = 1;
const WIDTH = 1280;
const QUALITY = 82;

function sortByNumber(a: string, b: string) {
  return Number.parseInt(path.parse(a).name, 10) - Number.parseInt(path.parse(b).name, 10);
}

function fmtKb(n: number) {
  return `${Math.round(n / 1024)} KB`.padStart(8);
}

async function main() {
  if (!existsSync(SRC)) {
    console.error("! public/Render/ not found");
    process.exit(1);
  }

  await mkdir(OUT, { recursive: true });

  const all = (await readdir(SRC))
    .filter((f) => /^\d+\.png$/i.test(f))
    .sort(sortByNumber);

  const picked = all.filter((_, i) => i % STEP === 0);
  if (picked.length === 0) {
    console.error("! no PNG frames in public/Render/");
    process.exit(1);
  }

  console.log(`\n▸ Render orbit  ${picked.length} frames  (step ${STEP} from ${all.length} sources)  @${WIDTH}px`);

  let totalIn = 0;
  let totalOut = 0;
  let height = 0;

  for (let i = 0; i < picked.length; i++) {
    const srcPath = path.join(SRC, picked[i]);
    const outName = `${String(i + 1).padStart(4, "0")}.webp`;
    const outPath = path.join(OUT, outName);

    const inSize = (await stat(srcPath)).size;
    totalIn += inSize;

    const pipeline = sharp(srcPath).resize({ width: WIDTH, withoutEnlargement: true }).webp({
      quality: QUALITY,
      effort: 4,
    });
    const { height: h } = await pipeline.clone().metadata();
    if (h) height = h;
    await pipeline.toFile(outPath);

    const outSize = (await stat(outPath)).size;
    totalOut += outSize;

    if (i % 20 === 0 || i === picked.length - 1) {
      console.log(`  ${picked[i].padEnd(10)} → ${outName}  ${fmtKb(outSize)}  (${i + 1}/${picked.length})`);
    }
  }

  const manifest = {
    count: picked.length,
    width: WIDTH,
    height,
    sourceStep: STEP,
    sourceTotal: all.length,
  };
  await writeFile(path.join(OUT, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);

  console.log(`\n  in  ${(totalIn / 1024 / 1024).toFixed(1)} MB`);
  console.log(`  out ${(totalOut / 1024 / 1024).toFixed(1)} MB`);
  console.log(`  ✓ manifest → public/render-frames/manifest.json\n`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
