'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { ImageLightbox } from './ImageLightbox';
import type { RevijaGalleryImage } from '@/data/revijaGallery';

type RevijaGalleryProps = {
  images: readonly RevijaGalleryImage[];
};

export function RevijaGallery({ images }: RevijaGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const items = useMemo(
    () =>
      images.map((src, index) => ({
        src,
        alt: `BH Fashion Week runway fotografija ${index + 1}`,
      })),
    [images],
  );

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
  };

  const closeLightbox = () => setLightboxIndex(null);

  return (
    <>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, index) => (
          <button
            key={item.src}
            type="button"
            onClick={() => openLightbox(index)}
            className="group relative overflow-hidden rounded-3xl border border-[#ebebeb] bg-white shadow-sm transition hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-[#9a7048]"
            aria-label={`Otvori fotografiju ${index + 1} sa revije`}
          >
            <div className="relative aspect-[3/4] w-full">
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes="(min-width: 1280px) 400px, (min-width: 768px) 45vw, 90vw"
                className="object-cover transition duration-300 group-hover:scale-105"
              />
            </div>
          </button>
        ))}
      </div>
      {lightboxIndex !== null && (
        <ImageLightbox items={items} initialIndex={lightboxIndex} onClose={closeLightbox} />
      )}
    </>
  );
}
