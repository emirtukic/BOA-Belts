const express = require('express');
const router = express.Router();
const PromoCode = require('../../models/PromoCode');
const Order = require('../../models/Order');
const { AUDIENCES, AUDIENCE_LABELS, DEFAULT_NEW_CUSTOMER_DAYS } = require('../../config/promoRules');

function parseFormBody(body) {
  return {
    code: (body.code || '').trim(),
    type: body.type === 'fixed' ? 'fixed' : 'percent',
    value: Math.max(0, parseFloat(body.value) || 0),
    active: body.active === 'on',
    usage_limit: body.usage_limit ? Math.max(1, parseInt(body.usage_limit, 10)) : null,
    expires_at: body.expires_at || null,
    audience: AUDIENCE_LABELS[body.audience] ? body.audience : 'svi',
    new_customer_days:
      body.audience === 'novi_korisnici'
        ? Math.min(365, Math.max(1, parseInt(body.new_customer_days, 10) || DEFAULT_NEW_CUSTOMER_DAYS))
        : null
  };
}

router.get('/', (req, res) => {
  res.render('admin/promo-codes/list', { title: 'Promo kodovi - Admin', promoCodes: PromoCode.all(), audienceLabels: AUDIENCE_LABELS });
});

router.get('/novi', (req, res) => {
  res.render('admin/promo-codes/form', { title: 'Novi promo kod - Admin', promoCode: null, audiences: AUDIENCES, defaultDays: DEFAULT_NEW_CUSTOMER_DAYS });
});

function validationError(data) {
  if (!data.code) return 'Kod je obavezan.';
  if (data.value <= 0) return 'Vrijednost popusta mora biti veća od nule.';
  if (data.type === 'percent' && data.value > 100) return 'Procenat popusta ne može biti veći od 100.';
  return null;
}

router.post('/', (req, res) => {
  const data = parseFormBody(req.body);
  const error = validationError(data);
  if (error) {
    req.flash('error', error);
    return res.redirect('/admin/promo-kodovi/novi');
  }
  try {
    const promo = PromoCode.create(data);
    req.flash('success', `Promo kod "${promo.code}" je sačuvan.`);
    res.redirect('/admin/promo-kodovi');
  } catch (err) {
    req.flash('error', 'Taj kod već postoji. Izaberi drugi.');
    res.redirect('/admin/promo-kodovi/novi');
  }
});

router.get('/:id', (req, res) => {
  const promoCode = PromoCode.findById(req.params.id);
  if (!promoCode) return res.redirect('/admin/promo-kodovi');
  const orders = Order.findByPromoCode(promoCode.code);
  res.render('admin/promo-codes/detail', {
    title: `Promo kod ${promoCode.code} - Admin`,
    promoCode,
    orders,
    audienceLabels: AUDIENCE_LABELS
  });
});

router.get('/:id/izmijeni', (req, res) => {
  const promoCode = PromoCode.findById(req.params.id);
  if (!promoCode) return res.redirect('/admin/promo-kodovi');
  res.render('admin/promo-codes/form', { title: 'Izmijeni promo kod - Admin', promoCode, audiences: AUDIENCES, defaultDays: DEFAULT_NEW_CUSTOMER_DAYS });
});

router.put('/:id', (req, res) => {
  const data = parseFormBody(req.body);
  const error = validationError(data);
  if (error) {
    req.flash('error', error);
    return res.redirect(`/admin/promo-kodovi/${req.params.id}/izmijeni`);
  }
  try {
    const promo = PromoCode.update(req.params.id, data);
    req.flash('success', `Promo kod "${promo.code}" je ažuriran.`);
    res.redirect('/admin/promo-kodovi');
  } catch (err) {
    req.flash('error', 'Taj kod već postoji. Izaberi drugi.');
    res.redirect(`/admin/promo-kodovi/${req.params.id}/izmijeni`);
  }
});

router.delete('/:id', (req, res) => {
  PromoCode.delete(req.params.id);
  req.flash('success', 'Promo kod je obrisan.');
  res.redirect('/admin/promo-kodovi');
});

module.exports = router;
