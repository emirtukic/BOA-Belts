'use client';

import { useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { FaChevronDown, FaInfoCircle, FaTimes } from 'react-icons/fa';
import { useLanguage } from './LanguageProvider';
import { LoyaltyCardSection } from './LoyaltyCardSection';

type Category = 'women' | 'men';

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
    id: 'w1',
    name: 'Travnik Slim',
    price: '€120',
    category: 'women',
    description:
      'Elegant, hand-stitched slim belt that pairs with dresses and high-waist tailoring. Features Italian brass hardware.',
    colors: [
      { label: 'Chestnut', swatch: '#8b5a2b', image: '/boa_belts_1.jpg' },
      { label: 'Obsidian', swatch: '#1f1f1f', image: '/belt.jpg' },
      { label: 'Ivory', swatch: '#f2e5d7', image: '/boa_belts_4.jpg' },
    ],
  },
  {
    id: 'w2',
    name: 'Sutjeska Wrap',
    price: '€135',
    category: 'women',
    description:
      'Soft wrap belt crafted for layering over knitwear. Double-sided leather with suede backing for grip.',
    colors: [
      { label: 'Cognac', swatch: '#a0522d', image: '/boa_belts_2.jpg' },
      { label: 'Coal', swatch: '#2a2a2a', image: '/boa_belts_3.jpg' },
      { label: 'Ash', swatch: '#d7d2cb', image: '/boa_belts_4.jpg' },
    ],
  },
  {
    id: 'w3',
    name: 'Sarajevo Knot',
    price: '€140',
    category: 'women',
    description:
      'Signature knotted belt with polished edges and tapered tips. Designed to cinch without bulk.',
    colors: [
      { label: 'Burgundy', swatch: '#5c1a27', image: '/boa_belts_3.jpg' },
      { label: 'Night', swatch: '#141414', image: '/belt.jpg' },
      { label: 'Sand', swatch: '#d6c2a6', image: '/boa_belts_4.jpg' },
    ],
  },
  {
    id: 'w4',
    name: 'Pliva Double',
    price: '€150',
    category: 'women',
    description:
      'Double-strap keeper belt with adjustable spacing. Finished with hand-polished edge paint for longevity.',
    colors: [
      { label: 'Caramel', swatch: '#b07335', image: '/boa_belts_1.jpg' },
      { label: 'Espresso', swatch: '#2f1b0c', image: '/boa_belts_2.jpg' },
      { label: 'Pebble', swatch: '#c4b5a5', image: '/boa_belts_4.jpg' },
    ],
  },
  {
    id: 'w5',
    name: 'Ravna Minimal',
    price: '€115',
    category: 'women',
    description:
      'Minimalist one-piece strap with hidden Chicago screws for quick buckle swaps. Ideal for capsule wardrobes.',
    colors: [
      { label: 'Maple', swatch: '#c16a3b', image: '/boa_belts_1.jpg' },
      { label: 'Slate', swatch: '#3f3f3f', image: '/belt.jpg' },
      { label: 'Bone', swatch: '#efe1d0', image: '/boa_belts_4.jpg' },
    ],
  },
  {
    id: 'w6',
    name: 'Lipa Statement',
    price: '€165',
    category: 'women',
    description:
      'Wide cinch belt with sculpted brass buckle. Hand-dyed edges and saddle-stitched seams for durability.',
    colors: [
      { label: 'Walnut', swatch: '#7b4b2a', image: '/boa_belts_2.jpg' },
      { label: 'Ink', swatch: '#0f0f0f', image: '/boa_belts_3.jpg' },
      { label: 'Cream', swatch: '#f3eadf', image: '/boa_belts_4.jpg' },
    ],
  },
  {
    id: 'w7',
    name: 'Una Contour',
    price: '€145',
    category: 'women',
    description:
      'Contour-cut belt that hugs the waistline. Finished with beveled edges and matte hardware for a modern look.',
    colors: [
      { label: 'Russet', swatch: '#8c4023', image: '/boa_belts_1.jpg' },
      { label: 'Char', swatch: '#242424', image: '/belt.jpg' },
      { label: 'Fawn', swatch: '#d9c2a7', image: '/boa_belts_4.jpg' },
    ],
  },
  {
    id: 'w8',
    name: 'Mahala Braid',
    price: '€155',
    category: 'women',
    description:
      'Hand-braided strap in premium veg-tan leather. Slight stretch for comfort with a polished brass buckle.',
    colors: [
      { label: 'Honey', swatch: '#c77935', image: '/boa_belts_2.jpg' },
      { label: 'Graphite', swatch: '#3b3b3b', image: '/boa_belts_3.jpg' },
      { label: 'Linen', swatch: '#e9ded0', image: '/boa_belts_4.jpg' },
    ],
  },
  {
    id: 'w9',
    name: 'Vila Accent',
    price: '€130',
    category: 'women',
    description:
      'Accent belt with stitched tonal piping and petite buckle. Perfect for blazers and pencil skirts.',
    colors: [
      { label: 'Cedar', swatch: '#a8653d', image: '/boa_belts_1.jpg' },
      { label: 'Obsidian', swatch: '#1d1d1d', image: '/belt.jpg' },
      { label: 'Shell', swatch: '#f5e7d6', image: '/boa_belts_4.jpg' },
    ],
  },
  {
    id: 'w10',
    name: 'Lukava Curve',
    price: '€160',
    category: 'women',
    description:
      'Curved strap that sits naturally on the hips. Hand burnished and conditioned for a soft sheen.',
    colors: [
      { label: 'Brandy', swatch: '#934d2c', image: '/boa_belts_2.jpg' },
      { label: 'Pitch', swatch: '#191919', image: '/boa_belts_3.jpg' },
      { label: 'Mist', swatch: '#ded1c3', image: '/boa_belts_4.jpg' },
    ],
  },
  {
    id: 'm1',
    name: 'Bosna Heritage',
    price: '€175',
    category: 'men',
    description:
      'Full-grain harness leather belt with heavy brass buckle. Built for denim and everyday wear.',
    colors: [
      { label: 'Oak', swatch: '#784421', image: '/boa_belts_1.jpg' },
      { label: 'Coal', swatch: '#161616', image: '/belt.jpg' },
      { label: 'Whiskey', swatch: '#a1572f', image: '/boa_belts_2.jpg' },
    ],
  },
  {
    id: 'm2',
    name: 'Drina Workwear',
    price: '€165',
    category: 'men',
    description:
      'Robust workwear belt with hand saddle-stitched keeper and beveled edges for comfort.',
    colors: [
      { label: 'Umber', swatch: '#845634', image: '/boa_belts_2.jpg' },
      { label: 'Iron', swatch: '#2b2b2b', image: '/boa_belts_3.jpg' },
      { label: 'Taupe', swatch: '#c2b5a6', image: '/boa_belts_4.jpg' },
    ],
  },
  {
    id: 'm3',
    name: 'Neretva Classic',
    price: '€155',
    category: 'men',
    description:
      'Classic dress belt with slim profile and polished nickel buckle. Ideal for tailoring.',
    colors: [
      { label: 'Mahogany', swatch: '#6e2f21', image: '/boa_belts_1.jpg' },
      { label: 'Jet', swatch: '#111111', image: '/belt.jpg' },
      { label: 'Clay', swatch: '#c7b7a1', image: '/boa_belts_4.jpg' },
    ],
  },
  {
    id: 'm4',
    name: 'Dinara Ranger',
    price: '€185',
    category: 'men',
    description:
      'Ranger-style belt with layered strap and Chicago screws. Built to handle heavy use.',
    colors: [
      { label: 'Rust', swatch: '#8d3f1f', image: '/boa_belts_2.jpg' },
      { label: 'Graphite', swatch: '#232323', image: '/boa_belts_3.jpg' },
      { label: 'Stone', swatch: '#d8ccbf', image: '/boa_belts_4.jpg' },
    ],
  },
  {
    id: 'm5',
    name: 'Jajce Field',
    price: '€170',
    category: 'men',
    description:
      'Field belt with matte buckle and waxed stitching. Treated with natural oils for weather resistance.',
    colors: [
      { label: 'Elm', swatch: '#7b4a24', image: '/boa_belts_1.jpg' },
      { label: 'Carbon', swatch: '#1c1c1c', image: '/belt.jpg' },
      { label: 'Flint', swatch: '#b7aa9b', image: '/boa_belts_4.jpg' },
    ],
  },
  {
    id: 'm6',
    name: 'Kozara Minimal',
    price: '€145',
    category: 'men',
    description:
      'Slim minimal belt with hidden slot for interchangeable buckles. Satin burnished finish.',
    colors: [
      { label: 'Tobacco', swatch: '#9a5a34', image: '/boa_belts_2.jpg' },
      { label: 'Midnight', swatch: '#121212', image: '/boa_belts_3.jpg' },
      { label: 'Smoke', swatch: '#d0c4b7', image: '/boa_belts_4.jpg' },
    ],
  },
  {
    id: 'm7',
    name: 'Zenica Utility',
    price: '€190',
    category: 'men',
    description:
      'Utility belt with reinforced holes and brass roller buckle. Perfect for rugged denim.',
    colors: [
      { label: 'Saddle', swatch: '#8a4e2a', image: '/boa_belts_1.jpg' },
      { label: 'Charcoal', swatch: '#292929', image: '/belt.jpg' },
      { label: 'Drift', swatch: '#c9bdac', image: '/boa_belts_4.jpg' },
    ],
  },
  {
    id: 'm8',
    name: 'Igman Braided',
    price: '€180',
    category: 'men',
    description:
      'Loosely braided strap for added flex and comfort. Finished with hand-beveled edges.',
    colors: [
      { label: 'Hazel', swatch: '#a05e2f', image: '/boa_belts_2.jpg' },
      { label: 'Steel', swatch: '#303030', image: '/boa_belts_3.jpg' },
      { label: 'Dune', swatch: '#dbcebf', image: '/boa_belts_4.jpg' },
    ],
  },
  {
    id: 'm9',
    name: 'Modrac Buckle',
    price: '€160',
    category: 'men',
    description:
      'Custom buckle belt with laser engraved interior detailing. Designed for business casual looks.',
    colors: [
      { label: 'Amber', swatch: '#a65c2b', image: '/boa_belts_1.jpg' },
      { label: 'Onyx', swatch: '#171717', image: '/belt.jpg' },
      { label: 'Marble', swatch: '#d5c7b8', image: '/boa_belts_4.jpg' },
    ],
  },
  {
    id: 'm10',
    name: 'Visoko Traveller',
    price: '€200',
    category: 'men',
    description:
      'Traveller belt with removable pouch slot and reinforced loop. Oil-treated for patina-rich aging.',
    colors: [
      { label: 'Chestnut', swatch: '#8c4f2a', image: '/boa_belts_2.jpg' },
      { label: 'Eclipse', swatch: '#101010', image: '/boa_belts_3.jpg' },
      { label: 'Birch', swatch: '#e1d4c6', image: '/boa_belts_4.jpg' },
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

export default function BeltsPageContent() {
  const { t } = useLanguage();
  const data = t.beltsPage;

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
  const [activeCategory, setActiveCategory] = useState<Category>('women');

  const womensSectionRef = useRef<HTMLDivElement | null>(null);
  const mensSectionRef = useRef<HTMLDivElement | null>(null);

  const womensProducts = useMemo(
    () => sortProductsByPrice(products.filter((product) => product.category === 'women'), sortOrder),
    [sortOrder],
  );
  const mensProducts = useMemo(
    () => sortProductsByPrice(products.filter((product) => product.category === 'men'), sortOrder),
    [sortOrder],
  );

  const womensCountLabel = `${womensProducts.length} ${data.sections.stylesLabel}`;
  const mensCountLabel = `${mensProducts.length} ${data.sections.stylesLabel}`;

  const handleColorChange = (productId: string, index: number) => {
    setSelectedColors((prev) => ({
      ...prev,
      [productId]: index,
    }));
  };

  const handleMenuClick = (category: Category) => {
    setActiveCategory(category);
    const target = category === 'women' ? womensSectionRef.current : mensSectionRef.current;
    target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
            priority={product.id === 'w1'}
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
                    isActive
                      ? 'ring-2 ring-offset-2 ring-[#1f1f1f] shadow-md'
                      : 'hover:shadow-md'
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
          <p className="text-sm uppercase tracking-[0.4em] text-[#9a7048]">
            {data.craftsmanshipTitle}
          </p>
          <h1 className="text-4xl font-semibold md:text-5xl">{data.highlightTitle}</h1>
          <div className="space-y-4 text-base text-[#3a3a3a] md:text-lg">
            {data.craftsmanshipParagraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-6 pb-24 pt-20">
        <nav
          aria-label="Belt categories"
          className="mx-auto flex w-full max-w-md justify-center gap-4 rounded-full border border-[#dfdfdf] bg-white p-2 shadow-sm"
        >
          <button
            type="button"
            onClick={() => handleMenuClick('women')}
            className={`flex-1 rounded-full px-6 py-3 text-sm font-semibold uppercase tracking-wide transition ${
              activeCategory === 'women'
                ? 'bg-[#111] text-white shadow'
                : 'text-[#111] hover:bg-[#111] hover:text-white'
            }`}
            aria-pressed={activeCategory === 'women'}
          >
            {data.categoryMenu.womens}
          </button>
          <button
            type="button"
            onClick={() => handleMenuClick('men')}
            className={`flex-1 rounded-full px-6 py-3 text-sm font-semibold uppercase tracking-wide transition ${
              activeCategory === 'men'
                ? 'bg-[#111] text-white shadow'
                : 'text-[#111] hover:bg-[#111] hover:text-white'
            }`}
            aria-pressed={activeCategory === 'men'}
          >
            {data.categoryMenu.mens}
          </button>
        </nav>

        <section
          ref={womensSectionRef}
          id="womens-belts"
          className={`space-y-8 ${activeCategory !== 'women' ? 'hidden' : ''}`}
          aria-hidden={activeCategory !== 'women'}
        >
          <div className="flex flex-col items-start justify-between gap-3 md:flex-row md:items-center">
            <div>
              <h3 className="text-2xl font-semibold md:text-3xl">
                {data.sections.womens.title}
              </h3>
              <p className="text-sm text-[#6a6a6a]">{data.sections.womens.subtitle}</p>
            </div>
            <div className="flex flex-col items-end gap-2 sm:flex-row sm:items-center sm:gap-3">
              <span className="rounded-full border border-[#dedede] px-4 py-2 text-xs font-semibold uppercase tracking-wide text-[#9a7048]">
                {womensCountLabel}
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
            {womensProducts.map((product) => renderProductCard(product))}
          </div>
        </section>

        <LoyaltyCardSection className="mt-4" />

        <section
          ref={mensSectionRef}
          id="mens-belts"
          className={`space-y-8 ${activeCategory !== 'men' ? 'hidden' : ''}`}
          aria-hidden={activeCategory !== 'men'}
        >
          <div className="flex flex-col items-start justify-between gap-3 md:flex-row md:items-center">
            <div>
              <h3 className="text-2xl font-semibold md:text-3xl">{data.sections.mens.title}</h3>
              <p className="text-sm text-[#6a6a6a]">{data.sections.mens.subtitle}</p>
            </div>
            <div className="flex flex-col items-end gap-2 sm:flex-row sm:items-center sm:gap-3">
              <span className="rounded-full border border-[#dedede] px-4 py-2 text-xs font-semibold uppercase tracking-wide text-[#9a7048]">
                {mensCountLabel}
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
            {mensProducts.map((product) => renderProductCard(product))}
          </div>
        </section>
      </section>
    </main>
  );
}
