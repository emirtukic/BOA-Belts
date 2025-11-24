import { Suspense } from 'react';
import type { Metadata } from 'next';
import BagsPageContent from '@/components/BagsPageContent';
import { BagsPageContainer } from '@/components/BagsPageContainer';

export const metadata: Metadata = {
  title: 'Torbe ra\u0111ene ru\u010dno',
  description:
    'Otkrij tote, crossbody i putne torbe krojene i \u0161ivene u Travniku sa oja\u010danim ru\u010dkama i preciznim detaljima.',
};

export default function BagsPage() {
  return (
    <Suspense fallback={<BagsPageContent focusedProductId={null} />}>
      <BagsPageContainer />
    </Suspense>
  );
}
