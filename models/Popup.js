const db = require('../config/db');

function parseRow(row) {
  if (!row) return null;
  return { ...row, is_active: !!row.is_active };
}

const Popup = {
  all() {
    return db.prepare('SELECT * FROM popups ORDER BY created_at DESC, id DESC').all().map(parseRow);
  },

  findById(id) {
    return parseRow(db.prepare('SELECT * FROM popups WHERE id = ?').get(id));
  },

  findActive() {
    return parseRow(db.prepare('SELECT * FROM popups WHERE is_active = 1 LIMIT 1').get());
  },

  create(data) {
    const info = db
      .prepare(
        `INSERT INTO popups (name, image, heading, text, cta_text, cta_link, delay_seconds, auto_close_seconds, is_active)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0)`
      )
      .run(
        data.name || 'Popup',
        data.image || '',
        data.heading || '',
        data.text || '',
        data.cta_text || '',
        data.cta_link || '/kolekcija',
        Math.max(0, parseInt(data.delay_seconds, 10) || 0),
        Math.max(0, parseInt(data.auto_close_seconds, 10) || 0)
      );
    return this.findById(info.lastInsertRowid);
  },

  update(id, data) {
    db.prepare(
      `UPDATE popups SET name = ?, image = ?, heading = ?, text = ?, cta_text = ?, cta_link = ?, delay_seconds = ?, auto_close_seconds = ?
       WHERE id = ?`
    ).run(
      data.name || 'Popup',
      data.image || '',
      data.heading || '',
      data.text || '',
      data.cta_text || '',
      data.cta_link || '/kolekcija',
      Math.max(0, parseInt(data.delay_seconds, 10) || 0),
      Math.max(0, parseInt(data.auto_close_seconds, 10) || 0),
      id
    );
    return this.findById(id);
  },

  activate(id) {
    db.prepare('UPDATE popups SET is_active = 0').run();
    db.prepare('UPDATE popups SET is_active = 1 WHERE id = ?').run(id);
    return this.findById(id);
  },

  deactivate(id) {
    db.prepare('UPDATE popups SET is_active = 0 WHERE id = ?').run(id);
    return this.findById(id);
  },

  duplicate(id) {
    const original = this.findById(id);
    if (!original) return null;
    return this.create({ ...original, name: `${original.name} (kopija)` });
  },

  delete(id) {
    db.prepare('DELETE FROM popups WHERE id = ?').run(id);
  }
};

module.exports = Popup;
