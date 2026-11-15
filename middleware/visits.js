// Brojanje posjeta bez kolacica i bez cuvanja IP adrese, po uzoru na Plausible:
// posjetilac = hash(dnevna nasumicna sol + IP + preglednik). Sol se mijenja svaki
// dan i stara se brise, pa se ista osoba ne moze pratiti iz dana u dan, a IP se
// iz hash-a ne moze vratiti.
const crypto = require('crypto');
const db = require('../config/db');
const { localDay } = require('../config/stats');

const BOT = /bot|crawl|spider|slurp|preview|facebookexternalhit|embedly|headless|lighthouse|pingdom|uptime|monitor|curl|wget|python|java\/|go-http|axios|node-fetch|httpclient|scrapy/i;
const SKIP_PATH = /^\/(admin|api|uploads|newsletter|healthz|korpa\/(dodaj|\d))/;

let salt = null;
function dailySalt(day) {
  if (salt && salt.day === day) return salt.value;
  const stored = db.prepare("SELECT value FROM settings WHERE key = 'visit_salt'").get();
  let parsed = null;
  try {
    parsed = stored ? JSON.parse(stored.value) : null;
  } catch (e) {
    parsed = null;
  }
  if (!parsed || parsed.day !== day) {
    parsed = { day, value: crypto.randomBytes(16).toString('hex') };
    db.prepare("INSERT INTO settings (key, value) VALUES ('visit_salt', ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value").run(
      JSON.stringify(parsed)
    );
  }
  salt = parsed;
  return parsed.value;
}

// Odakle je posjetilac dosao: Google, Instagram, Facebook, drugi sajt ili direktno.
function sourceOf(req, ownHost) {
  const utm = typeof req.query.utm_source === 'string' ? req.query.utm_source.toLowerCase() : '';
  let host = '';
  try {
    host = new URL(req.get('referer') || '').hostname.replace(/^www\./, '');
  } catch (e) {
    host = '';
  }
  const value = utm || host;
  if (!value || host === ownHost) return utm ? utm.slice(0, 40) : 'Direktno';
  if (/google\./.test(value) || value === 'google') return 'Google';
  if (/instagram/.test(value) || value === 'ig') return 'Instagram';
  if (/facebook|^fb$|fb\.com|fb\.me/.test(value)) return 'Facebook';
  if (/bing\./.test(value)) return 'Bing';
  if (/tiktok/.test(value)) return 'TikTok';
  if (/whatsapp|wa\.me/.test(value)) return 'WhatsApp';
  if (/viber/.test(value)) return 'Viber';
  return value.slice(0, 60);
}

function deviceOf(userAgent) {
  if (/ipad|tablet/i.test(userAgent)) return 'Tablet';
  if (/mobi|android|iphone/i.test(userAgent)) return 'Mobitel';
  return 'Računar';
}

const insert = () =>
  db.prepare('INSERT INTO page_views (day, path, visitor, source, device) VALUES (?, ?, ?, ?, ?)');

function trackVisits(req, res, next) {
  const userAgent = req.get('user-agent') || '';
  if (req.method !== 'GET' || SKIP_PATH.test(req.path) || !userAgent || BOT.test(userAgent) || req.session.adminId) {
    return next();
  }
  res.on('finish', () => {
    try {
      if (res.statusCode !== 200 || !/text\/html/.test(res.get('content-type') || '')) return;
      const day = localDay(new Date().toISOString().slice(0, 19).replace('T', ' '));
      const ip = req.get('true-client-ip') || req.ip || '';
      const visitor = crypto
        .createHash('sha256')
        .update(`${dailySalt(day)}|${ip}|${userAgent}`)
        .digest('hex')
        .slice(0, 16);
      insert().run(day, req.path.slice(0, 200), visitor, sourceOf(req, req.hostname.replace(/^www\./, '')), deviceOf(userAgent));
    } catch (err) {
      console.error('Greška pri brojanju posjete:', err.message);
    }
  });
  next();
}

module.exports = { trackVisits, sourceOf, deviceOf };
