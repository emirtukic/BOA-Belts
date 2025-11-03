'use client';

import { useSearchParams } from 'next/navigation';
import WalletsPageContent from './WalletsPageContent';

export function WalletsPageContainer() {
  const searchParams = useSearchParams();
  const productId = searchParams.get('product');
  return <WalletsPageContent focusedProductId={productId} />;
}
