#!/usr/bin/env bash
set -e

echo "======================================"
echo " FOLIOGA-TECH SHOP V2"
echo " Installation professionnelle"
echo "======================================"

ROOT="$(pwd)"
BACKUP="backups/shop-v2-$(date +%Y%m%d-%H%M%S)"

echo ""
echo "1. Sauvegarde..."
mkdir -p "$BACKUP"

[ -d "app/[locale]/shop" ] && cp -r "app/[locale]/shop" "$BACKUP/shop" || true
[ -d "components" ] && cp -r "components" "$BACKUP/components" || true
[ -d "lib" ] && cp -r "lib" "$BACKUP/lib" || true
[ -f "app/globals.css" ] && cp "app/globals.css" "$BACKUP/globals.css" || true

echo "Sauvegarde : $BACKUP"

echo ""
echo "2. Création des dossiers..."

mkdir -p "app/[locale]/shop/[id]"
mkdir -p "app/[locale]/cart"
mkdir -p "components/shop"
mkdir -p "lib"

echo ""
echo "3. Création des données produits..."

cat > lib/products.ts <<'EOF'
export type Product = {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  oldPrice?: number;
  image: string;
  rating: number;
  reviews: number;
  condition: "Neuf" | "Excellent" | "Très bon" | "Bon";
  stock: number;
  badge?: string;
};

export const products: Product[] = [
  {
    id: "iphone-13",
    name: "iPhone 13 128 Go",
    category: "Smartphones",
    description:
      "iPhone reconditionné, testé et contrôlé par nos techniciens.",
    price: 429,
    oldPrice: 499,
    image:
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=900&q=80",
    rating: 4.8,
    reviews: 126,
    condition: "Excellent",
    stock: 8,
    badge: "Best-seller",
  },
  {
    id: "macbook-air-m2",
    name: "MacBook Air M2",
    category: "Ordinateurs",
    description:
      "MacBook Air M2 reconditionné, idéal pour le travail et les études.",
    price: 899,
    oldPrice: 1099,
    image:
      "https://images.unsplash.com/photo-1517336714739-489689fd1ca8?auto=format&fit=crop&w=900&q=80",
    rating: 4.9,
    reviews: 94,
    condition: "Excellent",
    stock: 4,
    badge: "Premium",
  },
  {
    id: "ipad-air",
    name: "iPad Air",
    category: "Tablettes",
    description:
      "Tablette polyvalente avec écran haute qualité et excellente autonomie.",
    price: 399,
    oldPrice: 469,
    image:
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=900&q=80",
    rating: 4.7,
    reviews: 82,
    condition: "Très bon",
    stock: 7,
  },
  {
    id: "galaxy-s23",
    name: "Samsung Galaxy S23",
    category: "Smartphones",
    description:
      "Smartphone Android haut de gamme entièrement contrôlé.",
    price: 489,
    oldPrice: 599,
    image:
      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=900&q=80",
    rating: 4.8,
    reviews: 73,
    condition: "Excellent",
    stock: 5,
    badge: "Top vente",
  },
  {
    id: "thinkpad-t14",
    name: "Lenovo ThinkPad T14",
    category: "Ordinateurs",
    description:
      "Ordinateur professionnel robuste et performant.",
    price: 579,
    oldPrice: 699,
    image:
      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=900&q=80",
    rating: 4.6,
    reviews: 51,
    condition: "Très bon",
    stock: 6,
  },
  {
    id: "airpods-pro",
    name: "AirPods Pro",
    category: "Audio",
    description:
      "Écouteurs sans fil avec réduction active du bruit.",
    price: 179,
    oldPrice: 249,
    image:
      "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?auto=format&fit=crop&w=900&q=80",
    rating: 4.7,
    reviews: 118,
    condition: "Excellent",
    stock: 12,
    badge: "Populaire",
  },
];

export const categories = [
  "Tous",
  "Smartphones",
  "Ordinateurs",
  "Tablettes",
  "Audio",
];
EOF

echo "✓ Produits créés"

echo ""
echo "4. Création du panier..."

cat > lib/cart.ts <<'EOF'
"use client";

import { Product } from "./products";

export type CartItem = Product & {
  quantity: number;
};

const KEY = "folioga-cart";

export function getCart(): CartItem[] {
  if (typeof window === "undefined") return [];

  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveCart(items: CartItem[]) {
  localStorage.setItem(KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("cart-updated"));
}

export function addToCart(product: Product) {
  const cart = getCart();
  const existing = cart.find((item) => item.id === product.id);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      ...product,
      quantity: 1,
    });
  }

  saveCart(cart);
}

export function removeFromCart(id: string) {
  saveCart(getCart().filter((item) => item.id !== id));
}

export function updateQuantity(id: string, quantity: number) {
  const cart = getCart();

  const item = cart.find((product) => product.id === id);

  if (!item) return;

  item.quantity = Math.max(1, quantity);

  saveCart(cart);
}

export function cartCount() {
  return getCart().reduce((total, item) => total + item.quantity, 0);
}

export function cartTotal() {
  return getCart().reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
}
EOF

echo "✓ Panier créé"

echo ""
echo "5. ProductCard..."

cat > components/shop/ProductCard.tsx <<'EOF'
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
EOF

echo "✓ ProductCard créée"

echo ""
echo "6. ProductFilters..."

cat > components/shop/ProductFilters.tsx <<'EOF'
"use client";

export default function ProductFilters({
  category,
  condition,
  sort,
  onCategoryChange,
  onConditionChange,
  onSortChange,
  categories,
}: {
  category: string;
  condition: string;
  sort: string;
  onCategoryChange: (value: string) => void;
  onConditionChange: (value: string) => void;
  onSortChange: (value: string) => void;
  categories: string[];
}) {
  return (
    <div className="grid gap-3 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-3">
      <select
        value={category}
        onChange={(e) => onCategoryChange(e.target.value)}
        className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none focus:border-blue-500"
      >
        {categories.map((item) => (
          <option key={item}>{item}</option>
        ))}
      </select>

      <select
        value={condition}
        onChange={(e) => onConditionChange(e.target.value)}
        className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none focus:border-blue-500"
      >
        <option value="Tous">Tous les états</option>
        <option value="Excellent">Excellent</option>
        <option value="Très bon">Très bon</option>
        <option value="Bon">Bon</option>
        <option value="Neuf">Neuf</option>
      </select>

      <select
        value={sort}
        onChange={(e) => onSortChange(e.target.value)}
        className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none focus:border-blue-500"
      >
        <option value="featured">Recommandés</option>
        <option value="price-asc">Prix croissant</option>
        <option value="price-desc">Prix décroissant</option>
        <option value="rating">Meilleures notes</option>
      </select>
    </div>
  );
}
EOF

echo "✓ Filtres créés"

echo ""
echo "7. Shop page..."

cat > "app/[locale]/shop/page.tsx" <<'EOF'
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import ProductCard from "@/components/shop/ProductCard";
import ProductFilters from "@/components/shop/ProductFilters";
import { categories, products } from "@/lib/products";

export default function ShopPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const [locale, setLocale] = useState("fr");
  const [category, setCategory] = useState("Tous");
  const [condition, setCondition] = useState("Tous");
  const [sort, setSort] = useState("featured");
  const [search, setSearch] = useState("");

  useMemo(() => {
    params.then((value) => setLocale(value.locale));
  }, [params]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (category !== "Tous") {
      result = result.filter((p) => p.category === category);
    }

    if (condition !== "Tous") {
      result = result.filter((p) => p.condition === condition);
    }

    if (search.trim()) {
      const query = search.toLowerCase();

      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query)
      );
    }

    if (sort === "price-asc") {
      result.sort((a, b) => a.price - b.price);
    }

    if (sort === "price-desc") {
      result.sort((a, b) => b.price - a.price);
    }

    if (sort === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [category, condition, sort, search]);

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="border-b border-slate-200 bg-slate-950 text-white">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm">
              ♻️ Technologie reconditionnée
            </div>

            <h1 className="text-4xl font-black tracking-tight md:text-6xl">
              La technologie,
              <br />
              <span className="text-blue-400">en mieux.</span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              Découvrez des appareils contrôlés par des professionnels,
              proposés à des prix plus responsables.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={`/${locale}/repairs`}
                className="rounded-xl bg-white px-5 py-3 font-bold text-slate-950 hover:bg-slate-100"
              >
                Faire réparer
              </Link>

              <Link
                href={`/${locale}/technicians`}
                className="rounded-xl border border-white/20 px-5 py-3 font-bold text-white hover:bg-white/10"
              >
                Trouver un technicien
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-blue-600">
              Folioga Shop
            </p>
            <h2 className="mt-1 text-3xl font-black text-slate-950">
              Nos produits
            </h2>
          </div>

          <Link
            href={`/${locale}/cart`}
            className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold shadow-sm hover:border-blue-300"
          >
            🛒 Voir mon panier
          </Link>
        </div>

        <div className="mb-6">
          <div className="relative">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un smartphone, ordinateur..."
              className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 pl-12 shadow-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />

            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">
              🔎
            </span>
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
            <strong className="text-slate-900">
              {filteredProducts.length}
            </strong>{" "}
            produit{filteredProducts.length > 1 ? "s" : ""}
          </p>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                locale={locale}
              />
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-3xl border border-dashed border-slate-300 bg-white p-16 text-center">
            <div className="text-5xl">🔎</div>
            <h3 className="mt-4 text-xl font-bold">
              Aucun produit trouvé
            </h3>
            <p className="mt-2 text-slate-500">
              Essayez une autre recherche ou modifiez les filtres.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
EOF

echo "✓ Boutique V2 créée"

echo ""
echo "8. Page produit..."

cat > "app/[locale]/shop/[id]/page.tsx" <<'EOF'
"use client";

import Link from "next/link";
import { use, useState } from "react";
import { products } from "@/lib/products";
import { addToCart } from "@/lib/cart";

export default function ProductPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = use(params);
  const product = products.find((item) => item.id === id);
  const [added, setAdded] = useState(false);

  if (!product) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-20 text-center">
        <h1 className="text-3xl font-black">Produit introuvable</h1>
        <Link
          href={`/${locale}/shop`}
          className="mt-6 inline-block rounded-xl bg-slate-900 px-5 py-3 font-bold text-white"
        >
          Retour à la boutique
        </Link>
      </main>
    );
  }

  function handleCart() {
    addToCart(product);
    setAdded(true);
  }

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
                {product.reviews} avis vérifiés
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
                onClick={handleCart}
                className="rounded-2xl bg-slate-950 px-6 py-4 font-bold text-white transition hover:bg-blue-600"
              >
                {added ? "✓ Produit ajouté" : "Ajouter au panier"}
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
EOF

echo "✓ Page produit créée"

echo ""
echo "9. Panier..."

cat > "app/[locale]/cart/page.tsx" <<'EOF'
"use client";

import Link from "next/link";
import { use, useEffect, useState } from "react";
import {
  CartItem,
  getCart,
  removeFromCart,
  updateQuantity,
  cartTotal,
} from "@/lib/cart";

export default function CartPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);

  const [items, setItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);

  function refresh() {
    const cart = getCart();
    setItems(cart);
    setTotal(cartTotal());
  }

  useEffect(() => {
    refresh();

    const handler = () => refresh();

    window.addEventListener("cart-updated", handler);

    return () => {
      window.removeEventListener("cart-updated", handler);
    };
  }, []);

  function remove(id: string) {
    removeFromCart(id);
    refresh();
  }

  function changeQuantity(id: string, quantity: number) {
    updateQuantity(id, quantity);
    refresh();
  }

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-20">
        <div className="mx-auto max-w-xl rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm">
          <div className="text-6xl">🛒</div>

          <h1 className="mt-5 text-3xl font-black">
            Votre panier est vide
          </h1>

          <p className="mt-3 text-slate-500">
            Découvrez nos produits reconditionnés.
          </p>

          <Link
            href={`/${locale}/shop`}
            className="mt-7 inline-block rounded-xl bg-slate-950 px-6 py-4 font-bold text-white hover:bg-blue-600"
          >
            Découvrir la boutique
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <div>
          <p className="text-sm font-bold uppercase tracking-widest text-blue-600">
            Folioga Shop
          </p>

          <h1 className="mt-2 text-4xl font-black">
            Votre panier
          </h1>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex gap-5 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-28 w-28 rounded-2xl object-cover"
                />

                <div className="min-w-0 flex-1">
                  <div className="flex justify-between gap-3">
                    <div>
                      <h2 className="font-bold text-slate-950">
                        {item.name}
                      </h2>

                      <p className="mt-1 text-sm text-slate-500">
                        {item.condition}
                      </p>
                    </div>

                    <button
                      onClick={() => remove(item.id)}
                      className="text-sm font-semibold text-red-500 hover:text-red-700"
                    >
                      Supprimer
                    </button>
                  </div>

                  <div className="mt-5 flex items-center justify-between">
                    <div className="flex items-center rounded-xl border border-slate-200">
                      <button
                        onClick={() =>
                          changeQuantity(item.id, item.quantity - 1)
                        }
                        className="px-4 py-2"
                      >
                        −
                      </button>

                      <span className="px-3 font-bold">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() =>
                          changeQuantity(item.id, item.quantity + 1)
                        }
                        className="px-4 py-2"
                      >
                        +
                      </button>
                    </div>

                    <strong className="text-xl">
                      {(item.price * item.quantity).toFixed(2)} €
                    </strong>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <aside className="h-fit rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-black">Résumé</h2>

            <div className="mt-6 flex justify-between text-slate-500">
              <span>Sous-total</span>
              <span>{total.toFixed(2)} €</span>
            </div>

            <div className="mt-3 flex justify-between text-slate-500">
              <span>Livraison</span>
              <span>Calculée au paiement</span>
            </div>

            <div className="my-6 border-t border-slate-200" />

            <div className="flex justify-between">
              <span className="font-bold">Total</span>
              <strong className="text-2xl">{total.toFixed(2)} €</strong>
            </div>

            <button
              className="mt-6 w-full rounded-2xl bg-slate-950 px-5 py-4 font-bold text-white hover:bg-blue-600"
              onClick={() => alert("Paiement Stripe à connecter.")}
            >
              Passer au paiement
            </button>

            <Link
              href={`/${locale}/shop`}
              className="mt-3 block text-center text-sm font-semibold text-slate-500 hover:text-blue-600"
            >
              Continuer mes achats
            </Link>
          </aside>
        </div>
      </div>
    </main>
  );
}
EOF

echo "✓ Panier V2 créé"

echo ""
echo "10. Vérification..."

npx tsc --noEmit

echo ""
echo "======================================"
echo " SHOP V2 INSTALLEE AVEC SUCCES"
echo "======================================"
echo ""
echo "Sauvegarde : $BACKUP"
echo ""
echo "Pages :"
echo "  /fr/shop"
echo "  /fr/shop/iphone-13"
echo "  /fr/cart"
echo ""
echo "Commande suivante :"
echo "  npm run build"
echo ""
