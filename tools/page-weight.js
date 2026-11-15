// Mjeri koliko podataka browser skine za stranicu (prvi ulazak, bez kesa):
// node tools/page-weight.js <url> [mobile]
const puppeteer = require('puppeteer-core');

const CHROME = process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe';

async function main() {
  const [url, mode] = process.argv.slice(2);
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: true });
  const page = await browser.newPage();
  if (mode === 'mobile') await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  else await page.setViewport({ width: 1440, height: 900 });
  await page.setCacheEnabled(false);
  const cdp = await page.createCDPSession();
  await cdp.send('Network.enable');
  let bytes = 0;
  let requests = 0;
  const byType = {};
  const types = {};
  cdp.on('Network.responseReceived', (e) => {
    types[e.requestId] = e.type;
  });
  cdp.on('Network.loadingFinished', (e) => {
    bytes += e.encodedDataLength;
    requests += 1;
    const type = types[e.requestId] || 'Other';
    byType[type] = (byType[type] || 0) + e.encodedDataLength;
  });
  const start = Date.now();
  await page.goto(url, { waitUntil: 'load', timeout: 90000 });
  const loadMs = Date.now() - start;
  // Prvi prikaz bez skrolanja: ono sto kupac ceka prije nego vidi stranicu.
  const kb = (n) => `${Math.round(n / 1024)} KB`;
  const parts = Object.entries(byType)
    .sort((a, b) => b[1] - a[1])
    .map(([t, n]) => `${t} ${kb(n)}`)
    .join(', ');
  console.log(`${url} [${mode || 'desktop'}]: ${kb(bytes)} u ${requests} zahtjeva, load ${loadMs} ms (${parts})`);
  await browser.close();
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
