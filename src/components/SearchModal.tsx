'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { useLanguage } from './LanguageProvider';
import { catalogProducts, type CatalogCategory } from '../data/catalog';

type SearchProduct = {
  id: string;
  name: string;
  price: string;
  href: string;
  category: CatalogCategory;
  image?: string;
  searchable: string[];
};

const normalizeText = (value: string) =>
  value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase();

const categoryTokens: Record<CatalogCategory, string[]> = {
  womensBelts: ['belt', 'women', 'kais', 'zenski kais', 'zena'],
  mensBelts: ['belt', 'men', 'kais', 'muski kais', 'muski'],
  bags: ['bag', 'torba', 'ruksak'],
  wallets: ['wallet', 'novcanik', 'card holder'],
  accessories: ['accessory', 'dodatak', 'dodaci'],
};

export type SearchModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const { t } = useLanguage();
  const descriptionOverrides = useMemo<Record<string, string>>(
    () => (t.products?.descriptions ?? {}) as Record<string, string>,
    [t],
  );
  const productIndex = useMemo<SearchProduct[]>(() => {
    return catalogProducts.map((product) => {
      const description = descriptionOverrides[product.name] ?? product.description ?? '';
      const searchableTokens = [product.name, description, ...(categoryTokens[product.category] ?? [])].map(
        (value) => normalizeText(value),
      );
      const [path, fragment] = product.listHref.split('#');
      const baseHref = `${path}?product=${product.id}`;
      const href = fragment ? `${baseHref}#${fragment}` : baseHref;
      return {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.colors[0]?.preview ?? product.colors[0]?.image,
        href,
        category: product.category,
        searchable: searchableTokens,
      };
    });
  }, [descriptionOverrides]);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    const focusTimer = setTimeout(() => inputRef.current?.focus(), 0);
    document.body.classList.add('overflow-hidden');

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      clearTimeout(focusTimer);
      document.body.classList.remove('overflow-hidden');
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
    }
  }, [isOpen]);

  const results = useMemo(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      return [];
    }

    const tokens = normalizeText(trimmed)
      .split(/\s+/)
      .filter(Boolean);

    return productIndex.filter((item) =>
      tokens.every((token) => item.searchable.some((value) => value.includes(token))),
    );
  }, [query, productIndex]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center bg-black/50 backdrop-blur-sm px-4 py-16 sm:px-8">
      <div className="w-full max-w-3xl rounded-3xl bg-white shadow-xl">
        <header className="flex items-center gap-3 border-b border-[#ececec] px-6 py-4">
          <FaSearch className="h-4 w-4 text-[#9a7048]" aria-hidden="true" />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t.search.placeholder}
            className="flex-1 border-none bg-transparent text-base text-[#111] outline-none placeholder:text-[#9c9c9c]"
            aria-label={t.search.inputLabel}
          />
          <button
            type="button"
            onClick={() => {
              setQuery('');
              onClose();
            }}
            className="rounded-full border border-transparent p-2 text-[#7a7a7a] transition hover:border-[#d0d0d0] hover:text-[#111]"
            aria-label={t.search.closeLabel}
          >
            <FaTimes className="h-4 w-4" aria-hidden="true" />
          </button>
        </header>
        <div className="max-h-[60vh] overflow-y-auto px-6 py-5">
          {query.trim() !== '' && results.length > 0 && (
            <ul className="space-y-3">
              {results.map((product) => (
                <li key={product.id}>
                  <Link
                    href={product.href}
                    onClick={() => {
                      setQuery('');
                      onClose();
                    }}
                    className="group flex items-center gap-4 rounded-2xl border border-[#f0f0f0] bg-white p-3 transition hover:border-[#9a7048]/40 hover:bg-[#fdf9f6]"
                  >
                    <div className="relative h-16 w-16 overflow-hidden rounded-xl bg-[#f5f5f5]">
                      {product.image ? (
                        <Image src={product.image} alt={product.name} fill sizes="64px" className="object-cover" />
                      ) : (
                        <span className="flex h-full w-full items-center justify-center text-xs text-[#9c9c9c]">
                          {t.search.noImage}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col gap-1">
                      <span className="text-sm font-semibold text-[#111]">{product.name}</span>
                      <span className="text-xs uppercase tracking-[0.18em] text-[#9a7048]">
                        {t.search.categoryLabels[product.category]}
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-[#111]">{product.price}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
