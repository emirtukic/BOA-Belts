import type { Metadata } from 'next';
import BagsPageContent from '@/components/BagsPageContent';

export const metadata: Metadata = {
  title: 'Boa Belts | Leather Bags and Totes',
  description:
    'Discover handmade leather tote, crossbody, and travel bags crafted in Travnik with reinforced stitching and premium hardware.',
};

type SearchParams = Record<string, string | string[] | undefined>;

export default function BagsPage({ searchParams }: { searchParams?: SearchParams }) {
  const rawProduct = searchParams?.product;
  const focusedProductId = Array.isArray(rawProduct) ? rawProduct[0] ?? null : rawProduct ?? null;

  return <BagsPageContent focusedProductId={focusedProductId} />;
}
