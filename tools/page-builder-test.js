const puppeteer = require('puppeteer-core');
// Test stranica iz admina: node tools/page-builder-test.js <url> <folder-za-snimke>
const path = require('path');
const B = process.argv[2] || 'http://localhost:3111';
const S = process.argv[3] || '.';
const IMG = path.join(__dirname, '..', 'public', 'images', 'revija') + '/';
let fails = 0;
const ok = (name, cond) => { console.log((cond ? 'OK   ' : 'FAIL ') + name); if (!cond) fails++; };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  const browser = await puppeteer.launch({ executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('dialog', (d) => d.accept());
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(B + '/admin/prijava', { waitUntil: 'networkidle2' });
  await page.type('#username', 'admin');
  await page.type('#password', 'test-admin-123');
  await Promise.all([page.waitForNavigation(), page.click('button[type=submit]')]);

  await page.goto(B + '/admin/stranice', { waitUntil: 'networkidle2' });
  ok('lista stranica radi', (await page.content()).includes('Još nema stranica'));
  await Promise.all([page.waitForNavigation(), page.click('a[href="/admin/stranice/nova"]')]);

  await page.type('#title', 'Jesenja kolekcija 2026');
  ok('adresa se popunila iz naslova', (await page.$eval('#slug', (e) => e.value)) === 'jesenja-kolekcija-2026');

  // Blok 1 (tekst) postoji po defaultu: brisemo ga i pravimo redoslijed ispocetka.
  const card = (n) => `#blocksList .pb-block-card:nth-child(${n})`;
  await page.$eval(card(1) + ' .btn-danger', (e) => e.click());
  const add = async (type) => { await page.$eval(`[data-add-block="${type}"]`, (b) => b.click()); await sleep(200); };

  await add('banner');
  let file = await page.$(card(1) + ' input[type=file]');
  await file.uploadFile(IMG + '8J3A0644.webp');
  await page.waitForSelector(card(1) + ' .pb-image-picker img', { timeout: 15000 });
  const inputs1 = await page.$$(card(1) + ' input[type=text]');
  await inputs1[0].type('Novo u radionici');
  await inputs1[1].type('Jesenja kolekcija');
  await page.type(card(1) + ' textarea', 'Kaiševi i torbe u toplim tonovima.');
  await inputs1[2].type('Pogledaj kolekciju');
  await inputs1[3].type('/kolekcija');

  await add('text');
  const t = await page.$$(card(2) + ' input[type=text]');
  await t[0].type('Ručno, polako i sa pažnjom');
  await page.type(card(2) + ' textarea', 'Prvi pasus sa **podebljanim** tekstom.\n\nDrugi pasus sa [linkom na kontakt](/kontakt).\n\n- prva stavka\n- druga stavka');

  await add('products');
  await page.$eval(card(3) + ' .pb-product-option:nth-child(1) input', (e) => e.click());
  await page.$eval(card(3) + ' .pb-product-option:nth-child(3) input', (e) => e.click());
  await page.$eval(card(3) + ' .pb-product-option:nth-child(5) input', (e) => e.click());

  await add('gallery');
  file = await page.$(card(4) + ' input[type=file]');
  await file.uploadFile(IMG + '8J3A0628.webp', IMG + 'DSC_0870.webp', IMG + 'IMG_5723.webp', IMG + 'L1050034.webp');
  await page.waitForFunction((sel) => document.querySelectorAll(sel + ' .pb-thumb').length === 4, { timeout: 30000 }, card(4));

  await add('imageText');
  file = await page.$(card(5) + ' input[type=file]');
  await file.uploadFile(IMG + 'DSC_0813.webp');
  await page.waitForSelector(card(5) + ' .pb-image-picker img', { timeout: 15000 });
  await page.select(card(5) + ' select', 'right');
  const it = await page.$$(card(5) + ' input[type=text]');
  await it[1].type('Kaiš po vašoj mjeri');
  await page.type(card(5) + ' textarea', 'Upišite obim struka i mi izrađujemo kaiš za vas.');

  await add('video');
  const v = await page.$$(card(6) + ' input[type=text]');
  await v[0].type('https://www.youtube.com/watch?v=dQw4w9WgXcQ');

  await add('image');
  file = await page.$(card(7) + ' input[type=file]');
  await file.uploadFile(IMG + '8J3A0630.webp');
  await page.waitForSelector(card(7) + ' .pb-image-picker img', { timeout: 15000 });

  // Pomjeri sliku (blok 7) gore iznad videa.
  await page.$eval(card(7) + ' .pb-block-tools .btn:nth-child(1)', (e) => e.click());
  await sleep(150);
  ok('pomjeranje bloka gore', (await page.$eval(card(6), (e) => e.dataset.type)) === 'image');

  await page.screenshot({ path: S + '/pb-admin.png', fullPage: true });

  // Pregled u novoj kartici, bez cuvanja.
  const [preview] = await Promise.all([
    new Promise((r) => browser.once('targetcreated', async (tg) => r(await tg.page()))),
    page.click('button[formaction="/admin/stranice/pregled"]')
  ]);
  await preview.waitForSelector('.preview-bar', { timeout: 20000 });
  await sleep(800);
  ok('pregled prikazuje baner', (await preview.$eval('.pb-banner h1', (e) => e.textContent.trim())) === 'Jesenja kolekcija');
  ok('pregled: 3 proizvoda', (await preview.$$('.pb-products .product-card')).length === 3);
  await preview.close();
  const other = await browser.newPage();
  ok('pregled nije sacuvao stranicu', (await (await other.goto(B + '/jesenja-kolekcija-2026', { waitUntil: 'networkidle2' })).status()) === 404);

  // Objavi i stavi u meni gore.
  await page.bringToFront();
  await page.$eval('input[name=status][value=published]', (e) => e.click());
  await page.select('#menu', 'header');
  await page.type('#menu_label', 'Jesen 2026');
  await Promise.all([page.waitForNavigation(), page.click('.pb-actions .btn-primary')]);
  ok('sacuvano i objavljeno', (await page.content()).includes('sačuvana i objavljena'));
  ok('posle cuvanja 7 blokova', (await page.$$('#blocksList .pb-block-card')).length === 7);

  const pub = await other.goto(B + '/jesenja-kolekcija-2026', { waitUntil: 'networkidle2' });
  ok('javna stranica 200', pub.status() === 200);
  const info = await other.evaluate(() => ({
    h1: document.querySelector('h1')?.textContent.trim(),
    nav: [...document.querySelectorAll('.main-nav a')].map((a) => a.textContent.trim()),
    order: [...document.querySelectorAll('.pb-block')].map((s) => s.className),
    strong: !!document.querySelector('.pb-text strong'),
    link: document.querySelector('.pb-text a')?.getAttribute('href'),
    list: document.querySelectorAll('.pb-text li').length,
    products: document.querySelectorAll('.pb-products .product-card').length,
    gallery: document.querySelectorAll('.pb-gallery .revija-item').length,
    yt: document.querySelector('.pb-video iframe')?.src,
    reversed: !!document.querySelector('.home-story.is-reversed')
  }));
  ok('h1 je naslov banera', info.h1 === 'Jesenja kolekcija');
  ok('meni gore ima "Jesen 2026" prije Kontakta', info.nav.indexOf('Jesen 2026') === info.nav.indexOf('Kontakt') - 1);
  ok('podebljano, link, lista', info.strong && info.link === '/kontakt' && info.list === 2);
  ok('3 proizvoda, 4 slike u galeriji', info.products === 3 && info.gallery === 4);
  ok('youtube video', /youtube-nocookie\.com\/embed\/dQw4w9WgXcQ/.test(info.yt || ''));
  ok('slika desno', info.reversed);
  const sm = await other.goto(B + '/sitemap.xml');
  ok('stranica u sitemap.xml', (await sm.text()).includes('/jesenja-kolekcija-2026'));
  await other.goto(B + '/jesenja-kolekcija-2026', { waitUntil: 'networkidle2' });
  await other.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 500) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 100)); } window.scrollTo(0, 0); });
  await sleep(800);
  await other.screenshot({ path: S + '/pb-public-desk.png', fullPage: true });

  const mob = await browser.newPage();
  await mob.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  await mob.goto(B + '/jesenja-kolekcija-2026', { waitUntil: 'networkidle2' });
  await mob.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 500) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 100)); } window.scrollTo(0, 0); });
  await sleep(800);
  ok('mobitel bez prelijevanja', (await mob.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)) <= 0);
  ok('mobilni meni ima stranicu', await mob.evaluate(() => [...document.querySelectorAll('#mobileNavDrawer a')].some((a) => a.textContent.trim() === 'Jesen 2026')));
  await mob.screenshot({ path: S + '/pb-public-mob.png', fullPage: true });

  // Skica: nestaje sa sajta i iz menija.
  await page.bringToFront();
  await page.$eval('input[name=status][value=draft]', (e) => e.click());
  await Promise.all([page.waitForNavigation(), page.click('.pb-actions .btn-primary')]);
  ok('skica vraca 404', (await (await other.goto(B + '/jesenja-kolekcija-2026', { waitUntil: 'networkidle2' })).status()) === 404);
  ok('skica nije u meniju', !(await other.evaluate(() => [...document.querySelectorAll('.main-nav a')].some((a) => a.textContent.includes('Jesen')))));

  // Zauzeta adresa se odbija.
  await page.goto(B + '/admin/stranice/nova', { waitUntil: 'networkidle2' });
  await page.type('#title', 'Kolekcija');
  await Promise.all([page.waitForNavigation(), page.click('.pb-actions .btn-primary')]);
  ok('adresa /kolekcija se odbija', (await page.content()).includes('sajt već koristi'));

  // Pregled pocetne sa nesacuvanim naslovom.
  await page.goto(B + '/admin/pocetna', { waitUntil: 'networkidle2' });
  await page.$eval('#heading', (e) => { e.value = 'Naslov samo za pregled'; });
  const [hp] = await Promise.all([
    new Promise((r) => browser.once('targetcreated', async (tg) => r(await tg.page()))),
    page.click('button[formaction="/admin/pocetna/pregled"]')
  ]);
  await hp.waitForSelector('.preview-bar', { timeout: 20000 });
  ok('pregled pocetne pokazuje novi naslov', (await hp.$eval('.home-hero h1', (e) => e.textContent.trim())) === 'Naslov samo za pregled');
  await hp.close();
  await page.bringToFront();
  await other.goto(B + '/', { waitUntil: 'networkidle2' });
  ok('prava pocetna nije promijenjena', (await other.$eval('.home-hero h1', (e) => e.textContent.trim())) !== 'Naslov samo za pregled');

  await page.goto(B + '/admin/stranice', { waitUntil: 'networkidle2' });
  await page.screenshot({ path: S + '/pb-list.png' });
  ok('nema JS gresaka', errors.length === 0);
  if (errors.length) console.log(errors);
  console.log(fails ? `${fails} NEUSPJELO` : 'SVE PROSLO');
  if (fails) process.exitCode = 1;
  await browser.close();
})().catch(async (e) => { console.error('GRESKA', e); process.exit(1); });
