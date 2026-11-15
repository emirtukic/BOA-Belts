CREATE TABLE IF NOT EXISTS admins (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  legacy_id TEXT,
  description TEXT,
  price_km REAL NOT NULL,
  sale_price_km REAL,
  category TEXT NOT NULL,
  sizes TEXT NOT NULL,
  colors TEXT NOT NULL,
  images TEXT NOT NULL,
  image_colors TEXT NOT NULL DEFAULT '{}',
  color_hex TEXT NOT NULL DEFAULT '{}',
  waist_required INTEGER NOT NULL DEFAULT 0,
  detail_colors TEXT NOT NULL DEFAULT '[]',
  in_stock INTEGER NOT NULL DEFAULT 1,
  featured INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT
);

CREATE TABLE IF NOT EXISTS popups (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  image TEXT,
  heading TEXT,
  text TEXT,
  cta_text TEXT,
  cta_link TEXT,
  delay_seconds INTEGER NOT NULL DEFAULT 2,
  auto_close_seconds INTEGER NOT NULL DEFAULT 0,
  is_active INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS reminders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  text TEXT NOT NULL,
  due_date TEXT,
  done INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS customers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  city TEXT,
  reset_token TEXT,
  reset_token_expires TEXT,
  google_id TEXT,
  facebook_id TEXT,
  email_verified INTEGER NOT NULL DEFAULT 0,
  verification_token TEXT,
  newsletter_opt_in INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  customer_name TEXT NOT NULL,
  email TEXT,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  notes TEXT,
  gift_wrap INTEGER NOT NULL DEFAULT 0,
  gift_wrap_price_km REAL NOT NULL DEFAULT 0,
  shipping_km REAL NOT NULL DEFAULT 0,
  promo_code TEXT,
  discount_km REAL NOT NULL DEFAULT 0,
  items TEXT NOT NULL,
  total_km REAL NOT NULL,
  payment_method TEXT NOT NULL DEFAULT 'pouzece',
  status TEXT NOT NULL DEFAULT 'novo',
  customer_id INTEGER,
  shipped_email_sent INTEGER NOT NULL DEFAULT 0,
  tracking_carrier TEXT,
  tracking_number TEXT,
  tracking_url TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS promo_codes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code TEXT UNIQUE NOT NULL,
  type TEXT NOT NULL DEFAULT 'percent',
  value REAL NOT NULL,
  active INTEGER NOT NULL DEFAULT 1,
  usage_limit INTEGER,
  used_count INTEGER NOT NULL DEFAULT 0,
  expires_at TEXT,
  audience TEXT NOT NULL DEFAULT 'svi',
  new_customer_days INTEGER,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  subscribed_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Ko se odjavio ne smije vise dobijati newsletter, ni kao registrovani korisnik.
CREATE TABLE IF NOT EXISTS newsletter_unsubscribes (
  email TEXT PRIMARY KEY,
  unsubscribed_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS sessions (
  sid TEXT PRIMARY KEY,
  sess TEXT NOT NULL,
  expires INTEGER NOT NULL
);

-- Posjete bez kolacica: visitor je dnevni anonimni hash, bez IP adrese.
CREATE TABLE IF NOT EXISTS page_views (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  day TEXT NOT NULL,
  path TEXT NOT NULL,
  visitor TEXT NOT NULL,
  source TEXT NOT NULL,
  device TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_page_views_day ON page_views (day);
