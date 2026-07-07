import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
page.on("pageerror", (err) => console.log("PAGEERROR:", err.message));

await page.goto("http://localhost:3000/", { waitUntil: "domcontentloaded" });
await page.waitForTimeout(20000);

const sceneTop = await page.evaluate(() => {
  const section = document.querySelector("#tradein");
  const scene = section?.lastElementChild?.lastElementChild; // сцена с машиной
  return scene ? scene.getBoundingClientRect().top + window.scrollY : 0;
});
console.log("scene top:", Math.round(sceneTop));

// Плавно доводим сцену от нижнего края вьюпорта до верхней трети,
// снимая кадры по пути.
let shot = 0;
for (let i = 0; i <= 5; i++) {
  const dest = sceneTop - 900 + (i * 620) / 5 + 40;
  // wheel-скролл до dest (Lenis игнорирует window.scrollTo)
  for (let s = 0; s < 400; s++) {
    const y = await page.evaluate(() => window.scrollY);
    if (y >= dest - 30) break;
    await page.mouse.wheel(0, Math.min(400, dest - y));
    await page.waitForTimeout(60);
  }
  await page.waitForTimeout(900);
  await page.screenshot({ path: `scripts/tradein-car-${shot}.png` });
  console.log("shot", shot++, "scrollY", await page.evaluate(() => window.scrollY));
}
await browser.close();
