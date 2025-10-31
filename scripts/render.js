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
  await page.setViewport({ width: 800, height: 1000 });
  await page.screenshot({ path: outputPath, fullPage: false });

  await browser.close();
  console.log("✅ Render complete: output.png");
})();
