module.exports = function requireCustomer(req, res, next) {
  if (!req.session.customerId) {
    return res.redirect('/nalog/prijava');
  }
  next();
};
