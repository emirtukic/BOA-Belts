const Settings = require('./Settings');

// Pocetni tekstovi stranica (preneseni sa starog sajta). Admin ih mijenja u
// Sadrzaj stranica; sacuvana verzija ima prednost nad ovim tekstom.
const DEFAULTS = {
  'o-nama': {
    heading: 'Ručni rad iz Travnika',
    intro:
      'Boa Belts je nastao uz jednu šivaću mašinu, nešto veći komad kože i viziju da svakodnevni predmeti zaslužuju pažnju kao porodično naslijeđe. Dugotrajnost i kvalitet postaju zvijezda vodilja i otvaraju put kreativnosti i slobodi. Danas i dalje radimo u istoj ulici, sa istim žarom, sa istom mašinom i sa puno većim snovima.',
    body: `Svaka narudžba počinje razgovorom. Upoznavajući stil klijenta, zajedničkim snagama pronalazimo idealan modni dodatak koji je napravljen prema željama klijenta.

U nazivima naših modela krije se posebno značenje. Svaki modni dodatak nosi ime koje idealno opisuje karakter osobe koja ga nosi.

## Šta nas vodi

**Zanat, ne proizvodnja.** Svaki rez, šav, konac i pakovanje nastaje u našoj radionici, kako bismo lično ispratili izradu od početka do kraja.

**Prirodni materijali.** Sarađujemo samo sa lokalnim kožarima koji dijele naše standarde održivosti, transparentnosti i poštovanja prema zanatu.

**Komadi koji stare uz tebe.** Boa komadi su napravljeni da skupljaju priče, a ne da se troše. Patina i mogućnost restauracije važniji su nam od sezonskih trendova.

## Kako nastaje tvoja narudžba

- **Konsultacije i skice:** zajedno biramo siluetu i okove ili pronalazimo najbolje rješenje iz naših standardnih modela.
- **Selekcija i priprema:** rezervišemo odgovarajuću kožu, provjeravamo vlakna i ton, zatim ručno krojimo i profiliramo svaki dio.
- **Završna obrada:** kontrola prije isporuke, pakovanje u posebne kutije i slanje.

## Dugoročni cilj brenda

- Radionice u Travniku za sve koji žele naučiti ručno šivenje i njegu kože.
- Saradnje s bh. kreativcima na limitiranim kapsulama i istraživačkim serijama.
- Program restauracije kako bi Boa komadi dobili novi sjaj i nakon godina nošenja.`,
    images: [
      '/images/studio/studio-1.webp',
      '/images/studio/studio-2.webp',
      '/images/studio/studio-3.webp',
      '/images/studio/studio-4.webp',
      '/images/studio/studio-5.webp'
    ]
  },
  'program-lojalnosti': {
    heading: 'Boa Loyalty kartica',
    intro: 'Svaka narudžba te vodi do većih pogodnosti i pažljivo biranih iznenađenja.',
    body: `- Karticu dobijaš već prilikom prve prijave i prve kupovine.
- Treća narudžba: 15% popusta.
- Šesta narudžba: iznenađenje iz našeg studija.
- Deveta narudžba: 25% popusta.
- Dvanaesta narudžba: iznenađenje uz tvoju isporuku.
- Petnaesta narudžba: 50% popusta.
- Osamnaesta narudžba: posebno iznenađenje iz radionice.

Loyalty kartica vrijedi od danas pa sve do daljnjeg. Iznos potrošnje nije ograničen.`,
    images: []
  }
};

const PageContent = {
  DEFAULTS,

  get(key) {
    const saved = Settings.get(`page_${key}`, null);
    return saved ? { ...DEFAULTS[key], ...saved } : { ...DEFAULTS[key] };
  },

  save(key, data) {
    Settings.set(`page_${key}`, data);
  }
};

module.exports = PageContent;
