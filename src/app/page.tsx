import './animations.css';
import { FaBug, FaMobileAlt, FaGlobe, FaTabletAlt } from 'react-icons/fa';

export const metadata = {
  title: "HAVE Solution | Quality Assurance & Software Testing",
  description: "Top-tier QA and testing services that ensure software excellence. Based in Sarajevo, serving global clients.",
  openGraph: {
    title: "HAVE Solution | QA & Software Testing",
    description: "Reliable QA solutions for modern software teams.",
    url: "https://www.havesolution.ba",
    siteName: "HAVE Solution",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "HAVE Solution Hero Image",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "HAVE Solution | QA Services",
    description: "Top QA and testing services from Sarajevo.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon-32x32.png",
    apple: "/apple-touch-icon.png",
  },
};

// app/page.tsx
export default function HomePage() {
  return (
    <main className="bg-[#0D0D0D] text-white">
      {/* Fixed Hero Section */}
      <section
        className="sticky top-0 h-screen w-full flex flex-col justify-center items-center text-center px-6 bg-cover bg-center bg-fixed"
        style={{ backgroundImage: "url('/hero-bg.jpg')" }}
      >
        <h1 className="typing-container mt-10">
          Quality-Driven Software. Trusted Results.
        </h1>
        <p className="text-lg md:text-xl text-white-400 max-w-2xl mb-8 animate-fade-in-up delay-300 mt-10">
          Helping companies launch reliable, secure, and scalable software through rigorous QA and modern development practices.
        </p>
        <a
          href="/contact"
          className="bg-white text-black px-6 py-3 rounded-full font-semibold hover:bg-gray-200 transition animate-fade-in-up delay-500 mt-10"
        >
          Let’s Talk
        </a>
      </section>

      <div className="relative z-10 bg-gradient-to-r from-black via-gray-900 to-black" style={{ marginTop: '55vh' }}>
        {/* About Preview */}
        <section className="relative -mt-32 py-20 px-6 max-w-5xl mx-auto text-center animate-fade-in-up delay-200">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Your Trusted Quality Assurance Partner</h2>
          <p className="text-gray-400 text-lg">
          At HAVE Solution, we ensure software excellence through top-tier Quality Assurance and software testing services. Based in Sarajevo, Bosnia and Herzegovina, we collaborate with clients across various industries and geographies, delivering reliable, high-performance solutions that enhance clients digital products. Whether you are a startup or an enterprise, we help you build software that meets the highest quality standards.
          </p>
          <a href="/about" className="text-white underline mt-4 inline-block hover:text-gray-300">
            Learn more →
          </a>
        </section>

        {/* Services Preview */}
        <section className="py-20 px-6 bg-gradient-to-r from-black via-gray-900 to-black animate-fade-in-up delay-300">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-white">Our Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-left -mt-12">
              <div className="slide-up delay-100 bg-white/10 backdrop-blur-lg border border-white/20 p-6 rounded-2xl hover:bg-white/20 transition-colors duration-150">
                <FaBug className="text-4xl text-white mb-4" />
                <h3 className="text-2xl font-semibold mb-3 text-white">Software Testing</h3>
                <p className="text-gray-200">
                  Comprehensive end-to-end testing to ensure your software is reliable, functional, and bug-free.
                </p>
              </div>
              <div className="slide-up delay-200 bg-white/10 backdrop-blur-lg border border-white/20 p-6 rounded-2xl hover:bg-white/20 transition-colors duration-150">
                <FaMobileAlt className="text-4xl text-white mb-4" />
                <h3 className="text-2xl font-semibold mb-3 text-white">App Testing</h3>
                <p className="text-gray-200">
                  Robust automated and manual testing for mobile applications, guaranteeing seamless user experiences on all devices.
                </p>
              </div>
              <div className="slide-up delay-300 bg-white/10 backdrop-blur-lg border border-white/20 p-6 rounded-2xl hover:bg-white/20 transition-colors duration-150">
                <FaGlobe className="text-4xl text-white mb-4" />
                <h3 className="text-2xl font-semibold mb-3 text-white">Website Testing</h3>
                <p className="text-gray-200">
                  Thorough testing of web applications for performance, security, and cross-browser compatibility.
                </p>
              </div>
              <div className="slide-up delay-400 bg-white/10 backdrop-blur-lg border border-white/20 p-6 rounded-2xl hover:bg-white/20 transition-colors duration-150">
                <FaTabletAlt className="text-4xl text-white mb-4" />
                <h3 className="text-2xl font-semibold mb-3 text-white">Mobile Testing</h3>
                <p className="text-gray-200">
                  In-depth testing for native and hybrid mobile apps to ensure optimal performance and user satisfaction.
                </p>
              </div>
            </div>
            <a href="/services" className="text-white underline mt-12 inline-block hover:text-gray-300">
              Explore all services →
            </a>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="py-20 px-6 text-white animate-fade-in-up delay-200">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-10">Why Choose HAVE Solution?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
              <div className="bg-white/10 backdrop-blur-md p-8 rounded-xl border border-white/20 hover:scale-105 transition-transform duration-300">
                <h3 className="text-2xl font-semibold mb-2 text-white">Proven Expertise</h3>
                <p className="text-gray-300">Years of experience in QA & testing for global software companies across industries.</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-8 rounded-xl border border-white/20 hover:scale-105 transition-transform duration-300">
                <h3 className="text-2xl font-semibold mb-2 text-white">Client-Centered</h3>
                <p className="text-gray-300">We work as an extension of your team, aligning fully with your product goals and roadmap.</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-8 rounded-xl border border-white/20 hover:scale-105 transition-transform duration-300">
                <h3 className="text-2xl font-semibold mb-2 text-white">Agile & Reliable</h3>
                <p className="text-gray-300">Our flexible engagement models fit startups and enterprises, always delivering on time and on budget.</p>
              </div>
            </div>
          </div>
        </section>
        {/* CTA Prompt */}
        <section className="text-center py-10 bg-gradient-to-r from-black via-gray-900 to-black">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-7">
            Want flawless software? Let’s talk QA.
          </h2>
          <a
            href="/contact"
            className="bg-white text-black px-6 py-2 rounded-full font-semibold hover:bg-gray-200 transition"
          >
            Get in Touch
          </a>
        </section>
        {/* Contact Card */}
        
        <section className="py-10 px-6 bg-gradient-to-r from-black via-gray-900 to-black animate-fade-in-up delay-400">
          <div className="max-w-7xl mx-auto overflow-hidden rounded-3xl bg-gradient-to-r from-blue-500 via-purple-600 to-teal-400 grid grid-cols-1 lg:grid-cols-2">
            {/* Left - Info */}
            <div className="p-12 flex flex-col justify-between text-white">
              <div>
                <h2 className="text-4xl font-bold text-white mb-4">Where can we help?</h2>
                <p className="text-white text-lg mb-8">
                  Complete the form and a HAVE Solution expert will contact you shortly.
                </p>
              </div>
              
            </div>
            {/* Right - Form */}
            <div className="p-12">
              <form action="/api/contact" method="POST" className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-white">First name*</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    required
                    className="mt-1 block w-full bg-white bg-opacity-90 border border-white/40 px-4 py-2 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-75"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-white">Last name*</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    required
                    className="mt-1 block w-full bg-white bg-opacity-90 border border-white/40 px-4 py-2 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-75"
                  />
                </div>
                <div>
                  <label htmlFor="jobTitle" className="block text-sm font-medium text-white">Job title</label>
                  <input
                    type="text"
                    id="jobTitle"
                    name="jobTitle"
                    className="mt-1 block w-full bg-white bg-opacity-90 border border-white/40 px-4 py-2 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-75"
                  />
                </div>
                <div>
                  <label htmlFor="companyName" className="block text-sm font-medium text-white">Company name</label>
                  <input
                    type="text"
                    id="companyName"
                    name="companyName"
                    className="mt-1 block w-full bg-white bg-opacity-90 border border-white/40 px-4 py-2 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-75"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-white">Work email*</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="mt-1 block w-full bg-white bg-opacity-90 border border-white/40 px-4 py-2 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-75"
                  />
                </div>
                <div>
                  <label htmlFor="help" className="block text-sm font-medium text-white">How can we help?*</label>
                  <select
                    id="help"
                    name="help"
                    required
                    className="mt-1 block w-full bg-white bg-opacity-90 border border-white/40 px-4 py-2 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-75"
                  >
                    <option value="">— Please choose an option —</option>
                    <option value="qa">QA Automation</option>
                    <option value="manual">Manual Testing</option>
                    <option value="performance">Performance &amp; Security</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="message" className="block text-sm font-medium text-white">Let us know more about what you’re looking for*</label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    required
                    className="mt-1 block w-full bg-white bg-opacity-90 border border-white/40 px-4 py-2 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-75"
                  ></textarea>
                </div>
                <div className="md:col-span-2 flex justify-end">
                  <button type="submit" className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition">
                    Send Message
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}