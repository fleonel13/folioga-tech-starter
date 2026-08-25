"use client";

import Link from "next/link";
import { useState } from "react";
import { Product } from "@/lib/products";
import { addToCart } from "@/lib/cart";

export default function ProductCard({
  product,
  locale,
}: {
  product: Product;
  locale: string;
}) {
  const [favorite, setFavorite] = useState(false);
  const [added, setAdded] = useState(false);

  function handleCart() {
    addToCart(product);
    setAdded(true);

    setTimeout(() => {
      setAdded(false);
    }, 1500);
  }

  return (
    <article className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative aspect-square overflow-hidden bg-slate-100">
        <Link href={`/${locale}/shop/${product.id}`}>
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        </Link>

        {product.badge && (
          <span className="absolute left-4 top-4 rounded-full bg-slate-900 px-3 py-1 text-xs font-bold text-white">
            {product.badge}
          </span>
        )}

        <button
          onClick={() => setFavorite(!favorite)}
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-lg shadow"
          aria-label="Favori"
        >
          {favorite ? "♥" : "♡"}
        </button>
      </div>

      <div className="p-5">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            {product.category}
          </span>

          <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">
            {product.condition}
          </span>
        </div>

        <Link href={`/${locale}/shop/${product.id}`}>
          <h3 className="text-lg font-bold text-slate-900 transition hover:text-blue-600">
            {product.name}
          </h3>
        </Link>

        <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
          {product.description}
        </p>

        <div className="mt-3 flex items-center gap-2 text-sm">
          <span className="font-bold text-amber-500">★ {product.rating}</span>
          <span className="text-slate-400">({product.reviews} avis)</span>
        </div>

        <div className="mt-4 flex items-end justify-between gap-3">
          <div>
            {product.oldPrice && (
              <div className="text-sm text-slate-400 line-through">
                {product.oldPrice} €
              </div>
            )}

            <div className="text-2xl font-black text-slate-950">
              {product.price} €
            </div>
          </div>

          <button
            onClick={handleCart}
            className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-600"
          >
            {added ? "✓ Ajouté" : "Ajouter"}
          </button>
        </div>

        <div className="mt-4 text-xs text-slate-400">
          {product.stock} exemplaire{product.stock > 1 ? "s" : ""} disponible
          {product.stock > 1 ? "s" : ""}
        </div>
      </div>
    </article>
  );
}
