const db = require('../config/db');
const { slugify } = require('../config/slug');

// Adrese koje sajt vec koristi; nova stranica ih ne smije zauzeti.
const RESERVED_SLUGS = [
  'admin', 'api', 'nalog', 'korpa', 'narudzba', 'kolekcija', 'kontakt', 'o-nama', 'program-lojalnosti',
  'bh-fashion-week', 'bhfashionweek', 'lista-zelja', 'newsletter', 'politika-privatnosti', 'uslovi-koristenja',
  'sitemap', 'robots', 'uploads', 'images', 'css', 'js', 'healthz', 'kaisevi', 'torbe', 'novcanici', 'dodaci',
  'lojalnost', 'proizvod', 'pocetna', 'pregled', 'favicon', 'site', 'google'
];

const MENUS = ['none', 'header', 'footer'];

function parse(row) {
  if (!row) return null;
  let blocks = [];
  try {
    blocks = JSON.parse(row.blocks || '[]');
  } catch {
    blocks = [];
  }
  return { ...row, blocks, published: row.status === 'published', menuLabel: row.menu_label || row.title };
}

const Page = {
  RESERVED_SLUGS,
  MENUS,
  slugify,

  all() {
    return db.prepare('SELECT * FROM pages ORDER BY updated_at DESC').all().map(parse);
  },

  findById(id) {
    return parse(db.prepare('SELECT * FROM pages WHERE id = ?').get(id));
  },

  findPublished(slug) {
    return parse(db.prepare("SELECT * FROM pages WHERE slug = ? AND status = 'published'").get(slug));
  },

  published() {
    return db.prepare("SELECT * FROM pages WHERE status = 'published' ORDER BY updated_at DESC").all().map(parse);
  },

  // Objavljene stranice koje admin zeli u meniju gore (header) ili dolje (footer).
  menu(where) {
    return db
      .prepare("SELECT * FROM pages WHERE status = 'published' AND menu = ? ORDER BY menu_order ASC, title ASC")
      .all(where)
      .map(parse);
  },

  // Vraca poruku greske ili null ako je adresa slobodna.
  slugProblem(slug, id) {
    if (!slug) return 'Upiši adresu stranice.';
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) return 'Adresa smije imati samo mala slova, brojeve i crtice.';
    if (RESERVED_SLUGS.includes(slug)) return `Adresu "/${slug}" sajt već koristi. Izaberi drugu.`;
    const row = db.prepare('SELECT id FROM pages WHERE slug = ?').get(slug);
    if (row && row.id !== Number(id)) return `Stranica sa adresom "/${slug}" već postoji.`;
    return null;
  },

  create(data) {
    const info = db
      .prepare(
        'INSERT INTO pages (slug, title, description, blocks, status, menu, menu_label, menu_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
      )
      .run(data.slug, data.title, data.description, JSON.stringify(data.blocks), data.status, data.menu, data.menu_label, data.menu_order);
    return Number(info.lastInsertRowid);
  },

  update(id, data) {
    db.prepare(
      "UPDATE pages SET slug = ?, title = ?, description = ?, blocks = ?, status = ?, menu = ?, menu_label = ?, menu_order = ?, updated_at = datetime('now') WHERE id = ?"
    ).run(data.slug, data.title, data.description, JSON.stringify(data.blocks), data.status, data.menu, data.menu_label, data.menu_order, id);
  },

  delete(id) {
    db.prepare('DELETE FROM pages WHERE id = ?').run(id);
  }
};

module.exports = Page;
