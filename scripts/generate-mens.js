const fs = require('fs');
const path = require('path');

const baseDir = path.join(process.cwd(), 'public', 'Mens Belts');
const outputPath = path.join(process.cwd(), 'src', 'data', 'mensBelts.ts');
const maxImagesPerProduct = Infinity;
const locale = 'bs-BA';

function encodePublicPath(relativePath) {
  const segments = relativePath.split(/[\\/]/).filter(Boolean);
  return '/' + segments.map(encodeURIComponent).join('/');
}

const list = [
  { id: '02', rawName: 'Classic belt', price: '35 KM' },
  { id: '35', rawName: 'Hunter belt', price: '250 KM' },
];

const wordReplacements = {};

function formatWord(word) {
  const lower = word.toLocaleLowerCase(locale);

  if (Object.prototype.hasOwnProperty.call(wordReplacements, lower)) {
    return wordReplacements[lower];
  }

  if (word.includes('.')) {
    const [before, after] = word.split('.');
    return `${before}.${after}`;
  }

  const [first = '', ...rest] = lower;
  return first.toLocaleUpperCase(locale) + rest.join('');
}

function formatName(rawName) {
  return rawName
    .replace(/_/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .map(formatWord)
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

const description =
  'RuÄna izrada u Travniku, prilagodljiva silueta i zavrÅ¡na obrada spremna za vaÅ¡ stil.';

const data = specs.map((spec) => {
  const folder = folders.find((dirent) => dirent.name.startsWith(`${spec.id}_`));

  if (!folder) {
    return {
      id: `m${spec.id.padStart(2, '0')}`,
      name: spec.name,
      price: spec.price,
      category: 'men',
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
    image: encodePublicPath(path.join('Mens Belts', folder.name, file)),
    preview: encodePublicPath(path.join('Mens Belts', folder.name, file)),
  }));

  return {
    id: `m${spec.id.padStart(2, '0')}`,
    name: spec.name,
    price: spec.price,
    category: 'men',
    description,
    colors,
  };
});

const header = `export type MensBeltVariant = {\n  label: string;\n  image: string;\n  preview?: string;\n  swatch?: string;\n};\n\nexport type MensBelt = {\n  id: string;\n  name: string;\n  price: string;\n  category: 'men';\n  description: string;\n  colors: MensBeltVariant[];\n};\n\nexport const mensBelts: MensBelt[] = `;

const fileContent = `${header}${JSON.stringify(data, null, 2)};\n`;

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, fileContent, { encoding: 'utf8' });
console.log(`Wrote ${data.length} mens belts to ${outputPath}`);

