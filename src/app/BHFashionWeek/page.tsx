import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { revijaGalleryImages } from '@/data/revijaGallery';
import { RevijaGallery } from '@/components/RevijaGallery';

const heroImage = '/revija/8J3A0630.webp';

export const metadata: Metadata = {
  title: 'Boa Belt BH Fashion Week | Boa Belts',
  description:
    'Boa Belts je predstavio kolekciju na BH Fashion Weeku u Sarajevu. Pogledajte backstage, runway i detalje iz revije kroz kompletnu foto arhivu.',
};

const eventFacts = [
  {
    label: 'Lokacija',
    value: 'Bosmal Arjaan by Rotana, Sarajevo',
  },
  {
    label: 'Program',
    value: '49. BH Fashion Week & kampanja "Udružene protiv nasilja nad ženama"',
  },
] as const;

const summaryItems = [
  {
    title: 'Otvaranje modne sedmice',
    description:
      'Podijelili smo pistu prve ve\u010deri sa No Nation Fashion, AMAL i drugim dizajnerima koji su predstavili doma\u0107e kolekcije.',
  },
  {
    title: 'Kampanja solidarnosti',
    description: 'Program je podr\u017eao inicijativu "Udru\u017eene protiv nasilja nad \u017eenama" koju je istakla organizatorica Fedra Smajovi\u0107.',
  },
  {
    title: 'Travni\u010dki potpis',
    description:
      'Boa Belts je u Sarajevo donio ru\u010dno ra\u0111ene kai\u0161eve i torbe nastale u radionici u Travniku, \u0161to je publika nagradila aplauzom.',
  },
] as const;

export default function RevijaPage() {
  return (
    <main className="bg-white text-[#0f0f0f]">
      <section className="relative overflow-hidden bg-[#0b0b0b] px-6 py-20 text-white md:px-10">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 lg:flex-row">
          <div className="flex-1 space-y-6">
            <span className="inline-flex w-fit items-center rounded-full border border-white/30 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-white/80">
              BH Fashion Week
            </span>
            <h1 className="text-3xl font-semibold leading-tight text-white md:text-4xl">
              Boa Belt BH Fashion Week
            </h1>
            <p className="text-base leading-relaxed text-white/80">
              Na pozornici hotela Bosmal Arjaan by Rotana u Sarajevu podijelili smo runway sa brendovima No Nation Fashion, AMAL i
              drugim dizajnerima koji podržavaju kampanju &ldquo;Udružene protiv nasilja nad ženama&rdquo;. Publika je imala priliku vidjeti
              kako ručno rađeni kaiševi i torbe iz Travnika ulaze u fokus domaće i međunarodne modne scene.
            </p>
            <p className="text-base leading-relaxed text-white/80">
              Ova revija nam je omogućila da pokažemo koliko lokalni dizajn može biti angažovan: svaki komad sa piste nosi
              istu energiju kao i poruka kampanje koja ističe solidarnost i podršku ženama širom Bosne i Hercegovine.
            </p>
            {summaryItems.length ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {summaryItems.map((item) => (
                  <div key={item.title} className="rounded-2xl border border-white/15 bg-white/5 p-4 text-white/85 backdrop-blur">
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-white">{item.title}</h3>
                    <p className="mt-2 text-sm text-white/80">{item.description}</p>
                  </div>
                ))}
              </div>
            ) : null}
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {eventFacts.map((fact) => (
                <div
                  key={fact.label}
                  className="rounded-2xl border border-white/20 bg-white/5 p-4 text-sm text-white/80 backdrop-blur"
                >
                  <dt className="text-xs uppercase tracking-wide text-white">{fact.label}</dt>
                  <dd className="mt-2 font-semibold text-white">{fact.value}</dd>
                </div>
              ))}
            </dl>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/"
                className="inline-flex items-center rounded-full border border-white/20 px-5 py-2 text-sm font-semibold text-white transition hover:bg-white hover:text-[#0b0b0b]"
              >
                Nazad na početnu
              </Link>
              <Link
                href="/kaisevi"
                className="inline-flex items-center rounded-full bg-white px-5 py-2 text-sm font-semibold text-[#0b0b0b] transition hover:bg-[#f4f4f4]"
              >
                Pogledaj kolekciju
              </Link>
            </div>
          </div>
          <div className="relative w-full max-w-xl self-center rounded-3xl border border-white/20 bg-white/5 shadow-2xl lg:self-start">
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-3xl">
              <Image
                src={heroImage}
                alt="Boa Belts look na BH Fashion Weeku"
                fill
                sizes="(min-width: 1024px) 450px, 90vw"
                className="object-cover"
                priority
              />
            </div>
            <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-t from-[#0b0b0b] via-transparent to-transparent" />
          </div>
        </div>
      </section>

      <section className="px-6 py-16 md:px-10">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#9a7048]">Foto arhiva</p>
            <h2 className="mt-4 text-3xl font-bold text-[#111]">Sve fotografije sa revije</h2>
            <p className="mt-4 text-base text-[#3f3f3f]">
              Od prvog izlaska do backstage detalja, svaka fotografija bilježi trenutke iz BH Fashion Weeka koji je okupio domaće
              i strane dizajnere. Scroll ili otvori galeriju i zabilježi svoje favorite za sljedeće narudžbe.
            </p>
          </div>
          <RevijaGallery images={revijaGalleryImages} />
        </div>
      </section>
    </main>
  );
}
