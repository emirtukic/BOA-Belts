'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
  return (
    <header className="fixed top-0 w-full z-50 bg-black/60 text-white">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <Image src="/logo-white.png" alt="Logo" width={120} height={40} />
        </Link>
        <nav className="hidden md:flex items-center space-x-12 text-ml font-medium">
          <Link href="/" className="hover:text-gray-300 transition-colors duration-200">
            Home
          </Link>
          <Link href="/about" className="hover:text-gray-300 transition-colors duration-200">
            About
          </Link>
          <Link href="/services" className="hover:text-gray-300 transition-colors duration-200">
            Services
          </Link>
          <Link href="/projects" className="hover:text-gray-300 transition-colors duration-200">
            Projects
          </Link>
          <Link href="/contact" className="hover:text-gray-300 transition-colors duration-200">
            Contact
          </Link>
        </nav>
        <div className="hidden md:block">
          <Link href="#contact">
            <button className="px-5 py-2 text-sm rounded-full bg-white text-black hover:bg-gray-200 transition-colors duration-200">
              Let’s Talk
            </button>
          </Link>
        </div>
      </div>
    </header>
  );
}