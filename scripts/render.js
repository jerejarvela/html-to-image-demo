const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

(async () => {
  const htmlPath = path.join(__dirname, "../html/output.html");
  const outputPath = path.join(__dirname, "../html/output.png");

  if (!fs.existsSync(htmlPath)) {
    console.error("❌ output.html not found!");
    process.exit(1);
  }

  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });

  const page = await browser.newPage();
  const html = fs.readFileSync(htmlPath, "utf-8");
  await page.setContent(html, { waitUntil: "networkidle0" });

  // 🔹 Selvitetään automaattisesti HTML:n koko
  const dimensions = await page.evaluate(() => {
    const body = document.body;
    const html = document.documentElement;
    const width = Math.max(
      body.scrollWidth, body.offsetWidth,
      html.clientWidth, html.scrollWidth, html.offsetWidth
    );
    const height = Math.max(
      body.scrollHeight, body.offsetHeight,
      html.clientHeight, html.scrollHeight, html.offsetHeight
    );
    return { width, height };
  });

  // 🔹 Asetetaan viewport tarkasti HTML:n mittoihin
  await page.setViewport({
    width: dimensions.width,
    height: dimensions.height,
    deviceScaleFactor: 1
  });

  // 🔹 Otetaan kuvakaappaus ilman tyhjiä marginaaleja
  await page.screenshot({
    path: outputPath,
    fullPage: false
  });

  await browser.close();
  console.log(`✅ Renderointi valmis: output.png (${dimensions.width}x${dimensions.height})`);
})();
