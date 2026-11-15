const express = require('express');
const router = express.Router();
const Product = require('../../models/Product');
const Order = require('../../models/Order');
const Customer = require('../../models/Customer');
const Reminder = require('../../models/Reminder');
const Admin = require('../../models/Admin');
const { LABELS } = require('../../config/orderStatuses');

router.get('/', (req, res) => {
  const products = Product.all();
  const allOrders = Order.all();
  const orderCounts = Order.counts();
  const recentOrders = allOrders.slice(0, 5);
  // Proizvodi koje kupci trenutno ne mogu naruciti (iskljuceno "Na stanju").
  const outOfStock = products.filter((p) => !p.available).sort((a, b) => a.name.localeCompare(b.name));
  const revenue = allOrders
    .filter((o) => o.status !== 'novo' && o.status !== 'otkazano')
    .reduce((sum, o) => sum + o.total_km, 0);

  res.render('admin/dashboard', {
    title: 'Dashboard - Admin',
    productCount: products.length,
    inStockCount: products.filter((p) => p.available).length,
    customerCount: Customer.count(),
    orderCounts,
    recentOrders,
    revenue,
    statusLabels: LABELS,
    pendingReminders: Reminder.pending(6),
    outOfStock
  });
});

router.get('/lozinka', (req, res) => {
  res.render('admin/password', { title: 'Promjena lozinke - Admin' });
});

router.post('/lozinka', (req, res) => {
  const { current_password, new_password, new_password2 } = req.body;
  const admin = Admin.findById(req.session.adminId);

  if (!admin || !Admin.verifyPassword(admin, current_password)) {
    req.flash('error', 'Trenutna lozinka nije tačna.');
    return res.redirect('/admin/lozinka');
  }
  if (typeof new_password !== 'string' || new_password.length < 10) {
    req.flash('error', 'Nova lozinka mora imati najmanje 10 karaktera.');
    return res.redirect('/admin/lozinka');
  }
  if (new_password !== new_password2) {
    req.flash('error', 'Nove lozinke se ne podudaraju.');
    return res.redirect('/admin/lozinka');
  }

  Admin.updatePassword(admin.id, new_password);
  req.flash('success', 'Lozinka je promijenjena.');
  res.redirect('/admin');
});

module.exports = router;
