'use client';

import { FaGift, FaHeart, FaPercent } from 'react-icons/fa';
import { useLanguage } from './LanguageProvider';

type LoyaltyCardSectionProps = {
  className?: string;
};

const accentIcons = [FaHeart, FaPercent, FaGift, FaHeart, FaPercent, FaGift, FaHeart] as const;

export function LoyaltyCardSection({ className }: LoyaltyCardSectionProps) {
  const { t } = useLanguage();
  const copy = t.loyalty;

  return (
    <section
      className={`relative overflow-hidden rounded-2xl border border-[#e0e0e0] bg-white px-4 py-6 shadow-sm md:px-6 ${className ?? ''}`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(248,228,208,0.35),_transparent_55%),radial-gradient(circle_at_bottom_right,_rgba(220,233,226,0.3),_transparent_45%)]" />
      <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div className="md:max-w-md space-y-3">
          <p className="inline-flex items-center gap-2 rounded-full bg-black/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-white shadow-sm">
            {copy.badge ?? 'Loyalty'}
          </p>
          <h2 className="text-xl font-semibold text-[#111] md:text-2xl">{copy.title}</h2>
          <p className="text-sm text-[#3f3f3f] md:text-base">{copy.subtitle}</p>
        </div>
        <div className="flex-1 space-y-3">
          <ul className="space-y-2.5 text-xs text-[#1f1f1f] md:text-sm">
            {copy.perks.map((perk, index) => {
              const Icon = accentIcons[index % accentIcons.length];
              return (
                <li
                  key={perk}
                  className="flex items-start gap-2 rounded-xl bg-white/80 px-3 py-2.5 shadow-[0_3px_10px_rgba(15,23,42,0.06)] ring-1 ring-[#ededed]"
                >
                  <span className="mt-0.5 text-[#9a7048]">
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                  <span className="leading-relaxed">{perk}</span>
                </li>
              );
            })}
          </ul>
          <p className="rounded-xl bg-[#111] px-3 py-2.5 text-xs font-semibold text-white md:text-sm">
            {copy.note}
          </p>
        </div>
      </div>
    </section>
  );
}
