import { chromium, devices } from "playwright";

const browser = await chromium.launch();
const context = await browser.newContext({ ...devices["iPhone 12 Pro"] });
const page = await context.newPage();
page.on("pageerror", (err) => console.log("PAGEERROR:", err.message));

await page.goto("http://localhost:3000/", { waitUntil: "domcontentloaded" });
await page.waitForTimeout(24000);

// Скроллим постепенно, как реальный пользователь (wheel-события для Lenis)
const target = await page.evaluate(() => {
  const el = document.querySelector("#company");
  return el ? el.getBoundingClientRect().top + window.scrollY : 0;
});
console.log("target scroll:", Math.round(target));

let steps = 0;
while (steps < 200) {
  const done = await page.evaluate((t) => window.scrollY >= t - 200, target);
  if (done) break;
  await page.mouse.wheel(0, 600);
  await page.waitForTimeout(120);
  steps++;
}
await page.waitForTimeout(4000);

const info = await page.evaluate(() => {
  const all = Array.from(document.querySelectorAll("#company [data-reveal]"));
  return {
    scrollY: Math.round(window.scrollY),
    els: all.map((el) => ({
      variant: el.getAttribute("data-reveal"),
      revealed: el.classList.contains("is-revealed"),
      top: Math.round(el.getBoundingClientRect().top),
      text: el.textContent?.slice(0, 25),
    })),
  };
});
console.log(JSON.stringify(info, null, 2));
await page.screenshot({ path: "scripts/company-mobile2.png" });
await browser.close();
 