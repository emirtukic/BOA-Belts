// Lagani "markdown-lite" konvertor za tekst koji admin unosi kroz obicnu
// textareu: prazan red = novi pasus, red koji pocinje sa "## " postaje h3,
// blok u kojem svaki red pocinje sa "- " postaje lista,
// **tekst** postaje podebljano. Tekst se prvo HTML-escape-uje pa se tek onda
// primjenjuje ova ogranicena sintaksa, tako da admin ne moze slucajno (ili
// namjerno) ubaciti proizvoljan HTML/skriptu.
function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// [tekst](adresa) postaje link. Dozvoljene su samo adrese na sajtu (/...),
// web adrese, mail i telefon; vanjske se otvaraju u novoj kartici.
function links(escaped) {
  return escaped.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (match, label, url) => {
    const href = url.replace(/&amp;/g, '&');
    if (/^\/(?!\/)/.test(href) || /^(mailto|tel):/i.test(href)) return `<a href="${url}">${label}</a>`;
    if (/^https?:\/\//i.test(href)) return `<a href="${url}" target="_blank" rel="noopener">${label}</a>`;
    return match;
  });
}

function bold(escaped) {
  return links(escaped.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>'));
}

function renderRichText(text) {
  if (!text) return '';
  const blocks = text
    .split(/\n\s*\n/)
    .map((b) => b.trim())
    .filter(Boolean);

  return blocks
    .map((block) => {
      if (block.startsWith('## ')) {
        return `<h3>${escapeHtml(block.slice(3).trim())}</h3>`;
      }
      const lines = block.split('\n').map((l) => l.trim());
      if (lines.every((l) => l.startsWith('- '))) {
        const items = lines.map((l) => `<li>${bold(escapeHtml(l.slice(2).trim()))}</li>`);
        return `<ul>${items.join('')}</ul>`;
      }
      const escaped = lines.map((l) => bold(escapeHtml(l))).join('<br>');
      return `<p>${escaped}</p>`;
    })
    .join('\n');
}

module.exports = { renderRichText };
