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
const ogImage = `${resolvedSiteUrl}/og-image-v3.png`;

export const metadata: Metadata = {
  metadataBase: new URL(resolvedSiteUrl),
  title: {
    default: "Boa Belts",
    template: "%s | Boa Belts",
  },
  description: "Otkrij ručno rađene kožne kaiševe, torbe i novčanike nastale u Travniku, Bosna i Hercegovina.",
  openGraph: {
    type: "website",
    locale: "bs_BA",
    url: resolvedSiteUrl,
    siteName: "Boa Belts",
    title: "Ručno rađeni kaiševi",
    description: "Otkrij ručno rađene kožne kaiševe, torbe i novčanike nastale u Travniku, Bosna i Hercegovina.",
    images: [
      {
        url: ogImage,
        secureUrl: ogImage,
        width: 1600,
        height: 900,
        alt: "Ručno izrađeni Boa Belts kožni dodaci prikazani zajedno.",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Boa Belts",
    description: "Otkrij ručno rađene kožne kaiševe, torbe i novčanike nastale u Travniku, Bosna i Hercegovina.",
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
    <html lang="bs">
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
          <div aria-hidden="true" className="h-20 bg-white md:h-24" />
          {children}
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
