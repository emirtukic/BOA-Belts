// Admin: stranice koje se slazu od blokova (Stranice > Nova stranica).
const path = require('path');
const crypto = require('crypto');
const express = require('express');
const multer = require('multer');
const router = express.Router();
const Page = require('../../models/Page');
const Product = require('../../models/Product');
const Category = require('../../models/Category');
const { upload } = require('../../middleware/upload');
const { saveUploadedImage } = require('../../config/images');
const { UPLOADS_DIR, removeUploadedFile } = require('../../config/paths');
const { BLOCK_TYPES, sanitizeBlocks, uploadsUsed } = require('../../config/pageBlocks');
const { renderPage } = require('../customPages');

const videoUpload = multer({
  storage: multer.diskStorage({
    destination: UPLOADS_DIR,
    filename(req, file, cb) {
      const ext = file.mimetype === 'video/webm' ? 'webm' : 'mp4';
      cb(null, `video-${Date.now()}-${crypto.randomBytes(4).toString('hex')}.${ext}`);
    }
  }),
  limits: { fileSize: 150 * 1024 * 1024 },
  fileFilter(req, file, cb) {
    if (/^video\/(mp4|webm)$/.test(file.mimetype)) return cb(null, true);
    cb(new Error('Video mora biti MP4 ili WEBM.'));
  }
});

// Podaci za listu proizvoda u bloku "Proizvodi".
function productChoices() {
  return Product.all().map((p) => ({
    id: p.id,
    name: p.name,
    image: p.smallImage(p.coverImage),
    category: p.category,
    available: p.available
  }));
}

function formData(body) {
  const title = String(body.title || '').trim().slice(0, 150);
  const slug = Page.slugify(body.slug || title).slice(0, 80);
  return {
    title,
    slug,
    description: String(body.description || '').trim().slice(0, 300),
    blocks: sanitizeBlocks(body.blocks),
    status: body.status === 'published' ? 'published' : 'draft',
    menu: Page.MENUS.includes(body.menu) ? body.menu : 'none',
    menu_label: String(body.menu_label || '').trim().slice(0, 40),
    menu_order: parseInt(body.menu_order, 10) || 0
  };
}

function renderForm(res, page, extra = {}) {
  res.render('admin/page-builder/form', {
    title: `${page.id ? page.title : 'Nova stranica'} - Admin`,
    page,
    blockTypes: BLOCK_TYPES,
    products: productChoices(),
    categories: Category.all(),
    ...extra
  });
}

router.get('/', (req, res) => {
  res.render('admin/page-builder/list', { title: 'Stranice - Admin', pages: Page.all() });
});

router.get('/nova', (req, res) => {
  renderForm(res, {
    id: null,
    title: '',
    slug: '',
    description: '',
    status: 'draft',
    menu: 'none',
    menu_label: '',
    menu_order: 0,
    blocks: [{ type: 'text', heading: '', body: '', align: 'left' }]
  });
});

router.get('/uredi/:id', (req, res) => {
  const page = Page.findById(req.params.id);
  if (!page) return res.redirect('/admin/stranice');
  renderForm(res, page);
});

function save(req, res, id) {
  const data = formData(req.body);
  const problem = !data.title ? 'Upiši naslov stranice.' : Page.slugProblem(data.slug, id);
  if (problem) return renderForm(res, { ...data, id }, { flashError: [problem] });
  if (id) {
    const old = Page.findById(id);
    const keep = new Set(uploadsUsed(data.blocks));
    uploadsUsed(old.blocks).filter((f) => !keep.has(f)).forEach(removeUploadedFile);
    Page.update(id, data);
  } else {
    id = Page.create(data);
  }
  req.flash('success', data.status === 'published' ? `Stranica je sačuvana i objavljena na /${data.slug}.` : 'Stranica je sačuvana kao skica (kupci je ne vide).');
  res.redirect(`/admin/stranice/uredi/${id}`);
}

router.post('/nova', (req, res) => save(req, res, null));
router.post('/uredi/:id', (req, res) => {
  if (!Page.findById(req.params.id)) return res.redirect('/admin/stranice');
  save(req, res, Number(req.params.id));
});

router.post('/obrisi/:id', (req, res) => {
  const page = Page.findById(req.params.id);
  if (page) {
    uploadsUsed(page.blocks).forEach(removeUploadedFile);
    Page.delete(page.id);
    req.flash('success', `Stranica "${page.title}" je obrisana.`);
  }
  res.redirect('/admin/stranice');
});

// Pregled nesacuvane stranice: prikazuje se kao na sajtu, nista se ne cuva.
router.post('/pregled', async (req, res, next) => {
  try {
    const data = formData(req.body);
    res.locals.noindex = true;
    await renderPage(res, { ...data, title: data.title || 'Bez naslova', menuLabel: data.menu_label || data.title }, { previewMode: true });
  } catch (err) {
    next(err);
  }
});

// Slika za blok: snima se odmah (velika + mala WebP verzija) i vraca adresu.
router.post('/slika', upload.single('image'), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'Izaberi sliku.' });
    const filename = await saveUploadedImage(req.file.buffer, UPLOADS_DIR);
    res.json({ src: `/uploads/${filename}` });
  } catch (err) {
    next(err);
  }
});

router.post('/video', videoUpload.single('video'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Izaberi video.' });
  res.json({ src: `/uploads/${path.basename(req.file.filename)}` });
});

module.exports = router;
