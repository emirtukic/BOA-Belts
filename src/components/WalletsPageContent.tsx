'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { FaChevronDown, FaInfoCircle, FaTimes } from 'react-icons/fa';
import { useLanguage } from './LanguageProvider';
import { LoyaltyCardSection } from './LoyaltyCardSection';

type Category = 'slim' | 'carry';

type ProductVariant = {
  label: string;
  swatch: string;
  image: string;
};

type Product = {
  id: string;
  name: string;
  price: string;
  category: Category;
  description: string;
  colors: ProductVariant[];
};

type SortOrder = 'asc' | 'desc';

const products: Product[] = [
  {
    id: 's1',
    name: 'Sarajevo Slimline',
    price: '€90',
    category: 'slim',
    description:
      'Two-pocket card sleeve with center slip, burnished edges, and hand-stitched seams for flat carry.',
    colors: [
      { label: 'Hazel', swatch: '#a56633', image: '/novcanik.jpg' },
      { label: 'Coal', swatch: '#1e1e1e', image: '/boabelts.jpg' },
      { label: 'Clay', swatch: '#d3c6b8', image: '/boa_belts_4.jpg' },
    ],
  },
  {
    id: 's2',
    name: 'Travnik Card Sleeve',
    price: '€85',
    category: 'slim',
    description:
      'Minimal sleeve with diagonal thumb cut, perfect for transit passes and two essential cards.',
    colors: [
      { label: 'Cognac', swatch: '#9f5a2e', image: '/boa_belts_1.jpg' },
      { label: 'Onyx', swatch: '#111111', image: '/boabelts.jpg' },
      { label: 'Sand', swatch: '#ded0bd', image: '/boa_belts_4.jpg' },
    ],
  },
  {
    id: 's3',
    name: 'Mahala Micro Wallet',
    price: '€95',
    category: 'slim',
    description:
      'Compact tri-pocket wallet with snap closure securing folded cash and a few key cards.',
    colors: [
      { label: 'Maple', swatch: '#b7723a', image: '/boa_belts_2.jpg' },
      { label: 'Slate', swatch: '#2f2f2f', image: '/boabelts.jpg' },
      { label: 'Mist', swatch: '#e1d9cf', image: '/boa_belts_4.jpg' },
    ],
  },
  {
    id: 's4',
    name: 'Jajce Snap Wallet',
    price: '€110',
    category: 'slim',
    description:
      'Snap wallet with hidden coin sleeve and easy-access front card pocket for quick taps.',
    colors: [
      { label: 'Chestnut', swatch: '#874c2f', image: '/boa_belts_1.jpg' },
      { label: 'Night', swatch: '#151515', image: '/boabelts.jpg' },
      { label: 'Dune', swatch: '#d7cbb9', image: '/boa_belts_4.jpg' },
    ],
  },
  {
    id: 's5',
    name: 'Igman Vertical Card Holder',
    price: '€88',
    category: 'slim',
    description:
      'Vertical layout card holder with staggered slots and reinforced mouth for durability.',
    colors: [
      { label: 'Russet', swatch: '#924623', image: '/boa_belts_2.jpg' },
      { label: 'Graphite', swatch: '#303030', image: '/boabelts.jpg' },
      { label: 'Fawn', swatch: '#dbcab6', image: '/boa_belts_4.jpg' },
    ],
  },
  {
    id: 's6',
    name: 'Brezza Front Pocket',
    price: '€92',
    category: 'slim',
    description:
      'Front pocket wallet with notch pull tab and tight saddle stitch to keep contents secure.',
    colors: [
      { label: 'Caramel', swatch: '#b36b31', image: '/boa_belts_1.jpg' },
      { label: 'Shadow', swatch: '#222222', image: '/boabelts.jpg' },
      { label: 'Ivory', swatch: '#e9dfd2', image: '/boa_belts_4.jpg' },
    ],
  },
  {
    id: 's7',
    name: 'Kova Fold Slim',
    price: '€105',
    category: 'slim',
    description:
      'Slim fold wallet with two interior card sleeves and an external quick-draw slot.',
    colors: [
      { label: 'Amber', swatch: '#be7334', image: '/boabelts2.jpg' },
      { label: 'Ink', swatch: '#141414', image: '/boabelts.jpg' },
      { label: 'Bone', swatch: '#e2d7c9', image: '/boa_belts_4.jpg' },
    ],
  },
  {
    id: 's8',
    name: 'Mala Zip Pouch',
    price: '€115',
    category: 'slim',
    description:
      'Micro zip pouch lined with suede, perfect for coins, earbuds, or minimal card carry.',
    colors: [
      { label: 'Hazelnut', swatch: '#a15f36', image: '/boa_belts_2.jpg' },
      { label: 'Char', swatch: '#2b2b2b', image: '/boabelts.jpg' },
      { label: 'Shell', swatch: '#e6dbce', image: '/boa_belts_4.jpg' },
    ],
  },
  {
    id: 's9',
    name: 'Zenica Loop Wallet',
    price: '€98',
    category: 'slim',
    description:
      'Loop-secured wallet with elastic keeper, built for gym lockers and light travel.',
    colors: [
      { label: 'Copper', swatch: '#aa5d31', image: '/boa_belts_2.jpg' },
      { label: 'Obsidian', swatch: '#181818', image: '/boabelts.jpg' },
      { label: 'Pearl', swatch: '#e4d8ca', image: '/boa_belts_4.jpg' },
    ],
  },
  {
    id: 's10',
    name: 'Austro Card Folio',
    price: '€120',
    category: 'slim',
    description:
      'Card folio with inner cash band and secret slot for SIM or valet keys.',
    colors: [
      { label: 'Saddle', swatch: '#a45e2f', image: '/boa_belts_1.jpg' },
      { label: 'Midnight', swatch: '#0f0f0f', image: '/boabelts.jpg' },
      { label: 'Frost', swatch: '#e0d8cc', image: '/boa_belts_4.jpg' },
    ],
  },
  {
    id: 'c1',
    name: 'Miljacka Bifold',
    price: '€140',
    category: 'carry',
    description:
      'Classic bifold with eight card slots, cash compartment, and removable ID window.',
    colors: [
      { label: 'Cognac', swatch: '#a35f2d', image: '/boa_belts_1.jpg' },
      { label: 'Charcoal', swatch: '#262626', image: '/boabelts.jpg' },
      { label: 'Stone', swatch: '#d1c6b7', image: '/boa_belts_4.jpg' },
    ],
  },
  {
    id: 'c2',
    name: 'Konjic Passport Folio',
    price: '€155',
    category: 'carry',
    description:
      'Passport folio with dual boarding pass sleeves, SIM pocket, and pen loop.',
    colors: [
      { label: 'Walnut', swatch: '#81502b', image: '/boa_belts_2.jpg' },
      { label: 'Jet', swatch: '#121212', image: '/boabelts.jpg' },
      { label: 'Oat', swatch: '#d7cbbd', image: '/boa_belts_4.jpg' },
    ],
  },
  {
    id: 'c3',
    name: 'Drina Travel Wallet',
    price: '€165',
    category: 'carry',
    description:
      'Travel wallet with zip closure, ticket sleeve, and removable wrist strap for security.',
    colors: [
      { label: 'Amber', swatch: '#b26532', image: '/boa_belts_2.jpg' },
      { label: 'Slate', swatch: '#2f2e2d', image: '/boabelts.jpg' },
      { label: 'Cloud', swatch: '#e2dacc', image: '/boa_belts_4.jpg' },
    ],
  },
  {
    id: 'c4',
    name: 'Vlašić Organizer',
    price: '€170',
    category: 'carry',
    description:
      'Zip-around organizer with tablet sleeve, pen loop, and modular card inserts.',
    colors: [
      { label: 'Sienna', swatch: '#a2552e', image: '/boa_belts_3.jpg' },
      { label: 'Shadow', swatch: '#1f1f1f', image: '/boabelts.jpg' },
      { label: 'Ivory', swatch: '#dfd5c8', image: '/boa_belts_4.jpg' },
    ],
  },
  {
    id: 'c5',
    name: 'Pliva Zip Bifold',
    price: '€150',
    category: 'carry',
    description:
      'Zip-around bifold that keeps coins, keys, and cash secure in transit.',
    colors: [
      { label: 'Maple', swatch: '#b76a34', image: '/boa_belts_1.jpg' },
      { label: 'Raven', swatch: '#181818', image: '/boabelts.jpg' },
      { label: 'Powder', swatch: '#e8ded2', image: '/boa_belts_4.jpg' },
    ],
  },
  {
    id: 'c6',
    name: 'Stari Grad Checkbook',
    price: '€145',
    category: 'carry',
    description:
      'Slim checkbook wallet with rear slip pocket and removable chequebook sleeve.',
    colors: [
      { label: 'Cedar', swatch: '#a06a3c', image: '/boa_belts_2.jpg' },
      { label: 'Obsidian', swatch: '#171717', image: '/boabelts.jpg' },
      { label: 'Linen', swatch: '#e4d8c8', image: '/boa_belts_4.jpg' },
    ],
  },
  {
    id: 'c7',
    name: 'Bijela Clutch Wallet',
    price: '€160',
    category: 'carry',
    description:
      'Clutch wallet with detachable wristlet, phone pocket, and card stacker.',
    colors: [
      { label: 'Rose', swatch: '#c58a7a', image: '/boa_belts_3.jpg' },
      { label: 'Ink', swatch: '#141414', image: '/boabelts.jpg' },
      { label: 'Porcelain', swatch: '#e6dad0', image: '/boa_belts_4.jpg' },
    ],
  },
  {
    id: 'c8',
    name: 'Una Phone Folio',
    price: '€175',
    category: 'carry',
    description:
      'Phone folio with detachable strap, card slots, and hidden cash sleeve for evenings out.',
    colors: [
      { label: 'Copper', swatch: '#a85b2f', image: '/boa_belts_2.jpg' },
      { label: 'Char', swatch: '#212121', image: '/boabelts.jpg' },
      { label: 'Fawn', swatch: '#dbcfc2', image: '/boa_belts_4.jpg' },
    ],
  },
  {
    id: 'c9',
    name: 'Sana Field Wallet',
    price: '€155',
    category: 'carry',
    description:
      'Field wallet with notebook insert, pen loop, and rear stash pocket.',
    colors: [
      { label: 'Oak', swatch: '#8a532b', image: '/boa_belts_1.jpg' },
      { label: 'Graphite', swatch: '#2d2d2d', image: '/boabelts.jpg' },
      { label: 'Drift', swatch: '#d9d2c7', image: '/boa_belts_4.jpg' },
    ],
  },
  {
    id: 'c10',
    name: 'Igman Document Case',
    price: '€185',
    category: 'carry',
    description:
      'Document case with gusseted sides, magnetic closure, and business card pockets.',
    colors: [
      { label: 'Whiskey', swatch: '#8e4f2b', image: '/boa_belts_2.jpg' },
      { label: 'Slate', swatch: '#303133', image: '/boabelts.jpg' },
      { label: 'Pebble', swatch: '#d5c9bc', image: '/boa_belts_4.jpg' },
    ],
  },
];

const parsePrice = (price: string) => Number(price.replace(/[^\d.]/g, '')) || 0;

const sortProductsByPrice = (items: Product[], order: SortOrder) =>
  [...items].sort((a, b) => {
    const priceA = parsePrice(a.price);
    const priceB = parsePrice(b.price);
    return order === 'asc' ? priceA - priceB : priceB - priceA;
  });

type SortSelectProps = {
  value: SortOrder;
  label: string;
  ascLabel: string;
  descLabel: string;
  onChange: (order: SortOrder) => void;
};

function SortSelect({ value, label, ascLabel, descLabel, onChange }: SortSelectProps) {
  return (
    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[#6a6a6a]">
      <span>{label}</span>
      <div className="relative">
        <select
          value={value}
          onChange={(event) => onChange(event.target.value as SortOrder)}
          className="appearance-none min-w-[180px] rounded-full border border-[#dedede] bg-white px-4 py-2 pr-10 text-xs font-semibold uppercase tracking-wide text-[#111] shadow-sm transition focus:border-[#111] focus:outline-none focus:ring-2 focus:ring-[#111] hover:border-[#111]/60"
        >
          <option value="asc">{ascLabel}</option>
          <option value="desc">{descLabel}</option>
        </select>
        <FaChevronDown className="pointer-events-none absolute right-4 top-1/2 h-3 w-3 -translate-y-1/2 text-[#6a6a6a]" />
      </div>
    </div>
  );
}

export default function WalletsPageContent() {
  const { t } = useLanguage();
  const data = t.walletsPage;

  const sortCopy =
    data.sort ??
    ({
      label: 'Sort',
      options: { asc: 'Lowest price first', desc: 'Highest price first' },
    } as const);

  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const formatTemplate = (template: string, replacements: Record<string, string>) =>
    Object.entries(replacements).reduce(
      (acc, [key, value]) => acc.replace(new RegExp(`\\{${key}\\}`, 'g'), value),
      template,
    );

  const [selectedColors, setSelectedColors] = useState<Record<string, number>>(() =>
    Object.fromEntries(products.map((product) => [product.id, 0])),
  );
  const [openProductId, setOpenProductId] = useState<string | null>(null);

  const sortedProducts = useMemo(() => sortProductsByPrice(products, sortOrder), [sortOrder]);

  const productCountLabel = `${sortedProducts.length} ${data.stylesLabel}`;

  const handleColorChange = (productId: string, index: number) => {
    setSelectedColors((prev) => ({
      ...prev,
      [productId]: index,
    }));
  };

  const renderProductCard = (product: Product) => {
    const activeIndex = selectedColors[product.id] ?? 0;
    const activeVariant = product.colors[activeIndex] ?? product.colors[0];

    return (
      <article
        key={product.id}
        className="group relative flex flex-col overflow-hidden rounded-3xl border border-[#e5e5e5] bg-white shadow-sm transition-shadow hover:shadow-xl"
      >
        <button
          type="button"
          onClick={() => setOpenProductId(product.id)}
          className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-[#111] shadow-md transition hover:bg-[#111] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#111]"
          aria-label={formatTemplate(data.card.infoAriaLabel, { product: product.name })}
        >
          <FaInfoCircle className="h-4 w-4" />
        </button>
        <div className="relative h-72 overflow-hidden bg-[#f5f5f5]">
          <Image
            src={activeVariant.image}
            alt={`${product.name} in ${activeVariant.label}`}
            fill
            sizes="(min-width: 1280px) 280px, (min-width: 768px) 33vw, 90vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            priority={product.id === 's1'}
          />
        </div>
        <div className="flex flex-1 flex-col gap-6 p-6">
          <div className="flex flex-wrap items-center gap-2">
            {product.colors.map((variant, index) => {
              const isActive = activeIndex === index;
              return (
                <button
                  key={variant.label}
                  type="button"
                  onClick={() => handleColorChange(product.id, index)}
                  className={`relative flex h-6 w-6 items-center justify-center rounded-full border border-white shadow-sm transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#1f1f1f]/50 md:h-7 md:w-7 ${
                    isActive ? 'ring-2 ring-offset-2 ring-[#1f1f1f] shadow-md' : 'hover:shadow-md'
                  }`}
                  style={{ backgroundColor: variant.swatch }}
                  aria-label={formatTemplate(data.card.selectColorLabel, {
                    color: variant.label,
                    product: product.name,
                  })}
                  aria-pressed={isActive}
                />
              );
            })}
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-[#111]">{product.name}</h3>
            <p className="text-sm uppercase tracking-wide text-[#696969]">
              {`${activeVariant.label}${data.card.materialSuffix}`}
            </p>
          </div>
          <div className="mt-auto flex items-baseline justify-between">
            <span className="text-base font-semibold text-[#111]">{product.price}</span>
            <span className="text-sm font-medium text-[#9a7048] uppercase">
              {data.card.craftedBadge}
            </span>
          </div>
        </div>
        {openProductId === product.id && (
          <div className="absolute inset-0 z-30 flex flex-col gap-4 bg-[#111]/90 p-6 text-white backdrop-blur-sm">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="text-xl font-semibold">{product.name}</h4>
                <p className="mt-1 text-sm uppercase tracking-wide text-white/70">
                  {formatTemplate(data.card.variantLabel, { variant: activeVariant.label })}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpenProductId(null)}
                className="ml-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/25 focus:outline-none focus:ring-2 focus:ring-white"
                aria-label={data.card.closeAria}
              >
                <FaTimes className="h-4 w-4" />
              </button>
            </div>
            <p className="text-sm leading-relaxed text-white/90">{product.description}</p>
            <div className="mt-auto">
              <button
                type="button"
                onClick={() => setOpenProductId(null)}
                className="inline-flex items-center justify-center rounded-full bg-white px-5 py-2 text-sm font-semibold text-[#111] transition hover:bg-[#f5f5f5]"
              >
                {data.card.closeLabel}
              </button>
            </div>
          </div>
        )}
      </article>
    );
  };

  const heroParagraphs = data.heroParagraphs ?? [data.heroSubtitle];

  return (
    <main className="bg-[#f9f9f9] text-[#1f1f1f]">
      <section
        className="relative py-28 px-6 text-center text-[#111]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(249,249,249,0.92), rgba(249,249,249,0.92)), url('/boabelts.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="relative z-10 mx-auto max-w-3xl space-y-5">
          <p className="text-sm uppercase tracking-[0.4em] text-[#9a7048]">{data.heroTitle}</p>
          <h1 className="text-4xl font-semibold md:text-5xl">{data.signatureTitle}</h1>
          <div className="space-y-4 text-base text-[#3a3a3a] md:text-lg">
            {heroParagraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 pb-24 pt-20">
        <div className="flex flex-col items-start justify-between gap-3 md:flex-row md:items-center">
          <div>
            <h2 className="text-2xl font-semibold md:text-3xl">{data.collectionTitle}</h2>
            <p className="text-sm text-[#6a6a6a] md:text-base">{data.collectionSubtitle}</p>
          </div>
          <div className="flex flex-col items-end gap-2 sm:flex-row sm:items-center sm:gap-3">
            <span className="rounded-full border border-[#dedede] px-4 py-2 text-xs font-semibold uppercase tracking-wide text-[#9a7048]">
              {productCountLabel}
            </span>
            <SortSelect
              value={sortOrder}
              label={sortCopy.label}
              ascLabel={sortCopy.options.asc}
              descLabel={sortCopy.options.desc}
              onChange={(order) => setSortOrder(order)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-3">
          {sortedProducts.map((product) => renderProductCard(product))}
        </div>

        <LoyaltyCardSection className="mt-4" />
      </section>
    </main>
  );
}
