const db = require('../config/db');

const Settings = {
  get(key, fallback = null) {
    const row = db.prepare('SELECT value FROM settings WHERE key = ?').get(key);
    if (!row) return fallback;
    try {
      return JSON.parse(row.value);
    } catch {
      return fallback;
    }
  },

  set(key, value) {
    const json = JSON.stringify(value);
    const existing = db.prepare('SELECT key FROM settings WHERE key = ?').get(key);
    if (existing) {
      db.prepare('UPDATE settings SET value = ? WHERE key = ?').run(json, key);
    } else {
      db.prepare('INSERT INTO settings (key, value) VALUES (?, ?)').run(key, json);
    }
  }
};

module.exports = Settings;
