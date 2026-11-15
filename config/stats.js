// Statistika za admin: sve se racuna po lokalnom datumu (Sarajevo), a otkazane
// narudzbe se ne racunaju u prihod ni prodaju.
const db = require('./db');
const { swatchFor } = require('./colors');
const { LABELS: STATUS_LABELS, STATUSES } = require('./orderStatuses');

const TZ = 'Europe/Sarajevo';
const MONTHS = ['jan', 'feb', 'mar', 'apr', 'maj', 'jun', 'jul', 'avg', 'sep', 'okt', 'nov', 'dec'];
const MONTHS_LONG = ['januar', 'februar', 'mart', 'april', 'maj', 'juni', 'juli', 'august', 'septembar', 'oktobar', 'novembar', 'decembar'];

const dayFormat = new Intl.DateTimeFormat('en-CA', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit' });

// "2026-11-12 22:30:00" (UTC iz baze) -> "2026-11-12" ili "2026-11-13" po Sarajevu.
function localDay(utc) {
  return dayFormat.format(new Date(`${utc.replace(' ', 'T')}Z`));
}

function today() {
  return dayFormat.format(new Date());
}

function parseDay(day) {
  const [y, m, d] = day.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

function formatDay(date) {
  return date.toISOString().slice(0, 10);
}

function addDays(day, n) {
  const date = parseDay(day);
  date.setUTCDate(date.getUTCDate() + n);
  return formatDay(date);
}

function daysBetween(from, to) {
  return Math.round((parseDay(to) - parseDay(from)) / 86400000) + 1;
}

function isDay(value) {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(parseDay(value).getTime());
}

function humanDay(day) {
  const [y, m, d] = day.split('-');
  return `${Number(d)}.${Number(m)}.${y}.`;
}

const PRESETS = [
  { id: '7d', label: 'Zadnjih 7 dana' },
  { id: '30d', label: 'Zadnjih 30 dana' },
  { id: '90d', label: 'Zadnjih 90 dana' },
  { id: 'mjesec', label: 'Ovaj mjesec' },
  { id: 'prosli-mjesec', label: 'Prošli mjesec' },
  { id: 'godina', label: 'Ova godina' },
  { id: 'prosla-godina', label: 'Prošla godina' },
  { id: 'sve', label: 'Sve vrijeme' }
];

function earliestDay() {
  const rows = [
    db.prepare('SELECT MIN(created_at) AS d FROM orders').get().d,
    db.prepare('SELECT MIN(created_at) AS d FROM customers').get().d,
    db.prepare('SELECT MIN(subscribed_at) AS d FROM newsletter_subscribers').get().d
  ].filter(Boolean);
  return rows.length ? rows.map(localDay).sort()[0] : today();
}

// Pretvara upit (?period=30d ili ?period=custom&od=..&do=..) u tacan raspon.
function resolveRange(query) {
  const now = today();
  const [y, m] = now.split('-').map(Number);
  const monthStart = (year, month) => formatDay(new Date(Date.UTC(year, month - 1, 1)));
  let period = PRESETS.some((p) => p.id === query.period) || query.period === 'custom' ? query.period : '30d';
  let from;
  let to = now;

  if (period === 'custom') {
    if (isDay(query.od) && isDay(query.do)) {
      [from, to] = [query.od, query.do].sort();
    } else {
      period = '30d';
    }
  }
  switch (period) {
    case '7d':
      from = addDays(now, -6);
      break;
    case '30d':
      from = addDays(now, -29);
      break;
    case '90d':
      from = addDays(now, -89);
      break;
    case 'mjesec':
      from = monthStart(y, m);
      break;
    case 'prosli-mjesec':
      from = monthStart(m === 1 ? y - 1 : y, m === 1 ? 12 : m - 1);
      to = addDays(monthStart(y, m), -1);
      break;
    case 'godina':
      from = `${y}-01-01`;
      break;
    case 'prosla-godina':
      from = `${y - 1}-01-01`;
      to = `${y - 1}-12-31`;
      break;
    case 'sve':
      from = earliestDay();
      if (from > to) from = to;
      break;
    default:
      break;
  }

  const length = daysBetween(from, to);
  const preset = PRESETS.find((p) => p.id === period);
  return {
    period,
    from,
    to,
    length,
    label: preset ? preset.label : `${humanDay(from)} - ${humanDay(to)}`,
    rangeText: from === to ? humanDay(from) : `${humanDay(from)} - ${humanDay(to)}`,
    // Prethodni period iste duzine, za poredjenje (za "Sve vrijeme" ga nema).
    previous: period === 'sve' ? null : { from: addDays(from, -length), to: addDays(from, -1) }
  };
}

function loadData() {
  const orders = db
    .prepare('SELECT id, created_at, status, total_km, discount_km, shipping_km, gift_wrap, promo_code, city, email, customer_id, items FROM orders')
    .all()
    .map((o) => ({ ...o, day: localDay(o.created_at), items: JSON.parse(o.items) }));
  const customers = db.prepare('SELECT id, created_at FROM customers').all().map((c) => ({ day: localDay(c.created_at) }));
  const subscribers = db
    .prepare('SELECT subscribed_at FROM newsletter_subscribers')
    .all()
    .map((s) => ({ day: localDay(s.subscribed_at) }));
  const products = db.prepare('SELECT id, name, slug, category, color_hex FROM products').all();
  const categories = db.prepare('SELECT slug, name FROM categories').all();
  return { orders, customers, subscribers, products, categories };
}

const round2 = (n) => Math.round(n * 100) / 100;
const inRange = (day, range) => day >= range.from && day <= range.to;

function summarize(data, range) {
  const all = data.orders.filter((o) => inRange(o.day, range));
  const valid = all.filter((o) => o.status !== 'otkazano');
  const revenue = round2(valid.reduce((sum, o) => sum + o.total_km, 0));
  const units = valid.reduce((sum, o) => sum + o.items.reduce((s, i) => s + i.qty, 0), 0);
  return {
    revenue,
    orders: valid.length,
    averageOrder: valid.length ? round2(revenue / valid.length) : 0,
    units,
    cancelled: all.length - valid.length,
    newCustomers: data.customers.filter((c) => inRange(c.day, range)).length,
    newSubscribers: data.subscribers.filter((s) => inRange(s.day, range)).length
  };
}

// Promjena u odnosu na prethodni period; null kad nema s cim porediti.
function change(current, previous) {
  if (previous === undefined || previous === null) return null;
  if (previous === 0) return current === 0 ? { percent: 0, direction: 'flat' } : { percent: null, direction: 'up' };
  const percent = Math.round(((current - previous) / previous) * 100);
  return { percent: Math.abs(percent), direction: percent > 0 ? 'up' : percent < 0 ? 'down' : 'flat' };
}

// Grupe po danu (do ~2 mjeseca) ili po mjesecu.
function buckets(range) {
  const list = [];
  if (range.length <= 62) {
    for (let day = range.from; day <= range.to; day = addDays(day, 1)) {
      const [y, m, d] = day.split('-').map(Number);
      list.push({ key: day, short: `${d}.${m}.`, long: `${d}. ${MONTHS_LONG[m - 1]} ${y}.` });
    }
    return { unit: 'day', list, keyOf: (day) => day };
  }
  let [y, m] = range.from.split('-').map(Number);
  const [endY, endM] = range.to.split('-').map(Number);
  while (y < endY || (y === endY && m <= endM)) {
    const key = `${y}-${String(m).padStart(2, '0')}`;
    list.push({ key, short: `${MONTHS[m - 1]} ${String(y).slice(2)}`, long: `${MONTHS_LONG[m - 1]} ${y}.` });
    m += 1;
    if (m > 12) {
      m = 1;
      y += 1;
    }
  }
  return { unit: 'month', list, keyOf: (day) => day.slice(0, 7) };
}

function series(bucketInfo, rows, valueOf) {
  const totals = Object.fromEntries(bucketInfo.list.map((b) => [b.key, 0]));
  rows.forEach((row) => {
    const key = bucketInfo.keyOf(row.day);
    if (key in totals) totals[key] += valueOf(row);
  });
  return bucketInfo.list.map((b) => ({ ...b, value: round2(totals[b.key]) }));
}

// Okrugle oznake na osi: 0 i 3-5 jednakih koraka (1, 2, 2.5 ili 5 x 10^n).
// Brojevi komada (integer) nikad nemaju korak manji od 1 ni korak 2.5.
function niceTicks(max, integer = false) {
  if (max <= 0) return [0, 1];
  const rough = max / 4;
  const power = 10 ** Math.floor(Math.log10(rough));
  const factors = integer ? [1, 2, 5, 10] : [1, 2, 2.5, 5, 10];
  let step = factors.map((f) => f * power).find((s) => s >= rough);
  if (integer) step = Math.max(1, Math.round(step));
  const top = Math.ceil(max / step) * step;
  const ticks = [];
  for (let v = 0; v <= top + step / 2; v += step) ticks.push(round2(v));
  return ticks;
}

function rankBy(map, limit) {
  const rows = Object.values(map).sort((a, b) => b.units - a.units || b.revenue - a.revenue);
  return limit ? rows.slice(0, limit) : rows;
}

// Posjetioci = zbir jedinstvenih posjetilaca po danu (hash se mijenja svaki dan).
function visitStats(range, products, orderCount, bucketInfo) {
  const between = 'day BETWEEN ? AND ?';
  const params = [range.from, range.to];
  const visitorsOn = (from, to) =>
    db.prepare(`SELECT COUNT(*) AS c FROM (SELECT DISTINCT day, visitor FROM page_views WHERE ${between})`).get(from, to).c;
  const visitors = visitorsOn(...params);
  const previousVisitors = range.previous ? visitorsOn(range.previous.from, range.previous.to) : null;
  const pageViews = db.prepare(`SELECT COUNT(*) AS c FROM page_views WHERE ${between}`).get(...params).c;
  const perDay = db
    .prepare(`SELECT day, COUNT(DISTINCT visitor) AS v FROM page_views WHERE ${between} GROUP BY day`)
    .all(...params);
  const productName = Object.fromEntries(products.map((p) => [`/kolekcija/${p.slug}`, p.name]));
  const PAGE_NAMES = {
    '/': 'Početna',
    '/kolekcija': 'Kolekcija',
    '/o-nama': 'O nama',
    '/program-lojalnosti': 'Program lojalnosti',
    '/bh-fashion-week': 'BH Fashion Week',
    '/kontakt': 'Kontakt',
    '/korpa': 'Korpa',
    '/narudzba': 'Narudžba (podaci za dostavu)',
    '/nalog/prijava': 'Prijava na nalog',
    '/nalog/registracija': 'Registracija',
    '/uslovi-koristenja': 'Uslovi korištenja',
    '/politika-privatnosti': 'Politika privatnosti'
  };
  const pageLabel = (p) =>
    PAGE_NAMES[p] || productName[p] || (p.startsWith('/narudzba/potvrda/') ? 'Potvrda narudžbe' : p);
  const pages = db
    .prepare(
      `SELECT path, COUNT(*) AS views, COUNT(DISTINCT day || visitor) AS visitors FROM page_views WHERE ${between}
       GROUP BY path ORDER BY views DESC LIMIT 10`
    )
    .all(...params)
    .map((r) => ({ name: pageLabel(r.path), path: r.path, units: r.views, visitors: r.visitors }));
  const groupBy = (column) =>
    db
      .prepare(
        `SELECT ${column} AS name, COUNT(DISTINCT day || visitor) AS units FROM page_views WHERE ${between}
         GROUP BY ${column} ORDER BY units DESC LIMIT 10`
      )
      .all(...params);
  const first = db.prepare('SELECT MIN(day) AS d FROM page_views').get().d;
  return {
    visitors,
    pageViews,
    previousVisitors,
    delta: previousVisitors === null ? null : change(visitors, previousVisitors),
    conversion: visitors ? Math.round((orderCount / visitors) * 1000) / 10 : null,
    pagesPerVisitor: visitors ? Math.round((pageViews / visitors) * 10) / 10 : null,
    since: first,
    series: series(bucketInfo, perDay.map((r) => ({ day: r.day, v: r.v })), (r) => r.v),
    pages,
    sources: groupBy('source'),
    devices: groupBy('device')
  };
}

function computeStats(query) {
  const range = resolveRange(query || {});
  const data = loadData();
  const current = summarize(data, range);
  const previous = range.previous ? summarize(data, range.previous) : null;
  const deltas = {};
  Object.keys(current).forEach((key) => {
    deltas[key] = previous ? change(current[key], previous[key]) : null;
  });

  const ordersInRange = data.orders.filter((o) => inRange(o.day, range));
  const valid = ordersInRange.filter((o) => o.status !== 'otkazano');
  const productById = Object.fromEntries(data.products.map((p) => [p.id, p]));
  const categoryName = Object.fromEntries(data.categories.map((c) => [c.slug, c.name]));

  const byProduct = {};
  const bySize = {};
  const byColor = {};
  const byDetailColor = {};
  const byCategory = {};
  valid.forEach((order) => {
    order.items.forEach((item) => {
      const lineRevenue = item.qty * (item.priceKm || 0);
      const product = productById[item.productId];
      const add = (map, key, extra) => {
        if (!map[key]) map[key] = { units: 0, revenue: 0, ...extra };
        map[key].units += item.qty;
        map[key].revenue = round2(map[key].revenue + lineRevenue);
      };
      add(byProduct, item.productId, { id: product ? product.id : null, name: product ? product.name : item.name });
      if (item.size) add(bySize, item.size, { name: item.size });
      if (item.color) {
        const key = item.color.toLowerCase();
        let hex = swatchFor(item.color);
        if (product) {
          const picked = JSON.parse(product.color_hex || '{}')[item.color];
          if (picked) hex = picked;
        }
        add(byColor, key, { name: item.color, hex });
      }
      if (item.detailColor) add(byDetailColor, item.detailColor.toLowerCase(), { name: item.detailColor, hex: swatchFor(item.detailColor) });
      const category = product ? product.category : null;
      add(byCategory, category || '-', { name: category ? categoryName[category] || category : 'Obrisan proizvod' });
    });
  });

  const byCity = {};
  valid.forEach((order) => {
    const name = (order.city || '').trim();
    if (!name) return;
    const key = name.toLowerCase();
    // Grad se prikazuje velikim pocetnim slovom, bez obzira kako ga je kupac upisao.
    if (!byCity[key]) byCity[key] = { name: name.charAt(0).toUpperCase() + name.slice(1), units: 0, revenue: 0 };
    byCity[key].units += 1;
    byCity[key].revenue = round2(byCity[key].revenue + order.total_km);
  });

  const byPromo = {};
  valid.forEach((order) => {
    if (!order.promo_code) return;
    const key = order.promo_code.toUpperCase();
    if (!byPromo[key]) byPromo[key] = { name: key, units: 0, revenue: 0 };
    byPromo[key].units += 1;
    byPromo[key].revenue = round2(byPromo[key].revenue + (order.discount_km || 0));
  });

  const statusCounts = STATUSES.map((s) => ({
    id: s.id,
    name: STATUS_LABELS[s.id],
    count: ordersInRange.filter((o) => o.status === s.id).length
  }));

  // Kupci: jedinstveni po e-mailu; povratni = narucili i prije ovog perioda ili vise puta.
  const buyers = {};
  valid.forEach((o) => {
    const key = (o.email || `#${o.id}`).toLowerCase();
    buyers[key] = (buyers[key] || 0) + 1;
  });
  const earlierBuyers = new Set(
    data.orders
      .filter((o) => o.day < range.from && o.status !== 'otkazano' && o.email)
      .map((o) => o.email.toLowerCase())
  );
  const buyerKeys = Object.keys(buyers);
  const returningBuyers = buyerKeys.filter((k) => buyers[k] > 1 || earlierBuyers.has(k)).length;

  const bucketInfo = buckets(range);
  const revenueSeries = series(bucketInfo, valid, (o) => o.total_km);
  const orderSeries = series(bucketInfo, valid, () => 1);
  const customerSeries = series(bucketInfo, data.customers, () => 1);
  const visits = visitStats(range, data.products, valid.length, bucketInfo);
  const chart = (points, format) => ({
    points,
    ticks: niceTicks(Math.max(0, ...points.map((p) => p.value)), format === 'count'),
    format,
    total: round2(points.reduce((s, p) => s + p.value, 0))
  });

  return {
    range,
    presets: PRESETS,
    unit: bucketInfo.unit,
    current,
    previous,
    deltas,
    totals: {
      customers: data.customers.filter((c) => c.day <= range.to).length,
      subscribers: data.subscribers.filter((s) => s.day <= range.to).length
    },
    buyers: { total: buyerKeys.length, returning: returningBuyers },
    extras: {
      discount: round2(valid.reduce((s, o) => s + (o.discount_km || 0), 0)),
      giftWraps: valid.filter((o) => o.gift_wrap).length,
      registeredOrders: valid.filter((o) => o.customer_id).length
    },
    charts: {
      revenue: chart(revenueSeries, 'km'),
      orders: chart(orderSeries, 'count'),
      customers: chart(customerSeries, 'count'),
      visitors: chart(visits.series, 'count')
    },
    visits,
    tables: {
      products: rankBy(byProduct, 10),
      sizes: Object.values(bySize).sort((a, b) => Number(a.name) - Number(b.name) || a.name.localeCompare(b.name)),
      colors: rankBy(byColor),
      detailColors: rankBy(byDetailColor),
      categories: rankBy(byCategory),
      cities: rankBy(byCity, 10),
      promos: rankBy(byPromo),
      statuses: statusCounts
    }
  };
}

module.exports = { computeStats, resolveRange, niceTicks, localDay, humanDay };
