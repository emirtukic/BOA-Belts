// Kuriri za pracenje posiljke. url = stranica kurira na kojoj kupac upise broj;
// ako kurir da direktan link za posiljku, admin ga zalijepi i koristi se on.
const CARRIERS = [
  { id: 'bh-posta', label: 'BH Pošta', url: 'https://www.posta.ba/' },
  { id: 'poste-srpske', label: 'Pošte Srpske', url: 'https://www.postesrpske.com/' },
  { id: 'hp-mostar', label: 'Hrvatska pošta Mostar', url: 'https://www.post.ba/' },
  { id: 'euroexpress', label: 'EuroExpress', url: 'https://www.euroexpress.ba/' },
  { id: 'x-express', label: 'X Express', url: 'https://www.x-express.ba/' },
  { id: 'expressone', label: 'ExpressOne', url: 'https://expressone.ba/' },
  { id: 'drugi', label: 'Drugi kurir', url: '' }
];

const CARRIER_BY_ID = Object.fromEntries(CARRIERS.map((c) => [c.id, c]));

// Sta kupac dobija: naziv kurira, broj i link (direktni, ili stranica kurira).
function trackingInfo(order) {
  if (!order || !order.tracking_number) return null;
  const carrier = CARRIER_BY_ID[order.tracking_carrier] || CARRIER_BY_ID.drugi;
  const directUrl = order.tracking_url || '';
  return {
    carrier: carrier.id === 'drugi' ? '' : carrier.label,
    number: order.tracking_number,
    url: directUrl || carrier.url,
    isDirect: !!directUrl
  };
}

module.exports = { CARRIERS, CARRIER_BY_ID, trackingInfo };
