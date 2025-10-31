﻿const fs = require('fs');
const path = require('path');

const baseDir = path.join(process.cwd(), 'public', 'Wallets');
const outputPath = path.join(process.cwd(), 'src', 'data', 'wallets.ts');
const maxImagesPerProduct = Infinity;
const locale = 'bs-BA';

function encodePublicPath(relativePath) {
  const segments = relativePath.split(/\\|\//).filter(Boolean);
  return '/' + segments.map(encodeURIComponent).join('/');
}

const list = `01_MINI NOVCANIK - 35 KM
34_MUSKI NOVCANIK ZA KONOBARE - 50 KM
55_NOVCANICI VELIKI - 45 KM
64_DJECIJI NOVCANIK - 30 KM`;

const categoryMap = {
  '01': 'slim',
  '34': 'slim',
  '55': 'carry',
  '64': 'slim',
};

const wordReplacements = {
  mini: 'Mini',
  novcanik: 'Novčanik',
  novcanici: 'Novčanici',
  muski: 'Muški',
  konobare: 'Konobare',
  veliki: 'Veliki',
  djeciji: 'Dječiji',
  za: 'Za',
};

function formatWord(word) {
  if (/^no\./i.test(word)) {
    return word.replace(/^no\./i, 'No.');
  }
  const lower = word.toLocaleLowerCase(locale);
  if (wordReplacements[lower]) {
    return wordReplacements[lower];
  }
  return lower.charAt(0).toLocaleUpperCase(locale) + lower.slice(1);
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
      throw new Error(`Invalid line in wallets list: "${line}"`);
    }
    const [, idName, pricePart] = match;
    const [id, ...nameParts] = idName.split('_');
    const rawName = nameParts.join(' ').replace(/\s+/g, ' ').trim();
    const name = formatName(rawName);
    const price = pricePart.replace(/\s+/g, ' ');
    const category = categoryMap[id.trim()] ?? 'slim';
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
      id: `w${spec.id.padStart(2, '0')}`,
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
    image: encodePublicPath(path.join('Wallets', folder.name, file)),
    preview: encodePublicPath(path.join('Wallets', folder.name, file)),
  }));

  return {
    id: `w${spec.id.padStart(2, '0')}`,
    name: spec.name,
    price: spec.price,
    category: spec.category,
    description,
    colors,
  };
});

const header = `export type WalletVariant = {\n  label: string;\n  image: string;\n  preview?: string;\n  swatch?: string;\n};\n\nexport type WalletProduct = {\n  id: string;\n  name: string;\n  price: string;\n  category: 'slim' | 'carry';\n  description: string;\n  colors: WalletVariant[];\n};\n\nexport const wallets: WalletProduct[] = `;

const fileContent = `${header}${JSON.stringify(data, null, 2)};\n`;

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, fileContent, { encoding: 'utf8' });
console.log(`Wrote ${data.length} wallets to ${outputPath}`);
