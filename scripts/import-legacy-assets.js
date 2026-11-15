// Jednokratni prenos slika sa starog sajta (logo, favikone, pocetna, studio,
// revija) u public/images/. Pravi WebP u dvije velicine kao i za proizvode.
//
// Upotreba: node scripts/import-legacy-assets.js <folder-starog-sajta>

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { SMALL_WIDTH, LARGE_WIDTH } = require('../config/images');

const oldPublic = path.join(process.argv[2] || '', 'public');
if (!process.argv[2] || !fs.existsSync(oldPublic)) {
  console.error('Navedi folder starog sajta: node scripts/import-legacy-assets.js <folder>');
  process.exit(1);
}

const OUT = path.join(__dirname, '..', 'public', 'images');

// [stara slika, nova putanja bez nastavka]
const SITE_IMAGES = [
  ['boa_belts_4.webp', 'hero/hero-1'],
  ['belt.webp', 'hero/hero-2'],
  ['torba.webp', 'hero/hero-3'],
  ['novcanik.webp', 'hero/hero-4'],
  ['1.webp', 'studio/studio-1'],
  ['2.webp', 'studio/studio-2'],
  ['3.webp', 'studio/studio-3'],
  ['4.webp', 'studio/studio-4'],
  ['5.webp', 'studio/studio-5'],
  ['belts-mobile.webp', 'home/kaisevi'],
  ['bags-mobile.webp', 'home/torbe'],
  ['wallets-mobile.webp', 'home/novcanici'],
  ['boabelts.webp', 'home/radionica'],
  ['boahero.webp', 'home/lojalnost']
];

async function webpPair(src, outBase) {
  fs.mkdirSync(path.dirname(outBase), { recursive: true });
  const input = sharp(src).rotate();
  await input.clone().resize({ width: LARGE_WIDTH, height: LARGE_WIDTH, fit: 'inside', withoutEnlargement: true }).webp({ quality: 78 }).toFile(`${outBase}.webp`);
  await input.clone().resize({ width: SMALL_WIDTH, withoutEnlargement: true }).webp({ quality: 72 }).toFile(`${outBase}-sm.webp`);
}

async function main() {
  for (const [file, target] of SITE_IMAGES) {
    await webpPair(path.join(oldPublic, file), path.join(OUT, target));
    console.log(`${file} -> images/${target}.webp`);
  }

  const revija = fs.readdirSync(path.join(oldPublic, 'revija')).filter((f) => /\.(webp|jpe?g|png)$/i.test(f)).sort();
  for (const file of revija) {
    await webpPair(path.join(oldPublic, 'revija', file), path.join(OUT, 'revija', path.parse(file).name));
  }
  console.log(`revija: ${revija.length} slika`);

  // Logo: SVG ostaje za sajt, PNG za e-mailove (mail klijenti ne prikazuju SVG).
  const logoDir = path.join(OUT, 'logo');
  fs.mkdirSync(logoDir, { recursive: true });
  fs.copyFileSync(path.join(oldPublic, 'boalogo.svg'), path.join(logoDir, 'boa-logo.svg'));
  await sharp(path.join(oldPublic, 'boalogo.svg'), { density: 300 }).resize({ width: 360 }).png().toFile(path.join(logoDir, 'boa-logo.png'));

  // Favikone u svim velicinama iz najvece postojece (512 px).
  const icon = path.join(oldPublic, 'android-chrome-512x512.png');
  for (const size of [16, 32, 48, 96, 192, 512]) {
    await sharp(icon).resize(size, size).png().toFile(path.join(logoDir, `favicon-${size}.png`));
  }
  await sharp(icon).resize(180, 180).flatten({ background: '#ffffff' }).png().toFile(path.join(logoDir, 'apple-touch-icon.png'));
  fs.copyFileSync(path.join(oldPublic, 'favicon.ico'), path.join(__dirname, '..', 'public', 'favicon.ico'));

  // Slika za dijeljenje na drustvenim mrezama (Facebook/WhatsApp traze JPG/PNG).
  await sharp(path.join(oldPublic, 'og-image-v3.png')).jpeg({ quality: 84 }).toFile(path.join(OUT, 'og-image.jpg'));
  console.log('logo, favikone i og-image gotovi');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
