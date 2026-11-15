// Pretvara naziv u dio URL-a: "Ženski kaiš Nora" -> "zenski-kais-nora".
const MAP = { č: 'c', ć: 'c', đ: 'dj', š: 's', ž: 'z', Č: 'c', Ć: 'c', Đ: 'dj', Š: 's', Ž: 'z' };

function slugify(name) {
  return String(name || '')
    .split('')
    .map((ch) => MAP[ch] || ch)
    .join('')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

module.exports = { slugify };
