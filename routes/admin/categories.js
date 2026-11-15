const express = require('express');
const router = express.Router();
const Category = require('../../models/Category');

router.get('/', (req, res) => {
  const categories = Category.all().map((c) => ({ ...c, productCount: Category.countProducts(c.slug) }));
  res.render('admin/categories/list', { title: 'Kategorije - Admin', categories });
});

router.get('/nova', (req, res) => {
  res.render('admin/categories/form', { title: 'Nova kategorija - Admin', category: null });
});

router.post('/', (req, res) => {
  const name = (req.body.name || '').trim();
  if (!name) {
    req.flash('error', 'Naziv kategorije je obavezan.');
    return res.redirect('/admin/kategorije/nova');
  }
  if (!Category.slugify(name) || Category.slugTakenByOther(name, 0)) {
    req.flash('error', 'Kategorija sa tim nazivom već postoji ili naziv nije ispravan.');
    return res.redirect('/admin/kategorije/nova');
  }
  const category = Category.create({ name, sort_order: parseInt(req.body.sort_order, 10) || 0 });
  req.flash('success', `Kategorija "${category.name}" je sačuvana.`);
  res.redirect('/admin/kategorije');
});

router.get('/:id/izmijeni', (req, res) => {
  const category = Category.findById(req.params.id);
  if (!category) return res.redirect('/admin/kategorije');
  res.render('admin/categories/form', { title: 'Izmijeni kategoriju - Admin', category });
});

router.put('/:id', (req, res) => {
  const name = (req.body.name || '').trim();
  if (!name) {
    req.flash('error', 'Naziv kategorije je obavezan.');
    return res.redirect(`/admin/kategorije/${req.params.id}/izmijeni`);
  }
  if (!Category.slugify(name) || Category.slugTakenByOther(name, req.params.id)) {
    req.flash('error', 'Kategorija sa tim nazivom već postoji ili naziv nije ispravan.');
    return res.redirect(`/admin/kategorije/${req.params.id}/izmijeni`);
  }
  const category = Category.update(req.params.id, { name, sort_order: parseInt(req.body.sort_order, 10) || 0 });
  if (category) req.flash('success', `Kategorija "${category.name}" je ažurirana.`);
  res.redirect('/admin/kategorije');
});

router.delete('/:id', (req, res) => {
  const category = Category.findById(req.params.id);
  if (!category) return res.redirect('/admin/kategorije');
  const productCount = Category.countProducts(category.slug);
  if (productCount > 0) {
    req.flash(
      'error',
      `Kategorija "${category.name}" se ne može obrisati jer je koristi ${productCount} proizvod(a). Prvo im promijeni kategoriju.`
    );
    return res.redirect('/admin/kategorije');
  }
  Category.delete(req.params.id);
  req.flash('success', `Kategorija "${category.name}" je obrisana.`);
  res.redirect('/admin/kategorije');
});

module.exports = router;
