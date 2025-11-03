import type { Metadata } from 'next';
import AccessoriesPageContent from '@/components/AccessoriesPageContent';

export const metadata: Metadata = {
  title: 'Boa Belts | Handcrafted Leather Accessories',
  description:
    'Explore Travnik-crafted leather accessories including wristwear, sheaths, and covers designed to accompany your everyday carry.',
};

type SearchParams = Record<string, string | string[] | undefined>;

export default function AccessoriesPage({ searchParams }: { searchParams?: SearchParams }) {
  const rawProduct = searchParams?.product;
  const focusedProductId = Array.isArray(rawProduct) ? rawProduct[0] ?? null : rawProduct ?? null;

  return <AccessoriesPageContent focusedProductId={focusedProductId} />;
}
