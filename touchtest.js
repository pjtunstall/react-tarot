const { chromium } = require("playwright");
(async () => {
  const browser = await chromium.launch();
  const scenarios = [
    { name: "portrait", width: 390, height: 664, file: "shot-portrait.png" },
    { name: "landscape-tight", width: 780, height: 260, file: "shot-landscape-tight.png" },
  ];
  for (const s of scenarios) {
    const context = await browser.newContext({ viewport: { width: s.width, height: s.height } });
    const page = await context.newPage();
    await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
    await page.waitForSelector(".carousel", { timeout: 30000 });
    await page.waitForTimeout(300);
    // Flip the center card face-up so the title text is visible in the screenshot
    await page.click(".card-inner.large-image, .large-image.card-inner").catch(() => {});
    await page.waitForTimeout(400);
    await page.screenshot({ path: s.file });
    await context.close();
  }
  await browser.close();
})();
