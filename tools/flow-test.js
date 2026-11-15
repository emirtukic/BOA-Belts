// Prolazi kroz glavne tokove u pravom Chromeu, kao kupac i kao admin, na
// desktopu i mobitelu, i snima ekran svakog koraka.
// Pokretati SAMO protiv lokalnog servera iz tools/dev-server.sh (privremena
// baza, mailovi se ne salju nego upisuju u <folder>/mailovi).
//
// Upotreba: node tools/flow-test.js <url> <folder-za-snimke> <folder-sa-mailovima>

const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

const CHROME = process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const [BASE = 'http://localhost:3111', OUT = 'snimke', MAIL_DIR = ''] = process.argv.slice(2);

if (!/^http:\/\/(localhost|127\.0\.0\.1)/.test(BASE)) {
  console.error('Test se pokrece samo protiv lokalnog servera.');
  process.exit(1);
}
fs.mkdirSync(OUT, { recursive: true });

const results = [];
function check(name, ok, detail = '') {
  results.push({ name, ok, detail });
  console.log(`${ok ? 'OK  ' : 'GRESKA'} ${name}${detail ? ` - ${detail}` : ''}`);
}

async function shot(page, name) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 700) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 60));
    }
    window.scrollTo(0, 0);
  });
  await new Promise((r) => setTimeout(r, 300));
  await page.screenshot({ path: path.join(OUT, `${name}.png`), fullPage: true });
  check(`bez horizontalnog prelijevanja: ${name}`, overflow <= 0, overflow > 0 ? `${overflow}px` : '');
}

async function go(page, url) {
  const res = await page.goto(BASE + url, { waitUntil: 'networkidle2' });
  return res.status();
}

async function submit(page, selector) {
  await Promise.all([page.waitForNavigation({ waitUntil: 'networkidle2' }), page.click(selector)]);
}

async function fill(page, values) {
  for (const [selector, value] of Object.entries(values)) {
    await page.$eval(selector, (el) => {
      el.value = '';
    });
    await page.type(selector, value);
  }
}

function mails() {
  if (!MAIL_DIR || !fs.existsSync(MAIL_DIR)) return [];
  return fs.readdirSync(MAIL_DIR).map((f) => ({ file: f, html: fs.readFileSync(path.join(MAIL_DIR, f), 'utf8') }));
}

function newMails(before) {
  const seen = new Set(before.map((m) => m.file));
  return mails().filter((m) => !seen.has(m.file));
}

async function waitForMails(before, count) {
  for (let i = 0; i < 30; i += 1) {
    const fresh = newMails(before);
    if (fresh.length >= count) return fresh;
    await new Promise((r) => setTimeout(r, 200));
  }
  return newMails(before);
}

// Tekst koji kupac upise ne smije postati HTML ni na sajtu ni u mailu.
const XSS = '<img src=x onerror=alert(1)>Test';

async function customerFlow(browser, mobile) {
  const tag = mobile ? 'mobitel' : 'desktop';
  const page = await browser.newPage();
  if (mobile) await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
  else await page.setViewport({ width: 1440, height: 900 });
  const dialogs = [];
  page.on('dialog', async (d) => {
    dialogs.push(d.message());
    await d.dismiss();
  });

  for (const [url, name] of [
    ['/', 'pocetna'],
    ['/kolekcija', 'kolekcija'],
    ['/kolekcija?kategorija=torbe', 'kategorija-torbe'],
    ['/kolekcija?pretraga=belt', 'pretraga'],
    ['/o-nama', 'o-nama'],
    ['/kontakt', 'kontakt'],
    ['/program-lojalnosti', 'program-lojalnosti'],
    ['/bh-fashion-week', 'bh-fashion-week'],
    ['/uslovi-koristenja', 'uslovi'],
    ['/politika-privatnosti', 'privatnost']
  ]) {
    const status = await go(page, url);
    check(`${tag}: ${url} se otvara`, status === 200 || status === 304, String(status));
    await shot(page, `${tag}-${name}`);
  }

  // Mobilni meni
  if (mobile) {
    await go(page, '/');
    await page.click('#navToggle');
    await new Promise((r) => setTimeout(r, 500));
    await page.screenshot({ path: path.join(OUT, `${tag}-meni.png`) });
    const open = await page.$eval('#mobileNavDrawer', (el) => el.classList.contains('open'));
    check(`${tag}: mobilni meni se otvara`, open);
  }

  // Proizvod -> korpa -> narudzba
  await go(page, '/kolekcija/maya-bag');
  await shot(page, `${tag}-proizvod`);
  await page.click('.product-gallery-thumbs img:nth-child(2)');
  const mainSrc = await page.$eval('.product-gallery-main img', (img) => img.getAttribute('src'));
  check(`${tag}: klik na sličicu mijenja veliku sliku`, /02\.webp$/.test(mainSrc), mainSrc);

  // Dodavanje ide bez ucitavanja stranice i otvara korpu sa strane.
  await page.click('form[action="/korpa/dodaj"] button[type="submit"]');
  await page.waitForSelector('#cartDrawer.open', { timeout: 5000 }).catch(() => {});
  await new Promise((r) => setTimeout(r, 600));
  await page.screenshot({ path: path.join(OUT, `${tag}-korpa-ladica.png`) });

  // Kais po mjeri: bez obima struka i boje detalja ne ide u korpu.
  await go(page, '/kolekcija?kategorija=zenski-kaisevi');
  const beltHref = await page.$eval('.product-card a[href^="/kolekcija/"]', (a) => a.getAttribute('href'));
  await go(page, beltHref);
  const beltName = await page.$eval('.product-info h1', (el) => el.textContent.trim());
  const beltPrice = await page.$eval('.product-info .product-price', (el) => parseFloat(el.innerText.match(/\d+(\.\d+)?/)[0]));
  check(`${tag}: kaiš ima polje za obim struka`, !!(await page.$('#waist')));
  check(`${tag}: kaiš nudi zlatnu i srebrenu boju detalja`, (await page.$$eval('input[name="detailColor"]', (els) => els.map((e) => e.value).join(','))) === 'Zlatna,Srebrena');
  const drawerBefore = await page.$eval('#cartDrawer', (el) => el.classList.contains('open'));
  await page.click('form[action="/korpa/dodaj"] button[type="submit"]');
  await new Promise((r) => setTimeout(r, 500));
  const blocked = !(await page.$eval('#cartDrawer', (el) => el.classList.contains('open')));
  check(`${tag}: kaiš bez obima struka ne ide u korpu`, !drawerBefore && blocked);
  const serverReject = await page.evaluate(async () => {
    const form = document.querySelector('form[action="/korpa/dodaj"]');
    const body = new URLSearchParams(new FormData(form));
    body.set('size', '20');
    body.set('detailColor', 'Zlatna');
    const res = await fetch('/korpa/dodaj', { method: 'POST', body, headers: { Accept: 'application/json' } });
    return res.status;
  });
  check(`${tag}: server odbija obim izvan raspona`, serverReject === 400, String(serverReject));
  await page.type('#waist', '85');
  await page.click('label.color-option');
  await shot(page, `${tag}-kais-mjera`);
  await page.click('form[action="/korpa/dodaj"] button[type="submit"]');
  await page.waitForSelector('#cartDrawer.open', { timeout: 5000 }).catch(() => {});
  await new Promise((r) => setTimeout(r, 600));
  await page.screenshot({ path: path.join(OUT, `${tag}-korpa-ladica-kais.png`) });

  await go(page, '/korpa');
  await shot(page, `${tag}-korpa`);
  const cartText = await page.$eval('main, body', (el) => el.innerText);
  check(`${tag}: proizvod je u korpi`, cartText.includes('Maya bag'));
  check(`${tag}: korpa prikazuje obim struka i boju detalja`, cartText.includes(beltName) && cartText.includes('Obim struka: 85 cm') && cartText.includes('Boja detalja: Zlatna'));

  await go(page, '/narudzba');
  await shot(page, `${tag}-narudzba`);
  const before = mails();
  await fill(page, {
    '#customer_name': `${XSS} Kupac`,
    '#email': `kupac.${tag}@example.com`,
    '#phone': '060 000 000',
    '#address': 'Testna ulica 1',
    '#city': 'Travnik'
  });
  await page.click('#termsCheckbox');
  await page.click('#reviewBtn');
  await new Promise((r) => setTimeout(r, 300));
  await shot(page, `${tag}-narudzba-pregled`);
  await submit(page, '#placeOrderBtn');
  const url = page.url();
  check(`${tag}: narudžba je primljena`, /\/narudzba\/potvrda\/\d+/.test(url), url);
  await shot(page, `${tag}-potvrda`);
  const confirmText = await page.$eval('body', (el) => el.innerText);
  const expectedTotal = (180 + beltPrice + 10).toFixed(2);
  check(`${tag}: potvrda prikazuje poštarinu 10 KM i ukupno ${expectedTotal} KM`, confirmText.includes('10.00 KM') && confirmText.includes(`${expectedTotal} KM`), confirmText.slice(0, 400));
  check(`${tag}: potvrda prikazuje obim struka`, confirmText.includes('Obim struka: 85 cm'));

  const orderMails = await waitForMails(before, 2);
  check(`${tag}: poslana su 2 maila (kupcu i vlasniku)`, orderMails.length === 2, orderMails.map((m) => m.file).join(', '));
  check(`${tag}: mailovi sadrže obim struka i boju detalja`, orderMails.length === 2 && orderMails.every((m) => m.html.includes('Obim struka: 85 cm') && m.html.includes('Boja detalja: Zlatna')));
  check(
    `${tag}: ime kupca je escapovano u mailovima`,
    orderMails.length > 0 && orderMails.every((m) => !m.html.includes('<img src=x') && m.html.includes('&lt;img src=x'))
  );
  check(`${tag}: nijedan alert (XSS) nije iskočio`, dialogs.length === 0, dialogs.join(' | '));
  await page.close();
  return Number(url.split('/').pop());
}

async function accountFlow(browser) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await go(page, '/nalog/registracija');
  await shot(page, 'nalog-registracija');
  const before = mails();
  await fill(page, {
    '#name': 'Test Kupac',
    '#email': 'nalog@example.com',
    '#password': 'lozinka123',
    '#password2': 'lozinka123'
  });
  await submit(page, 'form[action="/nalog/registracija"] button[type="submit"]');
  await shot(page, 'nalog-provjerite-email');
  const [verify] = await waitForMails(before, 1);
  const link = verify && (verify.html.match(/href="(http[^"]*\/nalog\/verifikacija\/[^"]+)"/) || [])[1];
  check('nalog: stigao je mail za potvrdu', !!link);
  if (link) {
    await page.goto(link.replace(/^https?:\/\/[^/]+/, BASE), { waitUntil: 'networkidle2' });
    await shot(page, 'nalog-potvrden');
    check('nalog: potvrda vodi na nalog', page.url().includes('/nalog'), page.url());
  }
  await go(page, '/nalog');
  await shot(page, 'nalog-pregled');

  // Newsletter u podnozju
  const beforeNl = mails();
  await page.type('#newsletterEmail', 'novosti@example.com');
  await page.click('#newsletterPrivacy');
  await page.click('#newsletterForm button[type="submit"]');
  const nl = await waitForMails(beforeNl, 1);
  check('newsletter: stigla je dobrodošlica', nl.some((m) => /newsletter/i.test(m.html)));
  const unsub = nl.length && (nl[0].html.match(/href="(http[^"]*\/newsletter\/odjava[^"]+)"/) || [])[1];
  if (unsub) {
    await page.goto(unsub.replace(/&amp;/g, '&').replace(/^https?:\/\/[^/]+/, BASE), { waitUntil: 'networkidle2' });
    await shot(page, 'newsletter-odjava');
    await submit(page, 'form button[type="submit"]');
    const text = await page.$eval('body', (el) => el.innerText);
    check('newsletter: odjava radi', /odjav/i.test(text));
  } else {
    check('newsletter: mail ima link za odjavu', false);
  }

  // Kontakt forma
  const beforeContact = mails();
  await go(page, '/kontakt');
  await fill(page, { 'input[name="name"]': XSS, 'input[name="email"]': 'pitanje@example.com', 'textarea[name="message"]': `Poruka ${XSS}` });
  await submit(page, 'form[action="/kontakt"] button[type="submit"]');
  const contact = await waitForMails(beforeContact, 1);
  check('kontakt: poruka je stigla vlasniku', contact.length === 1);
  check('kontakt: tekst je escapovan u mailu', contact.length === 1 && !contact[0].html.includes('<img src=x'));
  await page.close();
}

async function adminFlow(browser, orderIds) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await go(page, '/admin/prijava');
  await shot(page, 'admin-prijava');
  await fill(page, { '#username': 'admin', '#password': 'pogresna' });
  await submit(page, 'button[type="submit"]');
  check('admin: pogrešna lozinka ne pušta', page.url().includes('/admin/prijava'));
  await fill(page, { '#username': 'admin', '#password': 'test-admin-123' });
  await submit(page, 'button[type="submit"]');
  check('admin: prijava radi', !page.url().includes('/prijava'), page.url());

  for (const [url, name] of [
    ['/admin', 'dashboard'],
    ['/admin/narudzbe', 'narudzbe'],
    ['/admin/proizvodi', 'proizvodi'],
    ['/admin/proizvodi/novi', 'proizvod-novi'],
    ['/admin/mjerenje-struka', 'mjerenje-struka'],
    ['/admin/kategorije', 'kategorije'],
    ['/admin/promo-kodovi', 'promo-kodovi'],
    ['/admin/statistika', 'statistika'],
    ['/admin/pocetna', 'pocetna'],
    ['/admin/stranice/o-nama', 'stranica-o-nama'],
    ['/admin/stranice/program-lojalnosti', 'stranica-lojalnost'],
    ['/admin/popup', 'popup'],
    ['/admin/newsletter', 'newsletter'],
    ['/admin/korisnici', 'korisnici'],
    ['/admin/podsjetnici', 'podsjetnici'],
    ['/admin/lozinka', 'lozinka']
  ]) {
    const status = await go(page, url);
    check(`admin: ${url} se otvara`, status === 200 || status === 304, String(status));
    await shot(page, `admin-${name}`);
  }

  // Uredjivanje proizvoda
  await go(page, '/admin/proizvodi');
  const editHref = await page.$eval('a[href*="/admin/proizvodi/"][href$="/izmijeni"]', (a) => a.getAttribute('href'));
  await go(page, editHref);
  await shot(page, 'admin-proizvod-izmjena');

  // Boja proizvoda (nije obavezna): admin doda boje torbi, kupac mora izabrati jednu.
  await go(page, '/admin/proizvodi');
  const mayaEdit = await page.evaluate(() => {
    const row = Array.from(document.querySelectorAll('tr')).find((tr) => tr.children[1] && tr.children[1].textContent.trim() === 'Maya bag');
    const link = row && row.querySelector('a[href$="/izmijeni"]');
    return link ? link.getAttribute('href') : null;
  });
  await go(page, mayaEdit);
  await page.evaluate(() => {
    document.querySelector('input[name="colors"]').value = 'crna, smeđa';
  });
  await Promise.all([page.waitForNavigation({ waitUntil: 'networkidle2' }), page.$eval('form.form-panel', (f) => f.submit())]);
  await go(page, '/kolekcija/maya-bag');
  await shot(page, 'proizvod-sa-bojom');
  const offered = await page.$$eval('input[name="color"]', (els) => els.map((e) => e.value).join(','));
  check('boja proizvoda: torba nudi crnu i smeđu', offered === 'crna,smeđa', offered);
  const colorAdd = await page.evaluate(async () => {
    const form = document.querySelector('form[action="/korpa/dodaj"]');
    const send = async (color) => {
      const body = new URLSearchParams(new FormData(form));
      if (color) body.set('color', color);
      const res = await fetch('/korpa/dodaj', { method: 'POST', body, headers: { Accept: 'application/json' } });
      return res.status;
    };
    return { without: await send(null), wrong: await send('zelena'), ok: await send('crna') };
  });
  check('boja proizvoda: bez izbora ili s pogrešnom bojom ne ide u korpu', colorAdd.without === 400 && colorAdd.wrong === 400, JSON.stringify(colorAdd));
  check('boja proizvoda: s izabranom bojom ide u korpu', colorAdd.ok === 200, JSON.stringify(colorAdd));
  await go(page, '/korpa');
  const colorCart = await page.$eval('body', (el) => el.innerText);
  check('boja proizvoda: korpa prikazuje "Boja: crna"', colorCart.includes('Boja: crna'));

  // Narudzba: poslano sa brojem posiljke, pa otkazivanje druge
  const [first, second] = orderIds;
  await go(page, `/admin/narudzbe/${first}`);
  await shot(page, 'admin-narudzba');
  const beforeShip = mails();
  await page.select('select[name="status"]', 'poslano');
  await fill(page, { '#tracking_number': 'RR123456789BA' });
  await submit(page, 'form[action*="/status"] button[type="submit"]');
  const shipped = await waitForMails(beforeShip, 1);
  check('admin: mail "poslano" sa brojem pošiljke', shipped.some((m) => m.html.includes('RR123456789BA')));

  if (second) {
    await go(page, `/admin/narudzbe/${second}`);
    const beforeCancel = mails();
    await page.select('select[name="status"]', 'otkazano');
    await submit(page, 'form[action*="/status"] button[type="submit"]');
    const cancelled = await waitForMails(beforeCancel, 1);
    check('admin: mail "otkazano"', cancelled.some((m) => /otkazana/.test(m.html)));
  }

  // Izvoz u Excel
  const today = new Date().toISOString().slice(0, 10);
  const xlsx = await page.evaluate(async (url) => {
    const res = await fetch(url);
    return { status: res.status, type: res.headers.get('content-type'), size: (await res.arrayBuffer()).byteLength };
  }, `/admin/narudzbe/izvoz?od=${today}&do=${today}`);
  check('admin: izvoz narudžbi u Excel', xlsx.status === 200 && /spreadsheet/.test(xlsx.type || '') && xlsx.size > 1000, JSON.stringify(xlsx));

  // Admin na mobitelu
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
  for (const [url, name] of [
    ['/admin', 'dashboard'],
    ['/admin/narudzbe', 'narudzbe'],
    [`/admin/narudzbe/${first}`, 'narudzba'],
    ['/admin/proizvodi', 'proizvodi'],
    [editHref, 'proizvod-izmjena'],
    ['/admin/statistika', 'statistika']
  ]) {
    await go(page, url);
    await shot(page, `admin-mobitel-${name}`);
  }
  await page.close();
}

async function wishlistAndChatFlow(browser, mobile) {
  const tag = mobile ? 'mobitel' : 'desktop';
  const page = await browser.newPage();
  if (mobile) await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  else await page.setViewport({ width: 1440, height: 900 });

  // Lista zelja: srce na kartici, broj u meniju, stranica liste, uklanjanje.
  await go(page, '/kolekcija?kategorija=torbe');
  const names = await page.$$eval('.product-card h3', (els) => els.slice(0, 2).map((e) => e.textContent.trim()));
  await page.click('.product-card:nth-child(1) .wish-btn');
  await page.click('.product-card:nth-child(2) .wish-btn');
  const badge = await page.$eval('#wishBadge', (el) => (el.hidden ? '' : el.textContent));
  check(`${tag}: lista želja - broj u meniju je 2`, badge === '2', badge);
  const pressed = await page.$eval('.product-card:nth-child(1) .wish-btn', (el) => el.getAttribute('aria-pressed'));
  check(`${tag}: lista želja - srce je označeno`, pressed === 'true');
  await go(page, '/lista-zelja');
  await page.waitForSelector('#wishlistItems .product-card', { timeout: 5000 }).catch(() => {});
  await shot(page, `${tag}-lista-zelja`);
  const listed = await page.$$eval('#wishlistItems .product-card h3', (els) => els.map((e) => e.textContent.trim()));
  check(`${tag}: lista želja prikazuje sačuvane proizvode`, names.every((n) => listed.includes(n)) && listed.length === 2, listed.join(', '));
  await page.click('#wishlistItems .product-card .wish-btn');
  await page.click('#wishlistItems .product-card .wish-btn');
  await new Promise((r) => setTimeout(r, 300));
  const emptyShown = await page.$eval('#wishlistEmpty', (el) => !el.hidden);
  check(`${tag}: lista želja - nakon uklanjanja prikazuje praznu listu`, emptyShown);
  await shot(page, `${tag}-lista-zelja-prazna`);

  // Viber / WhatsApp
  await go(page, '/kolekcija/maya-bag');
  const ask = await page.$$eval('.product-ask a', (els) => els.map((a) => a.getAttribute('href')));
  check(
    `${tag}: pitanje o proizvodu ide na WhatsApp s nazivom proizvoda i na Viber`,
    ask.length === 2 && /^https:\/\/wa\.me\/387603265484\?text=.*Maya%20bag/.test(ask[0]) && /^viber:\/\/chat\?number=%2B387603265484$/.test(ask[1]),
    ask.join(' | ')
  );
  await page.click('#chatToggle');
  await new Promise((r) => setTimeout(r, 300));
  const menuOpen = await page.$eval('#chatMenu', (el) => !el.hidden);
  check(`${tag}: dugme "Pišite nam" otvara Viber/WhatsApp`, menuOpen);
  await page.screenshot({ path: path.join(OUT, `${tag}-chat-meni.png`) });
  await page.keyboard.press('Escape');
  const menuClosed = await page.$eval('#chatMenu', (el) => el.hidden);
  check(`${tag}: Viber/WhatsApp meni se zatvara`, menuClosed);
  await page.close();
}

async function main() {
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: true });
  try {
    const desktopOrder = await customerFlow(browser, false);
    const mobileOrder = await customerFlow(browser, true);
    await wishlistAndChatFlow(browser, false);
    await wishlistAndChatFlow(browser, true);
    await accountFlow(browser);
    await adminFlow(browser, [desktopOrder, mobileOrder]);
  } finally {
    await browser.close();
  }
  const failed = results.filter((r) => !r.ok);
  console.log(`\n${results.length - failed.length}/${results.length} provjera prošlo.`);
  if (failed.length) process.exitCode = 1;
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
