'use client';

import { useSearchParams } from 'next/navigation';
import BeltsPageContent from './BeltsPageContent';

export function BeltsPageContainer() {
  const searchParams = useSearchParams();
  const productId = searchParams.get('product');
  return <BeltsPageContent focusedProductId={productId} />;
}
