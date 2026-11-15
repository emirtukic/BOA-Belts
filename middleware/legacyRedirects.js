// Adrese sa starog sajta (Next.js) trajno (301) vode na nove adrese webshopa.
// Google tako prenosi postojece pozicije, a stari linkovi i bookmarkovi rade.
const Product = require('../models/Product');

const PAGES = {
  '/kaisevi': '/kolekcija?kategorija=zenski-kaisevi',
  '/torbe': '/kolekcija?kategorija=torbe',
  '/novcanici': '/kolekcija?kategorija=novcanici',
  '/dodaci': '/kolekcija?kategorija=dodaci',
  '/lojalnost': '/program-lojalnosti',
  '/bhfashionweek': '/bh-fashion-week'
};

function legacyRedirects(req, res, next) {
  if (req.method !== 'GET' && req.method !== 'HEAD') return next();
  // Stari sajt je imao i varijante sa / na kraju i sa .html nastavkom.
  const path = req.path.replace(/\.html$/i, '').replace(/\/+$/, '').toLowerCase();

  if (PAGES[path]) return res.redirect(301, PAGES[path]);

  const match = path.match(/^\/proizvod\/([a-z0-9-]+)$/);
  if (match) {
    const product = Product.findByLegacyId(match[1]);
    return res.redirect(301, product ? `/kolekcija/${product.slug}` : '/kolekcija');
  }
  next();
}

module.exports = legacyRedirects;
