const db = require('../config/db');
const { swatchFor } = require('../config/colors');
const { slugify } = require('../config/slug');
const { smallImage } = require('../config/images');

const HEX = /^#[0-9a-f]{6}$/i;

function parseRow(row) {
  if (!row) return row;
  const onSale = row.sale_price_km != null && row.sale_price_km > 0 && row.sale_price_km < row.price_km;
  const sizes = JSON.parse(row.sizes);
  const colors = JSON.parse(row.colors);
  const images = JSON.parse(row.images);
  const detailColors = JSON.parse(row.detail_colors || '[]');
  const storedImageColors = JSON.parse(row.image_colors || '{}');
  const imageColors = {};
  images.forEach((image) => {
    if (colors.includes(storedImageColors[image])) imageColors[image] = storedImageColors[image];
  });
  const storedHex = JSON.parse(row.color_hex || '{}');
  const colorHex = {};
  colors.forEach((color) => {
    if (HEX.test(storedHex[color] || '')) colorHex[color] = storedHex[color].toLowerCase();
  });
  // Pocetna slika: prva slika oznacena "Sve boje", inace prva slika.
  const coverImage = images.find((image) => !imageColors[image]) || images[0];
  return {
    ...row,
    sizes,
    colors,
    images,
    imageColors,
    colorHex,
    coverImage,
    // Mala verzija slike za liste i korpu (stare slike bez nje vracaju original).
    smallImage,
    // Nijansa koju je izabrao admin, inace prepoznata po nazivu (null = nepoznata).
    swatchOf(color) {
      return colorHex[color] || swatchFor(color);
    },
    // Prva slika izabrane boje; boja bez svoje slike dobija pocetnu sliku.
    imageFor(color) {
      return images.find((image) => color && imageColors[image] === color) || coverImage;
    },
    // Na stanju = admin ga nije iskljucio i ima bar jednu dostupnu velicinu.
    available: !!row.in_stock && (!sizes.length || sizes.some((s) => s.stock > 0)),
    totalStock: sizes.reduce((sum, s) => sum + s.stock, 0),
    // Kaisevi po mjeri: kupac upisuje obim struka prije dodavanja u korpu.
    waistRequired: !!row.waist_required,
    // Boje detalja (npr. Zlatna/Srebrena) - kupac bira, odvojeno od boje proizvoda.
    detailColors,
    in_stock: !!row.in_stock,
    featured: !!row.featured,
    onSale,
    finalPrice: onSale ? row.sale_price_km : row.price_km,
    discountPercent: onSale ? Math.round((1 - row.sale_price_km / row.price_km) * 100) : 0
  };
}

const Product = {
  all({ category, search } = {}) {
    const conditions = [];
    const params = [];
    if (category) {
      conditions.push('category = ?');
      params.push(category);
    }
    if (search) {
      conditions.push('(name LIKE ? OR description LIKE ?)');
      params.push(`%${search}%`, `%${search}%`);
    }
    let sql = 'SELECT * FROM products';
    if (conditions.length) sql += ` WHERE ${conditions.join(' AND ')}`;
    sql += ' ORDER BY created_at DESC';
    const rows = db.prepare(sql).all(...params);
    return rows.map(parseRow);
  },

  featured(limit = 3) {
    const rows = db.prepare('SELECT * FROM products WHERE featured = 1 ORDER BY created_at DESC LIMIT ?').all(limit);
    return rows.map(parseRow);
  },

  findById(id) {
    return parseRow(db.prepare('SELECT * FROM products WHERE id = ?').get(id));
  },

  findByLegacyId(legacyId) {
    return parseRow(db.prepare('SELECT * FROM products WHERE legacy_id = ?').get(legacyId));
  },

  findBySlug(slug) {
    return parseRow(db.prepare('SELECT * FROM products WHERE slug = ?').get(slug));
  },

  slugify,

  // Dva proizvoda istog naziva dobijaju razlicit URL umjesto greske pri cuvanju.
  uniqueSlug(name) {
    const base = slugify(name) || 'proizvod';
    let slug = base;
    let suffix = 2;
    while (db.prepare('SELECT 1 FROM products WHERE slug = ?').get(slug)) {
      slug = `${base}-${suffix}`;
      suffix += 1;
    }
    return slug;
  },

  adjustStock(productId, size, delta) {
    const product = this.findById(productId);
    if (!product || !size) return;
    const sizes = product.sizes.map((s) => (s.size === size ? { ...s, stock: Math.max(0, s.stock + delta) } : s));
    db.prepare("UPDATE products SET sizes = ?, updated_at = datetime('now') WHERE id = ?").run(
      JSON.stringify(sizes),
      productId
    );
  },

  create(data) {
    const slug = data.slug || this.uniqueSlug(data.name);
    const info = db
      .prepare(
        `INSERT INTO products (name, slug, legacy_id, description, price_km, sale_price_km, category, sizes, colors, images, image_colors, color_hex, waist_required, detail_colors, in_stock, featured)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .run(
        data.name,
        slug,
        data.legacy_id || null,
        data.description || '',
        data.price_km,
        data.sale_price_km != null ? data.sale_price_km : null,
        data.category,
        JSON.stringify(data.sizes || []),
        JSON.stringify(data.colors || []),
        JSON.stringify(data.images || []),
        JSON.stringify(data.imageColors || {}),
        JSON.stringify(data.colorHex || {}),
        data.waistRequired ? 1 : 0,
        JSON.stringify(data.detailColors || []),
        data.in_stock ? 1 : 0,
        data.featured ? 1 : 0
      );
    return this.findById(info.lastInsertRowid);
  },

  update(id, data) {
    const existing = this.findById(id);
    if (!existing) return null;
    const slug = data.slug || existing.slug;
    db.prepare(
      `UPDATE products SET name=?, slug=?, description=?, price_km=?, sale_price_km=?,
       category=?, sizes=?, colors=?, images=?, image_colors=?, color_hex=?, waist_required=?, detail_colors=?, in_stock=?, featured=?, updated_at=datetime('now')
       WHERE id=?`
    ).run(
      data.name,
      slug,
      data.description || '',
      data.price_km,
      data.sale_price_km != null ? data.sale_price_km : null,
      data.category,
      JSON.stringify(data.sizes || []),
      JSON.stringify(data.colors || []),
      JSON.stringify(data.images || existing.images),
      JSON.stringify(data.imageColors || (data.images ? {} : existing.imageColors)),
      JSON.stringify(data.colorHex || existing.colorHex),
      data.waistRequired ? 1 : 0,
      JSON.stringify(data.detailColors || []),
      data.in_stock ? 1 : 0,
      data.featured ? 1 : 0,
      id
    );
    return this.findById(id);
  },

  delete(id) {
    db.prepare('DELETE FROM products WHERE id = ?').run(id);
  }
};

module.exports = Product;
