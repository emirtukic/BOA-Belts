import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import './animations.css';
import LanguageProvider from "@/components/LanguageProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.boabelts.com';
const resolvedSiteUrl = siteUrl.replace(/\/$/, '');
const ogImage = `${resolvedSiteUrl}/og-image.jpg`;

export const metadata: Metadata = {
  metadataBase: new URL(resolvedSiteUrl),
  title: {
    default: "Boa Belts | Handcrafted Leather Goods",
    template: "%s | Boa Belts",
  },
  description: "Boa Belts crafts handmade belts, bags, and wallets in Travnik, Bosnia and Herzegovina.",
  openGraph: {
    type: "website",
    locale: "bs_BA",
    url: resolvedSiteUrl,
    siteName: "Boa Belts",
    title: "Boa Belts | Handcrafted Leather Goods",
    description: "Handmade belts, bags, and wallets from Travnik, crafted with premium leather.",
    images: [
      {
        url: ogImage,
        width: 1600,
        height: 900,
        alt: "Handcrafted Boa Belts leather accessories displayed together.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Boa Belts | Handcrafted Leather Goods",
    description: "Handmade belts, bags, and wallets from Travnik, crafted with premium leather.",
    images: [ogImage],
  },
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: ["/favicon.ico"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
          integrity="sha512-papERskZfKQ0Tn5ctprXstz4zAXBlKMJYj5uOHDJP/8EShvXpYvULdCKArVgX6f69Y+UHOJ2YBgFjD5Ae3U8Kg=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <LanguageProvider>
          <Navbar />
          {children}
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
