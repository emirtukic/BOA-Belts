// Snima ekran stranice u pravom Chromeu: node tools/shot.js <url> <izlaz.png> [mobile] [full]
const puppeteer = require('puppeteer-core');

const CHROME = process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe';

async function main() {
  const [url, out, mode = 'desktop', full = 'full'] = process.argv.slice(2);
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: true });
  const page = await browser.newPage();
  if (mode === 'mobile') {
    await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  } else {
    await page.setViewport({ width: 1440, height: 900 });
  }
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
  // Skrolanje kroz stranicu ucita slike sa loading="lazy" prije snimka.
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 600) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 120));
    }
    window.scrollTo(0, 0);
  });
  await new Promise((r) => setTimeout(r, 1000));
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  await page.screenshot({ path: out, fullPage: full === 'full' });
  console.log(`${out} (horizontalno prelijevanje: ${overflow}px)`);
  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
