import type { Metadata } from 'next';
import WalletsPageContent from '@/components/WalletsPageContent';

export const metadata: Metadata = {
  title: 'Boa Belts | Leather Wallets and Accessories',
  description:
    'Custom card holders, bifold wallets, and travel folios handcrafted in Travnik with saddle-stitched seams.',
};

export default function WalletsPage() {
  return <WalletsPageContent />;
}

