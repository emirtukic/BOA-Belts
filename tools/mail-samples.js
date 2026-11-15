// Pravi primjer svakog maila koji webshop salje, bez slanja: mailovi se
// upisuju kao HTML u MAIL_PREVIEW_DIR. Pokreni s privremenim DATA_DIR-om:
//   DATA_DIR=<privremeni> MAIL_PREVIEW_DIR=<folder> APP_URL=https://www.boabelts.com node tools/mail-samples.js
if (!process.env.MAIL_PREVIEW_DIR || !process.env.DATA_DIR) {
  console.error('Postavi MAIL_PREVIEW_DIR i DATA_DIR (privremeni folder), da se ne salju pravi mailovi.');
  process.exit(1);
}
process.env.SMTP_HOST = '';
process.env.SMTP_USER = '';
process.env.SMTP_PASS = '';

const mailer = require('../config/mailer');
const site = process.env.APP_URL || 'http://localhost:3000';

const customer = { name: 'Amra Hodžić', email: 'kupac@example.com' };
const order = {
  id: 27,
  customer_name: 'Amra Hodžić',
  customer_email: 'kupac@example.com',
  email: 'kupac@example.com',
  phone: '061 234 567',
  address: 'Bosanska 12',
  city: 'Travnik',
  notes: 'Molim da kurir pozove prije dostave.',
  items: [
    { name: 'Ruby belt', qty: 1, size: '82', detailColor: 'Zlatna', priceKm: 100 },
    { name: 'Maya bag', qty: 1, color: 'smeđa', priceKm: 180 }
  ],
  shipping_km: 10,
  discount_km: 0,
  total_km: 290,
  tracking_carrier: 'bh-posta',
  tracking_number: 'RR123456789BA',
  adminUrl: `${site}/admin/narudzbe/27`
};

async function main() {
  await mailer.sendContactEmail({ name: 'Amra Hodžić', email: 'kupac@example.com', phone: '061 234 567', message: 'Zdravo,\nda li Ruby belt može i u crnoj boji?' });
  await mailer.sendVerificationEmail(customer, `${site}/nalog/verifikacija/primjer`);
  await mailer.sendWelcomeEmail(customer);
  await mailer.sendPasswordResetEmail(customer, `${site}/nalog/nova-lozinka/primjer`);
  await mailer.sendOrderConfirmationEmail(order);
  await mailer.sendOrderNotificationEmail(order);
  await mailer.sendOrderShippedEmail(order);
  await mailer.sendTrackingUpdateEmail(order);
  await mailer.sendOrderCancelledEmail(order);
  await mailer.sendNewsletterWelcomeEmail('kupac@example.com', '');
  await mailer.sendNewsletterCampaignEmail(
    'kupac@example.com',
    'Nova kolekcija kaiševa',
    '<h2>Nova kolekcija je stigla</h2><p>Pogledajte nove modele kaiševa iz naše radionice.</p>'
  );
  console.log('Primjeri mailova su u', process.env.MAIL_PREVIEW_DIR);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
