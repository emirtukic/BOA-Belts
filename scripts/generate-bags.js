const fs = require('fs');
const path = require('path');

const baseDir = path.join(process.cwd(), 'public', 'Bags');
const outputPath = path.join(process.cwd(), 'src', 'data', 'bags.ts');
const maxImagesPerProduct = Infinity;
const locale = 'bs-BA';

function encodePublicPath(relativePath) {
  const segments = relativePath.split(/\\|\//).filter(Boolean);
  return '/' + segments.map(encodeURIComponent).join('/');
}

const list = `32_MAYA TORBA - 180 KM
36_TORBICA MALA - 80 KM
37_TORBA VELIKA - 150 KM
59_TORBA - 80 KM
61_TORBICA ZA MUSKARCE ZA TELEFON - 60 KM
62_TORBA SREDNJA - 100 KM
63_MUSKA VELIKA TORBA - 120 KM`;

const categoryMap = {
  '32': 'daily',
  '36': 'daily',
  '37': 'travel',
  '59': 'daily',
  '61': 'daily',
  '62': 'travel',
  '63': 'travel',
};

const wordReplacements = {
  Torba: 'Torba',
  Torbica: 'Torbica',
  Muska: 'Muška',
  Muskarce: 'Muškarce',
};

function formatWord(word) {
  if (/^no\./i.test(word)) {
    return word.replace(/^no\./i, 'No.');
  }
  const lower = word.toLocaleLowerCase(locale);
  const capitalised = lower.charAt(0).toLocaleUpperCase(locale) + lower.slice(1);
  return wordReplacements[capitalised] ?? capitalised;
}

function formatName(rawName) {
  return rawName
    .split(/\s+/)
    .filter(Boolean)
    .map(formatWord)
    .join(' ');
}

const specs = list
  .split('\n')
  .map((line) => line.trim())
  .filter(Boolean)
  .map((line) => {
    const match = line.match(/^(.*?)\s*[-–—]\s*(.+)$/);
    if (!match) {
      throw new Error(`Invalid line in bags list: "${line}"`);
    }
    const [, idName, pricePart] = match;
    const [id, ...nameParts] = idName.split('_');
    const rawName = nameParts.join(' ').replace(/\s+/g, ' ').trim();
    const name = formatName(rawName);
    const price = pricePart.replace(/\s+/g, ' ');
    const category = categoryMap[id.trim()] ?? 'daily';
    return { id: id.trim(), name, price, category };
  });

const folders = fs
  .readdirSync(baseDir, { withFileTypes: true })
  .filter((dirent) => dirent.isDirectory());

const description = 'Ru\u010dna izrada u Travniku, prilagodljiva silueta i zavr\u0161na obrada spremna za va\u0161 stil.';

const data = specs.map((spec) => {
  const folder = folders.find((dirent) => dirent.name.startsWith(spec.id + '_'));
  if (!folder) {
    return {
      id: `b${spec.id.padStart(2, '0')}`,
      name: spec.name,
      price: spec.price,
      category: spec.category,
      description,
      colors: [],
    };
  }

  const folderPath = path.join(baseDir, folder.name);
  const files = fs
    .readdirSync(folderPath)
    .filter((file) => !file.startsWith('.') && file !== 'Thumbs.db')
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
    .slice(0, maxImagesPerProduct);

  const colors = files.map((file, idx) => ({
    label: `Photo ${idx + 1}`,
    image: encodePublicPath(path.join('Bags', folder.name, file)),
    preview: encodePublicPath(path.join('Bags', folder.name, file)),
  }));

  return {
    id: `b${spec.id.padStart(2, '0')}`,
    name: spec.name,
    price: spec.price,
    category: spec.category,
    description,
    colors,
  };
});

const header = `export type BagVariant = {\n  label: string;\n  image: string;\n  preview?: string;\n};\n\nexport type BagProduct = {\n  id: string;\n  name: string;\n  price: string;\n  category: 'daily' | 'travel';\n  description: string;\n  colors: BagVariant[];\n};\n\nexport const bags: BagProduct[] = `;

const fileContent = `${header}${JSON.stringify(data, null, 2)};\n`;

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, fileContent, { encoding: 'utf8' });
console.log(`Wrote ${data.length} bags to ${outputPath}`);
