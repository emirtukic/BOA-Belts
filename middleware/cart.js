const Product = require('../models/Product');
const { roundMoney } = require('../config/format');

function ensureCart(req) {
  if (!req.session.cart) {
    req.session.cart = { items: [] };
  }
  return req.session.cart;
}

// Null znaci da se stanje ne prati (proizvod bez veličina).
function availableStock(product, size) {
  if (!product.in_stock) return 0;
  if (!product.sizes.length) return null;
  const sizeInfo = product.sizes.find((s) => s.size === size);
  return sizeInfo ? sizeInfo.stock : 0;
}

// Cita samo id/velicinu/boju/kolicinu iz sesije - cijena i naziv se UVIJEK
// ponovo ucitavaju iz baze ovdje, tako da korisnik ne moze izmijeniti cijenu
// preko sesije/kolacica.
function getCartDetails(req) {
  const cart = ensureCart(req);
  const items = [];
  let total = 0;

  cart.items.forEach((entry, index) => {
    const product = Product.findById(entry.productId);
    if (!product) return;
    const lineTotal = roundMoney(product.finalPrice * entry.qty);
    total += lineTotal;
    items.push({
      index,
      product,
      size: entry.size,
      color: entry.color,
      detailColor: entry.detailColor,
      qty: entry.qty,
      lineTotal,
      maxQty: availableStock(product, entry.size)
    });
  });

  return { items, total: roundMoney(total) };
}

// Stanje se moze promijeniti dok kupac razmislja: svodi korpu na ono sto se
// stvarno moze isporuciti i vraca poruke o svakoj izmjeni.
function syncCartWithStock(req) {
  const cart = ensureCart(req);
  const notices = [];

  cart.items = cart.items.filter((entry) => {
    const product = Product.findById(entry.productId);
    if (!product) {
      notices.push('Jedan proizvod iz vaše korpe više nije dostupan i uklonjen je.');
      return false;
    }
    const stock = availableStock(product, entry.size);
    if (stock === null || entry.qty <= stock) return true;

    const label = entry.size ? `${product.name} (veličina ${entry.size})` : product.name;
    if (stock <= 0) {
      notices.push(`${label} više nije na stanju i uklonjeno je iz korpe.`);
      return false;
    }
    notices.push(`${label}: na stanju je još ${stock} kom., pa smo prilagodili količinu.`);
    entry.qty = stock;
    return true;
  });

  return notices;
}

function attachCartCount(req, res, next) {
  // Ne pravimo korpu za svakog posjetioca - sesija nastaje tek kad je zatreba.
  const cart = req.session.cart;
  if (cart) {
    cart.items = cart.items.filter((entry) => Product.findById(entry.productId));
  }
  res.locals.cartCount = cart ? cart.items.reduce((sum, i) => sum + i.qty, 0) : 0;
  next();
}

module.exports = { ensureCart, getCartDetails, syncCartWithStock, availableStock, attachCartCount };
