const fs = require('fs');
const path = require('path');

const baseDir = path.join(process.cwd(), 'public', 'Mens Belts');
const outputPath = path.join(process.cwd(), 'src', 'data', 'mensBelts.ts');
const maxImagesPerProduct = Infinity;
const locale = 'bs-BA';

function encodePublicPath(relativePath) {
  const segments = relativePath.split(/\\|\//).filter(Boolean);
  return '/' + segments.map(encodeURIComponent).join('/');
}

const list = `02_MUSKI KAIS - 35 KM
35_MUSKI LOVACKI KAIS - 250 KM`;

const wordReplacements = {
  Muski: 'Muški',
  Lovacki: 'Lovački',
  Kais: 'Kaiš',
  Muska: 'Muška',
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
      throw new Error(`Invalid line in mens belt list: "${line}"`);
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

  const colors = files.map((file, idx) => ({
    label: `Photo ${idx + 1}`,
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

const header = `export type MensBeltVariant = {\n  label: string;\n  image: string;\n  preview?: string;\n};\n\nexport type MensBelt = {\n  id: string;\n  name: string;\n  price: string;\n  category: 'men';\n  description: string;\n  colors: MensBeltVariant[];\n};\n\nexport const mensBelts: MensBelt[] = `;

const fileContent = `${header}${JSON.stringify(data, null, 2)};\n`;

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, fileContent, { encoding: 'utf8' });
console.log(`Wrote ${data.length} mens belts to ${outputPath}`);
