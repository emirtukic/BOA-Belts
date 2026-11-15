// Snima svaki mail iz lokalnog testa (MAIL_PREVIEW_DIR) kao sliku, da se pregleda izgled.
// Upotreba: node tools/mail-shots.js <folder-s-mailovima> <folder-za-slike>
const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');

const CHROME = process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe';

async function main() {
  const [dir, out] = process.argv.slice(2);
  fs.mkdirSync(out, { recursive: true });
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: true });
  const page = await browser.newPage();
  for (const width of [700, 375]) {
    await page.setViewport({ width, height: 900 });
    for (const file of fs.readdirSync(dir).filter((f) => f.endsWith('.html'))) {
      await page.goto(pathToFileURL(path.resolve(dir, file)).href, { waitUntil: 'networkidle0' });
      const name = `${width}-${file.replace(/^\d+-/, '').replace(/\.html$/, '').slice(0, 40)}`;
      await page.screenshot({ path: path.join(out, `${name}.png`), fullPage: true });
      const info = await page.evaluate(() => ({
        brokenImages: Array.from(document.images).filter((i) => !i.naturalWidth).map((i) => i.src),
        links: Array.from(document.links).map((a) => a.href),
        overflow: document.documentElement.scrollWidth - window.innerWidth
      }));
      if (width === 700) console.log(name, JSON.stringify(info));
      else if (info.overflow > 0 || info.brokenImages.length) console.log(name, 'PROBLEM', JSON.stringify(info));
    }
  }
  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
