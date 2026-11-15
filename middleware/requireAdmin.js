module.exports = function requireAdmin(req, res, next) {
  if (!req.session.adminId) {
    return res.redirect('/admin/prijava');
  }
  next();
};
