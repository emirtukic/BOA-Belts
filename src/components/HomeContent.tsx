'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  FaArrowLeft,
  FaArrowRight,
  FaGem,
  FaHandHoldingHeart,
  FaLeaf,
  FaRulerCombined,
} from 'react-icons/fa';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from './LanguageProvider';
import { LoyaltyCardSection } from './LoyaltyCardSection';

const beltIcons = [
  FaHandHoldingHeart,
  FaRulerCombined,
  FaLeaf,
  FaGem,
] as const;

const heroBackgrounds = [
  "url('/boa_belts_4.jpg')",
  "url('/belt.jpg')",
  "url('/torba.jpg')",
  "url('/novcanik.jpg')",
] as const;

const galleryMedia = [
  '/1.jpg',
  '/2.jpg',
  '/3.jpg',
  '/4.jpg',
  '/5.jpg',
] as const;

const sectionImages = {
  belts: '/belt.jpg',
  bags: '/boa_belts_2.jpg',
  wallets: '/boahero.jpg',
} as const;

export default function HomeContent() {
  const { t } = useLanguage();
  type Slide = {
    title: string;
    subtitle: string;
    cta: string;
    href: string;
    background: string;
  };
  const slides = useMemo<Slide[]>(
    () =>
      [
        {
          title: t.hero.title,
          subtitle: t.hero.subtitle,
          cta: t.hero.cta,
          href: '/belts',
        },
        {
          title: t.beltsPage.heroTitle,
          subtitle: t.beltsPage.heroSubtitle,
          cta: t.belts.ctaLabel,
          href: '/belts',
        },
        {
          title: t.bagsPage.heroTitle,
          subtitle: t.bagsPage.heroSubtitle,
          cta: t.bags.ctaLabel,
          href: '/bags',
        },
        {
          title: t.walletsPage.heroTitle,
          subtitle: t.walletsPage.heroSubtitle,
          cta: t.wallets.cta,
          href: '/wallets',
        },
      ].map((slide, index) => ({
        ...slide,
        background: heroBackgrounds[index % heroBackgrounds.length],
      })),
    [t],
  );
  const [activeSlide, setActiveSlide] = useState(0);
  const totalSlides = slides.length;
  const galleryRef = useRef<HTMLDivElement | null>(null);
  const [galleryCanScrollLeft, setGalleryCanScrollLeft] = useState(false);
  const [galleryCanScrollRight, setGalleryCanScrollRight] = useState(true);

  useEffect(() => {
    const interval = setInterval(
      () => setActiveSlide((prev) => (prev + 1) % totalSlides),
      6000,
    );
    return () => clearInterval(interval);
  }, [totalSlides]);

  useEffect(() => {
    const container = galleryRef.current;
    if (!container) {
      return;
    }

    const update = () => {
      const maxScrollLeft = container.scrollWidth - container.clientWidth;
      setGalleryCanScrollLeft(container.scrollLeft > 0);
      setGalleryCanScrollRight(container.scrollLeft < maxScrollLeft - 1);
    };

    update();
    container.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);

    return () => {
      container.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  const handleGalleryScroll = (direction: 'prev' | 'next') => {
    const container = galleryRef.current;
    if (!container) {
      return;
    }
    const scrollAmount = container.clientWidth * 0.8;
    container.scrollBy({
      left: direction === 'next' ? scrollAmount : -scrollAmount,
      behavior: 'smooth',
    });
  };

  const goToSlide = (index: number) => {
    setActiveSlide((index + totalSlides) % totalSlides);
  };

  return (
    <main className="bg-white text-[#1f1f1f]">
      {/* Fixed Hero Section */}
      <section
        className="sticky top-0 h-screen w-full flex flex-col justify-start items-start px-6 pt-24 bg-cover bg-center bg-fixed overflow-hidden"
        style={{
          backgroundImage:
            slides[activeSlide]?.background ?? heroBackgrounds[0],
        }}
      >
        <div className="relative w-full max-w-sm text-left ml-2 md:ml-4">
          {slides.map((slide, index) => (
            <div
              key={slide.title}
              className={`absolute inset-0 flex w-full flex-col items-start justify-center space-y-4 rounded-3xl border border-white/40 bg-white/80 px-5 py-8 backdrop-blur-lg shadow-lg transition-all duration-700 ${
                index === activeSlide
                  ? 'opacity-100 translate-y-0 pointer-events-auto'
                  : 'opacity-0 translate-y-8 pointer-events-none'
              }`}
            >
              <h1 className="text-lg md:text-2xl font-semibold text-[#111] leading-tight">
                {slide.title}
              </h1>
              <p className="text-xs md:text-sm text-[#1f1f1f] leading-relaxed">
                {slide.subtitle}
              </p>
              <Link
                href={slide.href}
                className="bg-[#111] text-white px-4 py-2 rounded-full text-xs font-semibold hover:bg-black transition"
              >
                {slide.cta}
              </Link>
            </div>
          ))}
          <div className="block pt-[170px] md:pt-[200px]" aria-hidden="true" />
        </div>
        <div className="mt-5 flex w-full max-w-sm items-center justify-start gap-4 pl-4 md:max-w-md md:pl-6">
          <button
            type="button"
            onClick={() => goToSlide(activeSlide - 1)}
            className="rounded-full border border-[#d0d0d0] bg-white px-3 py-2 text-[11px] font-semibold text-[#111] transition hover:bg-[#111] hover:text-white"
            aria-label="Previous slide"
          >
            ‹
          </button>
          <div className="flex items-center gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => goToSlide(index)}
                className={`h-2.5 w-2.5 rounded-full transition ${
                  index === activeSlide ? 'bg-[#111]' : 'bg-[#d0d0d0]'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => goToSlide(activeSlide + 1)}
            className="rounded-full border border-[#d0d0d0] bg-white px-3 py-2 text-[11px] font-semibold text-[#111] transition hover:bg-[#111] hover:text-white"
            aria-label="Next slide"
          >
            ›
          </button>
        </div>
      </section>

      <div className="relative z-10 bg-white" style={{ marginTop: '55vh' }}>
        {/* Studio Gallery */}
        <section
          id="gallery"
          className="relative overflow-hidden py-20 px-10 bg-[#f7f7f7] animate-fade-in-up delay-150 border-t border-[#ececec]"
        >
          <div className="relative z-10 max-w-6xl mx-auto">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between text-[#1f1f1f]">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold">
                  {t.gallery.title}
                </h2>
                <p className="mt-4 text-[#4b4b4b] md:max-w-xl">
                  {t.gallery.subtitle}
                </p>
              </div>
            </div>
            <div className="relative mt-10">
              <div
                ref={galleryRef}
                className="flex gap-6 overflow-x-auto pb-6 snap-x snap-mandatory px-6 scroll-smooth [scrollbar-width:none] [-ms-overflow-style:'none'] [&::-webkit-scrollbar]:hidden"
              >
                {galleryMedia.map((src, index) => {
                  const item = t.gallery.items[index];
                  return (
                    <figure
                      key={src}
                      className="relative flex w-64 flex-shrink-0 snap-start flex-col overflow-hidden rounded-3xl border border-[#e4e4e4] bg-white shadow-sm transition-transform duration-300 hover:-translate-y-1 md:w-80"
                    >
                      <div className="relative h-48 md:h-64">
                        <Image
                          src={src}
                          alt={item?.title ?? t.gallery.title}
                          fill
                          sizes="(min-width: 768px) 320px, 80vw"
                          className="object-cover"
                          priority={index === 0}
                        />
                      </div>
                      <figcaption className="flex flex-1 flex-col justify-between p-4 text-left">
                        <div>
                          <h3 className="text-lg font-semibold text-[#111]">
                            {item?.title}
                          </h3>
                          <p className="mt-5 text-sm text-[#4b4b4b]">
                            {item?.description}
                          </p>
                        </div>
                      </figcaption>
                    </figure>
                  );
                })}
              </div>
              <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-16 bg-gradient-to-r from-[#f7f7f7] via-[#f7f7f7]/85 to-transparent md:block" />
              <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-16 bg-gradient-to-l from-[#f7f7f7] via-[#f7f7f7]/85 to-transparent md:block" />
              <button
                type="button"
                onClick={() => handleGalleryScroll('prev')}
                disabled={!galleryCanScrollLeft}
                className="absolute left-4 top-1/2 hidden -translate-y-1/2 items-center justify-center rounded-full border border-[#d0d0d0] bg-white/90 p-3 text-[#111] shadow-md transition hover:bg-[#111] hover:text-white disabled:cursor-not-allowed disabled:opacity-40 md:flex"
                aria-label={t.gallery.controls.previous}
              >
                <FaArrowLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => handleGalleryScroll('next')}
                disabled={!galleryCanScrollRight}
                className="absolute right-4 top-1/2 hidden -translate-y-1/2 items-center justify-center rounded-full border border-[#d0d0d0] bg-white/90 p-3 text-[#111] shadow-md transition hover:bg-[#111] hover:text-white disabled:cursor-not-allowed disabled:opacity-40 md:flex"
                aria-label={t.gallery.controls.next}
              >
                <FaArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-[#f7f7f7] via-[#f7f7f7]/90 to-white z-0" />
        </section>

        {/* About Preview */}
        <section
          id="about"
          className="relative -mt-32 py-20 px-6 max-w-5xl mx-auto text-center animate-fade-in-up delay-200"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-10 text-[#1f1f1f]">
            {t.about.title}
          </h2>
          <p className="text-lg text-[#4b4b4b] leading-relaxed">
            {t.about.body}
          </p>
          <div className="mt-8">
            <Link
              href="/about"
              className="inline-block bg-[#111] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#000] transition"
            >
              {t.about.ctaLabel}
            </Link>
          </div>
        </section>

        {/* Belts Preview */}
        <section
          id="belts"
          className="py-20 px-6 bg-white animate-fade-in-up delay-300 border-t border-[#ececec]"
        >
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col gap-12 md:flex-row md:items-stretch">
              <div className="text-center md:text-left md:flex md:flex-[3] md:flex-col">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-[#1f1f1f]">
                    {t.belts.title}
                  </h2>
                  <div className="mt-10 grid grid-cols-1 gap-6 text-left sm:grid-cols-2">
                    {t.belts.cards.map((card, index) => {
                      const Icon = beltIcons[index];
                      return (
                        <div
                          key={card.title}
                          className="slide-up bg-white border border-[#ececec] p-6 rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-150"
                        >
                          <Icon className="text-4xl text-[#111] mb-4" />
                          <h3 className="text-2xl font-semibold mb-3 text-[#1f1f1f]">
                            {card.title}
                          </h3>
                          <p className="text-[#4b4b4b]">{card.description}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="relative h-64 w-full overflow-hidden rounded-3xl border border-[#ececec] bg-[#111]/5 shadow-inner  md:min-h-[29rem] md:self-stretch md:flex-[2] mt-28">
                <Image
                  src={sectionImages.belts}
                  alt={`${t.belts.title} preview`}
                  fill
                  sizes="(min-width: 1280px) 420px, (min-width: 768px) 40vw, 90vw"
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f]/35 via-transparent to-transparent" />
              </div>
            </div>
            <div className="mt-12 flex justify-center">
              <Link
                href="/belts"
                className="inline-block bg-[#111] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#000] transition"
              >
                {t.belts.ctaLabel}
              </Link>
            </div>
          </div>
        </section>

        {/* Bags Section */}
        <section
          id="bags"
          className="py-20 px-6 text-[#1f1f1f] animate-fade-in-up delay-200 bg-white border-t border-[#ececec]"
        >
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col gap-12 md:flex-row-reverse md:items-stretch">
              <div className="text-center md:text-left md:flex md:flex-[3] md:flex-col">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold">
                    {t.bags.title}
                  </h2>
                  <div className="mt-10 grid grid-cols-1 gap-6 text-left sm:grid-cols-2 lg:grid-cols-3">
                    {t.bags.cards.map((card) => (
                      <div
                        key={card.title}
                        className="bg-white backdrop-blur-md p-8 rounded-xl border border-[#ececec] hover:-translate-y-1.5 transition-transform duration-300 shadow-sm"
                      >
                        <h3 className="text-2xl font-semibold mb-3 text-[#1f1f1f]">
                          {card.title}
                        </h3>
                        <p className="text-[#4b4b4b]">{card.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="relative h-64 w-full overflow-hidden rounded-3xl border border-[#ececec] bg-[#111]/5 shadow-inner md:h-auto md:min-h-[26rem] md:self-stretch md:flex-[2]">
                <Image
                  src={sectionImages.bags}
                  alt={`${t.bags.title} preview`}
                  fill
                  sizes="(min-width: 1280px) 460px, (min-width: 768px) 45vw, 90vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f]/30 via-transparent to-transparent" />
              </div>
            </div>
            <div className="mt-12 flex justify-center">
              <Link
                href="/bags"
                className="inline-block bg-[#111] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#000] transition"
              >
                {t.bags.ctaLabel}
              </Link>
            </div>
          </div>
        </section>

        {/* Wallets CTA */}
        <section
          id="wallets"
          className="py-20 px-6 bg-white border-t border-[#ececec] animate-fade-in-up delay-150"
        >
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col gap-12 md:flex-row md:items-stretch">
              <div className="text-center md:text-left md:flex md:flex-[3] md:flex-col">
                <h2 className="text-3xl md:text-4xl font-bold text-[#1f1f1f]">
                  {t.wallets.title}
                </h2>
                <div className="mt-10 grid grid-cols-1 gap-6 text-left sm:grid-cols-2">
                  {t.wallets.cards.map((card) => (
                    <div
                      key={card.title}
                      className="bg-white border border-[#ececec] p-6 rounded-2xl shadow-sm hover:-translate-y-1 transition-transform duration-200"
                    >
                      <h3 className="text-xl font-semibold mb-3 text-[#1f1f1f]">
                        {card.title}
                      </h3>
                      <p className="text-[#4b4b4b]">{card.description}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative h-64 w-full overflow-hidden rounded-3xl border border-[#ececec] bg-[#111]/5 shadow-inner md:h-auto md:min-h-[26rem] md:self-stretch md:flex-[2]">
                <Image
                  src={sectionImages.wallets}
                  alt={`${t.wallets.title} preview`}
                  fill
                  sizes="(min-width: 1280px) 420px, (min-width: 768px) 40vw, 90vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f]/30 via-transparent to-transparent" />
              </div>
            </div>
            <div className="mt-12 flex justify-center">
              <Link
                href="/wallets"
                className="inline-block bg-[#111] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#000] transition"
              >
                {t.wallets.cta}
              </Link>
            </div>
          </div>
        </section>

        <section className="py-20 px-6 bg-[#f9f9f9] border-t border-[#ececec] animate-fade-in-up delay-300">
          <div className="max-w-6xl mx-auto">
            <LoyaltyCardSection />
          </div>
        </section>

        {/* Contact Card */}
        <section
          id="contact"
          className="py-12 px-6 bg-white animate-fade-in-up delay-400 border-t border-[#ececec]"
        >
          <div className="max-w-7xl mx-auto overflow-hidden rounded-3xl bg-white border border-[#ececec] grid grid-cols-1 lg:grid-cols-2 shadow-xl">
            {/* Left - Info */}
            <div className="p-12 flex flex-col justify-between text-[#161616]">
              <div>
                <h2 className="text-4xl font-bold text-[#111] mb-4">
                  {t.contactSection.title}
                </h2>
                <p className="text-[#404040] text-lg mb-8">
                  {t.contactSection.description}
                </p>
              </div>
            </div>
            {/* Right - Form */}
            <div className="p-12 bg-white/95">
              <form
                action="/api/contact"
                method="POST"
                className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left text-[#1f1f1f]"
              >
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium"
                  >
                    {t.contactSection.form.firstName}
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    required
                    className="mt-1 block w-full bg-white border border-[#d9d9d9] px-4 py-2 rounded-md text-[#1f1f1f] placeholder-[#9f9f9f] focus:outline-none focus:ring-2 focus:ring-[#111]"
                  />
                </div>
                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium"
                  >
                    {t.contactSection.form.lastName}
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    required
                    className="mt-1 block w-full bg-white border border-[#d9d9d9] px-4 py-2 rounded-md text-[#1f1f1f] placeholder-[#9f9f9f] focus:outline-none focus:ring-2 focus:ring-[#111]"
                  />
                </div>
                <div>
                  <label
                    htmlFor="phoneNumber"
                    className="block text-sm font-medium"
                  >
                    {t.contactSection.form.phoneNumber}
                  </label>
                  <input
                    type="text"
                    id="phoneNumber"
                    name="phoneNumber"
                    className="mt-1 block w-full bg-white border border-[#d9d9d9] px-4 py-2 rounded-md text-[#1f1f1f] placeholder-[#9f9f9f] focus:outline-none focus:ring-2 focus:ring-[#111]"
                  />
                </div>
                <div>
                  <label
                    htmlFor="preferredProduct"
                    className="block text-sm font-medium"
                  >
                    {t.contactSection.form.preferredProduct}
                  </label>
                  <input
                    type="text"
                    id="preferredProduct"
                    name="preferredProduct"
                    className="mt-1 block w-full bg-white border border-[#d9d9d9] px-4 py-2 rounded-md text-[#1f1f1f] placeholder-[#9f9f9f] focus:outline-none focus:ring-2 focus:ring-[#111]"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium"
                  >
                    {t.contactSection.form.email}
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="mt-1 block w-full bg-white border border-[#d9d9d9] px-4 py-2 rounded-md text-[#1f1f1f] placeholder-[#9f9f9f] focus:outline-none focus:ring-2 focus:ring-[#111]"
                  />
                </div>
                <div>
                  <label
                    htmlFor="help"
                    className="block text-sm font-medium"
                  >
                    {t.contactSection.form.interest}
                  </label>
                  <select
                    id="help"
                    name="help"
                    required
                    className="mt-1 block w-full bg-white border border-[#d9d9d9] px-4 py-2 rounded-md text-[#1f1f1f] focus:outline-none focus:ring-2 focus:ring-[#111]"
                    defaultValue=""
                  >
                    <option value="" disabled>
                      {t.contactSection.form.selectPlaceholder}
                    </option>
                    <option value="belt">
                      {t.contactSection.form.options.belt}
                    </option>
                    <option value="bag">
                      {t.contactSection.form.options.bag}
                    </option>
                    <option value="wallet">
                      {t.contactSection.form.options.wallet}
                    </option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium"
                  >
                    {t.contactSection.form.messageLabel}
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    required
                    className="mt-1 block w-full bg-white border border-[#d9d9d9] px-4 py-2 rounded-md text-[#1f1f1f] placeholder-[#9f9f9f] focus:outline-none focus:ring-2 focus:ring-[#111]"
                  ></textarea>
                </div>
                <div className="md:col-span-2 flex justify-end">
                  <button
                    type="submit"
                    className="bg-[#111] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#000] transition"
                  >
                    {t.contactSection.form.submit}
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



