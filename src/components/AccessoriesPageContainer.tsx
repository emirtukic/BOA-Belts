'use client';

import { useSearchParams } from 'next/navigation';
import AccessoriesPageContent from './AccessoriesPageContent';

export function AccessoriesPageContainer() {
  const searchParams = useSearchParams();
  const productId = searchParams?.get('product') ?? null;
  return <AccessoriesPageContent focusedProductId={productId} />;
}
