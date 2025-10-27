'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { FaChevronDown, FaInfoCircle, FaTimes } from 'react-icons/fa';
import { useLanguage } from './LanguageProvider';
import { LoyaltyCardSection } from './LoyaltyCardSection';

type Category = 'daily' | 'travel';

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
    id: 'd1',
    name: 'Miljacka Tote',
    price: '€240',
    category: 'daily',
    description:
      'Structured tote with reinforced handles and interior drop pockets for phone, keys, and small notebooks.',
    colors: [
      { label: 'Cognac', swatch: '#a36a3c', image: '/torba.jpg' },
      { label: 'Ink', swatch: '#1f1f1f', image: '/boabelts.jpg' },
      { label: 'Olive', swatch: '#5a5f3b', image: '/boa_belts_3.jpg' },
    ],
  },
  {
    id: 'd2',
    name: 'Ferhadija Crossbody',
    price: '€210',
    category: 'daily',
    description:
      'Slim crossbody with double gusset compartments, adjustable strap, and hidden magnet closure.',
    colors: [
      { label: 'Chestnut', swatch: '#8c4a2f', image: '/boabelts2.jpg' },
      { label: 'Onyx', swatch: '#191919', image: '/boahero.jpg' },
      { label: 'Fog', swatch: '#dcd7ce', image: '/boa_belts_4.jpg' },
    ],
  },
  {
    id: 'd3',
    name: 'Travnik Market Tote',
    price: '€230',
    category: 'daily',
    description:
      'Open-top tote lined with cotton twill and finished with key leash and detachable pouch.',
    colors: [
      { label: 'Caramel', swatch: '#b87333', image: '/boa_belts_1.jpg' },
      { label: 'Slate', swatch: '#444444', image: '/boabelts.jpg' },
      { label: 'Moss', swatch: '#66734d', image: '/boa_belts_2.jpg' },
    ],
  },
  {
    id: 'd4',
    name: 'Atelje Shoulder Bag',
    price: '€225',
    category: 'daily',
    description:
      'Curved shoulder bag with suede-lined flap, brass turn lock, and slip pocket for quick access.',
    colors: [
      { label: 'Merlot', swatch: '#5e1f2b', image: '/boa_belts_3.jpg' },
      { label: 'Graphite', swatch: '#2f2f2f', image: '/boahero.jpg' },
      { label: 'Sand', swatch: '#d6c4ae', image: '/boa_belts_4.jpg' },
    ],
  },
  {
    id: 'd5',
    name: 'Baščaršija Sling',
    price: '€195',
    category: 'daily',
    description:
      'Versatile sling that can be worn crossbody or around the waist, with quick-access zip pocket.',
    colors: [
      { label: 'Cider', swatch: '#b2642b', image: '/boa_belts_2.jpg' },
      { label: 'Charcoal', swatch: '#272727', image: '/boabelts.jpg' },
      { label: 'Mist', swatch: '#e5ded1', image: '/boa_belts_4.jpg' },
    ],
  },
  {
    id: 'd6',
    name: 'Vrbas Hobo',
    price: '€215',
    category: 'daily',
    description:
      'Soft hobo silhouette with magnetic closure, interior zip pocket, and reinforced base for structure.',
    colors: [
      { label: 'Walnut', swatch: '#7b4827', image: '/boa_belts_1.jpg' },
      { label: 'Noir', swatch: '#101010', image: '/boahero.jpg' },
      { label: 'Rose', swatch: '#caa99a', image: '/boabelts2.jpg' },
    ],
  },
  {
    id: 'd7',
    name: 'Javor Clutch',
    price: '€185',
    category: 'daily',
    description:
      'Foldover clutch with wrist strap, card slots, and removable chain for evening wear.',
    colors: [
      { label: 'Amber', swatch: '#c9823a', image: '/boabelts2.jpg' },
      { label: 'Ebony', swatch: '#171717', image: '/boabelts.jpg' },
      { label: 'Champagne', swatch: '#dfd3c3', image: '/boa_belts_4.jpg' },
    ],
  },
  {
    id: 'd8',
    name: 'Kula Bucket Bag',
    price: '€205',
    category: 'daily',
    description:
      'Drawstring bucket bag with suede collar, structured base, and adjustable shoulder strap.',
    colors: [
      { label: 'Saddle', swatch: '#a15b2a', image: '/torba.jpg' },
      { label: 'Ash', swatch: '#3d3d3d', image: '/boa_belts_3.jpg' },
      { label: 'Dove', swatch: '#d9d4c8', image: '/boa_belts_4.jpg' },
    ],
  },
  {
    id: 'd9',
    name: 'Aida Brief',
    price: '€260',
    category: 'daily',
    description:
      'Slim briefcase with padded laptop sleeve, document divider, and detachable shoulder strap.',
    colors: [
      { label: 'Cognac', swatch: '#a66933', image: '/boa_belts_1.jpg' },
      { label: 'Midnight', swatch: '#0c0c0c', image: '/boabelts.jpg' },
      { label: 'Steel', swatch: '#b5b8bd', image: '/boa_belts_2.jpg' },
    ],
  },
  {
    id: 'd10',
    name: 'Skenderija Laptop Tote',
    price: '€245',
    category: 'daily',
    description:
      'Zippered tote with padded laptop pocket, leather cable tie, and luggage sleeve for commuting.',
    colors: [
      { label: 'Hazel', swatch: '#ad6b3a', image: '/boabelts2.jpg' },
      { label: 'Navy', swatch: '#1b2a3b', image: '/boabelts.jpg' },
      { label: 'Ivory', swatch: '#f1e9dd', image: '/boa_belts_4.jpg' },
    ],
  },
  {
    id: 't1',
    name: 'Bjelašnica Weekender',
    price: '€320',
    category: 'travel',
    description:
      'Oversized weekender with removable shoulder strap, shoe compartment, and brass feet.',
    colors: [
      { label: 'Whiskey', swatch: '#8d4b28', image: '/boa_belts_1.jpg' },
      { label: 'Obsidian', swatch: '#161616', image: '/boabelts.jpg' },
      { label: 'Stone', swatch: '#c8beb0', image: '/boa_belts_4.jpg' },
    ],
  },
  {
    id: 't2',
    name: 'Una Carryall',
    price: '€305',
    category: 'travel',
    description:
      'Carryall with wide opening, waxed canvas lining, and external passport pocket for airport ease.',
    colors: [
      { label: 'Hazelnut', swatch: '#a05f36', image: '/torba.jpg' },
      { label: 'Graphite', swatch: '#2c2c2c', image: '/boa_belts_3.jpg' },
      { label: 'Fjord', swatch: '#698196', image: '/boahero.jpg' },
    ],
  },
  {
    id: 't3',
    name: 'Kozara Duffel',
    price: '€315',
    category: 'travel',
    description:
      'Barrel duffel reinforced with double-stitched straps, side grab handles, and lockable zipper pulls.',
    colors: [
      { label: 'Sienna', swatch: '#a14f2b', image: '/boa_belts_2.jpg' },
      { label: 'Ink', swatch: '#121314', image: '/boabelts.jpg' },
      { label: 'Frost', swatch: '#d7d4cc', image: '/boa_belts_4.jpg' },
    ],
  },
  {
    id: 't4',
    name: 'Trebević Backpack',
    price: '€290',
    category: 'travel',
    description:
      'Roll-top backpack with padded back panel, laptop sleeve, and quick-access side zip.',
    colors: [
      { label: 'Chestnut', swatch: '#8f512c', image: '/boa_belts_1.jpg' },
      { label: 'Raven', swatch: '#1a1a1a', image: '/boahero.jpg' },
      { label: 'Pine', swatch: '#43563d', image: '/boa_belts_3.jpg' },
    ],
  },
  {
    id: 't5',
    name: 'Sutjeska Messenger',
    price: '€275',
    category: 'travel',
    description:
      'Messenger bag with padded shoulder strap, organiser panel, and quick-release buckle.',
    colors: [
      { label: 'Copper', swatch: '#9c552c', image: '/boabelts2.jpg' },
      { label: 'Slate', swatch: '#3a3a3a', image: '/boabelts.jpg' },
      { label: 'Stone', swatch: '#ccc4b6', image: '/boa_belts_4.jpg' },
    ],
  },
  {
    id: 't6',
    name: 'Prenj Garment Bag',
    price: '€360',
    category: 'travel',
    description:
      'Tri-fold garment bag with hanger clip system, interior zip pockets, and exterior document sleeve.',
    colors: [
      { label: 'Brandy', swatch: '#874327', image: '/boa_belts_2.jpg' },
      { label: 'Coal', swatch: '#202020', image: '/boabelts.jpg' },
      { label: 'Ivory', swatch: '#dfd8cc', image: '/boa_belts_4.jpg' },
    ],
  },
  {
    id: 't7',
    name: 'Drina Camera Bag',
    price: '€265',
    category: 'travel',
    description:
      'Camera bag with padded modular dividers, weather flap, and tripod strap anchors.',
    colors: [
      { label: 'Canyon', swatch: '#aa6233', image: '/boabelts2.jpg' },
      { label: 'Shadow', swatch: '#242424', image: '/boabelts.jpg' },
      { label: 'Cloud', swatch: '#d9d6cc', image: '/boa_belts_4.jpg' },
    ],
  },
  {
    id: 't8',
    name: 'Tara Convertible Tote',
    price: '€285',
    category: 'travel',
    description:
      'Convertible tote that shifts into a backpack with slide hardware and concealed straps.',
    colors: [
      { label: 'Maple', swatch: '#b66a35', image: '/boa_belts_1.jpg' },
      { label: 'Iron', swatch: '#2e2e2e', image: '/boabelts.jpg' },
      { label: 'Birch', swatch: '#e4dccc', image: '/boa_belts_4.jpg' },
    ],
  },
  {
    id: 't9',
    name: 'Lukomir Gear Duffel',
    price: '€335',
    category: 'travel',
    description:
      'Large-format gear duffel with waterproof lining, tie-down straps, and hidden tracker pocket.',
    colors: [
      { label: 'Mahogany', swatch: '#7f3a21', image: '/boa_belts_3.jpg' },
      { label: 'Night', swatch: '#151515', image: '/boahero.jpg' },
      { label: 'Glacier', swatch: '#ced1d6', image: '/boa_belts_4.jpg' },
    ],
  },
  {
    id: 't10',
    name: 'Igman Flight Bag',
    price: '€295',
    category: 'travel',
    description:
      'Cabin-sized flight bag with document organiser, removable strap, and trolley sleeve.',
    colors: [
      { label: 'Amber', swatch: '#b8622c', image: '/boabelts2.jpg' },
      { label: 'Shadow', swatch: '#232323', image: '/boabelts.jpg' },
      { label: 'Linen', swatch: '#ddd6c8', image: '/boa_belts_4.jpg' },
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

export default function BagsPageContent() {
  const { t } = useLanguage();
  const data = t.bagsPage;

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
            priority={product.id === 'd1'}
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

  const heroParagraphs = [data.heroSubtitle, ...data.craftsmanshipParagraphs];

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
          <h1 className="text-4xl font-semibold md:text-5xl">{data.craftsmanshipTitle}</h1>
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
