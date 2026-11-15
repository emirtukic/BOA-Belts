const express = require('express');
const router = express.Router();
const Customer = require('../../models/Customer');
const Order = require('../../models/Order');

router.get('/', (req, res) => {
  const customers = Customer.all().map((c) => ({
    ...c,
    orderCount: Order.allByCustomer(c.id).length
  }));
  res.render('admin/customers/list', { title: 'Korisnici - Admin', customers });
});

module.exports = router;
