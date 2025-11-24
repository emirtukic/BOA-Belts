import { Suspense } from 'react';
import type { Metadata } from 'next';
import AccessoriesPageContent from '@/components/AccessoriesPageContent';
import { AccessoriesPageContainer } from '@/components/AccessoriesPageContainer';

export const metadata: Metadata = {
  title: 'Dodaci',
  description:
    'Explore Travnik-crafted leather accessories including wristwear, sheaths, and covers designed to accompany your everyday carry.',
};

export default function AccessoriesPage() {
  return (
    <Suspense fallback={<AccessoriesPageContent focusedProductId={null} />}>
      <AccessoriesPageContainer />
    </Suspense>
  );
}
