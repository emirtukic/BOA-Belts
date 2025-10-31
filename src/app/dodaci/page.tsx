import type { Metadata } from 'next';
import AccessoriesPageContent from '@/components/AccessoriesPageContent';

export const metadata: Metadata = {
  title: 'Boa Belts | Handcrafted Leather Accessories',
  description:
    'Explore Travnik-crafted leather accessories including wristwear, sheaths, and covers designed to accompany your everyday carry.',
};

export default function AccessoriesPage() {
  return <AccessoriesPageContent />;
}

