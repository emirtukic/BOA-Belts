import type { Metadata } from 'next';
import BeltsPageContent from '@/components/BeltsPageContent';

export const metadata: Metadata = {
  title: 'Boa Belts | Signature Leather Belts',
  description:
    'Explore handcrafted belts made in Travnik with full-grain leather, solid hardware, and bespoke sizing options.',
};

type SearchParamsPromise = Promise<Record<string, string | string[]>>;

export default function BeltsPage({ searchParams }: { searchParams?: SearchParamsPromise }) {
  const resolved =
    (searchParams as unknown as Record<string, string | string[] | undefined> | undefined) ?? undefined;
  const rawProduct = resolved?.product;
  const focusedProductId = Array.isArray(rawProduct) ? rawProduct[0] ?? null : rawProduct ?? null;

  return <BeltsPageContent focusedProductId={focusedProductId} />;
}
