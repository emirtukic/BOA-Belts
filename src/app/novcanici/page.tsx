import { Suspense } from 'react';
import type { Metadata } from 'next';
import WalletsPageContent from '@/components/WalletsPageContent';
import { WalletsPageContainer } from '@/components/WalletsPageContainer';

export const metadata: Metadata = {
  title: 'Nov\u010danici',
  description:
    'Ru\u010dno \u0161iveni card holderi, nov\u010danici i putne futrole sa saddle \u0161avom i personalizacijom inicijala.',
};

export default function WalletsPage() {
  return (
    <Suspense fallback={<WalletsPageContent focusedProductId={null} />}>
      <WalletsPageContainer />
    </Suspense>
  );
}
