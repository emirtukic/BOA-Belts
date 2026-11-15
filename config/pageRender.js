// Priprema blokova stranice za prikaz: tekst u HTML, proizvodi za blok
// "Proizvodi", YouTube adresa, dimenzije slika za galeriju.
const path = require('path');
const sharp = require('sharp');
const Product = require('../models/Product');
const Category = require('../models/Category');
const { renderRichText } = require('./richText');
const { youtubeId, blockProducts } = require('./pageBlocks');
const { UPLOADS_DIR } = require('./paths');

const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const sizeCache = new Map();

function smallOf(src) {
  return src && /\.webp$/i.test(src) && !/-sm\.webp$/i.test(src) ? src.replace(/\.webp$/i, '-sm.webp') : src;
}

function diskPath(src) {
  if (src.startsWith('/uploads/')) return path.join(UPLOADS_DIR, path.basename(src));
  return path.join(PUBLIC_DIR, src);
}

async function imageSize(src) {
  if (sizeCache.has(src)) return sizeCache.get(src);
  let size = { width: 1200, height: 1500 };
  try {
    const meta = await sharp(diskPath(src)).metadata();
    size = { width: meta.width, height: meta.height };
    sizeCache.set(src, size);
  } catch {
    // Slika ne postoji ili nije citljiva: galerija koristi uobicajen oblik.
  }
  return size;
}

async function prepareBlocks(blocks) {
  const products = Product.all();
  const categories = Category.all();
  const out = [];
  for (const block of blocks) {
    const b = { ...block };
    if (b.type === 'text') b.html = renderRichText(b.body);
    if (b.type === 'imageText') b.html = renderRichText(b.text);
    if (b.type === 'video' && b.source === 'youtube') b.youtube = youtubeId(b.url);
    if (b.type === 'products') b.items = blockProducts(b, products);
    if (b.type === 'gallery') {
      b.items = [];
      for (const src of b.images) {
        const size = await imageSize(src);
        b.items.push({ src, small: smallOf(src), ...size });
      }
    }
    out.push(b);
  }
  return { blocks: out, categories };
}

module.exports = { prepareBlocks, smallOf };
