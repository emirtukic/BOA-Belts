'use client';

import { useSearchParams } from 'next/navigation';
import BeltsPageContent from './BeltsPageContent';

export function BeltsPageContainer() {
  const searchParams = useSearchParams();
  const productId = searchParams?.get('product') ?? null;
  return <BeltsPageContent focusedProductId={productId} />;
}
