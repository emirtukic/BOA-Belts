'use client';

import Link from 'next/link';
import { FaEnvelope, FaFacebookMessenger, FaInstagram } from 'react-icons/fa';
import { SiViber } from 'react-icons/si';
import type { IconType } from 'react-icons';
import { useLanguage } from './LanguageProvider';
import { LoyaltyCardSection } from './LoyaltyCardSection';

/* ===== Types ===== */
type ContactKey = 'instagram' | 'facebook' | 'email';

type ContactMethod = {
  label?: string;
  description?: string;
  href?: string;
  value?: string; // e.g. email address
};

type Channel = {
  label: string; // e.g. "Instagram", "Viber Community"
  href: string;  // e.g. "https://instagram.com/..." or "https://invite.viber.com/..."
  platform?: string; // optional explicit key like "instagram" | "viber"
  key?: string;      // optional explicit key
};

type AboutPage = {
  heroTitle?: string;
  heroSubtitle?: string;

  introTitle?: string;
  introParagraphs?: string[];
  storyParagraphs?: string[];

  highlightsTitle?: string;
  highlights?: { title: string; description: string }[];
  values?: { title: string; description: string }[];

  processTitle?: string;
  processSteps?: string[];
  craftParagraphs?: string[];

  timelineTitle?: string;
  timelinePoints?: string[];

  contactTitle?: string;
  contactSubtitle?: string;
  contactMethods?: Record<string, ContactMethod>;

  channelsTitle?: string;
  channelsSubtitle?: string;
  channels?: Channel[];

  ctaTitle?: string;
  ctaText?: string;
  ctaButton?: string;
};

/* ===== Icon Maps ===== */
const contactIcons: Record<ContactKey, IconType> = {
  instagram: FaInstagram,
  facebook: FaFacebookMessenger,
  email: FaEnvelope,
};

const channelIcons: Record<string, IconType> = {
  instagram: FaInstagram,
  viber: SiViber,
};

/* ===== Helpers ===== */
function resolveChannelKey(ch: Channel): keyof typeof channelIcons {
  const explicit =
    (ch.platform ?? ch.key ?? ch.label ?? '').toString().toLowerCase().trim();

  if (explicit in channelIcons) return explicit as keyof typeof channelIcons;

  const href = (ch.href ?? '').toLowerCase();
  if (href.includes('instagram.com')) return 'instagram';
  if (href.includes('viber.com') || href.includes('invite.viber.com')) return 'viber';

  return 'instagram'; // safe fallback
}

/* ===== Component ===== */
export default function AboutPageContent() {
  const { t } = useLanguage();
const data: Partial<AboutPage> = (t as any)?.aboutPage ?? {};

  const introParagraphs: string[] = Array.isArray(data.introParagraphs)
    ? data.introParagraphs
    : Array.isArray(data.storyParagraphs)
    ? data.storyParagraphs
    : [];

  const highlights: { title: string; description: string }[] = Array.isArray(data.highlights)
    ? data.highlights
    : Array.isArray(data.values)
    ? data.values
    : [];

  const processSteps: string[] = Array.isArray(data.processSteps)
    ? data.processSteps
    : Array.isArray(data.craftParagraphs)
    ? data.craftParagraphs
    : [];

  const timelinePoints: string[] = Array.isArray(data.timelinePoints) ? data.timelinePoints : [];

  const contactEntries: [string, ContactMethod][] = Object.entries(
    data.contactMethods ?? {}
  ) as [string, ContactMethod][];

  const channels: Channel[] = Array.isArray(data.channels) ? (data.channels as Channel[]) : [];

  return (
    <main className="bg-white text-[#1f1f1f]">
      <section
        className="relative overflow-hidden py-28 px-6 text-center text-[#111]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.9), rgba(255,255,255,0.9)), url('/boabelts.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="relative z-10 mx-auto max-w-3xl space-y-6">
          <h1 className="text-4xl font-semibold md:text-5xl">{data.heroTitle}</h1>
          <p className="text-lg text-[#3a3a3a] md:text-xl">{data.heroSubtitle}</p>
        </div>
      </section>

      <section className="py-16 px-6 bg-white border-b border-[#ececec]">
        <div className="mx-auto flex max-w-5xl flex-col gap-6 text-left">
          <h2 className="text-3xl font-semibold text-[#111] md:text-4xl">{data.introTitle}</h2>
          <div className="space-y-4 text-lg leading-relaxed text-[#4b4b4b]">
            {introParagraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      {highlights.length > 0 && (
        <section className="py-16 px-6 bg-white border-b border-[#ececec]">
          <div className="mx-auto flex max-w-6xl flex-col gap-10">
            <div className="space-y-4 text-center">
              <h2 className="text-3xl font-semibold text-[#111] md:text-4xl">
                {data.highlightsTitle}
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {highlights.map((item) => (
                <div
                  key={item.title}
                  className="h-full rounded-2xl border border-[#ececec] bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <h3 className="text-xl font-semibold text-[#111]">{item.title}</h3>
                  <p className="mt-3 text-sm text-[#4b4b4b] md:text-base">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {processSteps.length > 0 && (
        <section className="py-16 px-6 bg-white border-b border-[#ececec]">
          <div className="mx-auto flex max-w-5xl flex-col gap-8">
            <div className="space-y-4 text-left">
              <h2 className="text-3xl font-semibold text-[#111] md:text-4xl">{data.processTitle}</h2>
            </div>
            <ol className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {processSteps.map((step, index) => (
                <li
                  key={step}
                  className="relative rounded-2xl border border-[#ececec] bg-white p-5 shadow-sm"
                >
                  <span className="absolute inset-x-5 -top-4 inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#111] text-sm font-semibold text-white shadow">
                    {index + 1}
                  </span>
                  <p className="mt-6 text-sm text-[#4b4b4b] md:text-base leading-relaxed">{step}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      <section className="py-16 px-6 bg-white border-b border-[#ececec]">
        <div className="mx-auto flex max-w-4xl flex-col gap-6 text-left">
          <h2 className="text-3xl font-semibold text-[#111] md:text-4xl">{data.timelineTitle}</h2>
          <ul className="list-disc space-y-3 pl-6 text-lg leading-relaxed text-[#4b4b4b]">
            {timelinePoints.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-16 px-6 bg-[#f9f9f9] border-b border-[#ececec]">
        <div className="mx-auto flex max-w-6xl flex-col gap-10">
          <div className="max-w-3xl space-y-4">
            <h2 className="text-3xl font-semibold text-[#111] md:text-4xl">{data.contactTitle}</h2>
            <p className="text-base text-[#4b4b4b] md:text-lg">{data.contactSubtitle}</p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {contactEntries.map(([key, method]) => {
              const typedKey = key as ContactKey;
              const Icon = contactIcons[typedKey] ?? FaEnvelope;
              const href =
                method?.href ?? (method?.value ? `mailto:${method.value}` : undefined);

              return (
                <a
                  key={key}
                  href={href ?? '#'}
                  target={href && href.startsWith('http') ? '_blank' : undefined}
                  rel={href && href.startsWith('http') ? 'noreferrer' : undefined}
                  className="group flex h-full flex-col gap-3 rounded-2xl border border-[#ececec] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#111] text-white">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold uppercase tracking-wide text-[#111]">
                      {method?.label}
                    </p>
                    <p className="text-sm text-[#4b4b4b]">{method?.description}</p>
                    {method?.value && !method?.href && (
                      <p className="text-sm font-semibold text-[#111]">{method.value}</p>
                    )}
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 px-6 bg-white border-b border-[#ececec]">
        <div className="mx-auto flex max-w-6xl flex-col gap-8">
          <div className="max-w-3xl space-y-4">
            <h2 className="text-3xl font-semibold text-[#111] md:text-4xl">
              {data.channelsTitle}
            </h2>
            <p className="text-base text-[#4b4b4b] md:text-lg">
              {data.channelsSubtitle}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {channels.map((channel) => {
              const key = resolveChannelKey(channel);
              const Icon = channelIcons[key];

              return (
                <a
                  key={channel.href}
                  href={channel.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center justify-between rounded-2xl border border-[#ececec] bg-[#f9f9f9] px-5 py-4 text-left shadow-sm transition hover:-translate-y-1 hover:border-[#111] hover:shadow-lg"
                >
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#111] text-white">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="text-sm font-semibold text-[#111] md:text-base">
                      {channel.label}
                    </span>
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-wide text-[#9a7048] group-hover:text-[#111]">
                    Join
                  </span>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-[#f9f9f9] border-b border-[#ececec]">
        <div className="mx-auto max-w-6xl">
          <LoyaltyCardSection />
        </div>
      </section>
    </main>
  );
}
