const Settings = require('./Settings');

const DEFAULT_HERO = {
  eyebrow: 'Ručni rad iz Travnika',
  heading: 'Prvi bosanskohercegovački brend kožnih dodataka',
  text: 'Ručno rađeni kožni kaiševi, torbe i novčanici iz naše radionice u Travniku. Kaiševe izrađujemo po vašoj mjeri.',
  cta_text: 'Istraži kolekciju',
  media_type: 'images',
  // Fotografije gdje je model desno, da tekst lijevo ostane citljiv.
  images: ['/images/revija/8J3A0644.webp', '/images/revija/8J3A0634.webp', '/images/hero/hero-2.webp'],
  video_url: ''
};

const Hero = {
  DEFAULT_HERO,
  get() {
    const saved = Settings.get('hero', null);
    return saved ? { ...DEFAULT_HERO, ...saved } : { ...DEFAULT_HERO };
  },
  save(hero) {
    Settings.set('hero', hero);
  }
};

module.exports = Hero;
