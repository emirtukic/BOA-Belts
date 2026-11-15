const db = require('../config/db');
const Product = require('./Product');
const PromoCode = require('./PromoCode');

function parseRow(row) {
  if (!row) return row;
  return {
    ...row,
    items: JSON.parse(row.items),
    gift_wrap: !!row.gift_wrap
  };
}

const Order = {
  all({ status } = {}) {
    let rows;
    if (status) {
      rows = db.prepare('SELECT * FROM orders WHERE status = ? ORDER BY created_at DESC').all(status);
    } else {
      rows = db.prepare('SELECT * FROM orders ORDER BY created_at DESC').all();
    }
    return rows.map(parseRow);
  },

  findById(id) {
    return parseRow(db.prepare('SELECT * FROM orders WHERE id = ?').get(id));
  },

  findByPromoCode(code) {
    return db
      .prepare('SELECT * FROM orders WHERE UPPER(promo_code) = UPPER(?) ORDER BY created_at DESC')
      .all(code)
      .map(parseRow);
  },

  allByCustomer(customerId) {
    return db
      .prepare('SELECT * FROM orders WHERE customer_id = ? ORDER BY created_at DESC')
      .all(customerId)
      .map(parseRow);
  },

  counts() {
    const rows = db.prepare('SELECT status, COUNT(*) as count FROM orders GROUP BY status').all();
    const result = { novo: 0, u_obradi: 0, poslano: 0, zavrseno: 0, otkazano: 0 };
    rows.forEach((r) => {
      result[r.status] = r.count;
    });
    return result;
  },

  create(data) {
    const info = db
      .prepare(
        `INSERT INTO orders (customer_name, email, phone, address, city, notes, gift_wrap, gift_wrap_price_km, shipping_km, promo_code, discount_km, items, total_km, payment_method, status, customer_id)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'novo', ?)`
      )
      .run(
        data.customer_name,
        data.email || '',
        data.phone,
        data.address,
        data.city,
        data.notes || '',
        data.gift_wrap ? 1 : 0,
        data.gift_wrap_price_km || 0,
        data.shipping_km || 0,
        data.promo_code || null,
        data.discount_km || 0,
        JSON.stringify(data.items),
        data.total_km,
        data.payment_method || 'pouzece',
        data.customer_id || null
      );
    return this.findById(info.lastInsertRowid);
  },

  // Narudzba, smanjenje stanja i brojac promo koda moraju uspjeti zajedno.
  place(data, appliedPromo) {
    return db.runInTransaction(() => {
      const order = this.create(data);
      order.items.forEach((item) => Product.adjustStock(item.productId, item.size, -item.qty));
      if (appliedPromo) PromoCode.incrementUsage(appliedPromo.id);
      return order;
    });
  },

  // Otkazivanje vraca proizvode na stanje i oslobadja promo kod; vracanje
  // otkazane narudzbe to ponovo uzima, ali samo ako robe jos ima.
  changeStatus(id, status) {
    const order = this.findById(id);
    if (!order) return { ok: false, error: 'Narudžba nije pronađena.' };

    const cancelling = order.status !== 'otkazano' && status === 'otkazano';
    const restoring = order.status === 'otkazano' && status !== 'otkazano';

    if (restoring) {
      const missing = order.items.find((item) => {
        const product = Product.findById(item.productId);
        const sizeInfo = product && item.size ? product.sizes.find((s) => s.size === item.size) : null;
        return sizeInfo && sizeInfo.stock < item.qty;
      });
      if (missing) {
        return {
          ok: false,
          error: `Narudžba se ne može vratiti: nema dovoljno na stanju za "${missing.name}" (veličina ${missing.size}).`
        };
      }
    }

    db.runInTransaction(() => {
      if (cancelling || restoring) {
        const sign = cancelling ? 1 : -1;
        order.items.forEach((item) => Product.adjustStock(item.productId, item.size, sign * item.qty));
        const promo = order.promo_code ? PromoCode.findByCode(order.promo_code) : null;
        if (promo) PromoCode.adjustUsage(promo.id, -sign);
      }
      db.prepare('UPDATE orders SET status = ? WHERE id = ?').run(status, id);
    });

    return { ok: true, order: this.findById(id) };
  },

  setTracking(id, { carrier, number, url }) {
    db.prepare('UPDATE orders SET tracking_carrier = ?, tracking_number = ?, tracking_url = ? WHERE id = ?').run(
      carrier || null,
      number || null,
      url || null,
      id
    );
    return this.findById(id);
  },

  markShippedEmailSent(id) {
    db.prepare('UPDATE orders SET shipped_email_sent = 1 WHERE id = ?').run(id);
  }
};

module.exports = Order;
