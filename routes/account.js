const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');
const Order = require('../models/Order');
const requireCustomer = require('../middleware/requireCustomer');
const { LABELS } = require('../config/orderStatuses');
const { sendWelcomeEmail, sendPasswordResetEmail, sendVerificationEmail } = require('../config/mailer');
const { passport, googleConfigured } = require('../config/passport');
const { cleanText, isValidEmail } = require('../config/format');
const { subscribeWithWelcome } = require('../config/newsletter');
const { startAuthenticatedSession } = require('../config/sessionStore');
const crypto = require('crypto');

function oauthFlags() {
  return { googleConfigured };
}

router.get('/registracija', (req, res) => {
  if (req.session.customerId) return res.redirect('/nalog');
  res.render('account/register', { title: 'Registracija - Boa Belts', ...oauthFlags() });
});

router.post('/registracija', (req, res) => {
  const { password, password2 } = req.body;
  const name = cleanText(req.body.name, 120);
  const email = cleanText(req.body.email, 200);
  const phone = cleanText(req.body.phone, 40);
  const address = cleanText(req.body.address, 200);
  const city = cleanText(req.body.city, 100);

  if (!name || !email || typeof password !== 'string' || !password) {
    req.flash('error', 'Molimo popunite ime, e-mail i lozinku.');
    return res.redirect('/nalog/registracija');
  }
  if (!isValidEmail(email)) {
    req.flash('error', 'Unesite ispravnu e-mail adresu.');
    return res.redirect('/nalog/registracija');
  }
  if (password.length < 6) {
    req.flash('error', 'Lozinka mora imati najmanje 6 karaktera.');
    return res.redirect('/nalog/registracija');
  }
  if (password !== password2) {
    req.flash('error', 'Lozinke se ne podudaraju.');
    return res.redirect('/nalog/registracija');
  }
  if (Customer.findByEmail(email)) {
    req.flash('error', 'Nalog sa ovom e-mail adresom već postoji. Pokušajte se prijaviti.');
    return res.redirect('/nalog/registracija');
  }

  const customer = Customer.create({
    name,
    email,
    password,
    phone,
    address,
    city,
    newsletterOptIn: req.body.newsletter === 'on'
  });
  const verifyUrl = `${res.locals.siteUrl}/nalog/verifikacija/${customer.verificationToken}`;

  sendVerificationEmail(customer, verifyUrl).catch((err) =>
    console.error('Greška pri slanju verifikacionog e-maila:', err.message)
  );

  res.render('account/check-email', {
    title: 'Potvrdite e-mail - Boa Belts',
    email: customer.email
  });
});

router.get('/verifikacija/:token', (req, res, next) => {
  const customer = Customer.findByVerificationToken(req.params.token);
  if (!customer) {
    req.flash('error', 'Link za potvrdu e-maila je nevažeći ili je nalog već potvrđen.');
    return res.redirect('/nalog/prijava');
  }

  Customer.verifyEmail(customer.id);
  // Prijava vazi tek sad: bez potvrde bi neko mogao prijaviti tudju adresu.
  if (customer.newsletter_opt_in) subscribeWithWelcome(customer.email);
  sendWelcomeEmail(customer).catch((err) => console.error('Greška pri slanju welcome e-maila:', err.message));
  startAuthenticatedSession(req, 'customerId', customer.id, (err) => {
    if (err) return next(err);
    req.flash('success', `Dobrodošli, ${customer.name}! Vaš nalog je potvrđen.`);
    res.redirect('/nalog');
  });
});

router.get('/ponovi-verifikaciju', (req, res) => {
  res.render('account/resend-verification', { title: 'Ponovo pošalji potvrdu - Boa Belts' });
});

router.post('/ponovi-verifikaciju', async (req, res) => {
  const email = cleanText(req.body.email, 200);
  const result = Customer.regenerateVerificationToken(email);

  if (result) {
    const verifyUrl = `${res.locals.siteUrl}/nalog/verifikacija/${result.token}`;
    try {
      await sendVerificationEmail(result.customer, verifyUrl);
    } catch (err) {
      console.error('Greška pri slanju verifikacionog e-maila:', err.message);
      req.flash('error', 'Trenutno ne možemo poslati e-mail. Pokušajte kasnije.');
      return res.redirect('/nalog/ponovi-verifikaciju');
    }
  }

  req.flash('success', 'Ako nalog sa tom adresom postoji i još nije potvrđen, poslali smo novi link.');
  res.redirect('/nalog/prijava');
});

router.get('/prijava', (req, res) => {
  if (req.session.customerId) return res.redirect('/nalog');
  res.render('account/login', { title: 'Prijava - Boa Belts', ...oauthFlags() });
});

router.post('/prijava', (req, res, next) => {
  const { email, password } = req.body;
  const customer = Customer.findByEmail(email);

  if (!customer || !Customer.verifyPassword(customer, password)) {
    req.flash('error', 'Pogrešan e-mail ili lozinka.');
    return res.redirect('/nalog/prijava');
  }

  if (!customer.email_verified) {
    req.flash(
      'error',
      'Molimo prvo potvrdite svoju e-mail adresu (provjerite inbox). Niste dobili e-mail? Zatražite ponovo ispod.'
    );
    return res.redirect('/nalog/prijava');
  }

  startAuthenticatedSession(req, 'customerId', customer.id, (err) => {
    if (err) return next(err);
    req.flash('success', `Dobrodošli nazad, ${customer.name}!`);
    res.redirect('/nalog');
  });
});

router.post('/odjava', (req, res) => {
  req.session.customerId = null;
  res.redirect('/');
});

/* --- Zaboravljena lozinka --- */
router.get('/zaboravljena-lozinka', (req, res) => {
  res.render('account/forgot-password', { title: 'Zaboravljena lozinka - Boa Belts' });
});

router.post('/zaboravljena-lozinka', async (req, res) => {
  const email = cleanText(req.body.email, 200);
  const result = Customer.createResetToken(email);

  // Namjerno ista poruka postoji-li nalog ili ne, da se ne otkriva koje su
  // e-mail adrese registrovane.
  if (result) {
    const resetUrl = `${res.locals.siteUrl}/nalog/reset-lozinke/${result.token}`;
    try {
      await sendPasswordResetEmail(result.customer, resetUrl);
    } catch (err) {
      console.error('Greška pri slanju e-maila za reset lozinke:', err.message);
      req.flash('error', 'Trenutno ne možemo poslati e-mail. Pokušajte kasnije.');
      return res.redirect('/nalog/zaboravljena-lozinka');
    }
  }

  req.flash('success', 'Ako nalog sa tom e-mail adresom postoji, poslali smo link za resetovanje lozinke.');
  res.redirect('/nalog/prijava');
});

router.get('/reset-lozinke/:token', (req, res) => {
  const customer = Customer.findByResetToken(req.params.token);
  if (!customer) {
    req.flash('error', 'Link za resetovanje lozinke je nevažeći ili je istekao.');
    return res.redirect('/nalog/zaboravljena-lozinka');
  }
  res.render('account/reset-password', { title: 'Nova lozinka - Boa Belts', token: req.params.token });
});

router.post('/reset-lozinke/:token', (req, res) => {
  const customer = Customer.findByResetToken(req.params.token);
  if (!customer) {
    req.flash('error', 'Link za resetovanje lozinke je nevažeći ili je istekao.');
    return res.redirect('/nalog/zaboravljena-lozinka');
  }

  const { password, password2 } = req.body;
  if (typeof password !== 'string' || password.length < 6) {
    req.flash('error', 'Lozinka mora imati najmanje 6 karaktera.');
    return res.redirect(`/nalog/reset-lozinke/${req.params.token}`);
  }
  if (password !== password2) {
    req.flash('error', 'Lozinke se ne podudaraju.');
    return res.redirect(`/nalog/reset-lozinke/${req.params.token}`);
  }

  // Reset lozinke potvrdjuje i e-mail adresu, pa vazi i prijava sa registracije.
  if (!customer.email_verified && customer.newsletter_opt_in) subscribeWithWelcome(customer.email);
  Customer.resetPassword(customer.id, password);
  req.flash('success', 'Lozinka je uspješno promijenjena. Prijavite se.');
  res.redirect('/nalog/prijava');
});

/* --- Prijava preko Google-a --- */
function handleOAuthLogin(req, res, next, provider, profile) {
  const providerId = profile.id;
  const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
  const name = profile.displayName || (email ? email.split('@')[0] : 'Korisnik');

  let customerByProvider = Customer.findByGoogleId(providerId);
  if (!customerByProvider && !email) {
    req.flash('error', 'Vaš nalog ne dijeli e-mail adresu. Registrujte se e-mailom i lozinkom.');
    return res.redirect('/nalog/registracija');
  }

  let customer = customerByProvider;

  if (!customer && email) {
    const existing = Customer.findByEmail(email);
    if (existing) {
      // Nepotvrdjen nalog je mogao otvoriti bilo ko sa tudjom adresom: stvarni
      // vlasnik adrese preuzima nalog, a stara lozinka prestaje vaziti.
      if (!existing.email_verified) {
        Customer.resetPassword(existing.id, crypto.randomBytes(24).toString('hex'));
      }
      Customer.linkOAuthProvider(existing.id, provider, providerId);
      customer = existing;
    }
  }

  let isNew = false;
  if (!customer) {
    customer = Customer.createFromOAuth({ name, email, provider, providerId });
    isNew = true;
  }

  if (isNew) {
    sendWelcomeEmail(customer).catch((err) => console.error('Greška pri slanju welcome e-maila:', err.message));
  }
  startAuthenticatedSession(req, 'customerId', customer.id, (err) => {
    if (err) return next(err);
    req.flash('success', `Dobrodošli, ${customer.name}!`);
    res.redirect('/nalog');
  });
}

router.get('/google', (req, res, next) => {
  if (!googleConfigured) {
    req.flash('error', 'Prijava preko Google-a trenutno nije dostupna.');
    return res.redirect('/nalog/prijava');
  }
  passport.authenticate('google', { session: false, scope: ['profile', 'email'] })(req, res, next);
});

router.get('/google/callback', (req, res, next) => {
  if (!googleConfigured) return res.redirect('/nalog/prijava');
  passport.authenticate('google', { session: false }, (err, profile) => {
    if (err || !profile) {
      req.flash('error', 'Prijava preko Google-a nije uspjela.');
      return res.redirect('/nalog/prijava');
    }
    handleOAuthLogin(req, res, next, 'google', profile);
  })(req, res, next);
});

/* --- Nalog --- */
router.get('/', requireCustomer, (req, res) => {
  const customer = Customer.findById(req.session.customerId);
  const orders = Order.allByCustomer(req.session.customerId);
  res.render('account/dashboard', { title: 'Moj nalog - Boa Belts', customer, orders, statusLabels: LABELS });
});

router.get('/izmjena', requireCustomer, (req, res) => {
  const customer = Customer.findById(req.session.customerId);
  res.render('account/edit', { title: 'Izmjena podataka - Boa Belts', customer });
});

router.post('/izmjena', requireCustomer, (req, res) => {
  const { password, password2 } = req.body;
  const name = cleanText(req.body.name, 120);
  const phone = cleanText(req.body.phone, 40);
  const address = cleanText(req.body.address, 200);
  const city = cleanText(req.body.city, 100);

  if (!name) {
    req.flash('error', 'Ime je obavezno.');
    return res.redirect('/nalog/izmjena');
  }
  if (password) {
    if (typeof password !== 'string' || password.length < 6) {
      req.flash('error', 'Nova lozinka mora imati najmanje 6 karaktera.');
      return res.redirect('/nalog/izmjena');
    }
    if (password !== password2) {
      req.flash('error', 'Nove lozinke se ne podudaraju.');
      return res.redirect('/nalog/izmjena');
    }
  }

  Customer.update(req.session.customerId, { name, phone, address, city, password: password || null });
  req.flash('success', 'Podaci su ažurirani.');
  res.redirect('/nalog');
});

module.exports = router;
