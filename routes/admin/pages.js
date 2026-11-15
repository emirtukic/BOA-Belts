const express = require('express');
const router = express.Router();
const PageContent = require('../../models/PageContent');
const { upload, processUploadedImages } = require('../../middleware/upload');
const { removeUploadedFile } = require('../../config/paths');

const PAGE_META = {
  'o-nama': { title: 'O nama', hasHeading: true },
  'program-lojalnosti': { title: 'Program lojalnosti', hasHeading: true }
};

router.get('/:key', (req, res) => {
  const key = req.params.key;
  const meta = PAGE_META[key];
  if (!meta) return res.redirect('/admin');
  res.render('admin/pages/form', {
    title: `${meta.title} - Admin`,
    pageKey: key,
    pageMeta: meta,
    content: PageContent.get(key)
  });
});

router.post('/:key', upload.array('images', 40), processUploadedImages, (req, res) => {
  const key = req.params.key;
  const meta = PAGE_META[key];
  if (!meta) return res.redirect('/admin');

  const current = PageContent.get(key);

  const keepImages = Array.isArray(req.body.keepImages)
    ? req.body.keepImages
    : req.body.keepImages
    ? [req.body.keepImages]
    : [];
  current.images.filter((img) => !keepImages.includes(img)).forEach(removeUploadedFile);
  const newImages = req.uploadedImages.map((f) => `/uploads/${f}`);

  const data = {
    ...current,
    intro: req.body.intro || '',
    body: req.body.body || '',
    images: [...keepImages, ...newImages]
  };
  if (meta.hasHeading) {
    data.heading = req.body.heading || '';
  }

  PageContent.save(key, data);
  req.flash('success', `${meta.title} je ažurirano.`);
  res.redirect(`/admin/stranice/${key}`);
});

module.exports = router;
