function escapeHtml(value) {
  return String(value == null ? '' : value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Forme mogu poslati niz ili objekat umjesto teksta (npr. email[]=a), pa sve
// sto dolazi od korisnika prvo svodimo na obican string.
function cleanText(value, maxLength = 500) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
}

function isValidEmail(email) {
  return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function roundMoney(amount) {
  return Math.round((amount + Number.EPSILON) * 100) / 100;
}

const dateFormatter = new Intl.DateTimeFormat('bs-BA', {
  timeZone: 'Europe/Sarajevo',
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit'
});

// SQLite datetime('now') vraca UTC bez oznake zone; prikazujemo lokalno vrijeme.
function formatDate(value) {
  if (!value) return '-';
  const date = new Date(`${String(value).replace(' ', 'T')}Z`);
  return Number.isNaN(date.getTime()) ? String(value) : dateFormatter.format(date);
}

module.exports = { escapeHtml, cleanText, isValidEmail, roundMoney, formatDate };
