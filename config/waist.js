// Kaisevi po mjeri: kupac upisuje obim struka i bira boju detalja.
// Uputu i dozvoljeni raspon admin mijenja u Proizvodi > Mjerenje struka.
const Settings = require('../models/Settings');

const KEY = 'waist';
const DETAIL_PALETTE = [
  { name: 'Zlatna', hex: '#c9a24b', stems: ['zlat'] },
  { name: 'Srebrena', hex: '#c3c3c3', stems: ['srebr'] }
];
const DETAIL_COLORS = DETAIL_PALETTE.map((c) => c.name);

const DEFAULTS = {
  intro: 'Izmjerite obim struka ili mjesta gdje ćete nositi kaiš, preko tankog sloja odjeće.',
  min: 50,
  max: 150
};

function getWaistSettings() {
  const saved = Settings.get(KEY, null) || {};
  const min = Number.isInteger(saved.min) ? saved.min : DEFAULTS.min;
  const max = Number.isInteger(saved.max) ? saved.max : DEFAULTS.max;
  return { intro: typeof saved.intro === 'string' ? saved.intro : DEFAULTS.intro, min, max };
}

function saveWaistSettings({ intro, min, max }) {
  Settings.set(KEY, { intro, min, max });
}

// Vraca obim u cm kao tekst ("85") ili null ako unos nije ispravan.
function parseWaist(value, settings = getWaistSettings()) {
  const text = String(value == null ? '' : value).trim();
  if (!/^\d{1,3}$/.test(text)) return null;
  const cm = parseInt(text, 10);
  return cm >= settings.min && cm <= settings.max ? String(cm) : null;
}

// Opis izbora stavke za korpu, narudzbe, mailove i Excel.
// Proizvod bez boja u adminu: boju Boa Belts dogovara sa kupcem nakon narudzbe.
const COLOR_AFTER_ORDER = 'po dogovoru nakon narudžbe';

function itemOptions(item) {
  const parts = [];
  if (item.size) parts.push(`Obim struka: ${item.size} cm`);
  parts.push(`Boja: ${item.color || COLOR_AFTER_ORDER}`);
  if (item.detailColor) parts.push(`Boja detalja: ${item.detailColor}`);
  return parts;
}

module.exports = { DETAIL_COLORS, DETAIL_PALETTE, COLOR_AFTER_ORDER, getWaistSettings, saveWaistSettings, parseWaist, itemOptions };
