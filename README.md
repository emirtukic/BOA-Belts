# Boa Belts

Web stranica za **Boa Belts**, ručno rađene kožne kaiševe, torbe, novčanike i dodatke iz Travnika (BiH).
Produkcija: https://www.boabelts.com

## Tehnologije

- [Next.js 15](https://nextjs.org/) (App Router, statički export – `output: 'export'`)
- React 19 + TypeScript
- Tailwind CSS 4
- React Icons, Lottie, Font Awesome (CDN)

## Pokretanje

```bash
npm install
npm run dev      # razvojni server na http://localhost:3000
npm run build    # statički build u folder out/
npm run lint
```

Opcionalno: `NEXT_PUBLIC_SITE_URL` postavlja osnovni URL za metapodatke i OG slike (zadano `https://www.boabelts.com`).

## Struktura

| Putanja | Sadržaj |
| --- | --- |
| `src/app/` | Stranice (App Router): početna, `kaisevi`, `torbe`, `novcanici`, `dodaci`, `proizvod/[productId]`, `o-nama`, `lojalnost`, `BHFashionWeek` |
| `src/components/` | UI komponente (Navbar, Footer, galerije, lightbox, pretraga) i `LanguageProvider` (prijevodi BS/EN) |
| `src/data/` | Katalog proizvoda (`mensBelts`, `womensBelts`, `bags`, `wallets`, `accessories`, `revijaGallery`, `catalog`) |
| `scripts/` | Node skripte koje generišu fajlove u `src/data/` iz foldera sa slikama |
| `public/` | Slike proizvoda (po kategorijama), revija, favikone, OG slike, `sitemap.xml`, `robots.txt` |

## Dodavanje proizvoda

Slike proizvoda nalaze se u `public/<Kategorija>/<ID>_<Naziv>_<Cijena>/`
(npr. `public/Bags/32_Maya bag_180 KM/`). Nakon dodavanja foldera pokreni odgovarajuću skriptu iz korijena projekta:

```bash
node scripts/generate-bags.js
node scripts/generate-wallets.js
node scripts/generate-mens.js
node scripts/generate-womens.js
node scripts/generate-accessories.js
```

## Slike

Zbog statičkog exporta Next.js ne optimizuje slike (`images.unoptimized`), pa se fajlovi serviraju onakvi kakvi jesu.
Sve slike su zato u **WebP** formatu, najviše 2000 px po dužoj strani. Nove slike prije dodavanja treba smanjiti i
pretvoriti u WebP (npr. [Squoosh](https://squoosh.app) ili `cwebp -q 80`). Izuzetak su favikone i OG slike
(`og-image*`), koje ostaju PNG/JPG radi kompatibilnosti sa društvenim mrežama.
