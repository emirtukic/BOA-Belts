require('dotenv').config();

const fs = require('fs');
const path = require('path');
const db = require('../config/db');
const Admin = require('../models/Admin');
const Product = require('../models/Product');

// Proizvodi preneseni sa starog sajta (scripts/import-legacy-products.js).
const fixturePath = path.join(__dirname, 'products.fixture.json');

function seedAdmin() {
  const username = process.env.ADMIN_USERNAME || 'admin';
  const password = process.env.ADMIN_PASSWORD;
  if (Admin.findByUsername(username)) return;
  if (!password) {
    console.warn('ADMIN_PASSWORD nije postavljen - admin nalog nije kreiran.');
    return;
  }
  Admin.create(username, password);
  console.log(`Kreiran admin nalog "${username}". Promijenite lozinku nakon prve prijave.`);
}

function seedProducts() {
  const existingCount = db.prepare('SELECT COUNT(*) as c FROM products').get().c;
  if (existingCount > 0 || !fs.existsSync(fixturePath)) return;
  const products = JSON.parse(fs.readFileSync(fixturePath, 'utf8'));
  // Unazad, jer lista prikazuje najnovije prvo: prvi iz fajla ostaje prvi na sajtu.
  db.runInTransaction(() => {
    products
      .slice()
      .reverse()
      .forEach((p, index) => {
        const createdAt = new Date(Date.UTC(2025, 0, 1) + index * 60000).toISOString().replace('T', ' ').slice(0, 19);
        const created = Product.create(p);
        db.prepare('UPDATE products SET created_at = ? WHERE id = ?').run(createdAt, created.id);
      });
  });
  console.log(`Dodano ${products.length} proizvoda.`);
}

function runSeed() {
  seedAdmin();
  seedProducts();
}

if (require.main === module) {
  runSeed();
  console.log('Seed završen.');
}

module.exports = { runSeed };
