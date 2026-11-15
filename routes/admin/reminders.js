const express = require('express');
const router = express.Router();
const Reminder = require('../../models/Reminder');

router.get('/', (req, res) => {
  res.render('admin/reminders/list', { title: 'Podsjetnici - Admin', reminders: Reminder.all() });
});

router.post('/', (req, res) => {
  const { text, due_date } = req.body;
  if (text && text.trim()) {
    Reminder.create({ text: text.trim(), due_date: due_date || null });
  }
  res.redirect('/admin/podsjetnici');
});

router.put('/:id/toggle', (req, res) => {
  Reminder.toggleDone(req.params.id);
  res.redirect(req.get('Referer') || '/admin/podsjetnici');
});

router.delete('/:id', (req, res) => {
  Reminder.delete(req.params.id);
  res.redirect('/admin/podsjetnici');
});

module.exports = router;
