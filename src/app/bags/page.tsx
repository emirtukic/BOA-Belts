import type { Metadata } from 'next';
import BagsPageContent from '@/components/BagsPageContent';

export const metadata: Metadata = {
  title: 'Boa Belts | Leather Bags and Totes',
  description:
    'Discover handmade leather tote, crossbody, and travel bags crafted in Travnik with reinforced stitching and premium hardware.',
};

type SearchParams = { product?: string | string[] } | Promise<{ product?: string | string[] }>;

export default function BagsPage({ searchParams }: { searchParams?: SearchParams }) {
  const resolved = (searchParams ?? {}) as { product?: string | string[] };
  const rawProduct = resolved.product;
  const focusedProductId = Array.isArray(rawProduct) ? rawProduct[0] ?? null : rawProduct ?? null;

  return <BagsPageContent focusedProductId={focusedProductId} />;
}
