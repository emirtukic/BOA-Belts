// Jednostavan brojac po IP adresi - stiti prijavu, forme i promo kodove od
// automatskog zasipanja. Radi jedna instanca servera, pa je memorija dovoljna.
function rateLimit({ name, windowMs, max, message, redirectTo }) {
  const hits = new Map();
  const cleanup = setInterval(() => {
    const now = Date.now();
    hits.forEach((entry, key) => {
      if (entry.resetAt <= now) hits.delete(key);
    });
  }, windowMs);
  cleanup.unref();

  return (req, res, next) => {
    // Render/Cloudflare prosljeduju pravu adresu kupca u True-Client-IP.
    const key = req.get('true-client-ip') || req.ip;
    const now = Date.now();
    let entry = hits.get(key);
    if (!entry || entry.resetAt <= now) {
      entry = { count: 0, resetAt: now + windowMs };
      hits.set(key, entry);
    }
    entry.count += 1;
    if (entry.count <= max) return next();

    console.warn(`Rate limit "${name}" dostignut za ${key}`);
    res.set('Retry-After', String(Math.ceil((entry.resetAt - now) / 1000)));
    const wantsJson = req.xhr || (req.headers.accept || '').includes('json');
    if (wantsJson) return res.status(429).json({ ok: false, error: message });
    req.flash('error', message);
    res.redirect(303, redirectTo || req.path);
  };
}

module.exports = rateLimit;
