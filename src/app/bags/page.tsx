import type { Metadata } from 'next';
import BagsPageContent from '@/components/BagsPageContent';

export const metadata: Metadata = {
  title: 'Boa Belts | Leather Bags and Totes',
  description:
    'Discover handmade leather tote, crossbody, and travel bags crafted in Travnik with reinforced stitching and premium hardware.',
};

export default function BagsPage() {
  return <BagsPageContent />;
}

