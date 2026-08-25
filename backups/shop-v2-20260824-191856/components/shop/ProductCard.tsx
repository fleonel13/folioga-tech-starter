'use client';

import Link from 'next/link';
import { Product } from '@/lib/products';

export default function ProductCard({
  product,
  locale
}: {
  product: Product;
  locale: string;
}) {
  const discount = product.oldPrice
    ? Math.round((1 - product.price / product.oldPrice) * 100)
    : 0;

  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <Link href={`/${locale}/shop/${product.id}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-slate-100">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />

          {discount > 0 && (
            <span className="absolute left-4 top-4 rounded-full bg-slate-950 px-3 py-1 text-xs font-bold text-white">
              -{discount}%
            </span>
          )}

          <span className="absolute right-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-slate-700 shadow">
            {product.condition}
          </span>
        </div>

        <div className="p-5">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-blue-600">
            {product.category}
          </p>

          <h3 className="text-lg font-bold text-slate-950">
            {product.name}
          </h3>

          <div className="mt-2 flex items-center gap-2">
            <span className="text-sm font-bold text-amber-500">
              ★ {product.rating}
            </span>
            <span className="text-sm text-slate-500">
              ({product.reviews})
            </span>
          </div>

          <div className="mt-4 flex items-end justify-between">
            <div>
              <span className="text-2xl font-black text-slate-950">
                {product.price} €
              </span>

              {product.oldPrice && (
                <span className="ml-2 text-sm text-slate-400 line-through">
                  {product.oldPrice} €
                </span>
              )}
            </div>

            <span className="text-xs font-medium text-slate-500">
              {product.stock > 0
                ? `${product.stock} disponibles`
                : 'Rupture'}
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
