const fs = require('fs');
const path = require('path');
const express = require('express');
const sharp = require('sharp');
const router = express.Router();
const Product = require('../models/Product');
const Hero = require('../models/Hero');
const HomeSections = require('../models/HomeSections');
const PageContent = require('../models/PageContent');
const NewsletterSubscriber = require('../models/NewsletterSubscriber');
const { renderRichText } = require('../config/richText');
const Category = require('../models/Category');
const Page = require('../models/Page');
const { sendContactEmail } = require('../config/mailer');
const { subscribeWithWelcome } = require('../config/newsletter');
const { cleanText, isValidEmail } = require('../config/format');
const { jsonLd, storeSchema } = require('../config/seo');
const { CONTACT_EMAIL } = require('../config/site');
const { SHIPPING_PRICE_KM } = require('../config/pricing');

// Pocetna: lifestyle fotografije za kategorije koje ih imaju; ostale dobijaju
// sliku svog prvog proizvoda.
const CATEGORY_IMAGES = {
  'zenski-kaisevi': '/images/home/kaisevi.webp',
  torbe: '/images/home/torbe.webp',
  novcanici: '/images/home/novcanici.webp'
};

// Grupe proizvoda za kartice na pocetnoj (kaisevi su jedna grupa).
const HOME_TABS = [
  { id: 'kaisevi', label: 'Kaiševi', categories: ['zenski-kaisevi', 'muski-kaisevi'], link: '/kolekcija?kategorija=zenski-kaisevi' },
  { id: 'torbe', label: 'Torbe', categories: ['torbe'], link: '/kolekcija?kategorija=torbe' },
  { id: 'novcanici', label: 'Novčanici', categories: ['novcanici'], link: '/kolekcija?kategorija=novcanici' },
  { id: 'dodaci', label: 'Dodaci', categories: ['dodaci'], link: '/kolekcija?kategorija=dodaci' }
];

const REVIJA_DIR = path.join(__dirname, '..', 'public', 'images', 'revija');
// Galerija revije: svaka slika nosi svoje stvarne dimenzije, da se uspravne i
// polozene fotografije slazu bez sjecenja i bez skakanja stranice pri ucitavanju.
let revijaCache = null;
async function fashionWeekImages() {
  if (!revijaCache) {
    const sorted = fs
      .readdirSync(REVIJA_DIR)
      .filter((f) => f.endsWith('.webp') && !f.endsWith('-sm.webp'))
      .sort();
    // Fotografije snimljene jedna za drugom su skoro iste. Rasporedjuju se
    // ispreplitano (svaka sedma), da slicne ne stoje jedna do druge.
    const STRIDE = 7;
    const files = [];
    for (let start = 0; start < STRIDE; start++) {
      for (let i = start; i < sorted.length; i += STRIDE) files.push(sorted[i]);
    }
    revijaCache = await Promise.all(
      files.map(async (f) => {
        const { width, height } = await sharp(path.join(REVIJA_DIR, f)).metadata();
        return { src: `/images/revija/${f}`, small: `/images/revija/${f.replace(/\.webp$/, '-sm.webp')}`, width, height };
      })
    );
  }
  return revijaCache;
}

// Podaci za pocetnu; isti se koriste i za pregled iz admina (sa nesacuvanim izmjenama).
function homeRenderData(res, hero, sections) {
  const products = Product.all().filter((p) => p.available);
  // Kategorije sa slikom prvog proizvoda; prazne se ne prikazuju.
  const categories = Category.all()
    .map((c) => {
      const product = products.find((p) => p.category === c.slug);
      const image = CATEGORY_IMAGES[c.slug] || (product && product.coverImage);
      return { ...c, product, image, count: products.filter((p) => p.category === c.slug).length };
    })
    .filter((c) => c.product);
  const tabs = HOME_TABS.map((t) => ({ ...t, products: products.filter((p) => t.categories.includes(p.category)).slice(0, 8) })).filter(
    (t) => t.products.length
  );
  return {
    title: 'Boa Belts - ručno rađeni kožni kaiševi, torbe i novčanici',
    description:
      'Ručno rađeni kožni kaiševi, torbe, novčanici i dodaci iz radionice u Travniku. Naručite online, platite pouzećem, dostava širom BiH za 3-4 radna dana.',
    jsonLdBlocks: [jsonLd(storeSchema(res.locals.siteUrl))],
    preloadImage: hero.images && hero.images[0] && !hero.images[0].startsWith('data:') ? hero.images[0] : null,
    categories,
    tabs,
    hero,
    sections
  };
}

router.get('/', (req, res) => {
  res.render('index', homeRenderData(res, Hero.get(), HomeSections.getAll()));
});

router.get('/o-nama', (req, res) => {
  const content = PageContent.get('o-nama');
  res.render('o-nama', {
    title: 'O nama - Boa Belts',
    description:
      'Boa Belts je porodična radionica iz Travnika koja ručno izrađuje kožne kaiševe, torbe, novčanike i dodatke. Upoznajte našu priču i način rada.',
    content,
    bodyHtml: renderRichText(content.body)
  });
});

router.get('/program-lojalnosti', (req, res) => {
  const content = PageContent.get('program-lojalnosti');
  res.render('program-lojalnosti', {
    title: 'Program lojalnosti - Boa Belts',
    description: 'Boa Loyalty kartica: popusti i iznenađenja uz svaku treću narudžbu. Pogledajte pogodnosti programa lojalnosti Boa Belts.',
    content,
    bodyHtml: renderRichText(content.body)
  });
});

router.get('/bh-fashion-week', async (req, res, next) => {
  try {
    res.render('bh-fashion-week', {
      title: 'Boa Belts na 49. BH Fashion Weeku - Boa Belts',
      description:
        'Fotografije sa revije Boa Belts na otvaranju 49. BH Fashion Weeka u hotelu Bosmal Arjaan by Rotana u Sarajevu.',
      ogImage: '/images/revija/8J3A0630.webp',
      images: await fashionWeekImages()
    });
  } catch (err) {
    next(err);
  }
});

// Lista zelja se cuva u pregledniku kupca (localStorage); stranica samo
// ucitava kartice proizvoda za id-jeve koje preglednik posalje.
router.get('/lista-zelja', (req, res) => {
  res.locals.noindex = true;
  res.render('lista-zelja', { title: 'Lista želja - Boa Belts', description: 'Proizvodi koje ste sačuvali za kasnije.' });
});

router.get('/lista-zelja/proizvodi', (req, res) => {
  const ids = String(req.query.ids || '')
    .split(',')
    .map((id) => parseInt(id, 10))
    .filter((id) => id > 0)
    .slice(0, 100);
  const products = ids.map((id) => Product.findById(id)).filter(Boolean);
  res.render('partials/wishlist-items', { products, categories: Category.all() }, (err, html) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ ok: false });
    }
    res.json({ ok: true, ids: products.map((p) => p.id), html });
  });
});

router.get('/kontakt', (req, res) => {
  res.render('kontakt', {
    title: 'Kontakt - Boa Belts',
    description: 'Kontaktirajte Boa Belts iz Travnika: telefon, e-mail i forma za upit o kaiševima, torbama i novčanicima.',
    jsonLdBlocks: [jsonLd(storeSchema(res.locals.siteUrl))]
  });
});

router.post('/kontakt', async (req, res) => {
  // Skriveno polje koje popunjavaju samo botovi: pravimo se da je sve u redu.
  if (req.body.website) {
    req.flash('success', 'Hvala! Vaša poruka je poslana, javit ćemo se uskoro.');
    return res.redirect('/kontakt#upit');
  }

  const name = cleanText(req.body.name, 120);
  const email = cleanText(req.body.email, 200);
  const phone = cleanText(req.body.phone, 40);
  const message = cleanText(req.body.message, 5000);

  if (!name || !isValidEmail(email) || !message) {
    req.flash('error', 'Molimo popunite ime, ispravan e-mail i poruku.');
    return res.redirect('/kontakt#upit');
  }

  try {
    await sendContactEmail({ name, email, phone, message });
    req.flash('success', 'Hvala! Vaša poruka je poslana, javit ćemo se uskoro.');
  } catch (err) {
    console.error('Greška pri slanju kontakt e-maila:', err.message);
    req.flash('error', `Trenutno ne možemo poslati poruku. Pokušajte ponovo kasnije ili nas kontaktirajte direktno na ${CONTACT_EMAIL}.`);
  }

  res.redirect('/kontakt#upit');
});

router.post('/newsletter/prijava', async (req, res) => {
  const wantsJson = req.xhr || (req.headers.accept && req.headers.accept.indexOf('json') !== -1);
  const email = cleanText(req.body.email, 200);
  const emailValid = isValidEmail(email);

  function fail(message) {
    if (wantsJson) return res.status(400).json({ ok: false, error: message });
    req.flash('error', message);
    return res.redirect(req.get('Referer') || '/');
  }

  if (!emailValid) {
    return fail('Unesite ispravnu e-mail adresu.');
  }
  if (req.body.privacy !== 'on') {
    return fail('Morate prihvatiti politiku privatnosti.');
  }

  const { created, promoCode } = subscribeWithWelcome(email);
  let message;

  if (created) {
    message = promoCode
      ? 'Hvala što ste se prijavili na newsletter! Provjerite e-mail za vaš promo kod.'
      : 'Hvala što ste se prijavili na newsletter!';
  } else {
    message = 'Ova e-mail adresa je već prijavljena na newsletter.';
  }

  if (wantsJson) return res.json({ ok: true, message });
  req.flash('success', message);
  res.redirect(req.get('Referer') || '/');
});

function unsubscribeParams(req) {
  const email = cleanText(req.query.email, 200);
  const valid = NewsletterSubscriber.isValidUnsubscribeToken(email, req.query.token);
  return { email, valid };
}

// GET samo pita za potvrdu: mail skeneri otvaraju sve linkove iz poruke, pa
// otvaranje linka samo po sebi ne smije nikoga odjaviti.
router.get('/newsletter/odjava', (req, res) => {
  const { email, valid } = unsubscribeParams(req);
  if (!valid) {
    res.locals.noindex = true;
    return res.status(404).render('errors/404', { title: 'Stranica nije pronađena - Boa Belts' });
  }
  res.render('newsletter/odjava', {
    title: 'Odjava sa newslettera - Boa Belts',
    email,
    done: false,
    actionUrl: req.originalUrl
  });
});

router.post('/newsletter/odjava', (req, res) => {
  const { email, valid } = unsubscribeParams(req);
  if (!valid) {
    res.locals.noindex = true;
    return res.status(404).render('errors/404', { title: 'Stranica nije pronađena - Boa Belts' });
  }
  NewsletterSubscriber.unsubscribe(email);
  res.render('newsletter/odjava', {
    title: 'Odjava sa newslettera - Boa Belts',
    email,
    done: true,
    actionUrl: ''
  });
});

router.get('/uslovi-koristenja', (req, res) => {
  res.render('legal/uslovi-koristenja', {
    shippingPrice: SHIPPING_PRICE_KM,
    title: 'Uslovi korištenja - Boa Belts',
    description: 'Uslovi korištenja web prodavnice Boa Belts: narudžba, cijene, plaćanje pouzećem i dostava.'
  });
});

router.get('/politika-privatnosti', (req, res) => {
  res.render('legal/politika-privatnosti', {
    title: 'Politika privatnosti - Boa Belts',
    description: 'Politika privatnosti Boa Belts: koje lične podatke prikupljamo, zašto i kako ih štitimo.'
  });
});

router.get('/robots.txt', (req, res) => {
  res.type('text/plain');
  res.send(
    process.env.SITE_NOINDEX === 'true'
      ? 'User-agent: *\nDisallow: /'
      : [
          'User-agent: *',
          'Allow: /',
          'Disallow: /admin',
          'Disallow: /nalog',
          'Disallow: /korpa',
          'Disallow: /narudzba',
          'Disallow: /newsletter',
          'Disallow: /api',
          'Disallow: /*?pretraga=',
          '',
          `Sitemap: ${res.locals.siteUrl}/sitemap.xml`
        ].join('\n')
  );
});

router.get('/sitemap.xml', (req, res) => {
  const base = res.locals.siteUrl;
  const staticUrls = [
    { loc: '/', priority: '1.0' },
    { loc: '/kolekcija', priority: '0.9' },
    { loc: '/o-nama', priority: '0.6' },
    { loc: '/program-lojalnosti', priority: '0.4' },
    { loc: '/bh-fashion-week', priority: '0.4' },
    { loc: '/kontakt', priority: '0.5' },
    { loc: '/uslovi-koristenja', priority: '0.3' },
    { loc: '/politika-privatnosti', priority: '0.3' }
  ];
  const products = Product.all();
  const categoryUrls = Category.all()
    .filter((c) => Category.countProducts(c.slug) > 0)
    .map((c) => ({ loc: `/kolekcija?kategorija=${encodeURIComponent(c.slug)}`, priority: '0.8' }));
  const urls = [
    ...[...staticUrls, ...categoryUrls].map(
      (u) => `  <url>\n    <loc>${base}${u.loc}</loc>\n    <priority>${u.priority}</priority>\n  </url>`
    ),
    ...products.map(
      (p) =>
        `  <url>\n    <loc>${base}/kolekcija/${p.slug}</loc>\n    <lastmod>${(p.updated_at || p.created_at).slice(0, 10)}</lastmod>\n    <priority>0.7</priority>\n  </url>`
    ),
    ...Page.published().map(
      (p) => `  <url>\n    <loc>${base}/${p.slug}</loc>\n    <lastmod>${p.updated_at.slice(0, 10)}</lastmod>\n    <priority>0.6</priority>\n  </url>`
    )
  ];
  res.type('application/xml');
  res.send(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>`);
});

module.exports = router;
module.exports.homeRenderData = homeRenderData;
