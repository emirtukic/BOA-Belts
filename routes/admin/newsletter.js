const express = require('express');
const router = express.Router();
const NewsletterSubscriber = require('../../models/NewsletterSubscriber');
const { styleRichEmailHtml } = require('../../config/emailTemplate');
const { sendNewsletterCampaignEmail } = require('../../config/mailer');
const { upload, processUploadedImages } = require('../../middleware/upload');
const PromoCode = require('../../models/PromoCode');
const { getNewsletterTexts, saveNewsletterTexts, NEWSLETTER_DEFAULTS } = require('../../config/newsletterTexts');
const { cleanText } = require('../../config/format');

router.get('/', (req, res) => {
  const subscribers = NewsletterSubscriber.all();
  const recipients = NewsletterSubscriber.allRecipientEmails();
  res.render('admin/newsletter/index', {
    title: 'Newsletter - Admin',
    subscribers,
    recipientCount: recipients.length,
    texts: getNewsletterTexts(),
    defaults: NEWSLETTER_DEFAULTS,
    promoCodes: PromoCode.all()
  });
});

router.post('/tekstovi', (req, res) => {
  const welcomeCode = cleanText(req.body.welcomeCode, 50).toUpperCase();
  if (welcomeCode && !PromoCode.findByCode(welcomeCode)) {
    req.flash('error', 'Izabrani promo kod ne postoji.');
    return res.redirect('/admin/newsletter');
  }
  saveNewsletterTexts({
    heading: cleanText(req.body.heading, 120),
    text: cleanText(req.body.text, 400),
    registerLabel: cleanText(req.body.registerLabel, 200),
    welcomeCode
  });
  req.flash('success', 'Tekstovi newslettera su sačuvani.');
  res.redirect('/admin/newsletter');
});

// Editor (Quill) poziva ovo ajax-om kad admin ubaci sliku u tekst - vraca
// APSOLUTNI url (mail klijenti ne mogu ucitati relativnu putanju).
router.post('/slika', upload.array('image', 1), processUploadedImages, (req, res) => {
  if (!req.uploadedImages.length) {
    return res.status(400).json({ error: 'Slika nije primljena.' });
  }
  res.json({ url: `${res.locals.siteUrl}/uploads/${req.uploadedImages[0]}` });
});

router.post('/posalji', async (req, res) => {
  const subject = (req.body.subject || '').trim();
  const bodyHtml = (req.body.body_html || '').trim();

  if (!subject || !bodyHtml || bodyHtml === '<p><br></p>') {
    req.flash('error', 'Naslov i tekst su obavezni.');
    return res.redirect('/admin/newsletter');
  }

  const recipients = NewsletterSubscriber.allRecipientEmails();
  if (recipients.length === 0) {
    req.flash('error', 'Trenutno nema nijednog primaoca (niko nije prijavljen na newsletter).');
    return res.redirect('/admin/newsletter');
  }

  const styledHtml = styleRichEmailHtml(bodyHtml);
  let sent = 0;
  let failed = 0;
  for (const email of recipients) {
    try {
      await sendNewsletterCampaignEmail(email, subject, styledHtml);
      sent += 1;
    } catch (err) {
      failed += 1;
      console.error(`Greška pri slanju newslettera na ${email}:`, err.message);
    }
  }

  if (failed === 0) {
    req.flash('success', `Newsletter je poslan na ${sent} adresa.`);
  } else {
    req.flash('error', `Poslano na ${sent} adresa, ${failed} nije uspjelo (provjeri konzolu za detalje).`);
  }
  res.redirect('/admin/newsletter');
});

router.delete('/:id', (req, res) => {
  NewsletterSubscriber.delete(req.params.id);
  req.flash('success', 'Pretplatnik je obrisan.');
  res.redirect('/admin/newsletter');
});

module.exports = router;
