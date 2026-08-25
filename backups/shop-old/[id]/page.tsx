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
