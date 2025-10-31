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

const list = `31_OMOT - 30 KM
56_NARUKVICA - 30 KM
57_OGRLICE - 30 KM
58_FUTROLA_ZA NOZEVE - 60 KM
60_FUTROLA ZA NAOCALE - 40 KM`;

const wordReplacements = {
  omot: 'Omot',
  narukvica: 'Narukvica',
  ogrlice: 'Ogrlice',
  futrola: 'Futrola',
  za: 'Za',
  nozeve: 'Noževe',
  noževe: 'Noževe',
  naocale: 'Naočale',
  naočale: 'Naočale',
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
      throw new Error(`Invalid line in accessories list: "${line}"`);
    }
    const [, idName, pricePart] = match;
    const [id, ...nameParts] = idName.split('_');
    const rawName = nameParts.join(' ').replace(/_/g, ' ').replace(/\s+/g, ' ').trim();
    const name = formatName(rawName);
    const price = pricePart.replace(/\s+/g, ' ');
    return { id: id.trim(), name, price };
  });

const folders = fs
  .readdirSync(baseDir, { withFileTypes: true })
  .filter((dirent) => dirent.isDirectory());

const description =
  'Ru\u010dna izrada u Travniku, prilagodljiva silueta i zavr\u0161na obrada spremna za va\u0161 stil.';

const data = specs.map((spec) => {
  const folder = folders.find((dirent) => dirent.name.startsWith(spec.id + '_'));
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

  const colors = files.map((file, idx) => ({
    label: `Photo ${idx + 1}`,
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

const fileContent = `${header}${JSON.stringify(data, null, 2)};
`;

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, fileContent, { encoding: 'utf8' });
console.log(`Wrote ${data.length} accessories to ${outputPath}`);
