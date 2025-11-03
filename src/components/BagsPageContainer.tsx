'use client';

import { useSearchParams } from 'next/navigation';
import BagsPageContent from './BagsPageContent';

export function BagsPageContainer() {
  const searchParams = useSearchParams();
  const productId = searchParams?.get('product') ?? null;
  return <BagsPageContent focusedProductId={productId} />;
}
