import type { Metadata } from 'next';
import WalletsPageContent from '@/components/WalletsPageContent';

export const metadata: Metadata = {
  title: 'Boa Belts | Leather Wallets and Accessories',
  description:
    'Custom card holders, bifold wallets, and travel folios handcrafted in Travnik with saddle-stitched seams.',
};

type SearchParamsPromise = Promise<Record<string, string | string[]>>;

export default function WalletsPage({ searchParams }: { searchParams?: SearchParamsPromise }) {
  const resolved =
    (searchParams as unknown as Record<string, string | string[] | undefined> | undefined) ?? undefined;
  const rawProduct = resolved?.product;
  const focusedProductId = Array.isArray(rawProduct) ? rawProduct[0] ?? null : rawProduct ?? null;

  return <WalletsPageContent focusedProductId={focusedProductId} />;
}
