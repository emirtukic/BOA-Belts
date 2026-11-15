const express = require('express');
const router = express.Router();
const { getWaistSettings, saveWaistSettings } = require('../../config/waist');
const { cleanText } = require('../../config/format');

router.get('/', (req, res) => {
  res.render('admin/waist', { title: 'Mjerenje struka - Admin', settings: getWaistSettings() });
});

router.post('/', (req, res) => {
  const min = parseInt(req.body.min, 10);
  const max = parseInt(req.body.max, 10);
  if (!Number.isInteger(min) || !Number.isInteger(max) || min < 1 || max > 300 || min >= max) {
    req.flash('error', 'Unesite ispravan raspon u cm, npr. od 50 do 150.');
    return res.redirect('/admin/mjerenje-struka');
  }
  saveWaistSettings({ intro: cleanText(req.body.intro, 500), min, max });
  req.flash('success', 'Sačuvano.');
  res.redirect('/admin/mjerenje-struka');
});

module.exports = router;
