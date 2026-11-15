const path = require('path');
const crypto = require('crypto');
const sharp = require('sharp');

// Svaka slika proizvoda postoji u dvije velicine: velika (stranica proizvoda)
// i mala sa nastavkom -sm (liste, korpa, pretraga). Liste tako ne ucitavaju
// fotografije od 1600 px, sto je bio glavni razlog sporosti starog sajta.
const LARGE_WIDTH = 1600;
const SMALL_WIDTH = 600;

function smallImage(src) {
  if (!src || !/\.webp$/i.test(src) || /-sm\.webp$/i.test(src)) return src;
  return src.replace(/\.webp$/i, '-sm.webp');
}

// Snima upload (fotografija sa telefona, cesto 2-8 MB) kao WebP u obje
// velicine i vraca ime velike slike. EXIF orijentacija se primjenjuje.
async function saveUploadedImage(buffer, dir, { width = LARGE_WIDTH, quality = 80 } = {}) {
  const base = `${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
  const input = sharp(buffer).rotate();
  await input
    .clone()
    .resize({ width, height: width, fit: 'inside', withoutEnlargement: true })
    .webp({ quality })
    .toFile(path.join(dir, `${base}.webp`));
  await input
    .clone()
    .resize({ width: Math.min(SMALL_WIDTH, width), withoutEnlargement: true })
    .webp({ quality: 72 })
    .toFile(path.join(dir, `${base}-sm.webp`));
  return `${base}.webp`;
}

module.exports = { LARGE_WIDTH, SMALL_WIDTH, smallImage, saveUploadedImage };
