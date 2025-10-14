import type { Metadata } from 'next';
import AboutPageContent from '@/components/AboutPageContent';

export const metadata: Metadata = {
  title: 'Boa Belts | About Our Travnik Studio',
  description:
    'Learn about Boa Belts, our Travnik workshop, and the slow craftsmanship behind every belt, bag, and wallet we create.',
};

export default function AboutPage() {
  return <AboutPageContent />;
}

