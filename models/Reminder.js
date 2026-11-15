const db = require('../config/db');

function parseRow(row) {
  if (!row) return row;
  return { ...row, done: !!row.done };
}

const Reminder = {
  all() {
    return db
      .prepare('SELECT * FROM reminders ORDER BY done ASC, due_date IS NULL, due_date ASC, created_at DESC')
      .all()
      .map(parseRow);
  },

  pending(limit) {
    const sql =
      'SELECT * FROM reminders WHERE done = 0 ORDER BY due_date IS NULL, due_date ASC, created_at DESC' +
      (limit ? ' LIMIT ?' : '');
    const rows = limit ? db.prepare(sql).all(limit) : db.prepare(sql).all();
    return rows.map(parseRow);
  },

  findById(id) {
    return parseRow(db.prepare('SELECT * FROM reminders WHERE id = ?').get(id));
  },

  create({ text, due_date }) {
    const info = db.prepare('INSERT INTO reminders (text, due_date) VALUES (?, ?)').run(text, due_date || null);
    return this.findById(info.lastInsertRowid);
  },

  toggleDone(id) {
    const reminder = this.findById(id);
    if (!reminder) return;
    db.prepare('UPDATE reminders SET done = ? WHERE id = ?').run(reminder.done ? 0 : 1, id);
  },

  delete(id) {
    db.prepare('DELETE FROM reminders WHERE id = ?').run(id);
  }
};

module.exports = Reminder;
