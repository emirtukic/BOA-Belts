// Boje: naziv koji admin upise dobija kruzic odgovarajuce boje.
// Prepoznaje se po pocetku rijeci, pa "crna", "crni" i "crna sa vezom" daju crnu.
// Duzi pocetci idu prije kracih ("svijetloplav" prije "plav").
const PALETTE = [
  { name: 'crna', hex: '#111111', stems: ['crn'] },
  { name: 'bijela', hex: '#fbfaf6', stems: ['bijel', 'bel'] },
  { name: 'siva', hex: '#9b9790', stems: ['siv'] },
  { name: 'bež', hex: '#d8c1a0', stems: ['bez', 'bež'] },
  { name: 'krem', hex: '#efe2c4', stems: ['krem'] },
  { name: 'caramel', hex: '#b37a42', stems: ['caramel', 'karamel'] },
  { name: 'smeđa', hex: '#6b4528', stems: ['smeđ', 'smed', 'braon'] },
  { name: 'roza', hex: '#e7a7b6', stems: ['roz', 'pink'] },
  { name: 'crvena', hex: '#b2222c', stems: ['crven'] },
  { name: 'bordo', hex: '#6e1f2c', stems: ['bordo'] },
  { name: 'teget', hex: '#1f2a44', stems: ['teget', 'tamnoplav'] },
  { name: 'svijetloplava', hex: '#9cc2e3', stems: ['svijetloplav'] },
  { name: 'plava', hex: '#2f5ea8', stems: ['plav'] },
  { name: 'zelena', hex: '#2f6b3a', stems: ['zelen'] },
  { name: 'maslinasta', hex: '#6f6a35', stems: ['maslin'] },
  { name: 'žuta', hex: '#e2c04a', stems: ['žut', 'zut'] },
  { name: 'narandžasta', hex: '#df7a2c', stems: ['narandž', 'narandz'] },
  { name: 'ljubičasta', hex: '#6b3f8f', stems: ['ljubič', 'ljubic'] },
  { name: 'zlatna', hex: '#c9a24b', stems: ['zlat'] },
  { name: 'srebrena', hex: '#c3c3c3', stems: ['srebr'] }
];

function swatchFor(colorName) {
  const words = String(colorName || '').toLowerCase().split(/[^a-zčćđšž]+/).filter(Boolean);
  for (const word of words) {
    const match = PALETTE.find((entry) => entry.stems.some((stem) => word.startsWith(stem)));
    if (match) return match.hex;
  }
  return null;
}

module.exports = { PALETTE, swatchFor };
