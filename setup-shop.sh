#!/usr/bin/env bash

set -e

echo "======================================"
echo " FOLIOGA-TECH — SHOP V1"
echo " Création de la boutique professionnelle"
echo "======================================"

mkdir -p components
mkdir -p "app/[locale]/shop/[id]"

cat > components/ShopSearch.tsx <<'EOF'
'use client';

import {useState} from 'react';

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export default function ShopSearch({value, onChange}: Props) {
  return (
    <div className="relative w-full">
      <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
        🔎
      </span>

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Rechercher un produit..."
        className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
      />
    </div>
  );
}
EOF

cat > components/ProductCard.tsx <<'EOF'
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
EOF

cat > components/ProductFilters.tsx <<'EOF'
'use client';

type Props = {
  category: string;
  condition: string;
  sort: string;
  onCategoryChange: (value: string) => void;
  onConditionChange: (value: string) => void;
  onSortChange: (value: string) => void;
};

export default function ProductFilters({
  category,
  condition,
  sort,
  onCategoryChange,
  onConditionChange,
  onSortChange
}: Props) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <select
        value={category}
        onChange={(e) => onCategoryChange(e.target.value)}
        className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium outline-none focus:border-blue-500"
      >
        <option value="all">Toutes les catégories</option>
        <option value="smartphones">Smartphones</option>
        <option value="ordinateurs">Ordinateurs</option>
        <option value="tablettes">Tablettes</option>
        <option value="accessoires">Accessoires</option>
      </select>

      <select
        value={condition}
        onChange={(e) => onConditionChange(e.target.value)}
        className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium outline-none focus:border-blue-500"
      >
        <option value="all">Tous les états</option>
        <option value="reconditionné">Reconditionné</option>
        <option value="neuf">Neuf</option>
      </select>

      <select
        value={sort}
        onChange={(e) => onSortChange(e.target.value)}
        className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium outline-none focus:border-blue-500"
      >
        <option value="featured">Nos recommandations</option>
        <option value="price-low">Prix croissant</option>
        <option value="price-high">Prix décroissant</option>
        <option value="rating">Mieux notés</option>
      </select>
    </div>
  );
}
EOF

cat > components/ShopTrustBar.tsx <<'EOF'
export default function ShopTrustBar() {
  const items = [
    ['🚚', 'Livraison rapide', 'Expédition suivie'],
    ['🔒', 'Paiement sécurisé', 'Transactions protégées'],
    ['♻️', 'Reconditionné', 'Testé et contrôlé'],
    ['🛡️', 'Garantie', 'Produits sélectionnés']
  ];

  return (
    <div className="grid gap-px overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 sm:grid-cols-2 lg:grid-cols-4">
      {items.map(([icon, title, text]) => (
        <div key={title} className="bg-white p-5">
          <div className="text-2xl">{icon}</div>
          <div className="mt-2 font-bold text-slate-900">{title}</div>
          <div className="mt-1 text-xs text-slate-500">{text}</div>
        </div>
      ))}
    </div>
  );
}
EOF

cat > components/ProductGrid.tsx <<'EOF'
import ProductCard from './ProductCard';

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

export default function ProductGrid({products}: {products: Product[]}) {
  if (!products.length) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
        <div className="text-5xl">🔎</div>
        <h3 className="mt-4 text-xl font-bold text-slate-900">
          Aucun produit trouvé
        </h3>
        <p className="mt-2 text-sm text-slate-500">
          Essayez de modifier votre recherche ou vos filtres.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
EOF

cat > "app/[locale]/shop/page.tsx" <<'EOF'
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
EOF

cat > "app/[locale]/shop/[id]/page.tsx" <<'EOF'
'use client';

import Link from 'next/link';
import {useParams} from 'next/navigation';

const products: Record<string, any> = {
  'iphone-13': {
    name: 'Apple iPhone 13 128 Go',
    category: 'Smartphones',
    condition: 'Reconditionné',
    price: 399,
    oldPrice: 499,
    rating: 4.8,
    reviews: 124,
    stock: 8,
    image: '📱',
    description:
      'Un smartphone puissant et fiable, contrôlé et reconditionné par des professionnels.'
  },
  'iphone-14': {
    name: 'Apple iPhone 14 128 Go',
    category: 'Smartphones',
    condition: 'Reconditionné',
    price: 499,
    oldPrice: 599,
    rating: 4.9,
    reviews: 87,
    stock: 5,
    image: '📱',
    description:
      'Un iPhone performant avec une excellente autonomie et un appareil photo avancé.'
  },
  'macbook-air-m2': {
    name: 'MacBook Air M2 13 pouces',
    category: 'Ordinateurs',
    condition: 'Reconditionné',
    price: 899,
    oldPrice: 1099,
    rating: 4.9,
    reviews: 63,
    stock: 4,
    image: '💻',
    description:
      'Un ordinateur portable puissant, silencieux et idéal pour le travail quotidien.'
  },
  'ipad-10': {
    name: 'Apple iPad 10e génération',
    category: 'Tablettes',
    condition: 'Neuf',
    price: 429,
    rating: 4.7,
    reviews: 51,
    stock: 12,
    image: '📲',
    description:
      'Une tablette polyvalente pour le travail, les études et le divertissement.'
  },
  'airpods-pro': {
    name: 'AirPods Pro 2e génération',
    category: 'Accessoires',
    condition: 'Neuf',
    price: 229,
    oldPrice: 279,
    rating: 4.8,
    reviews: 208,
    stock: 20,
    image: '🎧',
    description:
      'Des écouteurs premium avec réduction active du bruit et excellente qualité audio.'
  },
  'thinkpad-t14': {
    name: 'Lenovo ThinkPad T14',
    category: 'Ordinateurs',
    condition: 'Reconditionné',
    price: 549,
    oldPrice: 749,
    rating: 4.6,
    reviews: 39,
    stock: 6,
    image: '💻',
    description:
      'Un ordinateur professionnel robuste, reconditionné et prêt à travailler.'
  }
};

export default function ProductPage() {
  const params = useParams();
  const id = typeof params.id === 'string' ? params.id : '';

  const product = products[id];

  if (!product) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-20 text-center">
        <div className="text-6xl">🔎</div>
        <h1 className="mt-5 text-3xl font-black">Produit introuvable</h1>
        <Link
          href="../shop"
          className="mt-6 inline-block rounded-xl bg-slate-900 px-6 py-3 font-bold text-white"
        >
          Retour à la boutique
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <Link
          href="../shop"
          className="text-sm font-semibold text-blue-600 hover:text-blue-700"
        >
          ← Retour à la boutique
        </Link>

        <div className="mt-8 grid overflow-hidden rounded-3xl border border-slate-200 bg-white lg:grid-cols-2">
          <div className="flex min-h-[450px] items-center justify-center bg-slate-100 text-[150px]">
            {product.image}
          </div>

          <div className="p-8 sm:p-12">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                {product.category}
              </span>

              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                {product.condition}
              </span>
            </div>

            <h1 className="mt-5 text-4xl font-black tracking-tight text-slate-950">
              {product.name}
            </h1>

            <div className="mt-4 flex items-center gap-3">
              <span className="font-bold text-amber-500">
                ★ {product.rating.toFixed(1)}
              </span>
              <span className="text-sm text-slate-500">
                {product.reviews} avis clients
              </span>
            </div>

            <p className="mt-6 leading-7 text-slate-600">
              {product.description}
            </p>

            <div className="mt-8 border-y border-slate-100 py-6">
              {product.oldPrice && (
                <div className="text-sm text-slate-400 line-through">
                  {product.oldPrice.toFixed(2)} €
                </div>
              )}

              <div className="text-4xl font-black text-slate-950">
                {product.price.toFixed(2)} €
              </div>

              <div className="mt-2 text-sm font-semibold text-emerald-600">
                ✓ {product.stock} exemplaires disponibles
              </div>
            </div>

            <button
              type="button"
              className="mt-8 w-full rounded-xl bg-blue-600 px-6 py-4 text-base font-bold text-white transition hover:bg-blue-700"
            >
              Ajouter au panier
            </button>

            <div className="mt-6 grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
              <div className="rounded-xl bg-slate-50 p-4">
                🚚 Livraison suivie
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                🔒 Paiement sécurisé
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                ♻️ Produit contrôlé
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                🛡️ Garantie incluse
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
EOF

echo ""
echo "======================================"
echo " SHOP V1 INSTALLEE"
echo "======================================"
echo ""
echo "Verification TypeScript..."
npx tsc --noEmit

echo ""
echo "✓ Boutique créée"
echo "✓ Recherche"
echo "✓ Filtres"
echo "✓ Tri"
echo "✓ Cartes produits"
echo "✓ Fiches produits"
echo "✓ Responsive"
echo ""
echo "Lance maintenant :"
echo "npm run build"
echo ""
