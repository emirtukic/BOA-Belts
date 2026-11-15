require('dotenv').config();

const express = require('express');
const session = require('express-session');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const morgan = require('morgan');
const multer = require('multer');
const path = require('path');

const { UPLOADS_DIR } = require('./config/paths');
const { SITE_URL, CHAT_NUMBER } = require('./config/site');
const { formatDate } = require('./config/format');
const { PALETTE, swatchFor } = require('./config/colors');
const { itemOptions } = require('./config/waist');
const { trackingInfo } = require('./config/carriers');
const { SqliteSessionStore } = require('./config/sessionStore');
const { runSeed } = require('./db/seed');
const { attachCartCount } = require('./middleware/cart');
const rateLimit = require('./middleware/rateLimit');
const { trackVisits } = require('./middleware/visits');
const requireAdmin = require('./middleware/requireAdmin');
const Customer = require('./models/Customer');
const Popup = require('./models/Popup');
const Category = require('./models/Category');
const { getNewsletterTexts } = require('./config/newsletterTexts');
const { passport } = require('./config/passport');

const isProduction = process.env.NODE_ENV === 'production';
const canonicalUrl = SITE_URL.startsWith('https://') ? new URL(SITE_URL) : null;

if (isProduction && !process.env.SESSION_SECRET) {
  console.error('SESSION_SECRET nije postavljen - server se ne pokrece u produkciji bez njega.');
  process.exit(1);
}
if (isProduction && !canonicalUrl) {
  console.warn('APP_URL nije https adresa - linkovi u e-mailovima i kanonski URL-ovi nece biti ispravni.');
}

// Greska u async ruti ne smije srusiti cijeli webshop.
process.on('unhandledRejection', (reason) => console.error('Neobradena greska:', reason));

runSeed();

const app = express();

app.disable('x-powered-by');
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
// Hosting stoji iza reverse proxy-ja: bez ovoga req.secure/req.ip nisu tacni.
app.set('trust proxy', Number(process.env.TRUST_PROXY_HOPS) || 1);

// Vrijednosti za greske koje nastanu prije nego sto middleware ispod postavi prave.
Object.assign(app.locals, {
  formatDate,
  swatchFor,
  colorPalette: PALETTE,
  itemOptions,
  trackingInfo,
  cartCount: 0,
  isAdminLoggedIn: false,
  isCustomerLoggedIn: false,
  currentCustomer: null,
  flashSuccess: [],
  flashError: [],
  currentPath: '',
  siteUrl: SITE_URL,
  chat: {
    whatsapp: `https://wa.me/${CHAT_NUMBER}`,
    viber: `viber://chat?number=%2B${CHAT_NUMBER}`
  },
  sitePopup: null,
  newsletterTexts: null,
  noindex: true
});

app.get('/healthz', (req, res) => res.type('text/plain').send('ok'));

app.use((req, res, next) => {
  res.set({
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'SAMEORIGIN',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
  });
  if (isProduction && canonicalUrl) {
    res.set('Strict-Transport-Security', 'max-age=31536000');
    // Jedna adresa za sve: http, www i hosting subdomena vode na glavnu domenu.
    if (req.hostname !== canonicalUrl.hostname || !req.secure) {
      return res.redirect(301, `${canonicalUrl.origin}${req.originalUrl}`);
    }
  }
  next();
});

// Adrese starog sajta (Next.js) vode trajno na nove, da Google i stari linkovi ne izgube stranice.
app.use(require('./middleware/legacyRedirects'));
app.get('/admin/login', (req, res) => res.redirect(301, '/admin/prijava'));

// Uploadi imaju jedinstvena imena pa ih browser moze dugo cuvati.
app.use('/uploads', express.static(UPLOADS_DIR, { maxAge: '30d', immutable: true }));
app.use(express.static(path.join(__dirname, 'public'), { maxAge: isProduction ? '7d' : 0 }));

app.use(morgan(isProduction ? 'combined' : 'dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Provjerava i body (obicni urlencoded formulari) i query string (potrebno
// za multipart/form-data formulare kao upload slika, gdje se body parsira
// kasnije unutar multer middleware-a, nakon sto je ruta vec izabrana).
app.use(
  methodOverride((req) => {
    if (req.body && req.body._method) {
      const method = req.body._method;
      delete req.body._method;
      return method;
    }
    if (req.query && req.query._method) {
      return req.query._method;
    }
  })
);

app.use(
  session({
    name: 'boa.sid',
    secret: process.env.SESSION_SECRET || 'boa-dev-secret',
    store: new SqliteSessionStore(),
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true,
      sameSite: 'lax', // stiti sve POST forme od CSRF-a sa drugih sajtova
      secure: isProduction && !!canonicalUrl
    }
  })
);
app.use(flash());
app.use(passport.initialize());

app.use(attachCartCount);

app.use((req, res, next) => {
  res.locals.isAdminLoggedIn = !!req.session.adminId;
  res.locals.isCustomerLoggedIn = !!req.session.customerId;
  res.locals.currentCustomer = req.session.customerId ? Customer.findById(req.session.customerId) : null;
  // Citanje flash-a pravi praznu sesiju, a posjetilac bez korpe je ne treba.
  res.locals.flashSuccess = req.session.flash ? req.flash('success') : [];
  res.locals.flashError = req.session.flash ? req.flash('error') : [];
  res.locals.currentPath = req.path;
  res.locals.siteUrl = SITE_URL || `${req.protocol}://${req.get('host')}`;
  res.locals.sitePopup = Popup.findActive();
  res.locals.newsletterTexts = getNewsletterTexts();
  res.locals.navCategories = Category.all();
  res.locals.noindex =
    process.env.SITE_NOINDEX === 'true' || /^\/(korpa|narudzba|nalog|admin|newsletter)/.test(req.path);
  next();
});

const MINUTE = 60 * 1000;
const TOO_MANY = 'Previše pokušaja. Pokušajte ponovo za nekoliko minuta.';
app.use(trackVisits);

app.post('/admin/prijava', rateLimit({ name: 'admin-prijava', windowMs: 15 * MINUTE, max: 10, message: TOO_MANY }));
app.post('/nalog/prijava', rateLimit({ name: 'prijava', windowMs: 15 * MINUTE, max: 20, message: TOO_MANY }));
app.post('/nalog/registracija', rateLimit({ name: 'registracija', windowMs: 60 * MINUTE, max: 10, message: TOO_MANY }));
app.post('/nalog/zaboravljena-lozinka', rateLimit({ name: 'reset', windowMs: 15 * MINUTE, max: 5, message: TOO_MANY }));
app.post('/nalog/ponovi-verifikaciju', rateLimit({ name: 'verifikacija', windowMs: 15 * MINUTE, max: 5, message: TOO_MANY }));
app.post('/kontakt', rateLimit({ name: 'kontakt', windowMs: 10 * MINUTE, max: 5, message: TOO_MANY }));
app.post('/newsletter/prijava', rateLimit({ name: 'newsletter', windowMs: 10 * MINUTE, max: 5, message: TOO_MANY, redirectTo: '/' }));
app.post('/narudzba/promo', rateLimit({ name: 'promo', windowMs: 10 * MINUTE, max: 15, message: TOO_MANY }));
app.post('/narudzba', rateLimit({ name: 'narudzba', windowMs: 10 * MINUTE, max: 10, message: TOO_MANY }));

app.use('/', require('./routes/public'));
app.use('/', require('./routes/shop'));
app.use('/', require('./routes/cart'));
app.use('/', require('./routes/checkout'));
app.use('/nalog', require('./routes/account'));

app.use('/admin', require('./routes/admin/auth'));
app.use('/admin', requireAdmin, require('./routes/admin/dashboard'));
app.use('/admin', requireAdmin, require('./routes/admin/hero'));
app.use('/admin/popup', requireAdmin, require('./routes/admin/popup'));
app.use('/admin/stranice', requireAdmin, require('./routes/admin/pages'));
app.use('/admin/kategorije', requireAdmin, require('./routes/admin/categories'));
app.use('/admin/promo-kodovi', requireAdmin, require('./routes/admin/promoCodes'));
app.use('/admin/newsletter', requireAdmin, require('./routes/admin/newsletter'));
app.use('/admin/proizvodi', requireAdmin, require('./routes/admin/products'));
app.use('/admin/narudzbe', requireAdmin, require('./routes/admin/orders'));
app.use('/admin/statistika', requireAdmin, require('./routes/admin/stats'));
app.use('/admin/mjerenje-struka', requireAdmin, require('./routes/admin/waist'));
app.use('/admin/korisnici', requireAdmin, require('./routes/admin/customers'));
app.use('/admin/podsjetnici', requireAdmin, require('./routes/admin/reminders'));

app.use((req, res) => {
  res.locals.noindex = true;
  res.status(404).render('errors/404', { title: 'Stranica nije pronađena - Boa Belts' });
});

function uploadErrorMessage(err) {
  if (err instanceof multer.MulterError) return 'Fajl je prevelik ili ih ima previše. Pokušaj sa manjom slikom.';
  if (/slike|slika|video/i.test(err.message)) return err.message;
  return 'Fajl nije moguće obraditi. Koristi JPG, PNG ili WEBP sliku.';
}

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);

  // Pogresan upload u adminu nije pad servera: admin ostaje na formi i vidi razlog.
  if (req.session && req.session.adminId && req.method !== 'GET' && req.originalUrl.startsWith('/admin')) {
    const message = uploadErrorMessage(err);
    if (req.path.endsWith('/slika')) return res.status(400).json({ error: message });
    req.flash('error', message);
    return res.redirect(303, req.get('Referer') || '/admin');
  }

  res.locals.noindex = true;
  res.status(err.status >= 400 && err.status < 500 ? err.status : 500).render('errors/500', {
    title: 'Greška na serveru - Boa Belts'
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Boa Belts webshop radi na ${SITE_URL || `http://localhost:${PORT}`}`);
});
