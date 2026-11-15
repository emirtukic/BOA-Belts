const path = require('path');
const fs = require('fs');
const { DatabaseSync } = require('node:sqlite');
const { DB_DIR } = require('./paths');

const dbPath = path.join(DB_DIR, 'boabelts.db');
const db = new DatabaseSync(dbPath);

// Vise upisa koji moraju uspjeti zajedno (npr. narudzba + smanjenje stanja).
db.runInTransaction = (work) => {
  db.exec('BEGIN');
  try {
    const result = work();
    db.exec('COMMIT');
    return result;
  } catch (err) {
    db.exec('ROLLBACK');
    throw err;
  }
};

db.exec('PRAGMA journal_mode = WAL;');

const schema = fs.readFileSync(path.join(__dirname, '..', 'db', 'schema.sql'), 'utf8');
db.exec(schema);

// Nove kolone dodaju se ovdje kad baza vec postoji (CREATE TABLE IF NOT EXISTS ih ne dodaje).
function addColumn(table, name, ddl) {
  const columns = db.prepare(`PRAGMA table_info(${table})`).all();
  if (!columns.some((col) => col.name === name)) db.exec(`ALTER TABLE ${table} ADD COLUMN ${ddl}`);
}
addColumn('products', 'legacy_id', 'legacy_id TEXT');
addColumn('products', 'waist_required', 'waist_required INTEGER NOT NULL DEFAULT 0');
// Boje detalja (Zlatna/Srebrena) su ranije stajale u "colors"; tamo sada idu
// boje proizvoda, pa se postojece boje detalja jednom premjeste u svoju kolonu.
if (!db.prepare('PRAGMA table_info(products)').all().some((col) => col.name === 'detail_colors')) {
  db.exec("ALTER TABLE products ADD COLUMN detail_colors TEXT NOT NULL DEFAULT '[]'");
  const detailNames = ['Zlatna', 'Srebrena'];
  db.prepare('SELECT id, colors FROM products').all().forEach((row) => {
    const colors = JSON.parse(row.colors || '[]');
    if (colors.length && colors.every((c) => detailNames.includes(c))) {
      db.prepare("UPDATE products SET detail_colors = ?, colors = '[]', image_colors = '{}', color_hex = '{}' WHERE id = ?").run(
        JSON.stringify(colors),
        row.id
      );
    }
  });
}

// Pocetne kategorije; admin ih kasnije mijenja u Kategorije.
const categoryCount = db.prepare('SELECT COUNT(*) as c FROM categories').get().c;
if (categoryCount === 0) {
  const defaultCategories = [
    { name: 'Ženski kaiševi', slug: 'zenski-kaisevi', sort_order: 1 },
    { name: 'Muški kaiševi', slug: 'muski-kaisevi', sort_order: 2 },
    { name: 'Torbe', slug: 'torbe', sort_order: 3 },
    { name: 'Novčanici', slug: 'novcanici', sort_order: 4 },
    { name: 'Dodaci', slug: 'dodaci', sort_order: 5 }
  ];
  const insertCategory = db.prepare('INSERT INTO categories (name, slug, sort_order) VALUES (?, ?, ?)');
  defaultCategories.forEach((c) => insertCategory.run(c.name, c.slug, c.sort_order));
}

module.exports = db;
