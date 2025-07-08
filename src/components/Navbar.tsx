'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
  }, [isMobileMenuOpen]);

  return (
    <header className="fixed top-0 left-0 right-0 w-screen z-50 text-white">
      <div className={`w-full px-6 py-4 flex justify-between items-center ${isMobileMenuOpen ? 'hidden' : 'bg-black/60'}`}>
        <Link href="/" className="flex items-center space-x-2">
          <Image src="/logo-white.png" alt="Logo" width={120} height={40} />
        </Link>
        <nav className={`hidden md:flex items-center space-x-12 text-ml font-medium ${isMobileMenuOpen ? 'hidden' : ''}`}>
          <a href="#" className="hover:text-gray-300 transition-colors duration-200">
            Home
          </a>
          <a href="#about" className="hover:text-gray-300 transition-colors duration-200">
            About
          </a>
          <a href="#services" className="hover:text-gray-300 transition-colors duration-200">
            Services
          </a>
          <a href="#projects" className="hover:text-gray-300 transition-colors duration-200">
            Projects
          </a>
          <a href="#contact" className="hover:text-gray-300 transition-colors duration-200">
            Contact
          </a>
        </nav>
        <div className="hidden md:block">
          <Link href="#contact">
            <button className="px-5 py-2 text-sm rounded-full bg-white text-black hover:bg-gray-200 transition-colors duration-200">
              Let’s Talk
            </button>
          </Link>
        </div>
        <div className="md:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="focus:outline-none"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>
      </div>
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 text-white flex flex-col justify-between items-center py-12 px-8 space-y-8">
          <div className="w-full flex justify-between items-center mb-8">
            <div className="flex items-center space-x-2">
              <Image src="/logo-white.png" alt="Logo" width={100} height={32} />
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-white text-3xl font-bold focus:outline-none"
            >
              &times;
            </button>
          </div>
          <div className="flex flex-col items-center space-y-6">
            <a href="#" className="text-lg font-semibold hover:text-gray-300" onClick={() => setIsMobileMenuOpen(false)}>Home</a>
            <a href="#about" className="text-lg font-semibold hover:text-gray-300" onClick={() => setIsMobileMenuOpen(false)}>About</a>
            <a href="#services" className="text-lg font-semibold hover:text-gray-300" onClick={() => setIsMobileMenuOpen(false)}>Services</a>
            <a href="#projects" className="text-lg font-semibold hover:text-gray-300" onClick={() => setIsMobileMenuOpen(false)}>Projects</a>
            <a href="#contact" className="text-lg font-semibold hover:text-gray-300" onClick={() => setIsMobileMenuOpen(false)}>Contact</a>
          </div>
          <div className="flex flex-col items-center space-y-6">
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-8 py-3 bg-white text-black rounded-full text-base font-semibold hover:bg-gray-200 transition shadow-lg"
            >
              <a href="#contact">Let’s Talk</a>
            </button>
            <div className="text-center mt-4">
              <p className="text-sm text-gray-400 mb-2">Follow us</p>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-400 inline-block">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M4.98 3.5C4.98 4.88 3.88 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM0 24V7h5v17H0zm7.5-17h4.7v2.54h.06c.66-1.25 2.3-2.56 4.74-2.56 5.08 0 6.01 3.33 6.01 7.66V24h-5v-7.67c0-1.83-.03-4.18-2.55-4.18-2.56 0-2.95 2-2.95 4.05V24h-5V7z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}