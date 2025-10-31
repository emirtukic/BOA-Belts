'use client';

import { useCallback, useEffect, useMemo, useRef, useState, type TouchEvent } from 'react';
import Image from 'next/image';
import { FaChevronLeft, FaChevronRight, FaTimes } from 'react-icons/fa';

type LightboxItem = {
  src: string;
  alt: string;
};

type ImageLightboxProps = {
  items: LightboxItem[];
  initialIndex?: number;
  onClose: () => void;
};

export function ImageLightbox({ items, initialIndex = 0, onClose }: ImageLightboxProps) {
  const safeItems = useMemo(
    () => (items.length > 0 ? items : [{ src: '/boabelts.jpg', alt: 'Product image' }]),
    [items],
  );
  const [currentIndex, setCurrentIndex] = useState(() =>
    initialIndex >= 0 && initialIndex < safeItems.length ? initialIndex : 0,
  );
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const goNext = useCallback(() => {
    setCurrentIndex((index) => (index + 1) % safeItems.length);
  }, [safeItems.length]);

  const goPrev = useCallback(() => {
    setCurrentIndex((index) => (index - 1 + safeItems.length) % safeItems.length);
  }, [safeItems.length]);

  useEffect(() => {
    if (initialIndex >= 0 && initialIndex < safeItems.length) {
      setCurrentIndex(initialIndex);
    } else {
      setCurrentIndex(0);
    }
  }, [initialIndex, safeItems.length]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
      if (event.key === 'ArrowRight') {
        goNext();
      }
      if (event.key === 'ArrowLeft') {
        goPrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [goNext, goPrev, onClose]);

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    touchStartX.current = event.changedTouches[0].clientX;
  };

  const handleTouchMove = (event: TouchEvent<HTMLDivElement>) => {
    touchEndX.current = event.changedTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) {
      touchStartX.current = null;
      touchEndX.current = null;
      return;
    }

    const delta = touchStartX.current - touchEndX.current;
    if (Math.abs(delta) > 40) {
      if (delta > 0) {
        goNext();
      } else {
        goPrev();
      }
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  const activeItem = safeItems[currentIndex];
  const showControls = safeItems.length > 1;

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4 py-6"
      role="dialog"
      aria-modal="true"
      aria-label={activeItem.alt}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-[#111] shadow-md transition hover:bg-white"
          aria-label="Close image preview"
        >
          <FaTimes className="h-4 w-4" />
        </button>

        {showControls && (
          <>
            <button
              type="button"
              onClick={goPrev}
              className="absolute left-4 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-[#111] shadow-md transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-white/60"
              aria-label="Previous image"
            >
              <FaChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={goNext}
              className="absolute right-4 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-[#111] shadow-md transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-white/60"
              aria-label="Next image"
            >
              <FaChevronRight className="h-4 w-4" />
            </button>
          </>
        )}

        <div className="relative h-[70vh] w-full max-h-[85vh] rounded-3xl bg-white/5 p-3 sm:p-6">
          <div
            className="relative h-full w-full overflow-hidden rounded-2xl bg-[#0f0f0f]"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <Image
              key={activeItem.src}
              src={activeItem.src}
              alt={activeItem.alt}
              fill
              sizes="(max-width: 768px) 90vw, 60vw"
              className="object-contain"
              priority
            />
          </div>
        </div>

        {showControls && (
          <div className="mt-6 flex items-center justify-center gap-2 text-xs uppercase tracking-[0.3em] text-white/80">
            <span>{String(currentIndex + 1).padStart(2, '0')}</span>
            <span className="h-px w-6 bg-white/40" aria-hidden="true" />
            <span>{String(safeItems.length).padStart(2, '0')}</span>
          </div>
        )}
      </div>
    </div>
  );
}
