const NewsletterSubscriber = require('../models/NewsletterSubscriber');
const PromoCode = require('../models/PromoCode');
const { sendNewsletterWelcomeEmail } = require('./mailer');
const { getNewsletterTexts } = require('./newsletterTexts');

// Ista prijava za formu u podnozju i za checkbox pri registraciji: novi
// pretplatnik uvijek dobija dobrodoslicu i promo kod, ako je kod jos aktivan.
function subscribeWithWelcome(email) {
  const { created } = NewsletterSubscriber.subscribe(email);
  if (!created) return { created: false, promoCode: null };

  // Admin bira kod u Newsletter > Tekstovi; prazno = dobrodoslica bez koda.
  const { welcomeCode } = getNewsletterTexts();
  const promoCheck = welcomeCode ? PromoCode.validate(welcomeCode) : { ok: false };
  const promoCode = promoCheck.ok ? promoCheck.promo.code : null;
  sendNewsletterWelcomeEmail(email, promoCode).catch((err) =>
    console.error('Greška pri slanju newsletter dobrodošlice:', err.message)
  );
  return { created: true, promoCode };
}

module.exports = { subscribeWithWelcome };
