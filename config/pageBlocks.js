// Blokovi od kojih admin slaze stranicu. Sve sto dolazi iz admin forme prolazi
// kroz sanitizeBlocks: nepoznata polja se odbacuju, linkovi i slike se provjere.

const BLOCK_TYPES = {
  text: 'Tekst',
  image: 'Slika',
  gallery: 'Galerija slika',
  video: 'Video',
  products: 'Proizvodi',
  banner: 'Velika slika sa tekstom',
  imageText: 'Slika i tekst jedno pored drugog'
};

const str = (v, max = 4000) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
const oneOf = (v, list, fallback) => (list.includes(v) ? v : fallback);

// Slike i video moraju biti sa ovog sajta (upload ili postojece slike).
function mediaPath(v) {
  const s = str(v, 300);
  return /^\/(uploads|images)\/[A-Za-z0-9._\/-]+$/.test(s) && !s.includes('..') ? s : '';
}

// Link dugmeta: adresa na sajtu, web adresa, mail ili telefon.
function safeLink(v) {
  const s = str(v, 500);
  if (!s) return '';
  if (/^\/(?!\/)/.test(s) || /^https?:\/\//i.test(s) || /^(mailto|tel):/i.test(s)) return s;
  if (/^www\./i.test(s)) return `https://${s}`;
  return '';
}

function youtubeId(url) {
  const s = str(url, 500);
  const m =
    s.match(/youtu\.be\/([A-Za-z0-9_-]{11})/) ||
    s.match(/[?&]v=([A-Za-z0-9_-]{11})/) ||
    s.match(/youtube\.com\/(?:embed|shorts|live)\/([A-Za-z0-9_-]{11})/);
  return m ? m[1] : '';
}

function sanitizeBlock(raw) {
  if (!raw || typeof raw !== 'object' || !BLOCK_TYPES[raw.type]) return null;
  switch (raw.type) {
    case 'text':
      return { type: 'text', heading: str(raw.heading, 200), body: str(raw.body, 20000), align: oneOf(raw.align, ['left', 'center'], 'left') };
    case 'image':
      return {
        type: 'image',
        src: mediaPath(raw.src),
        alt: str(raw.alt, 200),
        caption: str(raw.caption, 300),
        size: oneOf(raw.size, ['normal', 'wide', 'full'], 'wide')
      };
    case 'gallery':
      return {
        type: 'gallery',
        heading: str(raw.heading, 200),
        images: (Array.isArray(raw.images) ? raw.images : []).map(mediaPath).filter(Boolean).slice(0, 80)
      };
    case 'video': {
      const source = oneOf(raw.source, ['youtube', 'file'], 'youtube');
      return {
        type: 'video',
        source,
        url: source === 'youtube' ? str(raw.url, 500) : '',
        src: source === 'file' ? mediaPath(raw.src) : '',
        caption: str(raw.caption, 300)
      };
    }
    case 'products':
      return {
        type: 'products',
        heading: str(raw.heading, 200),
        mode: oneOf(raw.mode, ['pick', 'category'], 'pick'),
        productIds: (Array.isArray(raw.productIds) ? raw.productIds : []).map(Number).filter((n) => Number.isInteger(n) && n > 0).slice(0, 48),
        category: str(raw.category, 100),
        limit: Math.min(Math.max(parseInt(raw.limit, 10) || 8, 1), 48)
      };
    case 'banner':
      return {
        type: 'banner',
        image: mediaPath(raw.image),
        eyebrow: str(raw.eyebrow, 120),
        heading: str(raw.heading, 200),
        text: str(raw.text, 1000),
        cta_text: str(raw.cta_text, 80),
        cta_link: safeLink(raw.cta_link)
      };
    case 'imageText':
      return {
        type: 'imageText',
        image: mediaPath(raw.image),
        eyebrow: str(raw.eyebrow, 120),
        heading: str(raw.heading, 200),
        text: str(raw.text, 5000),
        cta_text: str(raw.cta_text, 80),
        cta_link: safeLink(raw.cta_link),
        side: oneOf(raw.side, ['left', 'right'], 'left')
      };
    default:
      return null;
  }
}

function sanitizeBlocks(json) {
  let list = json;
  if (typeof json === 'string') {
    try {
      list = JSON.parse(json || '[]');
    } catch {
      list = [];
    }
  }
  return (Array.isArray(list) ? list : []).map(sanitizeBlock).filter(Boolean).slice(0, 60);
}

// Svi upload fajlovi koje stranica koristi (za brisanje kad vise nisu potrebni).
function uploadsUsed(blocks) {
  const files = [];
  (blocks || []).forEach((b) => {
    [b.src, b.image, ...(b.images || [])].forEach((p) => {
      if (p && p.startsWith('/uploads/')) files.push(p);
    });
  });
  return files;
}

// Proizvodi za blok "Proizvodi": izabrani redom kojim ih je admin poredao,
// ili dostupni iz jedne kategorije.
function blockProducts(block, products) {
  const available = products.filter((p) => p.available);
  if (block.mode === 'category') {
    return available.filter((p) => !block.category || p.category === block.category).slice(0, block.limit);
  }
  return block.productIds.map((id) => available.find((p) => p.id === id)).filter(Boolean);
}

module.exports = { BLOCK_TYPES, sanitizeBlocks, uploadsUsed, youtubeId, blockProducts, safeLink };
