const Settings = require('./Settings');

const DEFAULTS = {
  lifestyle: {
    image: '/images/studio/studio-4.webp',
    eyebrow: 'Kaiševi po mjeri',
    heading: 'Kaiš izrađen po vašoj mjeri',
    text: 'Svaki kaiš ručno režemo, poliramo i šijemo prema obimu vašeg struka. Od farmerki do odijela, prati vaš stil i s vremenom dobija karakter.',
    cta_text: 'Izaberite kaiš',
    cta_link: '/kolekcija?kategorija=zenski-kaisevi'
  },
  story: {
    image: '/images/home/radionica.webp',
    eyebrow: 'Naša priča',
    heading: 'Izrađeno u Travniku, Bosna i Hercegovina',
    text: 'Boa Belts spaja tradicionalne kožarske vještine s modernim dizajnom kako bi stvorio izdržljive komade koji s vremenom postaju još ljepši. Svaki proizvod se reže, šije i završava u Travniku, pa nastaju predmeti puni karaktera spremni za svakodnevnu upotrebu.',
    cta_text: 'Saznaj više o nama',
    cta_link: '/o-nama'
  }
};

const SECTION_KEYS = Object.keys(DEFAULTS);

const HomeSections = {
  DEFAULTS,
  SECTION_KEYS,

  get(key) {
    const saved = Settings.get(`home_${key}`, null);
    return saved ? { ...DEFAULTS[key], ...saved } : { ...DEFAULTS[key] };
  },

  getAll() {
    const all = {};
    SECTION_KEYS.forEach((key) => {
      all[key] = HomeSections.get(key);
    });
    return all;
  },

  save(key, data) {
    Settings.set(`home_${key}`, data);
  }
};

module.exports = HomeSections;
