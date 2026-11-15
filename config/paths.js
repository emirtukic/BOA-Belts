require('dotenv').config();

const path = require('path');
const fs = require('fs');

const ROOT = path.join(__dirname, '..');

// U produkciji DATA_DIR pokazuje na trajni disk: baza i sve sto admin uploaduje
// moraju preživjeti novi deploy. Bez DATA_DIR-a (lokalni razvoj) koristimo
// postojece foldere unutar projekta.
const DATA_DIR = process.env.DATA_DIR ? path.resolve(process.env.DATA_DIR) : null;
const DB_DIR = DATA_DIR || path.join(ROOT, 'db');
const UPLOADS_DIR = DATA_DIR ? path.join(DATA_DIR, 'uploads') : path.join(ROOT, 'public', 'uploads');

[DB_DIR, UPLOADS_DIR].forEach((dir) => fs.mkdirSync(dir, { recursive: true }));

// Brise samo fajlove koje je admin uploadovao. Slike iz repozitorija dijele
// vise stranica i ne smiju se brisati kad ih admin skloni sa jedne od njih.
function removeUploadedFile(publicPath) {
  if (!publicPath || !publicPath.startsWith('/uploads/')) return;
  const name = path.basename(publicPath);
  fs.unlink(path.join(UPLOADS_DIR, name), () => {});
  // Mala verzija iste slike (liste, korpa).
  if (name.endsWith('.webp')) fs.unlink(path.join(UPLOADS_DIR, name.replace(/\.webp$/, '-sm.webp')), () => {});
}

module.exports = { DB_DIR, UPLOADS_DIR, removeUploadedFile };
