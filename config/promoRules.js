// Ko smije koristiti promo kod: svi, samo prva narudzba ili samo novi korisnici.
// Provjerava se pri unosu koda i ponovo pri potvrdi narudzbe.
const db = require('./db');

const AUDIENCES = [
  { id: 'svi', label: 'Svi kupci' },
  { id: 'prva_narudzba', label: 'Samo prva narudžba' },
  { id: 'novi_korisnici', label: 'Samo novi korisnici' }
];
const AUDIENCE_LABELS = Object.fromEntries(AUDIENCES.map((a) => [a.id, a.label]));
const DEFAULT_NEW_CUSTOMER_DAYS = 30;

// "061 246-105", "+387 61 246 105" i "0038761246105" su isti broj.
function normalizePhone(phone) {
  let digits = String(phone || '').replace(/\D/g, '');
  digits = digits.replace(/^00/, '').replace(/^387/, '').replace(/^0/, '');
  return digits.length >= 6 ? digits : '';
}

// Da li je kupac (po e-mailu, telefonu ili nalogu) vec narucio? Otkazane se ne racunaju.
function hasPreviousOrder({ email, phone, customerId }) {
  const orders = db.prepare("SELECT email, phone, customer_id FROM orders WHERE status != 'otkazano'").all();
  const mail = (email || '').trim().toLowerCase();
  const tel = normalizePhone(phone);
  return orders.some(
    (o) =>
      (mail && (o.email || '').trim().toLowerCase() === mail) ||
      (tel && normalizePhone(o.phone) === tel) ||
      (customerId && o.customer_id === customerId)
  );
}

function daysSince(utc) {
  return (Date.now() - new Date(`${utc.replace(' ', 'T')}Z`).getTime()) / 86400000;
}

// Vraca null kad kupac smije koristiti kod, ili poruku zasto ne smije.
// `final` = provjera pri potvrdi narudzbe, kad e-mail i telefon sigurno postoje.
function eligibilityError(promo, { email, phone, customer, final = false }) {
  const audience = promo.audience || 'svi';
  if (audience === 'prva_narudzba') {
    if (!customer && !email && !phone && !final) {
      return 'Ovaj kod važi samo za prvu narudžbu. Prvo upišite e-mail adresu, pa primijenite kod.';
    }
    if (hasPreviousOrder({ email: email || (customer && customer.email), phone, customerId: customer && customer.id })) {
      return 'Ovaj kod važi samo za prvu narudžbu, a vi ste već naručivali kod nas (isti e-mail, telefon ili nalog).';
    }
  }
  if (audience === 'novi_korisnici') {
    const days = promo.new_customer_days || DEFAULT_NEW_CUSTOMER_DAYS;
    if (!customer) {
      return 'Ovaj kod važi samo za nove korisnike. Prijavite se ili napravite nalog, pa ga primijenite.';
    }
    if (daysSince(customer.created_at) > days) {
      return `Ovaj kod važi samo za nove korisnike (nalog napravljen u zadnjih ${days} dana), a vaš nalog je stariji.`;
    }
  }
  return null;
}

module.exports = { AUDIENCES, AUDIENCE_LABELS, DEFAULT_NEW_CUSTOMER_DAYS, eligibilityError, normalizePhone };
