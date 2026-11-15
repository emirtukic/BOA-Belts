const db = require('../config/db');
const { roundMoney } = require('../config/format');
const { AUDIENCE_LABELS } = require('../config/promoRules');

const audienceOf = (value) => (AUDIENCE_LABELS[value] ? value : 'svi');

function parseRow(row) {
  if (!row) return row;
  return { ...row, active: !!row.active, audience: audienceOf(row.audience) };
}

const PromoCode = {
  all() {
    return db.prepare('SELECT * FROM promo_codes ORDER BY created_at DESC').all().map(parseRow);
  },

  findById(id) {
    return parseRow(db.prepare('SELECT * FROM promo_codes WHERE id = ?').get(id));
  },

  findByCode(code) {
    if (typeof code !== 'string' || !code.trim()) return null;
    return parseRow(
      db.prepare('SELECT * FROM promo_codes WHERE UPPER(code) = UPPER(?)').get(code.trim())
    );
  },

  // Vraca { ok: true, promo } ili { ok: false, error: '...' } - koristi se i
  // pri završetku narudžbe i pri primjeni koda, da poruka o gresci uvijek bude ista.
  validate(code) {
    const promo = this.findByCode(code);
    if (!promo) return { ok: false, error: 'Promo kod ne postoji.' };
    if (!promo.active) return { ok: false, error: 'Ovaj promo kod više nije aktivan.' };
    // Kod vrijedi do kraja izabranog dana, po lokalnom vremenu.
    if (promo.expires_at && new Date(`${promo.expires_at.slice(0, 10)}T23:59:59+01:00`) < new Date()) {
      return { ok: false, error: 'Ovom promo kodu je istekao rok važenja.' };
    }
    if (promo.usage_limit != null && promo.used_count >= promo.usage_limit) {
      return { ok: false, error: 'Ovaj promo kod je iskorišten maksimalan broj puta.' };
    }
    return { ok: true, promo };
  },

  calculateDiscount(promo, subtotal) {
    if (!promo) return 0;
    const raw = promo.type === 'percent' ? (subtotal * promo.value) / 100 : promo.value;
    return roundMoney(Math.max(0, Math.min(raw, subtotal)));
  },

  create(data) {
    const info = db
      .prepare(
        `INSERT INTO promo_codes (code, type, value, active, usage_limit, expires_at, audience, new_customer_days)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .run(
        data.code.trim().toUpperCase(),
        data.type === 'fixed' ? 'fixed' : 'percent',
        data.value,
        data.active ? 1 : 0,
        data.usage_limit || null,
        data.expires_at || null,
        audienceOf(data.audience),
        data.new_customer_days || null
      );
    return this.findById(info.lastInsertRowid);
  },

  update(id, data) {
    db.prepare(
      `UPDATE promo_codes SET code = ?, type = ?, value = ?, active = ?, usage_limit = ?, expires_at = ?,
       audience = ?, new_customer_days = ? WHERE id = ?`
    ).run(
      data.code.trim().toUpperCase(),
      data.type === 'fixed' ? 'fixed' : 'percent',
      data.value,
      data.active ? 1 : 0,
      data.usage_limit || null,
      data.expires_at || null,
      audienceOf(data.audience),
      data.new_customer_days || null,
      id
    );
    return this.findById(id);
  },

  incrementUsage(id) {
    this.adjustUsage(id, 1);
  },

  adjustUsage(id, delta) {
    db.prepare('UPDATE promo_codes SET used_count = MAX(0, used_count + ?) WHERE id = ?').run(delta, id);
  },

  delete(id) {
    db.prepare('DELETE FROM promo_codes WHERE id = ?').run(id);
  }
};

module.exports = PromoCode;
