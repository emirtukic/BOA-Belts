'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { ImageLightbox } from './ImageLightbox';

type Variant = {
  label: string;
  image: string;
  preview?: string;
};

type ProductGalleryProps = {
  productName: string;
  variants: Variant[];
};

const fallbackVariant: Variant = {
  label: 'Photo 1',
  image: '/boabelts.jpg',
  preview: '/boabelts.jpg',
};

export function ProductGallery({ productName, variants }: ProductGalleryProps) {
  const safeVariants = variants.length > 0 ? variants : [fallbackVariant];
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const activeVariant = safeVariants[activeIndex] ?? safeVariants[0];

  const lightboxItems = useMemo(
    () =>
      safeVariants.map((variant) => ({
        src: variant.image,
        alt: `${productName} - ${variant.label}`,
      })),
    [productName, safeVariants],
  );

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={() => setLightboxIndex(activeIndex)}
        className="relative block h-[420px] w-full overflow-hidden rounded-3xl border border-[#e3e3e3] bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#111] md:h-[520px]"
      >
        <Image
          key={activeVariant.image}
          src={activeVariant.image}
          alt={`${productName} - ${activeVariant.label}`}
          fill
          sizes="(min-width: 1024px) 640px, 100vw"
          className="object-cover transition-transform duration-500 hover:scale-[1.02]"
          priority
        />
        <span className="absolute bottom-4 left-4 rounded-full bg-white/85 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-[#111] shadow">
          Pogledaj u punoj veličini
        </span>
      </button>

      {safeVariants.length > 1 && (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {safeVariants.map((variant, index) => {
            const isActive = index === activeIndex;
            return (
              <button
                key={variant.label}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`group relative h-36 overflow-hidden rounded-2xl border bg-white shadow-sm transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#111] ${
                  isActive ? 'border-[#111] ring-2 ring-[#111]' : 'border-[#e6e6e6]'
                }`}
                aria-pressed={isActive}
                aria-label={`Prikaži ${variant.label}`}
              >
                <Image
                  src={variant.image}
                  alt={`${productName} - ${variant.label}`}
                  fill
                  sizes="200px"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <span className="absolute bottom-2 left-2 rounded-full bg-white/85 px-3 py-1 text-xs font-semibold text-[#111] shadow">
                  {variant.label}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {lightboxIndex !== null && (
        <ImageLightbox
          items={lightboxItems}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </div>
  );
}
