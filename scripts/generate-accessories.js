const fs = require('fs');
const path = require('path');

const baseDir = path.join(process.cwd(), 'public', 'Accesories');
const outputPath = path.join(process.cwd(), 'src', 'data', 'accessories.ts');
const maxImagesPerProduct = Infinity;
const locale = 'bs-BA';

function encodePublicPath(relativePath) {
  const segments = relativePath.split(/[\\/]/).filter(Boolean);
  return '/' + segments.map(encodeURIComponent).join('/');
}

const list = [
  { id: '31', rawName: 'OMOT', price: '30 KM' },
  { id: '56', rawName: 'NARUKVICA', price: '30 KM' },
  { id: '57', rawName: 'OGRLICE', price: '30 KM' },
  { id: '58', rawName: 'FUTROLA_ZA NO\u017dEVE', price: '60 KM' },
  { id: '60', rawName: 'FUTROLA ZA NAO\u010cALE', price: '40 KM' },
];

const wordReplacements = {
  omot: 'Omot',
  narukvica: 'Narukvica',
  ogrlice: 'Ogrlice',
  futrola: 'Futrola',
  za: 'Za',
  no\u017eeve: 'No\u017eeve',
  nao\u010dale: 'Nao\u010dale',
  dje\u010diji: 'Dje\u010diji',
};

function formatWord(word) {
  if (/^no\./i.test(word)) {
    return word.replace(/^no\./i, 'No.');
  }

  const lower = word.toLocaleLowerCase(locale);

  if (Object.prototype.hasOwnProperty.call(wordReplacements, lower)) {
    return wordReplacements[lower];
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
  'Ručna izrada u Travniku, prilagodljiva silueta i završna obrada spremna za vaš stil.';

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
