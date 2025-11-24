import type { Metadata } from 'next';
import AboutPageContent from '@/components/AboutPageContent';

export const metadata: Metadata = {
  title: 'O nama',
  description:
    'Saznaj vi\u0161e o na\u0161oj radionici u Travniku, procesu izrade i zanatu koji stoji iza svakog kai\u0161a, torbe i nov\u010danika.',
};

export default function AboutPage() {
  return <AboutPageContent />;
}

