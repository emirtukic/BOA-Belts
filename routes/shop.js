const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Category = require('../models/Category');
const { getWaistSettings, DETAIL_PALETTE } = require('../config/waist');
const DETAIL_SWATCHES = Object.fromEntries(DETAIL_PALETTE.map((c) => [c.name, c.hex]));
const { SHIPPING_PRICE_KM } = require('../config/pricing');
const { jsonLd, productSchema, breadcrumbSchema, metaExcerpt } = require('../config/seo');

router.get('/api/pretraga', (req, res) => {
  const q = typeof req.query.q === 'string' ? req.query.q.trim() : '';
  if (q.length < 2) return res.json({ results: [] });
  const products = Product.all({ search: q }).slice(0, 6);
  res.json({
    results: products.map((p) => ({
      name: p.name,
      slug: p.slug,
      image: p.smallImage(p.coverImage),
      price: p.finalPrice,
      onSale: p.onSale,
      originalPrice: p.price_km
    }))
  });
});

router.get('/kolekcija', (req, res) => {
  const categorySlug = typeof req.query.kategorija === 'string' ? req.query.kategorija : null;
  const search = typeof req.query.pretraga === 'string' ? req.query.pretraga.trim() || null : null;
  const category = categorySlug ? Category.findBySlug(categorySlug) : null;

  if (categorySlug && !category) {
    res.locals.noindex = true;
    return res.status(404).render('errors/404', { title: 'Stranica nije pronađena - Boa Belts' });
  }

  const products = Product.all({ category: categorySlug, search });

  // Rezultati pretrage nisu sadrzaj za Google; stranice kategorija jesu.
  if (search) res.locals.noindex = true;

  const baseTitle = category ? category.name : 'Kolekcija';
  res.render('shop/catalog', {
    title: search ? `Pretraga: "${search}" - Boa Belts` : `${baseTitle} - Boa Belts`,
    description: category
      ? `${category.name} Boa Belts: ručno rađeni od prirodne kože u radionici u Travniku. Plaćanje pouzećem i dostava širom BiH za 3-4 radna dana.`
      : 'Cijela kolekcija Boa Belts: ručno rađeni kožni kaiševi, torbe, novčanici i dodaci iz Travnika. Plaćanje pouzećem i dostava širom BiH.',
    canonicalPath: category ? `/kolekcija?kategorija=${category.slug}` : '/kolekcija',
    products,
    // Prazne kategorije ne prikazujemo kupcu (dok im admin ne doda proizvode).
    categories: Category.all().filter((c) => Category.countProducts(c.slug) > 0 || c.slug === categorySlug),
    activeCategory: categorySlug,
    activeCategoryName: category ? category.name : null,
    searchQuery: search
  });
});

router.get('/kolekcija/:slug', (req, res) => {
  const product = Product.findBySlug(req.params.slug);
  if (!product) {
    res.locals.noindex = true;
    return res.status(404).render('errors/404', { title: 'Stranica nije pronađena - Boa Belts' });
  }
  const category = Category.findBySlug(product.category);
  const categoryLabel = category ? category.name : product.category;
  const { siteUrl } = res.locals;
  const crumbs = [
    { name: 'Početna', url: '/' },
    { name: 'Kolekcija', url: '/kolekcija' }
  ];
  if (category) crumbs.push({ name: category.name, url: `/kolekcija?kategorija=${category.slug}` });
  crumbs.push({ name: product.name, url: `/kolekcija/${product.slug}` });

  const relatedProducts = Product.all({ category: product.category })
    .filter((p) => p.id !== product.id && p.available)
    .slice(0, 3);

  res.render('shop/product', {
    title: `${product.name} - Boa Belts`,
    description:
      metaExcerpt(product.description) ||
      `${product.name}: ručni rad od prirodne kože iz radionice Boa Belts u Travniku. Plaćanje pouzećem, dostava širom BiH.`,
    ogImage: product.coverImage,
    ogType: 'product',
    jsonLdBlocks: [jsonLd(productSchema(siteUrl, product, categoryLabel)), jsonLd(breadcrumbSchema(siteUrl, crumbs))],
    crumbs,
    product,
    categoryLabel,
    relatedProducts,
    categories: Category.all(),
    waist: getWaistSettings(),
    detailSwatches: DETAIL_SWATCHES,
    shippingPrice: SHIPPING_PRICE_KM
  });
});

module.exports = router;
