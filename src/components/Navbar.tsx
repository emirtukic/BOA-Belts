'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from './LanguageProvider';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t, toggleLanguage } = useLanguage();

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
  }, [isMobileMenuOpen]);

  const navLinks = [
    { href: '/', label: t.nav.home },
    { href: '/belts', label: t.nav.belts },
    { href: '/bags', label: t.nav.bags },
    { href: '/wallets', label: t.nav.wallets },
    { href: '/about', label: t.nav.about },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 w-screen z-50">
      <div
        className={`w-full px-6 py-3 transition-colors duration-200 ${
          isMobileMenuOpen ? 'hidden' : 'bg-white/85 backdrop-blur-lg border-b border-[#ececec]'
        }`}
      >
        <div className="mx-auto flex w-full max-w-6xl items-center">
          <Link href="/" className="flex items-center space-x-2 text-[#111] font-semibold tracking-wide">
            <Image src="/boalogo.png" alt="Boa Belts logo" width={170} height={40} className="h-10 w-auto" />
          </Link>

          <nav
            className={`hidden md:flex flex-1 items-center justify-center space-x-9 text-sm font-semibold text-[#111] ${
              isMobileMenuOpen ? 'hidden' : ''
            }`}
          >
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="uppercase tracking-wide hover:text-[#000] transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto hidden md:flex items-center space-x-3">
            <button
              type="button"
              onClick={toggleLanguage}
              className="rounded-full border border-[#d0d0d0] bg-white px-4 py-2 text-xs font-semibold tracking-wide text-[#111] transition-colors duration-200 hover:bg-[#111] hover:text-white"
              aria-label={t.nav.languageToggleAria}
            >
              {t.nav.languageToggle}
            </button>
            <Link href="/#contact">
              <button className="px-5 py-2 text-sm rounded-full bg-[#111] text-white font-semibold shadow-md transition duration-200 hover:-translate-y-0.5 hover:bg-black">
                {t.nav.contactCta}
              </button>
            </Link>
          </div>

          <div className="ml-auto flex items-center md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              className="focus:outline-none text-[#111]"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d={isMobileMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
              </svg>
            </button>
          </div>
        </div>
      </div>
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-white text-[#111] flex flex-col justify-between items-center py-12 px-8 space-y-8">
          <div className="w-full flex justify-between items-center mb-8">
            <div className="flex items-center space-x-2">
              <Image src="/boalogo.png" alt="Boa Belts logo" width={95} height={26} />
            </div>
            <div className="flex items-center space-x-4">
              <button
                type="button"
                onClick={toggleLanguage}
                className="border border-[#d0d0d0] text-[#111] px-3 py-1 rounded-full text-xs tracking-wide hover:bg-[#f3f3f3] transition-colors duration-200"
                aria-label={t.nav.languageToggleAria}
              >
                {t.nav.languageToggle}
              </button>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-[#111] text-3xl font-bold focus:outline-none"
                aria-label="Close menu"
              >
                &times;
              </button>
            </div>
          </div>
          <div className="flex flex-col items-center space-y-6 text-lg font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="hover:text-black"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="flex flex-col items-center space-y-6">
            <Link
              href="/#contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-8 py-3 bg-[#111] text-white rounded-full text-base font-semibold shadow-lg transition duration-200 hover:-translate-y-0.5 hover:bg-black"
            >
              {t.nav.contactCta}
            </Link>
            <div className="text-center mt-4">
              <p className="text-sm text-[#7b7b7b] mb-2">{t.nav.follow}</p>
              <div className="flex items-center space-x-4">
                <a href="https://www.instagram.com/boa_belts/?hl=en" target="_blank" rel="noopener noreferrer" className="hover:text-black">
                  {t.followLinks.instagram}
                </a>
                <a href="https://www.facebook.com/boa.belts.ba" target="_blank" rel="noopener noreferrer" className="hover:text-black">
                  {t.followLinks.facebook}
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
