'use client';

import Link from 'next/link';

type Product = {
  id: string;
  name: string;
  category: string;
  condition: string;
  price: number;
  oldPrice?: number;
  rating: number;
  reviews: number;
  stock: number;
  image: string;
  badge?: string;
};

export default function ProductCard({product}: {product: Product}) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <Link href={`./shop/${product.id}`}>
        <div className="relative flex h-56 items-center justify-center bg-slate-100 p-6">
          {product.badge && (
            <span className="absolute left-4 top-4 rounded-full bg-blue-600 px-3 py-1 text-xs font-bold text-white">
              {product.badge}
            </span>
          )}

          <div className="text-7xl transition duration-300 group-hover:scale-110">
            {product.image}
          </div>
        </div>
      </Link>

      <div className="p-5">
        <div className="mb-2 flex items-center justify-between gap-3">
          <span className="text-xs font-semibold uppercase tracking-wide text-blue-600">
            {product.category}
          </span>

          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
            {product.condition}
          </span>
        </div>

        <Link href={`./shop/${product.id}`}>
          <h3 className="line-clamp-2 min-h-12 text-lg font-bold text-slate-900 transition hover:text-blue-600">
            {product.name}
          </h3>
        </Link>

        <div className="mt-3 flex items-center gap-2">
          <span className="text-sm font-bold text-amber-500">
            ★ {product.rating.toFixed(1)}
          </span>
          <span className="text-xs text-slate-500">
            ({product.reviews} avis)
          </span>
        </div>

        <div className="mt-4 flex items-end justify-between gap-4">
          <div>
            {product.oldPrice && (
              <div className="text-sm text-slate-400 line-through">
                {product.oldPrice.toFixed(2)} €
              </div>
            )}

            <div className="text-2xl font-black text-slate-900">
              {product.price.toFixed(2)} €
            </div>
          </div>

          <Link
            href={`./shop/${product.id}`}
            className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-blue-600"
          >
            Voir
          </Link>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4 text-xs">
          <span className="text-slate-500">
            {product.stock > 0 ? `${product.stock} en stock` : 'Rupture de stock'}
          </span>

          <span className="font-semibold text-emerald-600">
            Livraison rapide
          </span>
        </div>
      </div>
    </article>
  );
}
