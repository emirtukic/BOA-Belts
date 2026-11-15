const express = require('express');
const router = express.Router();
const Admin = require('../../models/Admin');
const { startAuthenticatedSession } = require('../../config/sessionStore');

router.get('/prijava', (req, res) => {
  if (req.session.adminId) {
    return res.redirect('/admin');
  }
  res.render('admin/login', { title: 'Prijava - Admin' });
});

router.post('/prijava', (req, res, next) => {
  const { username, password } = req.body;
  const admin = Admin.findByUsername(username);

  if (!admin || !Admin.verifyPassword(admin, password)) {
    req.flash('error', 'Pogrešno korisničko ime ili lozinka.');
    return res.redirect('/admin/prijava');
  }

  startAuthenticatedSession(req, 'adminId', admin.id, (err) => {
    if (err) return next(err);
    res.redirect('/admin');
  });
});

router.post('/odjava', (req, res) => {
  req.session.adminId = null;
  res.redirect('/admin/prijava');
});

module.exports = router;
