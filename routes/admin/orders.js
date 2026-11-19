const express = require('express');
const { itemOptions } = require('../../config/waist');
const router = express.Router();
const Order = require('../../models/Order');
const Customer = require('../../models/Customer');
const paymentMethods = require('../../config/paymentMethods');
const { sendOrderShippedEmail, sendOrderCancelledEmail, sendTrackingUpdateEmail } = require('../../config/mailer');
const { CARRIERS, CARRIER_BY_ID } = require('../../config/carriers');
const { cleanText } = require('../../config/format');

// Podaci o posiljci iz forme; link samo ako je pravi http(s) URL.
function parseTracking(body) {
  const number = cleanText(body.tracking_number, 60);
  const carrier = CARRIER_BY_ID[body.tracking_carrier] ? body.tracking_carrier : 'drugi';
  let url = cleanText(body.tracking_url, 500);
  if (url) {
    try {
      const parsed = new URL(url);
      if (!/^https?:$/.test(parsed.protocol)) url = null;
    } catch (e) {
      url = null;
    }
  }
  return { number, carrier: number ? carrier : '', url, invalidUrl: url === null };
}
const { STATUSES, LABELS } = require('../../config/orderStatuses');
const { resolveRange, localDay } = require('../../config/stats');
const { buildXlsx, excelDate } = require('../../config/xlsx');

router.get('/', (req, res) => {
  const status = LABELS[req.query.status] ? req.query.status : null;
  const orders = Order.all({ status });
  res.render('admin/orders/list', {
    title: 'Narudžbe - Admin',
    orders,
    statuses: STATUSES,
    statusLabels: LABELS,
    activeStatus: status,
    // Zadano: prethodni mjesec, sto knjigovodstvo najcesce trazi.
    exportFrom: resolveRange({ period: 'prosli-mjesec' }).from,
    exportTo: resolveRange({ period: 'prosli-mjesec' }).to
  });
});

// Excel za knjigovodstvo: list "Narudzbe" (jedan red po narudzbi) i list
// "Stavke" (jedan red po proizvodu). Otkazane su ukljucene, sa statusom.
router.get('/izvoz', (req, res) => {
  const range = resolveRange({ period: 'custom', od: req.query.od, do: req.query.do });
  const orders = Order.all()
    .filter((o) => {
      const day = localDay(o.created_at);
      return day >= range.from && day <= range.to;
    })
    .sort((a, b) => a.id - b.id);
  const payment = Object.fromEntries(paymentMethods.map((m) => [m.id, m.label.replace(/\s*\(.*\)$/, '')]));

  const orderSheet = {
    name: 'Narudžbe',
    columns: [
      { header: 'Broj', width: 8, type: 'integer' },
      { header: 'Datum', width: 17, type: 'datetime' },
      { header: 'Status', width: 12 },
      { header: 'Kupac', width: 22 },
      { header: 'E-mail', width: 26 },
      { header: 'Telefon', width: 15 },
      { header: 'Adresa', width: 26 },
      { header: 'Grad', width: 14 },
      { header: 'Proizvodi', width: 50 },
      { header: 'Komada', width: 9, type: 'integer' },
      { header: 'Proizvodi (KM)', width: 14, type: 'money' },
      { header: 'Popust (KM)', width: 12, type: 'money' },
      { header: 'Promo kod', width: 14 },
      { header: 'Poštarina (KM)', width: 12, type: 'money' },
      { header: 'Ukupno (KM)', width: 13, type: 'money' },
      { header: 'Plaćanje', width: 16 },
      { header: 'Kurir', width: 16 },
      { header: 'Broj pošiljke', width: 20 },
      { header: 'Napomena kupca', width: 30 }
    ],
    rows: orders.map((o) => [
      o.id,
      excelDate(o.created_at),
      LABELS[o.status] || o.status,
      o.customer_name,
      o.email,
      o.phone,
      o.address,
      o.city,
      o.items
        .map((i) => `${i.qty} x ${i.name}${itemOptions(i).length ? ` (${itemOptions(i).join(', ')})` : ''}`)
        .join('; '),
      o.items.reduce((s, i) => s + i.qty, 0),
      Math.round(o.items.reduce((s, i) => s + i.qty * (i.priceKm || 0), 0) * 100) / 100,
      o.discount_km || 0,
      o.promo_code || '',
      o.shipping_km,
      o.total_km,
      payment[o.payment_method] || o.payment_method,
      o.tracking_number ? (CARRIER_BY_ID[o.tracking_carrier] || CARRIER_BY_ID.drugi).label : '',
      o.tracking_number || '',
      o.notes || ''
    ])
  };
  const itemSheet = {
    name: 'Stavke',
    columns: [
      { header: 'Broj narudžbe', width: 13, type: 'integer' },
      { header: 'Datum', width: 17, type: 'datetime' },
      { header: 'Status', width: 12 },
      { header: 'Proizvod', width: 40 },
      { header: 'Obim struka (cm)', width: 16 },
      { header: 'Boja', width: 14 },
      { header: 'Boja detalja', width: 14 },
      { header: 'Količina', width: 9, type: 'integer' },
      { header: 'Cijena (KM)', width: 12, type: 'money' },
      { header: 'Iznos (KM)', width: 12, type: 'money' }
    ],
    rows: orders.flatMap((o) =>
      o.items.map((i) => [
        o.id,
        excelDate(o.created_at),
        LABELS[o.status] || o.status,
        i.name,
        i.size || '',
        i.color || 'Po dogovoru',
        i.detailColor || '',
        i.qty,
        i.priceKm || 0,
        Math.round(i.qty * (i.priceKm || 0) * 100) / 100
      ])
    )
  };

  const file = buildXlsx([orderSheet, itemSheet]);
  res.set({
    'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'Content-Disposition': `attachment; filename="boabelts-narudzbe-${range.from}-do-${range.to}.xlsx"`,
    'Cache-Control': 'no-store'
  });
  res.send(file);
});

router.get('/:id', (req, res) => {
  const order = Order.findById(req.params.id);
  if (!order) return res.redirect('/admin/narudzbe');
  const linkedCustomer = order.customer_id ? Customer.findById(order.customer_id) : null;
  const paymentMethod = paymentMethods.find((m) => m.id === order.payment_method);
  res.render('admin/orders/detail', {
    title: `Narudžba #${order.id} - Admin`,
    order,
    statuses: STATUSES,
    statusLabels: LABELS,
    carriers: CARRIERS,
    linkedCustomer,
    paymentLabel: paymentMethod ? paymentMethod.label : order.payment_method
  });
});

router.put('/:id/status', async (req, res) => {
  const redirectUrl = `/admin/narudzbe/${req.params.id}`;
  const existing = Order.findById(req.params.id);
  if (!existing) return res.redirect('/admin/narudzbe');

  const status = req.body.status;
  if (!LABELS[status]) {
    req.flash('error', 'Nepoznat status narudžbe.');
    return res.redirect(redirectUrl);
  }

  const tracking = parseTracking(req.body);
  if (tracking.invalidUrl) {
    req.flash('error', 'Link za praćenje mora počinjati sa https:// (zalijepi ga kako ga je dao kurir).');
    return res.redirect(redirectUrl);
  }

  const result = Order.changeStatus(existing.id, status);
  if (!result.ok) {
    req.flash('error', result.error);
    return res.redirect(redirectUrl);
  }
  const trackingChanged =
    (tracking.number || '') !== (existing.tracking_number || '') ||
    (tracking.carrier || '') !== (existing.tracking_carrier || '') ||
    (tracking.url || '') !== (existing.tracking_url || '');
  const order = trackingChanged ? Order.setTracking(existing.id, tracking) : result.order;
  const customerEmailData = { ...order, customer_email: order.email };
  let trackingMailSent = false;

  try {
    if (order.status === 'poslano' && !order.shipped_email_sent && order.email) {
      await sendOrderShippedEmail(customerEmailData);
      Order.markShippedEmailSent(order.id);
    } else if (order.status === 'poslano' && order.shipped_email_sent && trackingChanged && order.tracking_number && order.email) {
      // Mail o slanju je vec otisao bez ovog broja: kupac dobija novi broj posebno.
      await sendTrackingUpdateEmail(customerEmailData);
      trackingMailSent = true;
    }
    if (order.status === 'otkazano' && existing.status !== 'otkazano' && order.email) {
      await sendOrderCancelledEmail(customerEmailData);
    }
  } catch (err) {
    console.error('Greška pri slanju e-maila o statusu narudžbe:', err.message);
    req.flash('error', 'Status je sačuvan, ali e-mail kupcu nije poslan. Javite se kupcu direktno.');
    return res.redirect(redirectUrl);
  }

  const restocked = order.status === 'otkazano' && existing.status !== 'otkazano';
  req.flash(
    'success',
    `Narudžba #${order.id} je sačuvana.${restocked ? ' Proizvodi su vraćeni na stanje.' : ''}${trackingMailSent ? ' Kupcu je poslan e-mail sa brojem pošiljke.' : ''}`
  );
  res.redirect(redirectUrl);
});

module.exports = router;
