import './animations.css';
import HomeContent from '@/components/HomeContent';

export const metadata = {
  title: "Boa Belts | Ručno pravljeni kožni kaiševi, torbe i novčanici",
  description: "Boa Belts is a Travnik-based leather studio crafting handmade belts, bags, and wallets from premium European hides.",
  openGraph: {
    title: "Boa Belts | Travnik Leather Studio",
    description: "Discover handmade leather belts, bags, and wallets created in Travnik, Bosnia and Herzegovina.",
    url: "https://www.facebook.com/boa.belts.ba",
    siteName: "Boa Belts",
    images: [
      {
        url: "/og-image'v3.png",
        width: 1200,
        height: 630,
        alt: "Boa Belts Travnik Leather Studio",
      },
    ],
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Boa Belts | Leather Goods",
    description: "Handcrafted belts, bags, and wallets from Travnik.",
    images: ["favicon-32x32.png"],
  },
  icons: {
    icon: "/favicon-32x32.png",
    shortcut: "url('/favicon-32x32.png')",
    apple: "/apple-touch-icon.png",
  },
};

export default function HomePage() {
  return <HomeContent />;
}
