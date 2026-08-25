'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { products, type Product } from '@/lib/products';
import { addToCart } from '@/lib/cart';

export default function ProductPage() {
  const params = useParams<{ locale: string; id: string }>();
  const locale = params.locale;
  const id = params.id;

  const product = products.find((item) => item.id === id);
  const [added, setAdded] = useState(false);

  if (!product) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-20">
        <div className="mx-auto max-w-3xl rounded-3xl bg-white p-10 text-center shadow-sm">
          <div className="text-5xl">🔎</div>

          <h1 className="mt-5 text-3xl font-black text-slate-950">
            Produit introuvable
          </h1>

          <p className="mt-3 text-slate-500">
            Ce produit n'existe plus ou le lien est incorrect.
          </p>

          <Link
            href={`/${locale}/shop`}
            className="mt-7 inline-flex rounded-xl bg-slate-950 px-6 py-3 font-bold text-white transition hover:bg-blue-600"
          >
            Retour à la boutique
          </Link>
        </div>
      </main>
    );
  }

  const handleCart = (item: Product) => {
    addToCart(item);
    setAdded(true);
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">

        <Link
          href={`/${locale}/shop`}
          className="text-sm font-semibold text-slate-500 hover:text-blue-600"
        >
          ← Retour à la boutique
        </Link>

        <div className="mt-8 grid gap-10 lg:grid-cols-2">

          <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
            <img
              src={product.image}
              alt={product.name}
              className="aspect-square w-full object-cover"
            />
          </div>

          <div className="flex flex-col justify-center">

            <div className="flex flex-wrap gap-2">

              <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-bold text-blue-700">
                {product.category}
              </span>

              <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-bold text-emerald-700">
                {product.condition}
              </span>

            </div>

            <h1 className="mt-5 text-4xl font-black tracking-tight text-slate-950 md:text-5xl">
              {product.name}
            </h1>

            <div className="mt-4 flex items-center gap-3">

              <span className="font-bold text-amber-500">
                ★ {product.rating}
              </span>

              <span className="text-slate-500">
                {product.reviews} avis
              </span>

            </div>

            <p className="mt-6 text-lg leading-8 text-slate-600">
              {product.description}
            </p>

            <div className="mt-8 border-y border-slate-200 py-6">

              {product.oldPrice && (
                <span className="mr-3 text-lg text-slate-400 line-through">
                  {product.oldPrice} €
                </span>
              )}

              <span className="text-4xl font-black text-slate-950">
                {product.price} €
              </span>

            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">

              <button
                type="button"
                onClick={() => handleCart(product)}
                className="rounded-2xl bg-slate-950 px-6 py-4 font-bold text-white transition hover:bg-blue-600"
              >
                {added ? '✓ Produit ajouté' : 'Ajouter au panier'}
              </button>

              <Link
                href={`/${locale}/cart`}
                className="rounded-2xl border border-slate-200 bg-white px-6 py-4 text-center font-bold text-slate-900 hover:border-blue-300"
              >
                Voir le panier
              </Link>

            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">

              <div className="rounded-2xl bg-white p-4 text-center">
                <div className="text-xl">✓</div>
                <div className="mt-1 text-xs font-bold">
                  Produit contrôlé
                </div>
              </div>

              <div className="rounded-2xl bg-white p-4 text-center">
                <div className="text-xl">♻️</div>
                <div className="mt-1 text-xs font-bold">
                  Reconditionné
                </div>
              </div>

              <div className="rounded-2xl bg-white p-4 text-center">
                <div className="text-xl">🚚</div>
                <div className="mt-1 text-xs font-bold">
                  Expédition rapide
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>
    </main>
  );
}
