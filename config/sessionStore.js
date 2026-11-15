const session = require('express-session');
const db = require('./db');

const DEFAULT_TTL_MS = 1000 * 60 * 60 * 24 * 7;

// Sesije cuvamo u SQLite-u da korpa i prijava prezive restart servera
// (podrazumijevani MemoryStore gubi sve i nije namijenjen produkciji).
class SqliteSessionStore extends session.Store {
  constructor() {
    super();
    const cleanup = setInterval(() => {
      db.prepare('DELETE FROM sessions WHERE expires < ?').run(Date.now());
    }, 1000 * 60 * 60);
    cleanup.unref();
  }

  get(sid, callback) {
    try {
      const row = db.prepare('SELECT sess, expires FROM sessions WHERE sid = ?').get(sid);
      if (!row || row.expires < Date.now()) return callback(null, null);
      callback(null, JSON.parse(row.sess));
    } catch (err) {
      callback(err);
    }
  }

  set(sid, sess, callback = () => {}) {
    try {
      const expires =
        sess.cookie && sess.cookie.expires ? new Date(sess.cookie.expires).getTime() : Date.now() + DEFAULT_TTL_MS;
      db.prepare(
        'INSERT INTO sessions (sid, sess, expires) VALUES (?, ?, ?) ON CONFLICT(sid) DO UPDATE SET sess = excluded.sess, expires = excluded.expires'
      ).run(sid, JSON.stringify(sess), expires);
      callback(null);
    } catch (err) {
      callback(err);
    }
  }

  destroy(sid, callback = () => {}) {
    try {
      db.prepare('DELETE FROM sessions WHERE sid = ?').run(sid);
      callback(null);
    } catch (err) {
      callback(err);
    }
  }

  touch(sid, sess, callback = () => {}) {
    this.set(sid, sess, callback);
  }
}

// Novi ID sesije pri svakoj prijavi (zastita od session fixation); korpa ostaje.
function startAuthenticatedSession(req, key, id, callback) {
  const { cart, lastOrderId } = req.session;
  req.session.regenerate((err) => {
    if (err) return callback(err);
    if (cart) req.session.cart = cart;
    if (lastOrderId) req.session.lastOrderId = lastOrderId;
    req.session[key] = id;
    callback();
  });
}

module.exports = { SqliteSessionStore, startAuthenticatedSession };
