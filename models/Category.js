const db = require('../config/db');

const { slugify } = require('../config/slug');

const Category = {
  slugify,

  all() {
    return db.prepare('SELECT * FROM categories ORDER BY sort_order ASC, name ASC').all();
  },

  findById(id) {
    return db.prepare('SELECT * FROM categories WHERE id = ?').get(id);
  },

  findBySlug(slug) {
    return db.prepare('SELECT * FROM categories WHERE slug = ?').get(slug);
  },

  countProducts(slug) {
    return db.prepare('SELECT COUNT(*) as c FROM products WHERE category = ?').get(slug).c;
  },

  // Slug drugog reda sa istim imenom bi srusio cuvanje (UNIQUE).
  slugTakenByOther(name, id) {
    const row = db.prepare('SELECT id FROM categories WHERE slug = ?').get(slugify(name));
    return !!row && row.id !== Number(id);
  },

  create(data) {
    const slug = slugify(data.name);
    const info = db
      .prepare('INSERT INTO categories (name, slug, sort_order) VALUES (?, ?, ?)')
      .run(data.name, slug, data.sort_order || 0);
    return this.findById(info.lastInsertRowid);
  },

  // Slug ostaje isti i kad se kategorija preimenuje: to je njen javni URL, a
  // proizvodi su preko njega povezani s kategorijom.
  update(id, data) {
    const existing = this.findById(id);
    if (!existing) return null;
    db.prepare('UPDATE categories SET name = ?, sort_order = ? WHERE id = ?').run(data.name, data.sort_order || 0, id);
    return this.findById(id);
  },

  delete(id) {
    db.prepare('DELETE FROM categories WHERE id = ?').run(id);
  }
};

module.exports = Category;
