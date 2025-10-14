'use client';

import Link from 'next/link';
import { useLanguage } from './LanguageProvider';

export default function BeltsPageContent() {
  const { t } = useLanguage();
  const data = t.beltsPage;

  return (
    <main className="bg-white text-[#1f1f1f]">
      <section
        className="relative py-28 px-6 text-[#111] text-center"
        style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.82), rgba(255,255,255,0.82)), url('/boabelts.jpg')" }}
      >
        <div className="relative z-10 max-w-3xl mx-auto space-y-6">
          <h1 className="text-4xl md:text-5xl font-semibold">{data.heroTitle}</h1>
          <p className="text-lg md:text-xl text-[#3a3a3a]">{data.heroSubtitle}</p>
          <Link
            href="/#contact"
            className="inline-block bg-[#111] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#000] transition"
          >
            {data.heroCta}
          </Link>
        </div>
      </section>

      <section className="py-16 px-6 bg-white border-b border-[#ececec]">
        <div className="max-w-4xl mx-auto space-y-6">
          <h2 className="text-3xl font-semibold text-[#1f1f1f]">{data.craftsmanshipTitle}</h2>
          {data.craftsmanshipParagraphs.map((paragraph) => (
            <p key={paragraph} className="text-lg leading-relaxed text-[#4b4b4b]">
              {paragraph}
            </p>
          ))}
        </div>
      </section>

      <section className="py-16 px-6 bg-white border-b border-[#ececec]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-semibold text-center mb-12 text-[#1f1f1f]">
            {data.highlightTitle}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {data.highlightItems.map((item) => (
              <div
                key={item.title}
                className="bg-white/90 border border-[#ececec] rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow duration-200"
              >
                <h3 className="text-2xl font-semibold mb-3 text-[#1f1f1f]">{item.title}</h3>
                <p className="text-[#4b4b4b]">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-6 bg-white border-b border-[#ececec]">
        <div className="max-w-4xl mx-auto space-y-6">
          <h2 className="text-3xl font-semibold text-[#1f1f1f]">{data.sizingTitle}</h2>
          <p className="text-lg text-[#4b4b4b]">{data.sizingText}</p>
          <ul className="list-disc list-inside space-y-3 text-[#4b4b4b]">
            {data.sizingPoints.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-16 px-6 bg-white border-b border-[#ececec]">
        <div className="max-w-4xl mx-auto space-y-6">
          <h2 className="text-3xl font-semibold text-[#1f1f1f]">{data.careTitle}</h2>
          <ol className="list-decimal list-inside space-y-3 text-[#4b4b4b]">
            {data.careSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </div>
      </section>

      <section className="py-20 px-6 text-center bg-white">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-3xl font-semibold text-[#1f1f1f]">{data.closingTitle}</h2>
          <p className="text-lg text-[#4b4b4b] leading-relaxed">{data.closingText}</p>
          <Link
            href="/#contact"
            className="inline-block bg-[#111] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#000] transition"
          >
            {data.closingButton}
          </Link>
        </div>
      </section>
    </main>
  );
}
