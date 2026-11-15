const { SITE_NAME, CONTACT_EMAIL, PHONES, ADDRESS, SOCIAL } = require('./site');
const { SHIPPING_PRICE_KM } = require('./pricing');

// Isto što piše u Uslovima korištenja: dostava samo u BiH, 3-4 radna dana.
const SHIPPING_DETAILS = {
  '@type': 'OfferShippingDetails',
  shippingRate: { '@type': 'MonetaryAmount', value: SHIPPING_PRICE_KM.toFixed(2), currency: 'BAM' },
  shippingDestination: { '@type': 'DefinedRegion', addressCountry: 'BA' },
  // Ukupno 3-4 radna dana: do 1 dan pripreme i 2-3 dana kurira.
  deliveryTime: {
    '@type': 'ShippingDeliveryTime',
    handlingTime: { '@type': 'QuantitativeValue', minValue: 0, maxValue: 1, unitCode: 'DAY' },
    transitTime: { '@type': 'QuantitativeValue', minValue: 3, maxValue: 3, unitCode: 'DAY' }
  }
};

function absoluteUrl(siteUrl, url) {
  return /^https?:\/\//.test(url) ? url : `${siteUrl}${url}`;
}

// `<` se mijenja da sadrzaj nikad ne moze zatvoriti <script> tag.
function jsonLd(data) {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

function storeSchema(siteUrl) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Store',
    '@id': `${siteUrl}/#store`,
    name: SITE_NAME,
    url: `${siteUrl}/`,
    logo: `${siteUrl}/images/logo/boa-logo.png`,
    image: `${siteUrl}/images/og-image.jpg`,
    description: 'Ručno rađeni kožni kaiševi, torbe, novčanici i dodaci iz Travnika, Bosna i Hercegovina.',
    email: CONTACT_EMAIL,
    telephone: PHONES[0].replace(/\s/g, ''),
    currenciesAccepted: 'BAM',
    paymentAccepted: 'Plaćanje pouzećem',
    address: {
      '@type': 'PostalAddress',
      addressLocality: ADDRESS.city,
      addressCountry: ADDRESS.country
    },
    sameAs: SOCIAL
  };
}

function productSchema(siteUrl, product, categoryLabel) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description || undefined,
    sku: `BOA-${product.id}`,
    category: categoryLabel,
    image: product.images.map((image) => absoluteUrl(siteUrl, image)),
    brand: { '@type': 'Brand', name: SITE_NAME },
    offers: {
      '@type': 'Offer',
      url: `${siteUrl}/kolekcija/${product.slug}`,
      priceCurrency: 'BAM',
      price: product.finalPrice.toFixed(2),
      itemCondition: 'https://schema.org/NewCondition',
      availability: product.available ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      seller: { '@type': 'Organization', name: SITE_NAME },
      shippingDetails: SHIPPING_DETAILS
    }
  };
}

function breadcrumbSchema(siteUrl, crumbs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: `${siteUrl}${crumb.url}`
    }))
  };
}

// Skracuje tekst za meta description na granici rijeci.
function metaExcerpt(text, maxLength = 155) {
  const clean = (text || '').replace(/\s+/g, ' ').trim();
  if (clean.length <= maxLength) return clean;
  const cut = clean.slice(0, maxLength);
  return `${cut.slice(0, cut.lastIndexOf(' ')).replace(/[\s,.;:-]+$/, '')}...`;
}

module.exports = { absoluteUrl, jsonLd, storeSchema, productSchema, breadcrumbSchema, metaExcerpt };
