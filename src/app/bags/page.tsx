import type { Metadata } from 'next';
import BagsPageContent from '@/components/BagsPageContent';

export const metadata: Metadata = {
  title: 'Boa Belts | Leather Bags and Totes',
  description:
    'Discover handmade leather tote, crossbody, and travel bags crafted in Travnik with reinforced stitching and premium hardware.',
};

type SearchParamsPromise = Promise<Record<string, string | string[]>>;

export default function BagsPage({ searchParams }: { searchParams?: SearchParamsPromise }) {
  const resolved =
    (searchParams as unknown as Record<string, string | string[] | undefined> | undefined) ?? undefined;
  const rawProduct = resolved.product;
  const focusedProductId = Array.isArray(rawProduct) ? rawProduct[0] ?? null : rawProduct ?? null;

  return <BagsPageContent focusedProductId={focusedProductId} />;
}
