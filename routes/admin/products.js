const express = require('express');
const router = express.Router();
const Product = require('../../models/Product');
const Category = require('../../models/Category');
const { upload, processUploadedImages } = require('../../middleware/upload');

const { DETAIL_COLORS, DETAIL_PALETTE } = require('../../config/waist');

function parseFormBody(body) {
  const colors = (body.colors || '')
    .split(',')
    .map((c) => c.trim())
    .filter(Boolean);
  // Nijanse iz birača boje; zadrzavaju se samo za boje koje proizvod ima.
  let pickedHex = {};
  try {
    pickedHex = JSON.parse(body.colorHex || '{}') || {};
  } catch (e) {
    pickedHex = {};
  }
  const colorHex = {};
  colors.forEach((color) => {
    const hex = pickedHex[color];
    if (typeof hex === 'string' && /^#[0-9a-f]{6}$/i.test(hex)) colorHex[color] = hex.toLowerCase();
  });
  const price_km = parseFloat(body.price_km);
  let sale_price_km = body.sale_price_km !== undefined ? parseFloat(body.sale_price_km) : NaN;
  if (!Number.isFinite(sale_price_km) || sale_price_km <= 0 || sale_price_km >= price_km) {
    sale_price_km = null;
  }
  return {
    name: body.name,
    description: body.description,
    price_km,
    sale_price_km,
    category: body.category,
    // Boa ne prati stanje po velicinama: kaisevi se rade po mjeri.
    sizes: [],
    colors,
    colorHex,
    waistRequired: body.waistRequired === 'on',
    detailColors: DETAIL_COLORS.filter((c) => [].concat(body.detailColors || []).includes(c)),
    in_stock: body.in_stock === 'on',
    featured: body.featured === 'on'
  };
}

router.get('/', (req, res) => {
  const products = Product.all();
  res.render('admin/products/list', { title: 'Proizvodi - Admin', products, categories: Category.all() });
});

router.get('/novi', (req, res) => {
  res.render('admin/products/form', {
    title: 'Novi proizvod - Admin',
    product: null,
    categories: Category.all(),
    detailPalette: DETAIL_PALETTE
  });
});

// Boja za svaku sliku: postojece slike imaju polja imagePath_N / imageColor_N,
// a sve nove slike iz jednog uploada dobijaju boju iz polja newImagesColor.
function parseImageColors(body, images, newImages, colors) {
  const imageColors = {};
  const setColor = (image, color) => {
    if (images.includes(image) && colors.includes(color)) imageColors[image] = color;
  };
  Object.keys(body)
    .filter((key) => /^imagePath_\d+$/.test(key))
    .forEach((key) => setColor(body[key], body[`imageColor_${key.slice('imagePath_'.length)}`]));
  newImages.forEach((image) => setColor(image, body.newImagesColor));
  return imageColors;
}

function validationError(data) {
  if (!data.name || !data.name.trim()) return 'Naziv proizvoda je obavezan.';
  if (!Number.isFinite(data.price_km) || data.price_km <= 0) return 'Unesite ispravnu cijenu.';
  if (!Category.findBySlug(data.category)) return 'Izaberite kategoriju.';
  return null;
}

router.post('/', upload.array('images', 8), processUploadedImages, (req, res) => {
  const data = parseFormBody(req.body);
  const error = validationError(data);
  if (error) {
    req.flash('error', error);
    return res.redirect('/admin/proizvodi/novi');
  }
  data.images = req.uploadedImages.length ? req.uploadedImages : ['placeholder.jpg'];
  data.images = data.images.map((f) =>
    f === 'placeholder.jpg' ? '/images/products/placeholder.jpg' : `/uploads/${f}`
  );
  data.imageColors = parseImageColors(req.body, data.images, data.images, data.colors);
  const product = Product.create(data);
  req.flash('success', `Proizvod "${product.name}" je uspješno sačuvan.`);
  res.redirect('/admin/proizvodi');
});

router.get('/:id/izmijeni', (req, res) => {
  const product = Product.findById(req.params.id);
  if (!product) return res.redirect('/admin/proizvodi');
  res.render('admin/products/form', {
    title: 'Izmijeni proizvod - Admin',
    product,
    categories: Category.all(),
    detailPalette: DETAIL_PALETTE
  });
});

router.put('/:id', upload.array('images', 8), processUploadedImages, (req, res) => {
  const existing = Product.findById(req.params.id);
  if (!existing) return res.redirect('/admin/proizvodi');

  const data = parseFormBody(req.body);
  const error = validationError(data);
  if (error) {
    req.flash('error', error);
    return res.redirect(`/admin/proizvodi/${req.params.id}/izmijeni`);
  }

  const keepImages = Array.isArray(req.body.keepImages)
    ? req.body.keepImages
    : req.body.keepImages
    ? [req.body.keepImages]
    : [];

  const newImages = req.uploadedImages.map((f) => `/uploads/${f}`);
  data.images = [...keepImages, ...newImages];
  if (data.images.length === 0) {
    data.images = ['/images/products/placeholder.jpg'];
  }
  data.imageColors = parseImageColors(req.body, data.images, newImages, data.colors);

  const product = Product.update(req.params.id, data);
  req.flash('success', `Proizvod "${product.name}" je uspješno ažuriran.`);
  res.redirect('/admin/proizvodi');
});

router.delete('/:id', (req, res) => {
  Product.delete(req.params.id);
  req.flash('success', 'Proizvod je obrisan.');
  res.redirect('/admin/proizvodi');
});

module.exports = router;
