import type { Metadata } from 'next';
import { LoyaltyCardSection } from '@/components/LoyaltyCardSection';

export const metadata: Metadata = {
  title: 'Loyalty | Boa Belts',
};

export default function LoyaltyPage() {
  return (
    <main className="min-h-screen bg-[#f9f9f9] px-6 py-16">
      <div className="mx-auto max-w-3xl pt-10">
        <LoyaltyCardSection />
      </div>
    </main>
  );
}
