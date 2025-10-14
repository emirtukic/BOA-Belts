'use client';

import { FaFacebookF, FaInstagram } from 'react-icons/fa';
import Link from 'next/link';
import { useLanguage } from './LanguageProvider';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-white text-[#161616] pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-5 gap-10">
        <div>
          <h4 className="text-2xl font-bold mb-4">Boa Belts</h4>
          <p className="text-sm text-[#5a5a5a]">
            {t.footer.description}
          </p>
        </div>

        <div>
          <h5 className="text-lg font-semibold mb-3">{t.footer.navigationTitle}</h5>
          <ul className="text-sm space-y-2 text-[#777]">
            <li><Link href="/belts" className="hover:text-[#111] transition-colors">{t.nav.belts}</Link></li>
            <li><Link href="/bags" className="hover:text-[#111] transition-colors">{t.nav.bags}</Link></li>
            <li><Link href="/wallets" className="hover:text-[#111] transition-colors">{t.nav.wallets}</Link></li>
          </ul>
        </div>
        <div>
          <h5 className="text-lg font-semibold mb-3">{t.footer.navigationTitle1}</h5>
          <ul className="text-sm space-y-2 text-[#777]">
            <li><Link href="/about" className="hover:text-[#111] transition-colors">{t.nav.about}</Link></li>
            <li><Link href="/#contact" className="hover:text-[#111] transition-colors">{t.nav.contact}</Link></li>
          </ul>
        </div>

        <div>
          <h5 className="text-lg font-semibold mb-3">{t.footer.contactTitle}</h5>
          <ul className="text-sm text-[#777] space-y-2">
            <li>{t.footer.location}</li>
            
          </ul>
        </div>

        <div>
          <h5 className="text-lg font-semibold mb-3">{t.footer.followTitle}</h5>
          <div className="flex space-x-4">
            <a
              href="https://www.instagram.com/boa_belts/?hl=en"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#111]"
              aria-label={t.followLinks.instagram}
            >
              <FaInstagram className="text-xl" />
            </a>
            <a
              href="https://www.facebook.com/p/Boa-Belts-100027303537151/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#111]"
              aria-label={t.followLinks.facebook}
            >
              <FaFacebookF className="text-xl" />
            </a>
          </div>
        </div>
      </div>

      <div className="mt-12 text-center text-xs text-[#777] border-t border-[#e6e6e6] pt-6">
        &copy; {new Date().getFullYear()} {t.footer.copyright}
      </div>
      <div className="mt-7 text-center text-xs text-[#777]">
        Developed by ET
      </div>
    </footer>
  );
}

