'use client';

import { useSearchParams } from 'next/navigation';
import WalletsPageContent from './WalletsPageContent';

export function WalletsPageContainer() {
  const searchParams = useSearchParams();
  const productId = searchParams?.get('product') ?? null;
  return <WalletsPageContent focusedProductId={productId} />;
}
