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

function bold(escaped) {
  return escaped.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
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
      const escaped = bold(escapeHtml(block));
      return `<p>${escaped}</p>`;
    })
    .join('\n');
}

module.exports = { renderRichText };
