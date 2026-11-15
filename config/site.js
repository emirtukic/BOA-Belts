require('dotenv').config();

// Jedino mjesto za javne podatke o brendu. Isti podaci idu u e-mailove,
// strukturirane podatke za Google i podnožje sajta.
const SITE_URL = (process.env.APP_URL || '').replace(/\/+$/, '');

module.exports = {
  SITE_URL,
  SITE_NAME: 'Boa Belts',
  CONTACT_EMAIL: 'boabelts.webshop@gmail.com',
  PHONES: ['+387 60 32 65 484'],
  // Broj za Viber i WhatsApp (dugme "Pišite nam" na sajtu), samo cifre s pozivnim brojem.
  CHAT_NUMBER: '387603265484',
  ADDRESS: { city: 'Travnik', country: 'BA' },
  SOCIAL: ['https://www.instagram.com/boa_belts/', 'https://www.facebook.com/profile.php?id=100027303537151']
};
