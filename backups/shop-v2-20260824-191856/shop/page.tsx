import { products } from '@/lib/products';
import ShopClient from '@/components/shop/ShopClient';

export default async function ShopPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="inline-flex rounded-full bg-blue-50 px-4 py-2 text-sm font-bold text-blue-700">
              FOLIOGA SHOP
            </span>

            <h1 className="mt-5 text-4xl font-black tracking-tight text-slate-950 md:text-6xl">
              La technologie,
              <span className="block text-blue-600">
                autrement.
              </span>
            </h1>

            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
              Découvrez des appareils contrôlés, reconditionnés et sélectionnés
              par nos équipes pour vous offrir le meilleur rapport qualité-prix.
            </p>

            <div className="mt-7 flex flex-wrap gap-3 text-sm font-semibold text-slate-600">
              <span className="rounded-full bg-slate-100 px-4 py-2">
                ✓ Produits contrôlés
              </span>
              <span className="rounded-full bg-slate-100 px-4 py-2">
                ✓ Garantie
              </span>
              <span className="rounded-full bg-slate-100 px-4 py-2">
                ✓ Paiement sécurisé
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <ShopClient products={products} locale={locale} />
      </section>
    </main>
  );
}
