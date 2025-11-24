import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { catalogProducts, catalogProductMap } from '@/data/catalog';
import { ProductGallery } from '@/components/ProductGallery';
import { FaTruck } from 'react-icons/fa';

const categoryLabels: Record<string, string> = {
  womensBelts: '\u017denski kai\u0161',
  mensBelts: 'Mu\u0161ki kai\u0161',
  bags: 'Torba',
  wallets: 'Nov\u010danik',
  accessories: 'Dodatak',
};

type ProductPageParams = {
  params: Promise<{ productId: string }>;
};

const defaultDescription = 'Ru\u010dno izra\u0111en predmet iz Boa Belts radionice.';

const getProduct = (productId: string) => catalogProductMap[productId];

export function generateStaticParams() {
  return catalogProducts.map((product) => ({ productId: product.id }));
}

export async function generateMetadata({ params }: ProductPageParams): Promise<Metadata> {
  const { productId } = await params;
  const product = getProduct(productId);
  if (!product) {
    return {
      title: 'Proizvod nije prona\u0111en | Boa Belts',
      description: defaultDescription,
    };
  }

  const heroImage = product.colors[0]?.image ?? '/boabelts.jpg';
  const description = product.description || defaultDescription;

  return {
    title: product.name,
    description,
    openGraph: {
      title: `${product.name} | Boa Belts`,
      description,
      type: 'article',
      url: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.boabelts.com'}/proizvod/${product.id}`,
      images: [
        {
          url: heroImage,
          width: 1200,
          height: 900,
          alt: `${product.name} - Boa Belts`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} | Boa Belts`,
      description,
      images: [heroImage],
    },
  };
}

export default async function ProductPage({ params }: ProductPageParams) {
  const { productId } = await params;
  const product = getProduct(productId);
  if (!product) {
    notFound();
  }

  const variants = product.colors.length
    ? product.colors
    : [{ label: 'Photo 1', image: '/boabelts.jpg', preview: '/boabelts.jpg' }];

  const categoryLabel = categoryLabels[product.category] ?? 'Boa Belts';

  return (
    <main className="min-h-screen bg-[#f3f3f3] px-6 py-16">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <div className="flex items-center justify-between gap-4">
          <Link
            href={product.listHref}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#111] transition hover:text-[#9a7048]"
          >
            <span aria-hidden="true">←</span>
            <span>Nazad na listu</span>
          </Link>
          <span className="rounded-full border border-[#dedede] px-4 py-2 text-xs font-semibold uppercase tracking-wide text-[#9a7048]">
            {categoryLabel}
          </span>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <ProductGallery productName={product.name} variants={variants} />

          <div className="flex flex-col gap-6 rounded-3xl bg-white p-8 shadow-sm">
            <div>
              <p className="text-sm uppercase tracking-[0.4em] text-[#9a7048]">{categoryLabel}</p>
              <h1 className="mt-2 text-3xl font-semibold text-[#111]">{product.name}</h1>
              <p className="text-lg font-semibold text-[#111]">{product.price}</p>
            </div>
            <p className="text-sm leading-relaxed text-[#3f3f3f] whitespace-pre-line">
              {product.description || defaultDescription}
            </p>
            <div className="rounded-2xl bg-[#f7f4f1] p-5 text-sm text-[#2a2a2a]">
              <p className="font-semibold text-[#111]">Kako naručiti</p>
              <p className="mt-2 leading-relaxed">
                Pošalji poruku na Instagram ili Facebook sa nazivom <strong>{product.name}</strong> i željenom bojom.
                Odgovaramo u roku od 24 sata sa svim potrebnim informacijama.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://www.instagram.com/boa_belts/?hl=en"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full bg-[#111] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#000]"
              >
                Kontaktiraj na Instagramu
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=100027303537151"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full border border-[#111] px-5 py-3 text-sm font-semibold text-[#111] transition hover:bg-[#111] hover:text-white"
              >
                Piši na Facebooku
              </a>
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-dashed border-[#d9d9d9] bg-[#fdf9f6] px-4 py-3 text-sm text-[#3a3a3a]">
              <FaTruck className="h-5 w-5 text-[#9a7048]" aria-hidden="true" />
              <p className="leading-relaxed">Dostavljamo u roku od 48h nakon završetka izrade.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
