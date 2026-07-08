import { chromium, devices } from "playwright";

const browser = await chromium.launch();
const context = await browser.newContext({ ...devices["iPhone 12 Pro"] });
const page = await context.newPage();
page.on("pageerror", (e) => console.log("PAGEERROR:", e.message));

await page.goto("http://localhost:3000/", { waitUntil: "domcontentloaded" });
await page.waitForTimeout(18000);

await page.evaluate(() => document.querySelector("#objects")?.scrollIntoView());
await page.waitForTimeout(1500);

for (const c of await page.$$("#objects button")) {
  if (((await c.textContent()) || "").includes("Естая")) { await c.click(); break; }
}
await page.waitForTimeout(1200);
for (const b of await page.$$("button")) {
  if (((await b.textContent()) || "").startsWith("Планировки")) { await b.click(); break; }
}
await page.waitForTimeout(1200);
await page.screenshot({ path: "scripts/zoom-slide.png" });

// Открыть на весь экран
const plan = await page.$('button[aria-label="Открыть планировку на весь экран"]');
if (plan) { await plan.click(); await page.waitForTimeout(1000); }
await page.screenshot({ path: "scripts/zoom-full.png" });

// Двойной тап по центру для зума
const wrap = await page.$('div.touch-none');
const box = await wrap?.boundingBox();
if (box) {
  const cx = box.x + box.width / 2, cy = box.y + box.height / 2;
  await page.mouse.dblclick(cx, cy);
  await page.waitForTimeout(700);
  const tf = await page.$eval('div.touch-none img', (el) => el.style.transform);
  console.log("transform after dblclick:", tf);
  await page.screenshot({ path: "scripts/zoom-in.png" });
}
await browser.close();
console.log("done");
