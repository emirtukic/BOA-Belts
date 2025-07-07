import { FaLinkedin } from "react-icons/fa";
import Link from 'next/link';
export default function Footer() {
    return (
      <footer className="bg-[#0D0D0D] text-white pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <h4 className="text-2xl font-bold mb-4">Have Solution</h4>
            <p className="text-sm text-gray-400">
              Digital solutions that drive your business forward. Focused on innovation, quality, and results.
            </p>
          </div>
  
          <div>
            <h5 className="text-lg font-semibold mb-3">Navigation</h5>
            <ul className="text-sm space-y-2 text-gray-300">
              <li><Link href="/" className="hover:text-white">Home</Link></li>
              <li><Link href="/about" className="hover:text-white">About Us</Link></li>
              <li><Link href="/services" className="hover:text-white">Services</Link></li>
              <li><Link href="/projects" className="hover:text-white">Projects</Link></li>
              <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
            </ul>
          </div>
  
          <div>
            <h5 className="text-lg font-semibold mb-3">Contact</h5>
            <ul className="text-sm text-gray-300 space-y-2">
              <li>Sarajevo, Bosnia and Herzegovina</li>
              <li><a href="mailto:info@havesolution.ba" className="hover:text-white">info@havesolution.ba</a></li>
              <li><a href="tel:+38761234567" className="hover:text-white">+387 62 258 941</a></li>
            </ul>
          </div>
  
          <div>
            <h5 className="text-lg font-semibold mb-3">Follow us</h5>
            <div className="flex space-x-4">
  <a
    href="https://www.linkedin.com/company/od-have-solution/"
    target="_blank"
    rel="noopener noreferrer"
    className="hover:text-white"
    aria-label="LinkedIn"
  >
    <FaLinkedin className="text-xl" />
  </a>
</div>
          </div>
        </div>
  
        <div className="mt-12 text-center text-xs text-gray-500 border-t border-gray-700 pt-6">
          &copy; {new Date().getFullYear()} Have Solution. All rights reserved by N2N Consulting.
        </div>
      </footer>
    );
  }