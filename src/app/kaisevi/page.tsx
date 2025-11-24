import { Suspense } from 'react';
import type { Metadata } from 'next';
import BeltsPageContent from '@/components/BeltsPageContent';
import { BeltsPageContainer } from '@/components/BeltsPageContainer';

export const metadata: Metadata = {
  title: 'Kai\u0161evi po mjeri',
  description:
    'Pregledaj \u017eenske i mu\u0161ke kai\u0161eve izra\u0111ene ru\u010dno u Travniku od ko\u017ee punog zrna, uz mesingane kop\u010de i mogu\u0107nost prilago\u0111avanja svake narud\u017ebe.',
};

export default function BeltsPage() {
  return (
    <Suspense fallback={<BeltsPageContent focusedProductId={null} />}>
      <BeltsPageContainer />
    </Suspense>
  );
}
