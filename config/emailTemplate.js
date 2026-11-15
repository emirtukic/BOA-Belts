const { itemOptions } = require('./waist');
const path = require('path');
const fs = require('fs');
const { SITE_URL, SITE_NAME, CONTACT_EMAIL, PHONES, CHAT_NUMBER } = require('./site');
const { escapeHtml: esc } = require('./format');

const LOGO_PATH = path.join(__dirname, '..', 'public', 'images', 'logo', 'boa-logo.png');

// Gmail ne prikazuje slike ugradjene kao data URI, zato je na pravoj domeni
// logo obican https link. Data URI ostaje samo za lokalni razvoj, jer mail
// klijent ne moze dohvatiti sliku sa localhost-a.
const LOGO_SRC = SITE_URL.startsWith('https://')
  ? `${SITE_URL}/images/logo/boa-logo.png`
  : `data:image/png;base64,${fs.readFileSync(LOGO_PATH).toString('base64')}`;
const SITE_HOST = SITE_URL.replace(/^https?:\/\//, '');

// Email klijenti ne podrzavaju eksterni CSS/flexbox - koristimo tabele i
// inline stilove radi maksimalne kompatibilnosti (Gmail, Outlook, itd).
function renderEmailShell({ preheader = '', bodyHtml, footerHtml = '' }) {
  return `<!DOCTYPE html>
<html lang="bs">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Boa Belts</title>
</head>
<body style="margin:0; padding:0; background:#ffffff; font-family:Arial, Helvetica, sans-serif;">
  <div style="display:none; max-height:0; overflow:hidden; opacity:0;">${esc(preheader)}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff; padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; max-width:600px; width:100%; border-radius:14px; overflow:hidden; border:1px solid #ececec;">
          <tr>
            <td style="background:#ffffff; padding:24px 40px; text-align:center; border-bottom:1px solid #ececec;">
              <img src="${LOGO_SRC}" alt="Boa Belts" height="44" style="height:44px; width:auto; border:0; color:#111111;">
              <div style="margin-top:8px; font-size:12px; font-weight:bold; letter-spacing:0.3em; color:#111111;">BOA BELTS</div>
            </td>
          </tr>
          <tr>
            <td style="padding:40px; color:#1f1f1f; font-size:15px; line-height:1.65;">
              ${bodyHtml}
            </td>
          </tr>
          <tr>
            <td style="background:#ffffff; padding:24px 40px; text-align:center; color:#6a6a6a; font-size:12px; border-top:1px solid #ececec;">
              <strong style="color:#1f1f1f;">${SITE_NAME}</strong><br>
              Travnik, Bosna i Hercegovina<br>
              <a href="mailto:${CONTACT_EMAIL}" style="color:#9a7048; text-decoration:none;">${CONTACT_EMAIL}</a>
              &nbsp;&middot;&nbsp; <span style="white-space:nowrap;">${PHONES[0]}</span><br>
              <a href="https://wa.me/${CHAT_NUMBER}" style="color:#9a7048; text-decoration:none;">Pišite nam na WhatsApp</a>
              ${SITE_HOST && SITE_URL.startsWith('https://') ? `<br><a href="${SITE_URL}" style="color:#9a7048; text-decoration:none;">${SITE_HOST}</a>` : ''}
              ${footerHtml}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// Rich-text editor (Quill) produce cist HTML sa golim h1/h2/h3/p/strong/img
// tagovima, bez inline stilova. Email klijenti ignorisu <style> blokove
// (narocito Outlook), pa svakom tagu rucno ubacujemo inline style da
// newsletter izgleda skladno sa ostatkom brenda i da slike ne "pobjegnu"
// izvan okvira na uskim ekranima.
function styleRichEmailHtml(html) {
  if (!html) return '';
  return html
    .replace(/<h1(?![^>]*style=)/g, '<h1 style="font-size:26px; color:#111111; margin:0 0 16px;"')
    .replace(/<h2(?![^>]*style=)/g, '<h2 style="font-size:22px; color:#111111; margin:20px 0 12px;"')
    .replace(/<h3(?![^>]*style=)/g, '<h3 style="font-size:18px; color:#111111; margin:18px 0 10px;"')
    .replace(/<p(?![^>]*style=)/g, '<p style="margin:0 0 14px; font-size:15px; line-height:1.65; color:#1f1f1f;"')
    .replace(/<a (?![^>]*style=)/g, '<a style="color:#9a7048; text-decoration:underline;" ')
    .replace(
      /<img /g,
      '<img style="max-width:100%; height:auto; border-radius:8px; margin:12px 0; display:block;" '
    )
    .replace(/<ul(?![^>]*style=)/g, '<ul style="margin:0 0 14px; padding-left:22px; font-size:15px; color:#1f1f1f;"')
    .replace(/<ol(?![^>]*style=)/g, '<ol style="margin:0 0 14px; padding-left:22px; font-size:15px; color:#1f1f1f;"')
    .replace(/<li(?![^>]*style=)/g, '<li style="margin-bottom:6px;"');
}

function promoCodeBox(code) {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px 0; width:100%;">
    <tr><td style="background:#ffffff; border:2px dashed #9a7048; border-radius:10px; padding:18px; text-align:center;">
      <div style="font-size:12px; text-transform:uppercase; letter-spacing:0.08em; color:#6a6a6a; margin-bottom:6px;">Vaš promo kod</div>
      <div style="font-size:24px; font-weight:bold; letter-spacing:0.05em; color:#111111;">${esc(code)}</div>
    </td></tr>
  </table>`;
}

function button(label, url) {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:28px 0;"><tr><td style="background:#111111; border-radius:999px;">
    <a href="${url}" style="display:inline-block; padding:14px 30px; color:#ffffff; font-weight:bold; font-size:14px; text-decoration:none; letter-spacing:0.02em; text-transform:uppercase;">${label}</a>
  </td></tr></table>`;
}

function itemsTable(items) {
  const rows = items
    .map(
      (item) => `
      <tr>
        <td style="padding:10px 0; border-bottom:1px solid #ececec; font-size:14px;">
          ${esc(item.name)} &times; ${item.qty}${itemOptions(item).length ? `<br><span style="font-size:13px; color:#6a6a6a;">${itemOptions(item).map(esc).join('<br>')}</span>` : ''}
        </td>
        <td style="padding:10px 0 10px 16px; border-bottom:1px solid #ececec; font-size:14px; text-align:right; white-space:nowrap; vertical-align:top;">
          ${(item.priceKm * item.qty).toFixed(2)} KM
        </td>
      </tr>`
    )
    .join('');
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0;">${rows}</table>`;
}

function orderTotalsTable(order) {
  const subtotal = order.items.reduce((sum, item) => sum + item.priceKm * item.qty, 0);
  const rows = [
    `<tr>
      <td style="padding:4px 0; font-size:14px;">Međuzbir</td>
      <td style="padding:4px 0; font-size:14px; text-align:right;">${subtotal.toFixed(2)} KM</td>
    </tr>`
  ];
  if (order.discount_km) {
    rows.push(`<tr>
      <td style="padding:4px 0; font-size:14px;">Popust${order.promo_code ? ` (${esc(order.promo_code)})` : ''}</td>
      <td style="padding:4px 0; font-size:14px; text-align:right; color:#8a2b2b;">-${order.discount_km.toFixed(2)} KM</td>
    </tr>`);
  }
  if (order.gift_wrap_price_km) {
    rows.push(`<tr>
      <td style="padding:4px 0; font-size:14px;">Poklon pakovanje</td>
      <td style="padding:4px 0; font-size:14px; text-align:right;">${order.gift_wrap_price_km.toFixed(2)} KM</td>
    </tr>`);
  }
  if (order.shipping_km) {
    rows.push(`<tr>
      <td style="padding:4px 0; font-size:14px;">Poštarina</td>
      <td style="padding:4px 0; font-size:14px; text-align:right;">${order.shipping_km.toFixed(2)} KM</td>
    </tr>`);
  }
  rows.push(`<tr>
    <td style="font-size:17px; font-weight:bold; padding-top:8px;">Ukupno</td>
    <td style="font-size:17px; font-weight:bold; text-align:right; padding-top:8px;">${order.total_km.toFixed(2)} KM</td>
  </tr>`);
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:8px;">${rows.join('')}</table>`;
}

module.exports = { renderEmailShell, button, itemsTable, orderTotalsTable, promoCodeBox, styleRichEmailHtml };
