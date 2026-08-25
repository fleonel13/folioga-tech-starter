'use client';

import { useMemo, useState } from 'react';
import type { Product } from '@/lib/products';
import ProductCard from './ProductCard';
import ProductFilters from './ProductFilters';

export default function ShopClient({
  products,
  locale
}: {
  products: Product[];
  locale: string;
}) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('Tous');
  const [condition, setCondition] = useState('Tous');
  const [sort, setSort] = useState('featured');

  const categories = useMemo(() => {
    return [
      'Tous',
      ...Array.from(
        new Set(products.map((product) => product.category))
      )
    ];
  }, [products]);

  const filtered = useMemo(() => {
    const search = query.trim().toLowerCase();

    const result = products.filter((product) => {
      const matchesQuery =
        !search ||
        product.name.toLowerCase().includes(search) ||
        product.category.toLowerCase().includes(search);

      const matchesCategory =
        category === 'Tous' || product.category === category;

      const matchesCondition =
        condition === 'Tous' || product.condition === condition;

      return matchesQuery && matchesCategory && matchesCondition;
    });

    return [...result].sort((a, b) => {
      if (sort === 'price-asc') return a.price - b.price;
      if (sort === 'price-desc') return b.price - a.price;
      if (sort === 'rating') return b.rating - a.rating;
      return 0;
    });
  }, [products, query, category, condition, sort]);

  return (
    <>
      <div className="mb-6 flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            ⌕
          </span>

          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher un produit..."
            className="w-full rounded-2xl border border-slate-200 bg-white py-4 pl-11 pr-4 text-sm shadow-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
          />
        </div>
      </div>

      <ProductFilters
        category={category}
        condition={condition}
        sort={sort}
        onCategoryChange={setCategory}
        onConditionChange={setCondition}
        onSortChange={setSort}
        categories={categories}
      />

      <div className="mt-8 flex items-center justify-between">
        <p className="text-sm text-slate-500">
          <strong className="text-slate-900">{filtered.length}</strong>{' '}
          produit{filtered.length > 1 ? 's' : ''}
        </p>
      </div>

      {filtered.length > 0 ? (
        <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              locale={locale}
            />
          ))}
        </div>
      ) : (
        <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <div className="text-4xl">🔎</div>

          <h2 className="mt-4 text-xl font-bold text-slate-950">
            Aucun produit trouvé
          </h2>

          <p className="mt-2 text-slate-500">
            Essayez une autre recherche ou modifiez vos filtres.
          </p>

          <button
            type="button"
            onClick={() => {
              setQuery('');
              setCategory('Tous');
              setCondition('Tous');
              setSort('featured');
            }}
            className="mt-6 rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-600"
          >
            Réinitialiser les filtres
          </button>
        </div>
      )}
    </>
  );
}
