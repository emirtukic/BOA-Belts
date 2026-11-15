const db = require('../config/db');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

function parseRow(row) {
  if (!row) return row;
  const { password_hash, reset_token, verification_token, ...rest } = row;
  return { ...rest, email_verified: !!row.email_verified };
}

const Customer = {
  findByEmail(email) {
    if (typeof email !== 'string') return undefined;
    return db.prepare('SELECT * FROM customers WHERE email = ?').get(email.trim().toLowerCase());
  },

  findById(id) {
    return parseRow(db.prepare('SELECT * FROM customers WHERE id = ?').get(id));
  },

  findByGoogleId(googleId) {
    return db.prepare('SELECT * FROM customers WHERE google_id = ?').get(googleId);
  },

  findByFacebookId(facebookId) {
    return db.prepare('SELECT * FROM customers WHERE facebook_id = ?').get(facebookId);
  },

  create({ name, email, password, phone, address, city, newsletterOptIn }) {
    const passwordHash = bcrypt.hashSync(password, 10);
    const token = crypto.randomBytes(32).toString('hex');
    const info = db
      .prepare(
        `INSERT INTO customers (name, email, password_hash, phone, address, city, verification_token, email_verified, newsletter_opt_in)
         VALUES (?, ?, ?, ?, ?, ?, ?, 0, ?)`
      )
      .run(name, email.trim().toLowerCase(), passwordHash, phone || '', address || '', city || '', token, newsletterOptIn ? 1 : 0);
    return { ...this.findById(info.lastInsertRowid), verificationToken: token };
  },

  // OAuth nalozi nemaju lozinku koju korisnik bira - generise se nasumican
  // hash da password_hash NOT NULL ogranicenje ostane zadovoljeno; korisnik
  // kasnije moze postaviti pravu lozinku preko "zaboravljena lozinka".
  // Google/Facebook su vec potvrdili e-mail vlasnika, pa OAuth nalozi
  // nastaju odmah verifikovani.
  createFromOAuth({ name, email, provider, providerId }) {
    const randomPassword = crypto.randomBytes(24).toString('hex');
    const passwordHash = bcrypt.hashSync(randomPassword, 10);
    const column = provider === 'google' ? 'google_id' : 'facebook_id';
    const info = db
      .prepare(
        `INSERT INTO customers (name, email, password_hash, ${column}, email_verified)
         VALUES (?, ?, ?, ?, 1)`
      )
      .run(name, (email || '').trim().toLowerCase(), passwordHash, providerId);
    return this.findById(info.lastInsertRowid);
  },

  linkOAuthProvider(id, provider, providerId) {
    const column = provider === 'google' ? 'google_id' : 'facebook_id';
    db.prepare(`UPDATE customers SET ${column} = ? WHERE id = ?`).run(providerId, id);
  },

  update(id, { name, phone, address, city, password }) {
    if (password) {
      const passwordHash = bcrypt.hashSync(password, 10);
      db.prepare(
        `UPDATE customers SET name = ?, phone = ?, address = ?, city = ?, password_hash = ? WHERE id = ?`
      ).run(name, phone || '', address || '', city || '', passwordHash, id);
    } else {
      db.prepare(
        `UPDATE customers SET name = ?, phone = ?, address = ?, city = ? WHERE id = ?`
      ).run(name, phone || '', address || '', city || '', id);
    }
    return this.findById(id);
  },

  verifyPassword(customer, plainPassword) {
    return typeof plainPassword === 'string' && bcrypt.compareSync(plainPassword, customer.password_hash);
  },

  all() {
    return db.prepare('SELECT * FROM customers ORDER BY created_at DESC').all().map(parseRow);
  },

  count() {
    return db.prepare('SELECT COUNT(*) as c FROM customers').get().c;
  },

  // --- Zaboravljena lozinka ---
  createResetToken(email) {
    const customer = this.findByEmail(email);
    if (!customer) return null;
    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1h
    db.prepare('UPDATE customers SET reset_token = ?, reset_token_expires = ? WHERE id = ?').run(
      token,
      expires,
      customer.id
    );
    return { customer, token };
  },

  findByResetToken(token) {
    const row = db
      .prepare('SELECT * FROM customers WHERE reset_token = ? AND reset_token_expires > ?')
      .get(token, new Date().toISOString());
    return row || null;
  },

  resetPassword(id, newPassword) {
    const passwordHash = bcrypt.hashSync(newPassword, 10);
    db.prepare(
      // Link je stigao na e-mail, pa je time potvrdjena i sama adresa.
      'UPDATE customers SET password_hash = ?, reset_token = NULL, reset_token_expires = NULL, email_verified = 1, verification_token = NULL WHERE id = ?'
    ).run(passwordHash, id);
  },

  // --- Verifikacija e-maila ---
  findByVerificationToken(token) {
    return db.prepare('SELECT * FROM customers WHERE verification_token = ?').get(token) || null;
  },

  verifyEmail(id) {
    db.prepare('UPDATE customers SET email_verified = 1, verification_token = NULL WHERE id = ?').run(id);
  },

  regenerateVerificationToken(email) {
    const customer = this.findByEmail(email);
    if (!customer || customer.email_verified) return null;
    const token = crypto.randomBytes(32).toString('hex');
    db.prepare('UPDATE customers SET verification_token = ? WHERE id = ?').run(token, customer.id);
    return { customer, token };
  }
};

module.exports = Customer;
