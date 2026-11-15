const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Customer = require('../models/Customer');
const { getCartDetails, syncCartWithStock } = require('../middleware/cart');
const paymentMethods = require('../config/paymentMethods');
const PromoCode = require('../models/PromoCode');
const { eligibilityError } = require('../config/promoRules');
const { SHIPPING_PRICE_KM } = require('../config/pricing');
const { cleanText, isValidEmail, roundMoney } = require('../config/format');
const { sendOrderConfirmationEmail, sendOrderNotificationEmail } = require('../config/mailer');

router.get('/narudzba', (req, res) => {
  const notices = syncCartWithStock(req);
  if (notices.length) {
    notices.forEach((notice) => req.flash('error', notice));
    return res.redirect('/korpa');
  }
  const { items, total } = getCartDetails(req);
  if (items.length === 0) {
    return res.redirect('/korpa');
  }
  const customer = req.session.customerId ? Customer.findById(req.session.customerId) : null;
  res.render('checkout/checkout', {
    title: 'Završetak narudžbe - Boa Belts',
    items,
    total,
    shippingPrice: SHIPPING_PRICE_KM,
    paymentMethods,
    customer
  });
});

router.post('/narudzba/promo', (req, res) => {
  const { total } = getCartDetails(req);
  const check = PromoCode.validate(req.body.code);
  if (!check.ok) {
    return res.json({ ok: false, error: check.error });
  }
  const customer = req.session.customerId ? Customer.findById(req.session.customerId) : null;
  const notAllowed = eligibilityError(check.promo, {
    email: isValidEmail(cleanText(req.body.email, 200)) ? cleanText(req.body.email, 200).toLowerCase() : '',
    phone: cleanText(req.body.phone, 40),
    customer
  });
  if (notAllowed) {
    return res.json({ ok: false, error: notAllowed });
  }
  const discount = PromoCode.calculateDiscount(check.promo, total);
  res.json({
    ok: true,
    code: check.promo.code,
    type: check.promo.type,
    value: check.promo.value,
    discount
  });
});

router.post('/narudzba', (req, res) => {
  const { items: cartItems } = getCartDetails(req);
  if (cartItems.length === 0) {
    // Dvostruki klik na "Potvrdite": prvi je napravio narudzbu, drugi ne smije
    // kupca baciti na praznu korpu kao da narudzba nije prosla.
    if (req.session.lastOrderId) return res.redirect(`/narudzba/potvrda/${req.session.lastOrderId}`);
    return res.redirect('/korpa');
  }

  const fail = (message) => {
    req.flash('error', message);
    res.redirect('/narudzba');
  };

  // Stanje je moglo pasti od trenutka kad je kupac otvorio stranicu.
  const notices = syncCartWithStock(req);
  if (notices.length) {
    notices.forEach((notice) => req.flash('error', notice));
    return res.redirect('/korpa');
  }

  const customer_name = cleanText(req.body.customer_name, 120);
  const email = cleanText(req.body.email, 200).toLowerCase();
  const phone = cleanText(req.body.phone, 40);
  const address = cleanText(req.body.address, 200);
  const city = cleanText(req.body.city, 100);
  const notes = cleanText(req.body.notes, 1000);

  if (!customer_name || !phone || !address || !city) {
    return fail('Molimo popunite ime i prezime, telefon, adresu i grad.');
  }
  if (!isValidEmail(email)) {
    return fail('Unesite ispravnu e-mail adresu.');
  }
  if (req.body.terms !== 'on') {
    return fail('Za završetak narudžbe potrebno je prihvatiti uslove korištenja.');
  }

  const { items, total } = getCartDetails(req);

  let discountKm = 0;
  let appliedPromo = null;
  const promoCode = cleanText(req.body.promo_code, 50);
  if (promoCode) {
    // Kupac je vidio cijenu sa popustom: ako kod u medjuvremenu vise ne vazi,
    // ne smijemo ga tiho naplatiti vise nego sto je ocekivao.
    const check = PromoCode.validate(promoCode);
    if (!check.ok) {
      return fail(`${check.error} Provjerite ukupan iznos i pokušajte ponovo.`);
    }
    // Uslov (prva narudzba / novi korisnik) se provjerava ponovo sa konacnim
    // e-mailom i telefonom, da se ne zaobidje promjenom podataka poslije unosa koda.
    const customer = req.session.customerId ? Customer.findById(req.session.customerId) : null;
    const notAllowed = eligibilityError(check.promo, { email, phone, customer, final: true });
    if (notAllowed) {
      return fail(`${notAllowed} Kod je uklonjen - provjerite ukupan iznos i pokušajte ponovo.`);
    }
    appliedPromo = check.promo;
    discountKm = PromoCode.calculateDiscount(check.promo, total);
  }

  const finalTotal = roundMoney(Math.max(0, total - discountKm + SHIPPING_PRICE_KM));

  const order = Order.place(
    {
      customer_name,
      email,
      phone,
      address,
      city,
      notes,
      shipping_km: SHIPPING_PRICE_KM,
      promo_code: appliedPromo ? appliedPromo.code : null,
      discount_km: discountKm,
      items: items.map((i) => ({
        productId: i.product.id,
        name: i.product.name,
        qty: i.qty,
        size: i.size,
        color: i.color,
        detailColor: i.detailColor,
        priceKm: i.product.finalPrice
      })),
      total_km: finalTotal,
      payment_method: 'pouzece',
      customer_id: req.session.customerId || null
    },
    appliedPromo
  );

  req.session.cart = { items: [] };
  req.session.lastOrderId = order.id;

  const adminUrl = `${res.locals.siteUrl}/admin/narudzbe/${order.id}`;
  sendOrderConfirmationEmail({ ...order, customer_email: order.email }).catch((err) =>
    console.error('Greška pri slanju potvrde narudžbe:', err.message)
  );
  sendOrderNotificationEmail({ ...order, adminUrl }).catch((err) =>
    console.error('Greška pri slanju notifikacije o narudžbi:', err.message)
  );

  res.redirect(`/narudzba/potvrda/${order.id}`);
});

router.get('/narudzba/potvrda/:id', (req, res) => {
  const order = Order.findById(req.params.id);
  // Stranica sadrzi ime i adresu kupca - vidi je samo ko je narucio (ili admin),
  // a ne svako ko pogodi broj narudzbe.
  const canView =
    order &&
    (req.session.lastOrderId === order.id ||
      req.session.adminId ||
      (req.session.customerId && order.customer_id === req.session.customerId));
  if (!canView) {
    res.locals.noindex = true;
    return res.status(404).render('errors/404', { title: 'Stranica nije pronađena - Boa Belts' });
  }
  res.render('checkout/potvrda', { title: 'Narudžba primljena - Boa Belts', order });
});

module.exports = router;
