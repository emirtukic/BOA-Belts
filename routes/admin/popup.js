const express = require('express');
const router = express.Router();
const Popup = require('../../models/Popup');
const { popupUpload, processPopupUpload } = require('../../middleware/popupUpload');
const { removeUploadedFile } = require('../../config/paths');

function parsePopupForm(body) {
  return {
    name: (body.name || '').trim() || 'Popup',
    heading: body.heading || '',
    text: body.text || '',
    cta_text: body.cta_text || '',
    cta_link: body.cta_link || '/kolekcija',
    delay_seconds: Math.max(0, parseInt(body.delay_seconds, 10) || 0),
    auto_close_seconds: Math.max(0, parseInt(body.auto_close_seconds, 10) || 0)
  };
}

router.get('/', (req, res) => {
  res.render('admin/popup/list', { title: 'Popup - Admin', popups: Popup.all() });
});

router.get('/novi', (req, res) => {
  res.render('admin/popup/form', { title: 'Novi popup - Admin', popup: null });
});

router.post('/', popupUpload.single('image'), processPopupUpload, (req, res) => {
  const data = parsePopupForm(req.body);
  data.image = req.uploadedPopupImage || '';
  const popup = Popup.create(data);
  req.flash('success', `Popup "${popup.name}" je sačuvan.`);
  res.redirect('/admin/popup');
});

router.get('/:id/izmijeni', (req, res) => {
  const popup = Popup.findById(req.params.id);
  if (!popup) return res.redirect('/admin/popup');
  res.render('admin/popup/form', { title: 'Izmijeni popup - Admin', popup });
});

router.put('/:id', popupUpload.single('image'), processPopupUpload, (req, res) => {
  const existing = Popup.findById(req.params.id);
  if (!existing) return res.redirect('/admin/popup');

  const data = parsePopupForm(req.body);

  if (req.uploadedPopupImage) {
    removeUploadedFile(existing.image);
    data.image = req.uploadedPopupImage;
  } else if (existing.image && req.body.keepImage === '1') {
    data.image = existing.image;
  } else {
    removeUploadedFile(existing.image);
    data.image = '';
  }

  const popup = Popup.update(req.params.id, data);
  req.flash('success', `Popup "${popup.name}" je ažuriran.`);
  res.redirect('/admin/popup');
});

router.post('/:id/aktiviraj', (req, res) => {
  const popup = Popup.activate(req.params.id);
  if (popup) req.flash('success', `Popup "${popup.name}" je sada aktivan na sajtu.`);
  res.redirect('/admin/popup');
});

router.post('/:id/deaktiviraj', (req, res) => {
  const popup = Popup.deactivate(req.params.id);
  if (popup) req.flash('success', `Popup "${popup.name}" je deaktiviran.`);
  res.redirect('/admin/popup');
});

router.post('/:id/dupliraj', (req, res) => {
  const copy = Popup.duplicate(req.params.id);
  if (copy) req.flash('success', `Napravljena je kopija: "${copy.name}".`);
  res.redirect('/admin/popup');
});

router.delete('/:id', (req, res) => {
  const popup = Popup.findById(req.params.id);
  if (popup) {
    removeUploadedFile(popup.image);
    Popup.delete(req.params.id);
    req.flash('success', 'Popup je obrisan.');
  }
  res.redirect('/admin/popup');
});

module.exports = router;
