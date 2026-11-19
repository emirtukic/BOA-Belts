const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
const { renderEmailShell, button, itemsTable, orderTotalsTable, promoCodeBox } = require('./emailTemplate');
const { trackingInfo } = require('./carriers');
const { SITE_URL, CONTACT_EMAIL, CHAT_NUMBER } = require('./site');
const { escapeHtml: esc } = require('./format');
const NewsletterSubscriber = require('../models/NewsletterSubscriber');

// Tekstualna verzija poruke: dio spam filtera bez nje oznacava mail kao sumnjiv.
function htmlToText(html) {
  return html
    .replace(/<a [^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g, '$2: $1')
    .replace(/<(br|\/p|\/h[1-6]|\/tr|\/li|\/table)[^>]*>/g, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&middot;/g, '·')
    .replace(/&times;/g, 'x')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n\s*\n+/g, '\n\n')
    .trim();
}

function newsletterFooter(email) {
  const url = `${SITE_URL}/newsletter/odjava?email=${encodeURIComponent(email)}&token=${NewsletterSubscriber.unsubscribeToken(email)}`;
  return {
    url,
    headers: { 'List-Unsubscribe': `<${url}>`, 'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click' },
    footerHtml: `<br><br>Ovaj e-mail ste dobili jer ste prijavljeni na newsletter Boa Belts.<br><a href="${esc(url)}" style="color:#6a6a6a;">Odjavite se sa newslettera</a>`
  };
}

let transporter;
let transporterConfigured = false;

// Transporter se pravi lijeno (tek kad prvi put zatreba) da app ne puca ako
// SMTP podaci jos nisu podeseni u .env - forma tada samo javi gresku umjesto
// da obori server.
function getTransporter() {
  if (transporterConfigured) return transporter;
  transporterConfigured = true;

  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    transporter = null;
    return null;
  }

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  return transporter;
}

function isConfigured() {
  return !!getTransporter();
}

// Samo za lokalno testiranje: MAIL_PREVIEW_DIR upisuje mailove kao HTML fajlove
// umjesto slanja, da se mogu pregledati bez ikakvog slanja stvarnim ljudima.
const PREVIEW_DIR = process.env.NODE_ENV !== 'production' ? process.env.MAIL_PREVIEW_DIR : '';

function writePreview({ to, subject, html }) {
  fs.mkdirSync(PREVIEW_DIR, { recursive: true });
  const name = `${Date.now()}-${String(subject).toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 60)}.html`;
  const meta = `<!-- Za: ${esc(to)} | Naslov: ${esc(subject)} -->
`;
  fs.writeFileSync(path.join(PREVIEW_DIR, name), meta + html);
}

async function send({ to, subject, bodyHtml, preheader, replyTo, headers, footerHtml }) {
  if (PREVIEW_DIR) {
    writePreview({ to, subject, html: renderEmailShell({ preheader, bodyHtml, footerHtml }) });
    return;
  }
  const t = getTransporter();
  if (!t) {
    throw new Error('SMTP nije podešen. Dodajte SMTP_HOST, SMTP_USER i SMTP_PASS u .env fajl.');
  }
  await t.sendMail({
    from: `"Boa Belts" <${process.env.SMTP_USER}>`,
    to,
    subject,
    replyTo,
    headers,
    text: htmlToText(bodyHtml),
    html: renderEmailShell({ preheader, bodyHtml, footerHtml })
  });
}

async function sendContactEmail({ name, email, phone, message }) {
  const to = process.env.CONTACT_TO_EMAIL || CONTACT_EMAIL;
  const bodyHtml = `
    <h2 style="margin:0 0 16px; color:#111111;">Novi upit sa sajta</h2>
    <p style="margin:0 0 6px;"><strong>Ime:</strong> ${esc(name)}</p>
    <p style="margin:0 0 6px;"><strong>E-mail:</strong> <a href="mailto:${esc(email)}" style="color:#111111;">${esc(email)}</a></p>
    <p style="margin:0 0 6px;"><strong>Telefon:</strong> ${phone ? `<a href="tel:${esc(phone.replace(/[^\d+]/g, ''))}" style="color:#111111;">${esc(phone)}</a>` : '-'}</p>
    <p style="margin:16px 0 6px;"><strong>Poruka:</strong></p>
    <p style="margin:0; white-space:pre-wrap; background:#f6f2ed; border-radius:8px; padding:14px 16px;">${esc(message)}</p>
    <p style="margin:20px 0 0; font-size:13px; color:#6a6a6a;">Kliknite "Odgovori" u svom mailu - odgovor ide direktno kupcu.</p>
  `;
  // "Odgovori" u mail klijentu ide direktno kupcu, a ne nama samima.
  await send({ to, subject: `Novi upit sa sajta - ${name}`, bodyHtml, preheader: `Upit od ${name}`, replyTo: email });
}

// Obavijest vlasniku: novi nalog (registrovan / potvrdjen / preko Google-a).
const NEW_CUSTOMER_STAGES = {
  registered: {
    title: 'Nova registracija',
    note: 'Kupac je napravio nalog. Nalog postaje aktivan kad kupac potvrdi e-mail adresu.'
  },
  verified: { title: 'Kupac je potvrdio nalog', note: 'Kupac je potvrdio e-mail adresu i nalog je aktivan.' },
  google: { title: 'Nova registracija preko Google-a', note: 'Kupac je napravio nalog preko Google-a; e-mail je već potvrđen.' }
};

async function sendNewCustomerNotificationEmail(customer, stage, adminUrl) {
  const info = NEW_CUSTOMER_STAGES[stage] || NEW_CUSTOMER_STAGES.registered;
  const to = process.env.CONTACT_TO_EMAIL || CONTACT_EMAIL;
  const row = (label, value) => `<p style="margin:0 0 6px;"><strong>${label}:</strong> ${value || '-'}</p>`;
  const bodyHtml = `
    <h2 style="margin:0 0 16px; color:#111111;">${info.title}</h2>
    ${row('Ime', esc(customer.name))}
    ${row('E-mail', `<a href="mailto:${esc(customer.email)}" style="color:#111111;">${esc(customer.email)}</a>`)}
    ${row('Telefon', customer.phone ? `<a href="tel:${esc(String(customer.phone).replace(/[^\d+]/g, ''))}" style="color:#111111;">${esc(customer.phone)}</a>` : '')}
    ${row('Grad', esc(customer.city))}
    ${row('Newsletter', customer.newsletter_opt_in || customer.newsletterOptIn ? 'Da' : 'Ne')}
    <p style="margin:16px 0 0; font-size:13px; color:#6a6a6a;">${info.note}</p>
    ${adminUrl ? button('Pogledajte kupce u adminu', adminUrl) : ''}
  `;
  await send({
    to,
    subject: `${info.title} - ${customer.name}`,
    replyTo: customer.email,
    bodyHtml,
    preheader: `${info.title}: ${customer.name}, ${customer.email}`
  });
}

async function sendVerificationEmail(customer, verifyUrl) {
  const bodyHtml = `
    <h2 style="margin:0 0 16px; color:#111111;">Potvrdite svoju e-mail adresu</h2>
    <p style="margin:0 0 8px;">Zdravo ${esc(customer.name)},</p>
    <p style="margin:0;">Hvala što ste se registrovali na Boa Belts. Kliknite na dugme ispod da potvrdite svoju e-mail adresu i aktivirate nalog.</p>
    ${button('Potvrdite e-mail', verifyUrl)}
    <p style="margin:0; font-size:13px; color:#6a6a6a;">Ako niste vi tražili kreiranje naloga, slobodno ignorišite ovaj e-mail.</p>
  `;
  await send({
    to: customer.email,
    subject: 'Potvrdite svoj nalog - Boa Belts',
    bodyHtml,
    preheader: 'Samo još jedan korak do aktivacije naloga'
  });
}

async function sendWelcomeEmail(customer) {
  const bodyHtml = `
    <h2 style="margin:0 0 16px; color:#111111;">Dobrodošli, ${esc(customer.name)}!</h2>
    <p style="margin:0 0 16px;">Vaš nalog na Boa Belts je uspješno kreiran. Sada možete pratiti svoje narudžbe, čuvati podatke za dostavu i brže naručivati.</p>
    <p style="margin:0;">Hvala što ste dio naše priče i ručno rađenih kožnih dodataka iz Travnika.</p>
    ${button('Pogledajte kolekciju', `${SITE_URL}/kolekcija`)}
  `;
  await send({
    to: customer.email,
    subject: 'Dobrodošli u Boa Belts',
    bodyHtml,
    preheader: 'Vaš nalog je uspješno kreiran'
  });
}

async function sendPasswordResetEmail(customer, resetUrl) {
  const bodyHtml = `
    <h2 style="margin:0 0 16px; color:#111111;">Zaboravili ste lozinku?</h2>
    <p style="margin:0 0 8px;">Zdravo ${esc(customer.name)},</p>
    <p style="margin:0;">Kliknite na dugme ispod da postavite novu lozinku. Link vrijedi 1 sat.</p>
    ${button('Postavite novu lozinku', resetUrl)}
    <p style="margin:0; font-size:13px; color:#6a6a6a;">Ako niste vi tražili promjenu lozinke, slobodno ignorišite ovaj e-mail.</p>
  `;
  await send({
    to: customer.email,
    subject: 'Resetovanje lozinke - Boa Belts',
    bodyHtml,
    preheader: 'Postavite novu lozinku za vaš nalog'
  });
}

async function sendOrderConfirmationEmail(order) {
  const to = order.customer_email;
  if (!to) return;
  const bodyHtml = `
    <h2 style="margin:0 0 16px; color:#111111;">Hvala na narudžbi, ${esc(order.customer_name)}!</h2>
    <p style="margin:0 0 6px;">Vaša narudžba <strong>#${order.id}</strong> je uspješno primljena i uskoro krećemo u pripremu.</p>
    <p style="margin:0 0 20px; color:#4b4b4b;">Plaćanje: pouzećem prilikom preuzimanja.</p>
    ${itemsTable(order.items)}
    ${orderTotalsTable(order)}
    <p style="margin:24px 0 0; color:#4b4b4b; font-size:13px;">Dostava na: ${esc(order.address)}, ${esc(order.city)}<br>Telefon: ${esc(order.phone)}</p>
    <p style="margin:24px 0 0;">Kad pošaljemo narudžbu, javit ćemo vam e-mailom broj pošiljke. Dostava širom BiH traje 3-4 radna dana.</p>
    <p style="margin:12px 0 0;">Imate pitanje? Odgovorite na ovaj e-mail ili nam pišite na <a href="https://wa.me/${CHAT_NUMBER}" style="color:#9a7048;">WhatsApp</a>.</p>
  `;
  await send({
    to,
    subject: `Potvrda narudžbe #${order.id} - Boa Belts`,
    bodyHtml,
    preheader: `Vaša narudžba #${order.id} je primljena`
  });
}

async function sendOrderNotificationEmail(order) {
  const to = process.env.CONTACT_TO_EMAIL || CONTACT_EMAIL;
  const bodyHtml = `
    <h2 style="margin:0 0 16px; color:#111111;">Nova narudžba #${order.id}</h2>
    <p style="margin:0 0 6px;"><strong>Kupac:</strong> ${esc(order.customer_name)}</p>
    <p style="margin:0 0 6px;"><strong>E-mail:</strong> <a href="mailto:${esc(order.email)}" style="color:#111111;">${esc(order.email)}</a></p>
    <p style="margin:0 0 6px;"><strong>Telefon:</strong> <a href="tel:${esc(String(order.phone).replace(/[^\d+]/g, ''))}" style="color:#111111;">${esc(order.phone)}</a></p>
    <p style="margin:0 0 6px;"><strong>Adresa:</strong> ${esc(order.address)}, ${esc(order.city)}</p>
    ${order.notes ? `<p style="margin:0 0 6px;"><strong>Napomena:</strong> ${esc(order.notes)}</p>` : ''}
    ${itemsTable(order.items)}
    ${orderTotalsTable(order)}
    ${button('Otvorite narudžbu u adminu', `${order.adminUrl}`)}
  `;
  await send({
    to,
    subject: `Nova narudžba #${order.id} - ${order.customer_name}`,
    replyTo: order.email || undefined,
    bodyHtml,
    preheader: `Nova narudžba od ${order.customer_name}, ${order.total_km.toFixed(2)} KM`
  });
}

// Okvir sa kurirom, brojem posiljke i dugmetom za pracenje.
function trackingBlock(order) {
  const info = trackingInfo(order);
  if (!info) return '';
  const howTo = info.url && !info.isDirect ? `<p style="margin:8px 0 0; font-size:13px; color:#6a6a6a;">Na stranici kurira upišite broj pošiljke u polje za praćenje.</p>` : '';
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 20px; background:#f6f2ed; border-radius:12px;"><tr><td style="padding:16px 20px;">
      <p style="margin:0 0 4px; font-size:13px; color:#6a6a6a; text-transform:uppercase; letter-spacing:0.04em;">Praćenje pošiljke</p>
      ${info.carrier ? `<p style="margin:0 0 4px;">Kurir: <strong>${esc(info.carrier)}</strong></p>` : ''}
      <p style="margin:0;">Broj pošiljke: <strong style="font-size:16px; letter-spacing:0.03em;">${esc(info.number)}</strong></p>
      ${info.url ? button('Pratite pošiljku', esc(info.url)) : ''}
      ${howTo}
    </td></tr></table>`;
}

async function sendOrderShippedEmail(order) {
  const to = order.customer_email;
  if (!to) return;
  const bodyHtml = `
    <h2 style="margin:0 0 16px; color:#111111;">Vaša narudžba je poslana!</h2>
    <p style="margin:0 0 16px;">Zdravo ${esc(order.customer_name)}, narudžba <strong>#${order.id}</strong> je upravo poslana na adresu:</p>
    <p style="margin:0 0 20px; color:#4b4b4b;">${esc(order.address)}, ${esc(order.city)}</p>
    ${trackingBlock(order)}
    ${itemsTable(order.items)}
    <p style="margin:20px 0 0;">Hvala što ste odabrali Boa Belts. Javite nam se ako imate bilo kakvo pitanje.</p>
  `;
  await send({
    to,
    subject: `Narudžba #${order.id} je poslana - Boa Belts`,
    bodyHtml,
    preheader: `Narudžba #${order.id} je na putu ka vama`
  });
}

async function sendTrackingUpdateEmail(order) {
  const to = order.customer_email;
  if (!to || !order.tracking_number) return;
  const bodyHtml = `
    <h2 style="margin:0 0 16px; color:#111111;">Broj za praćenje vaše narudžbe</h2>
    <p style="margin:0 0 16px;">Zdravo ${esc(order.customer_name)}, evo podataka za praćenje narudžbe <strong>#${order.id}</strong>:</p>
    ${trackingBlock(order)}
    <p style="margin:0;">Javite nam se ako imate bilo kakvo pitanje.</p>
  `;
  await send({
    to,
    subject: `Praćenje narudžbe #${order.id} - Boa Belts`,
    bodyHtml,
    preheader: `Broj pošiljke: ${order.tracking_number}`
  });
}

async function sendOrderCancelledEmail(order) {
  const to = order.customer_email;
  if (!to) return;
  const bodyHtml = `
    <h2 style="margin:0 0 16px; color:#111111;">Narudžba #${order.id} je otkazana</h2>
    <p style="margin:0 0 16px;">Zdravo ${esc(order.customer_name)}, vaša narudžba <strong>#${order.id}</strong> je otkazana i neće biti poslana.</p>
    ${itemsTable(order.items)}
    <p style="margin:20px 0 0;">Ako mislite da je došlo do greške ili imate pitanje, javite nam se na <a href="mailto:${CONTACT_EMAIL}" style="color:#9a7048;">${CONTACT_EMAIL}</a>.</p>
  `;
  await send({
    to,
    subject: `Narudžba #${order.id} je otkazana - Boa Belts`,
    bodyHtml,
    preheader: `Narudžba #${order.id} je otkazana`
  });
}

async function sendNewsletterWelcomeEmail(email, promoCode) {
  const { headers, footerHtml } = newsletterFooter(email);
  const bodyHtml = `
    <h2 style="margin:0 0 16px; color:#111111;">Dobrodošli u Boa Belts porodicu!</h2>
    <p style="margin:0 0 8px;">Hvala što ste se prijavili na naš newsletter - sada ćete prvi saznati za nove kolekcije, priče iz radionice i posebne ponude.</p>
    ${button('Pogledajte kolekciju', `${SITE_URL}/kolekcija`)}
    ${promoCode ? `<p style="margin:16px 0 0;">Kao dobrodošlicu, evo promo koda koji možete iskoristiti pri narudžbi:</p>${promoCodeBox(promoCode)}<p style="margin:0; font-size:13px; color:#6a6a6a;">Kod unesite u polje "Promo kod" pri završetku narudžbe.</p>` : ''}
  `;
  await send({
    to: email,
    subject: 'Dobrodošli u Boa Belts newsletter',
    bodyHtml,
    preheader: promoCode ? 'Hvala na prijavi - evo vašeg promo koda' : 'Hvala na prijavi',
    headers,
    footerHtml
  });
}

async function sendNewsletterCampaignEmail(to, subject, bodyHtml) {
  const { headers, footerHtml } = newsletterFooter(to);
  await send({ to, subject, bodyHtml, preheader: subject, headers, footerHtml });
}

module.exports = {
  isConfigured,
  sendContactEmail,
  sendVerificationEmail,
  sendNewCustomerNotificationEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendOrderConfirmationEmail,
  sendOrderNotificationEmail,
  sendOrderShippedEmail,
  sendTrackingUpdateEmail,
  sendOrderCancelledEmail,
  sendNewsletterWelcomeEmail,
  sendNewsletterCampaignEmail
};
