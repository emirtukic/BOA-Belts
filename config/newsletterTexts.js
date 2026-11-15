// Tekstovi o newsletteru i promo kod dobrodoslice: admin ih mijenja u
// Newsletter > Tekstovi, jer se popust mijenja ili ga nema.
const Settings = require('../models/Settings');

const KEY = 'newsletter_texts';

const DEFAULTS = {
  heading: 'Prijavite se na newsletter',
  text: 'Prvi saznajte za nove modele, priče iz radionice i posebne ponude.',
  registerLabel: 'Želim primati newsletter sa novim modelima i ponudama',
  // Popust za nove pretplatnike vlasnik uključuje u adminu (Newsletter > Tekstovi).
  welcomeCode: ''
};

// Checkbox pri registraciji mora imati neki tekst i kad admin obrise svoj.
const REGISTER_FALLBACK = 'Želim primati newsletter sa novim kolekcijama i ponudama';

function getNewsletterTexts() {
  const saved = Settings.get(KEY, {}) || {};
  const texts = { ...DEFAULTS };
  Object.keys(DEFAULTS).forEach((field) => {
    if (typeof saved[field] === 'string') texts[field] = saved[field];
  });
  return { ...texts, registerLabelShown: texts.registerLabel || REGISTER_FALLBACK };
}

function saveNewsletterTexts(texts) {
  Settings.set(KEY, {
    heading: texts.heading,
    text: texts.text,
    registerLabel: texts.registerLabel,
    welcomeCode: texts.welcomeCode
  });
}

module.exports = { getNewsletterTexts, saveNewsletterTexts, NEWSLETTER_DEFAULTS: DEFAULTS };
