'use client';

import { useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { FaChevronDown, FaInfoCircle, FaTimes } from 'react-icons/fa';
import { useLanguage } from './LanguageProvider';
import { LoyaltyCardSection } from './LoyaltyCardSection';
import { ImageLightbox } from './ImageLightbox';
import { womensBelts } from '../data/womensBelts';
import { mensBelts } from '../data/mensBelts';

type Category = 'women' | 'men';

type ProductVariant = {
  label: string;
  swatch?: string;
  image: string;
  preview?: string;
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

const womensCatalog: Product[] = womensBelts.map((belt) => ({
  ...belt,
  colors: belt.colors.map((variant) => ({
    label: variant.label,
    image: variant.image,
    preview: variant.preview ?? variant.image,
  })),
}));

const mensCatalog: Product[] = mensBelts.map((belt) => ({
  ...belt,
  colors: belt.colors.map((variant) => ({
    label: variant.label,
    image: variant.image,
    preview: variant.preview ?? variant.image,
  })),
}));

const products: Product[] = [...womensCatalog, ...mensCatalog];
const leadProductId = womensCatalog[0]?.id ?? mensCatalog[0]?.id ?? null;


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

  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const formatTemplate = (template: string, replacements: Record<string, string>) =>
    Object.entries(replacements).reduce(
      (acc, [key, value]) => acc.replace(new RegExp(`\\{${key}\\}`, 'g'), value),
      template,
    );

  const [selectedColors, setSelectedColors] = useState<Record<string, number>>(() =>
    Object.fromEntries(products.map((product) => [product.id, 0])),
  );
  const [openProductId, setOpenProductId] = useState<string | null>(null);
  const [lightboxState, setLightboxState] = useState<
    { items: { src: string; alt: string }[]; index: number } | null
  >(null);
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
    const variants =
      product.colors.length > 0
        ? product.colors
        : [{ label: 'Photo 1', image: '/boabelts.jpg', preview: '/boabelts.jpg' }];
    const activeIndex = selectedColors[product.id] ?? 0;
    const activeVariant = variants[activeIndex] ?? variants[0];
    const imageAlt = `${product.name} - ${activeVariant.label}`;

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
        <button
          type="button"
          onClick={() =>
            setLightboxState({
              items: variants.map((variant) => ({
                src: variant.image,
                alt: `${product.name} - ${variant.label}`,
              })),
              index: activeIndex,
            })
          }
          className="relative h-72 w-full overflow-hidden bg-[#f5f5f5] focus:outline-none focus:ring-2 focus:ring-[#111]"
          aria-label={`Open larger view of ${imageAlt}`}
        >
          <Image
            src={activeVariant.image}
            alt={imageAlt}
            fill
            sizes="(min-width: 1280px) 280px, (min-width: 768px) 33vw, 90vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            priority={leadProductId !== null && product.id === leadProductId}
          />
        </button>
        <div className="flex flex-1 flex-col gap-6 p-6">
          <div className="flex flex-wrap items-center gap-2">
            {variants.map((variant, index) => {
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
                  style={{
                    backgroundColor: variant.swatch ?? '#dcdcdc',
                    backgroundImage: variant.preview ? `url(${variant.preview})` : undefined,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    filter: isActive ? 'none' : 'brightness(0.7)',
                  }}
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
              {data.card.availabilityLabel}
            </p>
          </div>
          <div className="mt-auto flex items-baseline justify-between">
            <span className="text-base font-semibold text-[#111]">{product.price}</span>
          </div>
        </div>
        {openProductId === product.id && (
          <div className="absolute inset-0 z-30 flex flex-col gap-4 bg-[#111]/90 p-6 text-white backdrop-blur-sm">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="text-xl font-semibold">{product.name}</h4>
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
          <LoyaltyCardSection className="mt-4" />
        </section>
      </section>
      {lightboxState && (
        <ImageLightbox
          items={lightboxState.items}
          initialIndex={lightboxState.index}
          onClose={() => setLightboxState(null)}
        />
      )}
    </main>
  );
}
