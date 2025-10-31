import type { Metadata } from 'next';
import BeltsPageContent from '@/components/BeltsPageContent';

export const metadata: Metadata = {
  title: 'Boa Belts | Signature Leather Belts',
  description:
    'Explore handcrafted belts made in Travnik with full-grain leather, solid hardware, and bespoke sizing options.',
};

export default function BeltsPage() {
  return <BeltsPageContent />;
}

