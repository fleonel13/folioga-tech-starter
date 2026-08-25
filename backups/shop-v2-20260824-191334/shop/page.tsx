'use client';

import {useMemo, useState} from 'react';
import ShopSearch from '@/components/ShopSearch';
import ProductFilters from '@/components/ProductFilters';
import ProductGrid from '@/components/ProductGrid';
import ShopTrustBar from '@/components/ShopTrustBar';

const products = [
  {
    id: 'iphone-13',
    name: 'Apple iPhone 13 128 Go',
    category: 'smartphones',
    condition: 'Reconditionné',
    price: 399,
    oldPrice: 499,
    rating: 4.8,
    reviews: 124,
    stock: 8,
    image: '📱',
    badge: 'Meilleure vente'
  },
  {
    id: 'iphone-14',
    name: 'Apple iPhone 14 128 Go',
    category: 'smartphones',
    condition: 'Reconditionné',
    price: 499,
    oldPrice: 599,
    rating: 4.9,
    reviews: 87,
    stock: 5,
    image: '📱',
    badge: '-17%'
  },
  {
    id: 'macbook-air-m2',
    name: 'MacBook Air M2 13 pouces',
    category: 'ordinateurs',
    condition: 'Reconditionné',
    price: 899,
    oldPrice: 1099,
    rating: 4.9,
    reviews: 63,
    stock: 4,
    image: '💻',
    badge: 'Premium'
  },
  {
    id: 'ipad-10',
    name: 'Apple iPad 10e génération',
    category: 'tablettes',
    condition: 'Neuf',
    price: 429,
    rating: 4.7,
    reviews: 51,
    stock: 12,
    image: '📲'
  },
  {
    id: 'airpods-pro',
    name: 'AirPods Pro 2e génération',
    category: 'accessoires',
    condition: 'Neuf',
    price: 229,
    oldPrice: 279,
    rating: 4.8,
    reviews: 208,
    stock: 20,
    image: '🎧',
    badge: 'Populaire'
  },
  {
    id: 'thinkpad-t14',
    name: 'Lenovo ThinkPad T14',
    category: 'ordinateurs',
    condition: 'Reconditionné',
    price: 549,
    oldPrice: 749,
    rating: 4.6,
    reviews: 39,
    stock: 6,
    image: '💻'
  }
];

export default function ShopPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [condition, setCondition] = useState('all');
  const [sort, setSort] = useState('featured');

  const filteredProducts = useMemo(() => {
    let result = products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        category === 'all' || product.category === category;

      const matchesCondition =
        condition === 'all' ||
        product.condition.toLowerCase() === condition;

      return matchesSearch && matchesCategory && matchesCondition;
    });

    if (sort === 'price-low') {
      result = [...result].sort((a, b) => a.price - b.price);
    }

    if (sort === 'price-high') {
      result = [...result].sort((a, b) => b.price - a.price);
    }

    if (sort === 'rating') {
      result = [...result].sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [search, category, condition, sort]);

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-700">
              Folioga-tech Shop
            </span>

            <h1 className="mt-5 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
              La technologie mérite
              <span className="text-blue-600"> une seconde vie.</span>
            </h1>

            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
              Découvrez notre sélection de smartphones, ordinateurs,
              tablettes et accessoires neufs ou reconditionnés.
            </p>
          </div>

          <div className="mt-10 max-w-3xl">
            <ShopSearch value={search} onChange={setSearch} />
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <ShopTrustBar />

        <section className="mt-10">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold text-blue-600">
                Notre catalogue
              </p>

              <h2 className="mt-1 text-3xl font-black text-slate-950">
                Produits sélectionnés
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                {filteredProducts.length} produit
                {filteredProducts.length > 1 ? 's' : ''} disponible
                {filteredProducts.length > 1 ? 's' : ''}
              </p>
            </div>

            <div className="w-full lg:max-w-3xl">
              <ProductFilters
                category={category}
                condition={condition}
                sort={sort}
                onCategoryChange={setCategory}
                onConditionChange={setCondition}
                onSortChange={setSort}
              />
            </div>
          </div>

          <div className="mt-8">
            <ProductGrid products={filteredProducts} />
          </div>
        </section>

        <section className="mt-16 overflow-hidden rounded-3xl bg-slate-900 p-8 text-white sm:p-12">
          <div className="max-w-2xl">
            <span className="text-sm font-bold uppercase tracking-wider text-blue-400">
              Pourquoi Folioga-tech ?
            </span>

            <h2 className="mt-3 text-3xl font-black sm:text-4xl">
              Acheter mieux. Réparer plus. Jeter moins.
            </h2>

            <p className="mt-4 leading-7 text-slate-300">
              Nous sélectionnons des appareils contrôlés pour prolonger leur
              durée de vie et réduire leur impact environnemental.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <span className="rounded-full bg-white/10 px-4 py-2 text-sm">
                ♻️ Économie circulaire
              </span>
              <span className="rounded-full bg-white/10 px-4 py-2 text-sm">
                🛠️ Techniciens qualifiés
              </span>
              <span className="rounded-full bg-white/10 px-4 py-2 text-sm">
                🔒 Paiement sécurisé
              </span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
