const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { ensureCart, getCartDetails, syncCartWithStock, availableStock } = require('../middleware/cart');
const { getWaistSettings, parseWaist } = require('../config/waist');

function wantsJson(req) {
  return req.xhr || (req.headers.accept && req.headers.accept.indexOf('json') !== -1);
}

function respondCart(req, res, notice) {
  const { items, total } = getCartDetails(req);
  const count = items.reduce((sum, i) => sum + i.qty, 0);
  if (wantsJson(req)) {
    res.render('partials/cart-drawer-items', { items, total }, (err, html) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ ok: false });
      }
      res.json({ ok: true, count, total, html, notice: notice || null });
    });
    return;
  }
  if (notice) req.flash('error', notice);
  res.redirect('/korpa');
}

router.get('/korpa', (req, res) => {
  syncCartWithStock(req).forEach((notice) => req.flash('error', notice));
  res.locals.flashError = [...res.locals.flashError, ...(req.session.flash ? req.flash('error') : [])];
  const { items, total } = getCartDetails(req);
  res.render('cart/cart', { title: 'Korpa - Boa Belts', items, total });
});

router.get('/korpa/drawer', (req, res) => {
  syncCartWithStock(req);
  respondCart(req, res);
});

router.post('/korpa/dodaj', (req, res) => {
  const { productId, qty } = req.body;
  let size = typeof req.body.size === 'string' ? req.body.size : undefined;
  let color = typeof req.body.color === 'string' ? req.body.color : undefined;
  let detailColor = typeof req.body.detailColor === 'string' ? req.body.detailColor : undefined;
  const product = Product.findById(Number(productId) || 0);
  if (!product) {
    if (wantsJson(req)) {
      return res.status(404).json({ ok: false, error: 'Proizvod nije pronađen.' });
    }
    return res.redirect('/kolekcija');
  }

  function fail(message) {
    if (wantsJson(req)) {
      return res.status(400).json({ ok: false, error: message });
    }
    req.flash('error', message);
    return res.redirect(`/kolekcija/${product.slug}`);
  }

  if (!product.available) {
    return fail('Ovaj proizvod trenutno nije na stanju.');
  }
  if (product.waistRequired) {
    const waist = getWaistSettings();
    size = parseWaist(size, waist);
    if (!size) return fail(`Upišite obim struka u cm, od ${waist.min} do ${waist.max}.`);
  } else if (product.sizes.length && !product.sizes.some((s) => s.size === size)) {
    return fail('Izaberite veličinu.');
  } else if (!product.sizes.length) {
    size = undefined;
  }
  if (product.colors.length && !product.colors.includes(color)) {
    return fail('Izaberite boju.');
  }
  if (!product.colors.length) color = undefined;
  if (product.detailColors.length && !product.detailColors.includes(detailColor)) {
    return fail('Izaberite boju detalja.');
  }
  if (!product.detailColors.length) detailColor = undefined;

  const cart = ensureCart(req);
  const requested = Math.max(1, parseInt(qty, 10) || 1);
  let quantity = requested;

  const existing = cart.items.find(
    (i) => i.productId === product.id && i.size === size && i.color === color && i.detailColor === detailColor
  );

  const stock = availableStock(product, size);
  let notice = null;
  if (stock !== null) {
    if (stock <= 0) {
      return fail(`Veličina ${size} trenutno nije na stanju.`);
    }
    const remaining = stock - (existing ? existing.qty : 0);
    if (remaining <= 0) {
      return fail(`U korpi već imate svih ${stock} kom. dostupnih u veličini ${size}.`);
    }
    if (requested > remaining) {
      quantity = remaining;
      notice = `Na stanju je dostupno još ${remaining} kom., pa smo dodali toliko.`;
    }
  }

  if (existing) {
    existing.qty += quantity;
  } else {
    cart.items.push({ productId: product.id, size, color, detailColor, qty: quantity });
  }

  respondCart(req, res, notice);
});

router.put('/korpa/:index', (req, res) => {
  const cart = ensureCart(req);
  const entry = cart.items[parseInt(req.params.index, 10)];
  let notice = null;
  if (entry) {
    const product = Product.findById(entry.productId);
    const stock = product ? availableStock(product, entry.size) : null;
    let qty = Math.max(1, parseInt(req.body.qty, 10) || 1);
    if (stock !== null && qty > stock) {
      qty = Math.max(1, stock);
      notice = `Na stanju je dostupno ${stock} kom.`;
    }
    entry.qty = qty;
  }
  respondCart(req, res, notice);
});

router.delete('/korpa/:index', (req, res) => {
  const cart = ensureCart(req);
  const index = parseInt(req.params.index, 10);
  if (cart.items[index]) {
    cart.items.splice(index, 1);
  }
  respondCart(req, res);
});

module.exports = router;
