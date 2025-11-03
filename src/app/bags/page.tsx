import { Suspense } from 'react';
import type { Metadata } from 'next';
import BagsPageContent from '@/components/BagsPageContent';
import { BagsPageContainer } from '@/components/BagsPageContainer';

export const metadata: Metadata = {
  title: 'Boa Belts | Leather Bags and Totes',
  description:
    'Discover handmade leather tote, crossbody, and travel bags crafted in Travnik with reinforced stitching and premium hardware.',
};

export default function BagsPage() {
  return (
    <Suspense fallback={<BagsPageContent focusedProductId={null} />}>
      <BagsPageContainer />
    </Suspense>
  );
}
