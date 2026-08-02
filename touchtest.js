const { chromium, devices } = require("playwright");
(async () => {
  const browser = await chromium.launch();
  // Simulate landscape phone with typical Chrome-Android chrome height eaten from the top,
  // by using a viewport shorter than a phone's real landscape screen (browser chrome ~50-100px)
  const context = await browser.newContext({ viewport: { width: 780, height: 320 } });
  const page = await context.newPage();
  await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
  await page.waitForSelector(".carousel", { timeout: 30000 });
  await page.waitForTimeout(500);

  const metrics = await page.evaluate(() => {
    const app = document.querySelector(".App").getBoundingClientRect();
    const carousel = document.querySelector(".carousel").getBoundingClientRect();
    const cards = Array.from(document.querySelectorAll(".card-inner")).map((e) => e.getBoundingClientRect());
    return {
      innerHeight: window.innerHeight,
      appHeight: app.height,
      carouselHeight: carousel.height,
      cardBottoms: cards.map((c) => c.bottom),
      cardTops: cards.map((c) => c.top),
    };
  });
  console.log(JSON.stringify(metrics, null, 2));
  await browser.close();
})();
