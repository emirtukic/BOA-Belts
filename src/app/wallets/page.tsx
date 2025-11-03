import type { Metadata } from 'next';
import WalletsPageContent from '@/components/WalletsPageContent';

export const metadata: Metadata = {
  title: 'Boa Belts | Leather Wallets and Accessories',
  description:
    'Custom card holders, bifold wallets, and travel folios handcrafted in Travnik with saddle-stitched seams.',
};

type SearchParams = { product?: string | string[] } | Promise<{ product?: string | string[] }>;

export default function WalletsPage({ searchParams }: { searchParams?: SearchParams }) {
  const resolved = (searchParams ?? {}) as { product?: string | string[] };
  const rawProduct = resolved.product;
  const focusedProductId = Array.isArray(rawProduct) ? rawProduct[0] ?? null : rawProduct ?? null;

  return <WalletsPageContent focusedProductId={focusedProductId} />;
}
