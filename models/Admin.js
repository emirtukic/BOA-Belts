const db = require('../config/db');
const bcrypt = require('bcryptjs');

const Admin = {
  findByUsername(username) {
    if (typeof username !== 'string') return undefined;
    return db.prepare('SELECT * FROM admins WHERE username = ?').get(username);
  },

  findById(id) {
    return db.prepare('SELECT * FROM admins WHERE id = ?').get(id);
  },

  create(username, plainPassword) {
    const passwordHash = bcrypt.hashSync(plainPassword, 10);
    const info = db
      .prepare('INSERT INTO admins (username, password_hash) VALUES (?, ?)')
      .run(username, passwordHash);
    return this.findById(info.lastInsertRowid);
  },

  verifyPassword(admin, plainPassword) {
    return typeof plainPassword === 'string' && bcrypt.compareSync(plainPassword, admin.password_hash);
  },

  updatePassword(id, plainPassword) {
    db.prepare('UPDATE admins SET password_hash = ? WHERE id = ?').run(bcrypt.hashSync(plainPassword, 10), id);
  }
};

module.exports = Admin;
