const crypto = require('crypto');
const db = require('../config/db');

function normalize(email) {
  return email.trim().toLowerCase();
}

const NewsletterSubscriber = {
  all() {
    return db.prepare('SELECT * FROM newsletter_subscribers ORDER BY subscribed_at DESC').all();
  },

  count() {
    return db.prepare('SELECT COUNT(*) as c FROM newsletter_subscribers').get().c;
  },

  findByEmail(email) {
    return db.prepare('SELECT * FROM newsletter_subscribers WHERE UPPER(email) = UPPER(?)').get(email.trim());
  },

  // Vraca { created: true/false, subscriber } - created:false znaci da je
  // email vec bio prijavljen (nije greska, samo ne saljemo dupli mail).
  subscribe(email) {
    // Nova prijava ponistava raniju odjavu.
    db.prepare('DELETE FROM newsletter_unsubscribes WHERE email = ?').run(normalize(email));
    const existing = this.findByEmail(email);
    if (existing) return { created: false, subscriber: existing };
    const info = db
      .prepare('INSERT INTO newsletter_subscribers (email) VALUES (?)')
      .run(email.trim().toLowerCase());
    return {
      created: true,
      subscriber: db.prepare('SELECT * FROM newsletter_subscribers WHERE id = ?').get(info.lastInsertRowid)
    };
  },

  delete(id) {
    db.prepare('DELETE FROM newsletter_subscribers WHERE id = ?').run(id);
  },

  unsubscribe(email) {
    const address = normalize(email);
    db.prepare('DELETE FROM newsletter_subscribers WHERE UPPER(email) = UPPER(?)').run(address);
    db.prepare('INSERT OR IGNORE INTO newsletter_unsubscribes (email) VALUES (?)').run(address);
  },

  // Potpisan token u linku za odjavu: odjaviti moze samo ko je dobio taj mail.
  unsubscribeToken(email) {
    return crypto
      .createHmac('sha256', process.env.SESSION_SECRET || 'boa-dev-secret')
      .update(normalize(email))
      .digest('hex')
      .slice(0, 32);
  },

  isValidUnsubscribeToken(email, token) {
    if (typeof email !== 'string' || typeof token !== 'string') return false;
    const expected = Buffer.from(this.unsubscribeToken(email));
    const received = Buffer.from(token);
    return expected.length === received.length && crypto.timingSafeEqual(expected, received);
  },

  // Newsletter dobijaju samo oni koji su se sami prijavili (forma ili checkbox
  // pri registraciji). Sam nalog nije saglasnost za promotivne poruke.
  allRecipientEmails() {
    const subscriberEmails = db.prepare('SELECT email FROM newsletter_subscribers').all().map((r) => r.email);
    const unsubscribed = new Set(db.prepare('SELECT email FROM newsletter_unsubscribes').all().map((r) => r.email));
    return [...new Set(subscriberEmails.map((e) => e.toLowerCase()))].filter((email) => !unsubscribed.has(email));
  }
};

module.exports = NewsletterSubscriber;
