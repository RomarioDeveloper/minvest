import fs from "fs";
import path from "path";
import sharp from "sharp";

const ROOT = path.join(import.meta.dirname, "..");
const LAYOUTS_DIR = path.join(ROOT, "public/Планировки");

/**
 * Планировки — 3D-рендеры на прозрачном фоне с огромными пустыми полями
 * (напр. 896×1200, а сам план ~364×286). Обрезаем прозрачные края, чтобы план
 * занимал весь кадр, и добавляем небольшой запас по краям.
 */
const files = [];
const walk = (dir) => {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const abs = path.join(dir, e.name);
    if (e.isDirectory()) walk(abs);
    else if (e.name.toLowerCase().endsWith(".webp")) files.push(abs);
  }
};
if (fs.existsSync(LAYOUTS_DIR)) walk(LAYOUTS_DIR);

let done = 0;
for (const abs of files) {
  try {
    const input = await sharp(abs).toBuffer();
    const trimmed = await sharp(input)
      .trim({ threshold: 12 })
      .toBuffer({ resolveWithObject: true });

    // Небольшой прозрачный отступ вокруг плана.
    const pad = Math.round(Math.max(trimmed.info.width, trimmed.info.height) * 0.04);
    await sharp(trimmed.data)
      .extend({
        top: pad,
        bottom: pad,
        left: pad,
        right: pad,
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .webp({ quality: 84, effort: 5 })
      .toFile(abs);

    const rel = path.relative(path.join(ROOT, "public"), abs);
    console.log(`trim → ${trimmed.info.width}×${trimmed.info.height}  ${rel}`);
    done++;
  } catch (e) {
    console.log(`skip ${path.basename(abs)}: ${e.message}`);
  }
}
console.log(`\nОбрезано планировок: ${done}/${files.length}`);
