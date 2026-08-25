import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProduct } from '@/lib/products';

export default async function ProductPage({
  params
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const product = getProduct(id);

  if (!product) notFound();

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          href={`/${locale}/shop`}
          className="text-sm font-semibold text-slate-500 hover:text-blue-600"
        >
          ← Retour à la boutique
        </Link>

        <div className="mt-6 grid gap-10 lg:grid-cols-2">
          <div>
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
              <img
                src={product.image}
                alt={product.name}
                className="aspect-square w-full object-cover"
              />
            </div>

            {product.images.length > 1 && (
              <div className="mt-4 grid grid-cols-4 gap-3">
                {product.images.map((image) => (
                  <div
                    key={image}
                    className="overflow-hidden rounded-xl border border-slate-200 bg-white"
                  >
                    <img
                      src={image}
                      alt=""
                      className="aspect-square w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col justify-center">
            <p className="text-sm font-bold uppercase tracking-wider text-blue-600">
              {product.category}
            </p>

            <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950">
              {product.name}
            </h1>

            <div className="mt-4 flex items-center gap-3">
              <span className="font-bold text-amber-500">
                ★ {product.rating}
              </span>
              <span className="text-sm text-slate-500">
                {product.reviews} avis
              </span>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
                {product.condition}
              </span>
            </div>

            <p className="mt-6 text-base leading-7 text-slate-600">
              {product.description}
            </p>

            <div className="mt-7">
              <span className="text-4xl font-black text-slate-950">
                {product.price} €
              </span>

              {product.oldPrice && (
                <span className="ml-3 text-lg text-slate-400 line-through">
                  {product.oldPrice} €
                </span>
              )}
            </div>

            <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
              <p className="font-bold text-emerald-800">
                ✓ Disponible immédiatement
              </p>
              <p className="mt-1 text-sm text-emerald-700">
                {product.stock} exemplaire{product.stock > 1 ? 's' : ''} en stock
              </p>
            </div>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <form action="/api/checkout" method="POST" className="flex-1">
                <input
                  type="hidden"
                  name="product"
                  value={product.id}
                />

                <Link
                  href={`/${locale}/cart?product=${product.id}`}
                  className="block w-full rounded-2xl bg-slate-950 px-6 py-4 text-center font-bold text-white transition hover:bg-blue-600"
                >
                  Ajouter au panier
                </Link>
              </form>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {product.features.map((feature) => (
                <div
                  key={feature}
                  className="rounded-xl bg-white p-4 text-sm font-semibold text-slate-700"
                >
                  ✓ {feature}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
