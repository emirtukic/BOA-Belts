const fs = require('fs');
const path = require('path');

const baseDir = path.join(process.cwd(), 'public', 'Womens Belts');
const outputPath = path.join(process.cwd(), 'src', 'data', 'womensBelts.ts');
const maxImagesPerProduct = Infinity; // adjust if needed
const locale = 'bs-BA';

function encodePublicPath(relativePath) {
  const segments = relativePath.split(/\\|\//).filter(Boolean);
  return '/' + segments.map(encodeURIComponent).join('/');
}

const list = `03_ANGEL BELT — 150 KM
04_EVA BELT — 85 KM
05_KAIŠ SA MAŠNICOM — 40 KM
06_FURIOUS BELT — 100 KM
07_No.1 — 85 KM
08_CRNI NA VEZANJE — 70 KM
09_CRNI SA RESAMA — 70 KM
10_DVIJE BOJE — 60 KM
11_BASIC KAIŠ — 35 KM
12_BOLD BELT — 55 KM
13_ŠIROKI SA DVIJE ŠNALE — 80 KM
14_TEJA BELT — 80 KM
15_INVICTA BELT — 120 KM
16_NEFERTITI BELT — 120 KM
17_TENA BELT — 45 KM
18_ADRIENNE BELT — 80 KM
19_AFRODITA BELT — 120 KM
20_ALBA BELT — 70 KM
21_SALVIA BELT — 45 KM
22_LILY BELT — 60 KM
23_ZINNIA BELT — 60 KM
24_ROSE BELT — 120 KM
25_GRACE BELT — 55 KM
26_NIKA BELT — 75 KM
27_IRIS BELT — 90 KM
28_GLORIJA BELT — 120 KM
30_INGA BELT — 150 KM
33_ANDREA BELT — 250 KM
38_SAMANTHA BELT — 90 KM
39_HERA BELT — 100 KM
40_KLEA BELT — 90 KM
41_KLEOPATRA BELT — 85 KM
42_FEMME BELT — 70 KM
43_DEMETRA BELT — 90 KM
44_XENA BELT — 150 KM
45_TEONA BELT — 65 KM
49_SABRINA BELT — 100 KM
50_DEVON BELT — 85 KM
51_LEON BELT — 120 KM
52_DOMINA BELT - 150 KM
53_SUZANA BELT - 150 KM
54_LORES BELT - 85 KM
65_LANA BELT - 60 KM
66_ZANA BELT - 180 KM`;

function formatName(rawName) {
  return rawName
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => {
      if (/^no\./i.test(word)) {
        return word.replace(/^no\./i, 'No.');
      }
      const lower = word.toLocaleLowerCase(locale);
      return lower.charAt(0).toLocaleUpperCase(locale) + lower.slice(1);
    })
    .join(' ');
}

const specs = list
  .split('\n')
  .map((line) => line.trim())
  .filter(Boolean)
  .map((line) => {
    const match = line.match(/^(.*?)\s*[-–—]\s*(.+)$/);
    if (!match) {
      throw new Error(`Invalid line in womens belt list: "${line}"`);
    }
    const [, idName, pricePart] = match;
  const [id, ...nameParts] = idName.split('_');
  const rawName = nameParts.join(' ').replace(/\s+/g, ' ').trim();
  const name = formatName(rawName);
  const price = pricePart.replace(/\s+/g, ' ');
  return { id: id.trim(), name, price };
});

const folders = fs
  .readdirSync(baseDir, { withFileTypes: true })
  .filter((dirent) => dirent.isDirectory());

const description = 'Ru\u010dna izrada u Travniku, prilagodljiva silueta i zavr\u0161na obrada spremna za va\u0161 stil.';

const data = specs.map((spec) => {
  const folder = folders.find((dirent) => dirent.name.startsWith(spec.id + '_'));
  if (!folder) {
    return { ...spec, id: `w${spec.id.padStart(2, '0')}`, category: 'women', description, colors: [] };
  }
  const folderPath = path.join(baseDir, folder.name);
  const files = fs
    .readdirSync(folderPath)
    .filter((file) => !file.startsWith('.') && file !== 'Thumbs.db')
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
    .slice(0, maxImagesPerProduct);
  const colors = files.map((file, idx) => ({
    label: `Photo ${idx + 1}`,
    image: encodePublicPath(path.join('Womens Belts', folder.name, file)),
    preview: encodePublicPath(path.join('Womens Belts', folder.name, file)),
  }));
  return {
    id: `w${spec.id.padStart(2, '0')}`,
    name: spec.name,
    price: spec.price,
    category: 'women',
    description,
    colors,
  };
});

const header = `export type WomensBeltVariant = {\n  label: string;\n  image: string;\n  preview?: string;\n};\n\nexport type WomensBelt = {\n  id: string;\n  name: string;\n  price: string;\n  category: 'women';\n  description: string;\n  colors: WomensBeltVariant[];\n};\n\nexport const womensBelts: WomensBelt[] = `;

const fileContent = `${header}${JSON.stringify(data, null, 2)};\n`;

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, fileContent, { encoding: 'utf8' });
console.log(`Wrote ${data.length} womens belts to ${outputPath}`);
