// Jednokratni uvoz proizvoda sa starog Next.js sajta (grana main).
// Cita src/data/*.ts i slike iz public/ starog sajta, pravi optimizovane slike
// (velika 1600 px + mala 600 px za liste) u public/images/products/<slug>/
// i upisuje db/products.fixture.json koji seed koristi za praznu bazu.
//
// Upotreba: node scripts/import-legacy-products.js <folder-starog-sajta>
// (folder dobijen sa: git archive main | tar -x -C <folder>)

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { slugify } = require('../config/slug');
const { SMALL_WIDTH, LARGE_WIDTH } = require('../config/images');

const oldRoot = process.argv[2];
if (!oldRoot || !fs.existsSync(path.join(oldRoot, 'src', 'data'))) {
  console.error('Navedi folder starog sajta: node scripts/import-legacy-products.js <folder>');
  process.exit(1);
}

const ROOT = path.join(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'public', 'images', 'products');
const FIXTURE = path.join(ROOT, 'db', 'products.fixture.json');
const DETAIL_COLORS = ['Zlatna', 'Srebrena'];

const SOURCES = [
  { file: 'womensBelts.ts', category: 'zenski-kaisevi' },
  { file: 'mensBelts.ts', category: 'muski-kaisevi' },
  { file: 'bags.ts', category: 'torbe' },
  { file: 'wallets.ts', category: 'novcanici' },
  { file: 'accessories.ts', category: 'dodaci' }
];

// Na novom sajtu nema izrade u boji po zelji: proizvod je u boji sa slike.
// Gravura i oblik zivotinje ostaju jer su posebne opcije tih modela.
const DESCRIPTION_FIXES = [
  [/Model je mogu[cć]e izraditi u boji po [zž]elji,? (ali i|kao i) sa gravurom po želji\./g, 'Model je moguće izraditi sa gravurom po želji.'],
  [/Model je mogu[cć]e izraditi u boji po želji pa čak i u obliku životinje po želji\./g, 'Model je moguće izraditi u obliku životinje po želji.'],
  [/ i moguće ga je naručiti u boji po želji\./g, '.'],
  [/ te je isti moguće izraditi u boji po želji\./g, '.'],
  [/\s*Model je mogu[cć]e izraditi u boji po [zž]elji\./g, '']
];

function readArray(file) {
  const source = fs.readFileSync(path.join(oldRoot, 'src', 'data', file), 'utf8');
  const start = source.indexOf('= [');
  const end = source.lastIndexOf('];');
  // Podaci su JS niz (dozvoljeni zarezi na kraju), a fajl je nas vlastiti stari kod.
  return new Function(`return ${source.slice(start + 2, end + 1)};`)();
}

function cleanDescription(text) {
  let clean = String(text || '');
  DESCRIPTION_FIXES.forEach(([pattern, replacement]) => {
    clean = clean.replace(pattern, replacement);
  });
  if (/boji po [zž]elji/i.test(clean)) console.warn('  provjeriti opis: ' + clean);
  return clean.replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
}

function priceOf(text) {
  const value = Number(String(text).replace(/[^0-9.,]/g, '').replace(',', '.'));
  if (!Number.isFinite(value) || value <= 0) throw new Error('Neispravna cijena: ' + text);
  return value;
}

async function convertImage(src, dir, index) {
  const base = String(index + 1).padStart(2, '0');
  const large = path.join(dir, `${base}.webp`);
  const small = path.join(dir, `${base}-sm.webp`);
  const input = sharp(src).rotate();
  await input.clone().resize({ width: LARGE_WIDTH, height: LARGE_WIDTH, fit: 'inside', withoutEnlargement: true }).webp({ quality: 78 }).toFile(large);
  await input.clone().resize({ width: SMALL_WIDTH, withoutEnlargement: true }).webp({ quality: 72 }).toFile(small);
  return base;
}

async function main() {
  fs.rmSync(OUT_DIR, { recursive: true, force: true });
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const usedSlugs = new Set();
  const products = [];

  for (const { file, category } of SOURCES) {
    const items = readArray(file);
    // Stari sajt je novije modele stavljao naprijed (priority), pa redoslijed cuvamo.
    items.sort((a, b) => (a.priority || 99) - (b.priority || 99));
    for (const item of items) {
      let slug = slugify(item.name) || item.id;
      if (usedSlugs.has(slug)) slug = `${slug}-${item.id}`;
      usedSlugs.add(slug);

      const dir = path.join(OUT_DIR, slug);
      fs.mkdirSync(dir, { recursive: true });
      const sources = [...new Set((item.colors || []).map((c) => c.image).filter(Boolean))];
      const images = [];
      for (const [index, url] of sources.entries()) {
        const src = path.join(oldRoot, 'public', decodeURIComponent(url));
        if (!fs.existsSync(src)) {
          console.warn(`  nema slike: ${src}`);
          continue;
        }
        const base = await convertImage(src, dir, index);
        images.push(`/images/products/${slug}/${base}.webp`);
      }
      if (!images.length) console.warn(`  ${item.name}: bez slika`);

      products.push({
        legacy_id: item.id,
        name: item.name.trim(),
        slug,
        description: cleanDescription(item.description),
        price_km: priceOf(item.price),
        category,
        sizes: [],
        // Kaisevi se rade po mjeri: kupac upisuje obim struka i bira boju detalja.
        colors: [],
        detailColors: /kaisevi$/.test(category) ? DETAIL_COLORS : [],
        waistRequired: /kaisevi$/.test(category),
        images,
        in_stock: true,
        featured: item.badge === 'Novo'
      });
      console.log(`${category}: ${item.name} (${images.length} slika)`);
    }
  }

  fs.writeFileSync(FIXTURE, `${JSON.stringify(products, null, 2)}\n`);
  console.log(`\nUvezeno ${products.length} proizvoda -> ${path.relative(ROOT, FIXTURE)}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
