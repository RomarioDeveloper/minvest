import fs from "fs";
import path from "path";
import sharp from "sharp";

const ROOT = path.join(import.meta.dirname, "..");
const PUBLIC = path.join(ROOT, "public");

/**
 * Крупноформатные PNG (фасады 6–33 МБ, планировки до 4.6 МБ) грузятся десятками
 * мегабайт. Пересобираем их в WebP: фото — с ресайзом и q80, планировки —
 * шире и q82, чтобы текст/линии оставались читаемыми.
 */
const TASKS = [
  // Лицевые фото объектов (лежат в корне public)
  { file: "Дюсенова 304.png", maxWidth: 2000, quality: 80 },
  { file: "Дюсенова 306.png", maxWidth: 2000, quality: 80 },
  { file: "Горького.png", maxWidth: 2000, quality: 80 },
  { file: "Естая 90 (2).png", maxWidth: 2000, quality: 80 },
  { file: "Бектурова 348.png", maxWidth: 2000, quality: 80 },
  { file: "Бектурова 356.png", maxWidth: 2000, quality: 80 },
];

const GALLERY_DIRS = ["Бектурова 356", "348 бектурова"];

async function convert(absPng, { maxWidth, quality }) {
  const absWebp = absPng.replace(/\.png$/i, ".webp");
  const before = fs.statSync(absPng).size;

  const img = sharp(absPng);
  const meta = await img.metadata();
  if (meta.width && meta.width > maxWidth) {
    img.resize({ width: maxWidth, withoutEnlargement: true });
  }
  await img.webp({ quality, effort: 5 }).toFile(absWebp);

  const after = fs.statSync(absWebp).size;
  const rel = path.relative(PUBLIC, absWebp);
  console.log(
    `${(before / 1048576).toFixed(1).padStart(6)} → ${(after / 1048576)
      .toFixed(2)
      .padStart(5)} MB   ${rel}`,
  );
  return { before, after };
}

async function main() {
  let totalBefore = 0;
  let totalAfter = 0;

  console.log("=== Лицевые фото ===");
  for (const t of TASKS) {
    const abs = path.join(PUBLIC, t.file);
    if (!fs.existsSync(abs)) {
      console.log(`  пропуск (нет файла): ${t.file}`);
      continue;
    }
    const { before, after } = await convert(abs, t);
    totalBefore += before;
    totalAfter += after;
  }

  console.log("\n=== Галереи Бектуровой ===");
  for (const dirName of GALLERY_DIRS) {
    const dir = path.join(PUBLIC, dirName);
    if (!fs.existsSync(dir)) continue;
    for (const name of fs.readdirSync(dir)) {
      if (!name.toLowerCase().endsWith(".png")) continue;
      const { before, after } = await convert(path.join(dir, name), {
        maxWidth: 2000,
        quality: 80,
      });
      totalBefore += before;
      totalAfter += after;
    }
  }

  console.log("\n=== Планировки ===");
  const layoutsDir = path.join(PUBLIC, "Планировки");
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const abs = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(abs);
      else if (entry.name.toLowerCase().endsWith(".png")) {
        pending.push(abs);
      }
    }
  };
  const pending = [];
  if (fs.existsSync(layoutsDir)) walk(layoutsDir);

  for (const abs of pending) {
    const { before, after } = await convert(abs, { maxWidth: 1800, quality: 82 });
    totalBefore += before;
    totalAfter += after;
  }

  console.log(
    `\nИТОГО: ${(totalBefore / 1048576).toFixed(1)} MB → ${(
      totalAfter / 1048576
    ).toFixed(1)} MB  (−${(100 - (totalAfter / totalBefore) * 100).toFixed(
      0,
    )}%)`,
  );
}

main();
