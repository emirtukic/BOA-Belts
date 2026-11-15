# Boa Belts webshop

Web prodavnica za **Boa Belts**, ručno rađene kožne kaiševe, torbe, novčanike i dodatke iz Travnika (BiH).
Produkcija: https://www.boabelts.com

## Tehnologije

- Node.js 24, Express, EJS
- SQLite preko ugrađenog `node:sqlite`
- multer + sharp za slike (svaka slika u dvije veličine, WebP)
- nodemailer za mailove (Gmail)

## Pokretanje lokalno

```bash
npm install
sh tools/dev-server.sh <privremeni-folder> 3111
```

Skripta koristi privremenu bazu i ne šalje mailove (upisuje ih kao HTML u `<privremeni-folder>/mailovi`). Admin: `/admin`, korisnik `admin`, lozinka `test-admin-123` (samo lokalno).

Test cijele kupovine i admina u pravom Chromeu:

```bash
node tools/flow-test.js http://localhost:3111 <folder-za-snimke> <privremeni-folder>/mailovi
```

## Struktura

| Putanja | Sadržaj |
| --- | --- |
| `server.js` | Pokretanje, sigurnosna zaglavlja, sesije, rute |
| `routes/` | Stranice za kupce i admin panel (`routes/admin/`) |
| `models/` | Rad s bazom (proizvodi, narudžbe, kupci, promo kodovi...) |
| `views/` | EJS stranice |
| `config/` | Podaci o brendu (`site.js`), dostava (`pricing.js`), mailovi, SEO, statistika |
| `db/` | Šema baze i početni proizvodi (`products.fixture.json`) |
| `public/images/` | Slike proizvoda, početne, revije i logo |
| `deploy/` | Skripte za server; uputstvo u `DEPLOY.md` |
| `scripts/` | Jednokratni prenos proizvoda i slika sa starog sajta |
| `tools/` | Lokalni test server, snimanje ekrana, mjerenje veličine stranica |
