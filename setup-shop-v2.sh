#!/usr/bin/env bash

set -e

echo ""
echo "=============================================="
echo "      FOLIOGA - SHOP V2 INSTALLATION"
echo "=============================================="
echo ""

ROOT="$(pwd)"
BACKUP="backups/shop-v2-$(date +%Y%m%d-%H%M%S)"

echo "[1/8] Création de la sauvegarde..."

mkdir -p "$BACKUP"

if [ -d "app/[locale]/shop" ]; then
  cp -r "app/[locale]/shop" "$BACKUP/shop"
fi

if [ -d "app/[locale]/cart" ]; then
  cp -r "app/[locale]/cart" "$BACKUP/cart"
fi

if [ -d "components" ]; then
  cp -r components "$BACKUP/components"
fi

echo "Sauvegarde créée : $BACKUP"

echo "[2/8] Création des dossiers..."

mkdir -p "components/shop"
mkdir -p "lib"
mkdir -p "app/[locale]/shop"
mkdir -p "app/[locale]/shop/[id]"
mkdir -p "app/[locale]/cart"

echo "[3/8] Création des données produits..."

cat > lib/products.ts <<'EOF'
export type ProductCondition =
  | 'Reconditionné'
  | 'Excellent'
  | 'Très bon'
  | 'Bon';

export type Product = {
  id: string;
  name: string;
  slug: string;
  category: string;
  price: number;
  oldPrice?: number;
  image: string;
  images: string[];
  rating: number;
  reviews: number;
  condition: ProductCondition;
  stock: number;
  description: string;
  features: string[];
  brand: string;
};

export const products: Product[] = [
  {
    id: 'iphone-13-128',
    name: 'iPhone 13 128 Go',
    slug: 'iphone-13-128',
    category: 'Smartphones',
    price: 399,
    oldPrice: 499,
    image:
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=900&q=85',
    images: [
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1603891128711-11b4b03bb138?auto=format&fit=crop&w=1200&q=85'
    ],
    rating: 4.8,
    reviews: 124,
    condition: 'Excellent',
    stock: 8,
    description:
      'iPhone 13 reconditionné et contrôlé par nos techniciens. Une excellente solution pour profiter des performances Apple à prix réduit.',
    features: [
      'Écran Super Retina XDR',
      '128 Go de stockage',
      'Double appareil photo',
      'Batterie contrôlée',
      'Garantie Folioga'
    ],
    brand: 'Apple'
  },
  {
    id: 'macbook-air-m1',
    name: 'MacBook Air M1',
    slug: 'macbook-air-m1',
    category: 'Ordinateurs',
    price: 699,
    oldPrice: 899,
    image:
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=85',
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=1200&q=85'
    ],
    rating: 4.9,
    reviews: 89,
    condition: 'Très bon',
    stock: 5,
    description:
      'MacBook Air équipé de la puce Apple M1, idéal pour travailler, étudier et créer au quotidien.',
    features: [
      'Puce Apple M1',
      '8 Go RAM',
      '256 Go SSD',
      'Écran Retina',
      'Garantie Folioga'
    ],
    brand: 'Apple'
  },
  {
    id: 'galaxy-s22',
    name: 'Samsung Galaxy S22',
    slug: 'galaxy-s22',
    category: 'Smartphones',
    price: 329,
    oldPrice: 449,
    image:
      'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=900&q=85',
    images: [
      'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=1200&q=85'
    ],
    rating: 4.7,
    reviews: 76,
    condition: 'Très bon',
    stock: 12,
    description:
      'Smartphone Samsung compact, puissant et parfaitement adapté à un usage quotidien.',
    features: [
      'Écran AMOLED',
      '128 Go',
      'Appareil photo haute résolution',
      '5G',
      'Batterie contrôlée'
    ],
    brand: 'Samsung'
  },
  {
    id: 'ipad-10',
    name: 'iPad 10e génération',
    slug: 'ipad-10',
    category: 'Tablettes',
    price: 429,
    oldPrice: 529,
    image:
      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=900&q=85',
    images: [
      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=1200&q=85'
    ],
    rating: 4.8,
    reviews: 54,
    condition: 'Excellent',
    stock: 6,
    description:
      'iPad moderne et polyvalent pour le travail, les études, le divertissement et la création.',
    features: [
      'Écran Liquid Retina',
      '64 Go',
      'USB-C',
      'Wi-Fi',
      'Garantie Folioga'
    ],
    brand: 'Apple'
  },
  {
    id: 'thinkpad-t14',
    name: 'Lenovo ThinkPad T14',
    slug: 'thinkpad-t14',
    category: 'Ordinateurs',
    price: 549,
    oldPrice: 749,
    image:
      'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=900&q=85',
    images: [
      'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=1200&q=85'
    ],
    rating: 4.6,
    reviews: 41,
    condition: 'Bon',
    stock: 4,
    description:
      'Ordinateur professionnel robuste, idéal pour les entreprises, développeurs et professionnels mobiles.',
    features: [
      'Écran 14 pouces',
      'SSD',
      'Clavier professionnel',
      'Windows compatible',
      'Contrôle technique'
    ],
    brand: 'Lenovo'
  },
  {
    id: 'airpods-pro',
    name: 'AirPods Pro',
    slug: 'airpods-pro',
    category: 'Audio',
    price: 159,
    oldPrice: 249,
    image:
      'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=900&q=85',
    images: [
      'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=1200&q=85'
    ],
    rating: 4.7,
    reviews: 137,
    condition: 'Excellent',
    stock: 15,
    description:
      'Écouteurs sans fil avec réduction active du bruit et boîtier de charge.',
    features: [
      'Réduction de bruit',
      'Bluetooth',
      'Boîtier de charge',
      'Résistance à la transpiration',
      'Garantie Folioga'
    ],
    brand: 'Apple'
  }
];

export function getProduct(id: string) {
  return products.find(
    (product) => product.id === id || product.slug === id
  );
}
EOF

echo "[4/8] Création des composants..."

cat > components/shop/ProductCard.tsx <<'EOF'
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
EOF

cat > components/shop/ProductFilters.tsx <<'EOF'
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
    <div className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 md:grid-cols-3">
      <select
        value={category}
        onChange={(e) => onCategoryChange(e.target.value)}
        className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium outline-none focus:border-blue-500"
      >
        <option value="Tous">Toutes les catégories</option>
        <option value="Smartphones">Smartphones</option>
        <option value="Ordinateurs">Ordinateurs</option>
        <option value="Tablettes">Tablettes</option>
        <option value="Audio">Audio</option>
      </select>

      <select
        value={condition}
        onChange={(e) => onConditionChange(e.target.value)}
        className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium outline-none focus:border-blue-500"
      >
        <option value="Tous">Tous les états</option>
        <option value="Excellent">Excellent</option>
        <option value="Très bon">Très bon</option>
        <option value="Bon">Bon</option>
        <option value="Reconditionné">Reconditionné</option>
      </select>

      <select
        value={sort}
        onChange={(e) => onSortChange(e.target.value)}
        className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium outline-none focus:border-blue-500"
      >
        <option value="featured">Recommandés</option>
        <option value="price-asc">Prix croissant</option>
        <option value="price-desc">Prix décroissant</option>
        <option value="rating">Mieux notés</option>
      </select>
    </div>
  );
}
EOF

cat > components/shop/ShopClient.tsx <<'EOF'
'use client';

import { useMemo, useState } from 'react';
import { Product } from '@/lib/products';
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

  const filtered = useMemo(() => {
    const result = products.filter((product) => {
      const matchesQuery =
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase()) ||
        product.brand.toLowerCase().includes(query.toLowerCase());

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
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher un produit, une marque..."
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
        </div>
      )}
    </>
  );
}
EOF

echo "[5/8] Création de la page boutique..."

cat > "app/[locale]/shop/page.tsx" <<'EOF'
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
EOF

echo "[6/8] Création des fiches produits..."

cat > "app/[locale]/shop/[id]/page.tsx" <<'EOF'
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
EOF

echo "[7/8] Création du panier V2..."

cat > "app/[locale]/cart/page.tsx" <<'EOF'
'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { products } from '@/lib/products';

type CartItem = {
  id: string;
  quantity: number;
};

export default function CartPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const [locale, setLocale] = useState('fr');
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    params.then(({ locale }) => setLocale(locale));

    try {
      const saved = localStorage.getItem('folioga-cart');
      if (saved) setCart(JSON.parse(saved));
    } catch {
      setCart([]);
    }
  }, [params]);

  useEffect(() => {
    localStorage.setItem('folioga-cart', JSON.stringify(cart));
  }, [cart]);

  const items = useMemo(
    () =>
      cart
        .map((item) => {
          const product = products.find((p) => p.id === item.id);
          return product ? { ...product, quantity: item.quantity } : null;
        })
        .filter(Boolean),
    [cart]
  );

  const total = items.reduce(
    (sum, item) => sum + (item?.price ?? 0) * (item?.quantity ?? 0),
    0
  );

  function changeQuantity(id: string, quantity: number) {
    if (quantity <= 0) {
      setCart((current) => current.filter((item) => item.id !== id));
      return;
    }

    setCart((current) =>
      current.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  }

  function clearCart() {
    setCart([]);
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-blue-600">
              FOLIOGA
            </p>
            <h1 className="mt-2 text-4xl font-black text-slate-950">
              Votre panier
            </h1>
          </div>

          {items.length > 0 && (
            <button
              onClick={clearCart}
              className="text-sm font-semibold text-slate-500 hover:text-red-600"
            >
              Vider
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-slate-200 bg-white p-12 text-center">
            <div className="text-5xl">🛒</div>
            <h2 className="mt-5 text-2xl font-black text-slate-950">
              Votre panier est vide
            </h2>
            <p className="mt-2 text-slate-500">
              Découvrez nos produits reconditionnés.
            </p>

            <Link
              href={`/${locale}/shop`}
              className="mt-6 inline-block rounded-2xl bg-slate-950 px-6 py-3 font-bold text-white hover:bg-blue-600"
            >
              Découvrir la boutique
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
            <div className="space-y-4">
              {items.map(
                (item) =>
                  item && (
                    <div
                      key={item.id}
                      className="flex gap-5 rounded-2xl border border-slate-200 bg-white p-4"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-28 w-28 rounded-xl object-cover"
                      />

                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold uppercase text-blue-600">
                          {item.category}
                        </p>

                        <h2 className="mt-1 font-bold text-slate-950">
                          {item.name}
                        </h2>

                        <p className="mt-2 text-lg font-black">
                          {item.price} €
                        </p>

                        <div className="mt-3 flex items-center gap-3">
                          <button
                            onClick={() =>
                              changeQuantity(
                                item.id,
                                item.quantity - 1
                              )
                            }
                            className="h-9 w-9 rounded-lg border"
                          >
                            −
                          </button>

                          <span className="font-bold">
                            {item.quantity}
                          </span>

                          <button
                            onClick={() =>
                              changeQuantity(
                                item.id,
                                item.quantity + 1
                              )
                            }
                            className="h-9 w-9 rounded-lg border"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  )
              )}
            </div>

            <aside className="h-fit rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-black text-slate-950">
                Récapitulatif
              </h2>

              <div className="mt-6 flex justify-between text-sm text-slate-500">
                <span>Sous-total</span>
                <span>{total.toFixed(2)} €</span>
              </div>

              <div className="mt-3 flex justify-between text-sm text-slate-500">
                <span>Livraison</span>
                <span>Calculée au paiement</span>
              </div>

              <div className="my-6 border-t border-slate-200" />

              <div className="flex justify-between">
                <span className="font-bold">Total</span>
                <span className="text-2xl font-black">
                  {total.toFixed(2)} €
                </span>
              </div>

              <button
                className="mt-6 w-full rounded-2xl bg-slate-950 px-6 py-4 font-bold text-white transition hover:bg-blue-600"
                onClick={() =>
                  alert(
                    'Le paiement sera connecté à Stripe dans la prochaine étape.'
                  )
                }
              >
                Passer au paiement
              </button>

              <p className="mt-4 text-center text-xs text-slate-400">
                Paiement sécurisé • Garantie Folioga
              </p>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}
EOF

echo "[8/8] Vérification TypeScript et build..."

echo ""
echo "=============================================="
echo "          TYPESCRIPT CHECK"
echo "=============================================="

npx tsc --noEmit

echo ""
echo "=============================================="
echo "             NEXT BUILD"
echo "=============================================="

npm run build

echo ""
echo "=============================================="
echo "       SHOP V2 INSTALLEE AVEC SUCCES"
echo "=============================================="
echo ""
echo "Boutique : http://localhost:3000/fr/shop"
echo "Panier   : http://localhost:3000/fr/cart"
echo ""
echo "Sauvegarde : $BACKUP"
echo ""
echo "Lance maintenant :"
echo "  npm run dev"
echo ""
