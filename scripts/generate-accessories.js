const fs = require('fs');
const path = require('path');

const baseDir = path.join(process.cwd(), 'public', 'Accesories');
const outputPath = path.join(process.cwd(), 'src', 'data', 'accessories.ts');
const maxImagesPerProduct = Infinity;
const locale = 'bs-BA';

function encodePublicPath(relativePath) {
  const segments = relativePath.split(/\\|\//).filter(Boolean);
  return '/' + segments.map(encodeURIComponent).join('/');
}

const list = [
  { id: '31', rawName: 'Omot', price: '30 KM' },
  { id: '56', rawName: 'Narukvica', price: '30 KM' },
  { id: '57', rawName: 'Ogrlice', price: '30 KM' },
  { id: '58', rawName: 'Futrola za no\u017eeve', price: '60 KM' },
  { id: '60', rawName: 'Futrola za nao\u010dale', price: '40 KM' },
];

function formatWord(word, index) {
  const lower = word.toLocaleLowerCase(locale);
  if (/^no\./i.test(lower)) {
    return lower.replace(/^no\./i, 'No.');
  }
  if (index === 0) {
    return lower.charAt(0).toLocaleUpperCase(locale) + lower.slice(1);
  }
  return lower;
}

function formatName(rawName) {
  return rawName
    .replace(/_/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .map((word, index) => formatWord(word, index))
    .join(' ');
}

const specs = list.map(({ id, rawName, price }) => ({
  id: id.trim(),
  name: formatName(rawName),
  price: price.trim(),
}));

const folders = fs
  .readdirSync(baseDir, { withFileTypes: true })
  .filter((dirent) => dirent.isDirectory());

const description = 'Ru\\u010dno izra\\u0111eno u Travniku, prilagodljiva silueta i zavr\\u0161na obrada spremna za va\\u0161 stil.';

const data = specs.map((spec) => {
  const folder = folders.find((dirent) => dirent.name.startsWith(`${spec.id}_`));

  if (!folder) {
    return {
      id: `a${spec.id.padStart(2, '0')}`,
      name: spec.name,
      price: spec.price,
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

  const colors = files.map((file, index) => ({
    label: `Photo ${index + 1}`,
    image: encodePublicPath(path.join('Accesories', folder.name, file)),
    preview: encodePublicPath(path.join('Accesories', folder.name, file)),
  }));

  return {
    id: `a${spec.id.padStart(2, '0')}`,
    name: spec.name,
    price: spec.price,
    description,
    colors,
  };
});

const header = `export type AccessoryVariant = {\n  label: string;\n  image: string;\n  preview?: string;\n  swatch?: string;\n};\n\nexport type AccessoryProduct = {\n  id: string;\n  name: string;\n  price: string;\n  description: string;\n  colors: AccessoryVariant[];\n};\n\nexport const accessories: AccessoryProduct[] = `;

const fileContent = `${header}${JSON.stringify(data, null, 2)};\n`;

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, fileContent, { encoding: 'utf8' });
console.log(`Wrote ${data.length} accessories to ${outputPath}`);

