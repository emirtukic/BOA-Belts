import type { Metadata } from 'next';
import AccessoriesPageContent from '@/components/AccessoriesPageContent';

export const metadata: Metadata = {
  title: 'Boa Belts | Handcrafted Leather Accessories',
  description:
    'Explore Travnik-crafted leather accessories including wristwear, sheaths, and covers designed to accompany your everyday carry.',
};

type SearchParams = { product?: string | string[] } | Promise<{ product?: string | string[] }>;

export default function AccessoriesPage({ searchParams }: { searchParams?: SearchParams }) {
  const resolved = (searchParams ?? {}) as { product?: string | string[] };
  const rawProduct = resolved.product;
  const focusedProductId = Array.isArray(rawProduct) ? rawProduct[0] ?? null : rawProduct ?? null;

  return <AccessoriesPageContent focusedProductId={focusedProductId} />;
}
