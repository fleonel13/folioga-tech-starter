#!/usr/bin/env bash

set -e

echo "🚀 Construction de la marketplace Folioga-tech..."

mkdir -p components/shop
mkdir -p components/technicians
mkdir -p components/repairs
mkdir -p components/dashboard

# ============================================================
# SHOP
# ============================================================

cat > components/shop/ProductCard.tsx <<'TSX'
import Link from 'next/link';

type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  oldPrice?: number;
  condition: string;
  rating: number;
  reviews: number;
  stock: number;
  emoji: string;
};

export default function ProductCard({product}: {product: Product}) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative flex h-64 items-center justify-center bg-slate-100">
        {product.oldPrice && (
          <span className="absolute left-4 top-4 rounded-full bg-emerald-500 px-3 py-1 text-xs font-bold text-white">
            PROMO
          </span>
        )}

        <button
          aria-label="Ajouter aux favoris"
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white text-xl shadow-sm hover:bg-slate-50"
        >
          ♡
        </button>

        <div className="text-8xl transition duration-300 group-hover:scale-110">
          {product.emoji}
        </div>
      </div>

      <div className="p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
          {product.category}
        </p>

        <Link href={`/fr/shop/${product.id}`}>
          <h3 className="mt-2 text-lg font-bold text-slate-950 hover:text-emerald-600">
            {product.name}
          </h3>
        </Link>

        <div className="mt-2 flex items-center gap-2 text-sm">
          <span className="text-yellow-500">★★★★★</span>
          <span className="text-slate-500">
            {product.rating} ({product.reviews})
          </span>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <span className="text-2xl font-bold text-slate-950">
            {product.price.toFixed(2)} €
          </span>

          {product.oldPrice && (
            <span className="text-sm text-slate-400 line-through">
              {product.oldPrice.toFixed(2)} €
            </span>
          )}
        </div>

        <div className="mt-2 text-sm">
          <span className="font-medium text-emerald-600">
            ● En stock
          </span>
          <span className="ml-2 text-slate-400">
            {product.stock} disponibles
          </span>
        </div>

        <button className="mt-5 w-full rounded-xl bg-slate-950 px-4 py-3 font-semibold text-white hover:bg-emerald-600">
          Ajouter au panier
        </button>
      </div>
    </article>
  );
}
TSX

cat > components/shop/ShopFilters.tsx <<'TSX'
const categories = [
  'Tous les produits',
  'Smartphones',
  'Ordinateurs',
  'Tablettes',
  'Consoles',
  'Accessoires',
];

export default function ShopFilters() {
  return (
    <aside className="rounded-2xl border border-slate-200 bg-white p-6">
      <h2 className="text-lg font-bold text-slate-950">
        Filtrer
      </h2>

      <div className="mt-6">
        <label className="text-sm font-semibold text-slate-700">
          Catégorie
        </label>

        <div className="mt-3 space-y-2">
          {categories.map((category, index) => (
            <label
              key={category}
              className="flex cursor-pointer items-center gap-3 rounded-lg p-2 hover:bg-slate-50"
            >
              <input
                type="radio"
                name="category"
                defaultChecked={index === 0}
                className="accent-emerald-500"
              />
              <span className="text-sm text-slate-600">
                {category}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="mt-8 border-t border-slate-100 pt-6">
        <label className="text-sm font-semibold text-slate-700">
          État
        </label>

        <div className="mt-3 space-y-3 text-sm text-slate-600">
          <label className="flex gap-3">
            <input type="checkbox" />
            Comme neuf
          </label>

          <label className="flex gap-3">
            <input type="checkbox" />
            Très bon état
          </label>

          <label className="flex gap-3">
            <input type="checkbox" />
            Bon état
          </label>
        </div>
      </div>

      <div className="mt-8 border-t border-slate-100 pt-6">
        <label className="text-sm font-semibold text-slate-700">
          Prix maximum
        </label>

        <input
          type="range"
          min="0"
          max="3000"
          defaultValue="1500"
          className="mt-4 w-full accent-emerald-500"
        />

        <div className="mt-2 flex justify-between text-xs text-slate-500">
          <span>0 €</span>
          <span>3 000 €</span>
        </div>
      </div>
    </aside>
  );
}
TSX

cat > app/[locale]/shop/page.tsx <<'TSX'
import ProductCard from '@/components/shop/ProductCard';
import ShopFilters from '@/components/shop/ShopFilters';

const products = [
  {
    id: 1,
    name: 'iPhone 13 128 Go',
    category: 'Smartphones',
    price: 399,
    oldPrice: 499,
    condition: 'Très bon état',
    rating: 4.8,
    reviews: 124,
    stock: 8,
    emoji: '📱',
  },
  {
    id: 2,
    name: 'MacBook Air M2',
    category: 'Ordinateurs',
    price: 799,
    oldPrice: 999,
    condition: 'Comme neuf',
    rating: 4.9,
    reviews: 87,
    stock: 4,
    emoji: '💻',
  },
  {
    id: 3,
    name: 'iPad Air',
    category: 'Tablettes',
    price: 449,
    condition: 'Très bon état',
    rating: 4.7,
    reviews: 63,
    stock: 6,
    emoji: '📱',
  },
  {
    id: 4,
    name: 'PlayStation 5',
    category: 'Consoles',
    price: 429,
    oldPrice: 499,
    condition: 'Très bon état',
    rating: 4.9,
    reviews: 211,
    stock: 3,
    emoji: '🎮',
  },
  {
    id: 5,
    name: 'AirPods Pro',
    category: 'Accessoires',
    price: 169,
    condition: 'Comme neuf',
    rating: 4.8,
    reviews: 156,
    stock: 12,
    emoji: '🎧',
  },
  {
    id: 6,
    name: 'Dell XPS 13',
    category: 'Ordinateurs',
    price: 599,
    condition: 'Bon état',
    rating: 4.6,
    reviews: 42,
    stock: 5,
    emoji: '💻',
  },
];

export default function ShopPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <section className="bg-slate-950 text-white">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <p className="font-semibold text-emerald-400">
            FOLIOGA MARKET
          </p>

          <h1 className="mt-3 text-4xl font-bold sm:text-5xl">
            Technologie reconditionnée.
          </h1>

          <p className="mt-4 max-w-2xl text-slate-300">
            Des appareils contrôlés, testés et prêts pour une nouvelle vie.
          </p>

          <div className="mt-8 max-w-2xl">
            <div className="flex overflow-hidden rounded-xl bg-white">
              <input
                type="search"
                placeholder="Rechercher un produit..."
                className="min-w-0 flex-1 px-5 py-4 text-slate-950 outline-none"
              />
              <button className="bg-emerald-500 px-6 font-bold text-slate-950">
                Rechercher
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
          <ShopFilters />

          <section>
            <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-2xl font-bold text-slate-950">
                  Nos produits
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {products.length} produits disponibles
                </p>
              </div>

              <select className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm">
                <option>Plus populaires</option>
                <option>Prix croissant</option>
                <option>Prix décroissant</option>
                <option>Mieux notés</option>
              </select>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
TSX

# ============================================================
# TECHNICIENS
# ============================================================

cat > components/technicians/TechnicianCard.tsx <<'TSX'
import Link from 'next/link';

type Technician = {
  id: number;
  name: string;
  city: string;
  speciality: string;
  rating: number;
  reviews: number;
  price: number;
  experience: number;
  emoji: string;
  verified: boolean;
};

export default function TechnicianCard({
  technician,
}: {
  technician: Technician;
}) {
  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <div className="bg-slate-950 px-6 py-8 text-center">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-white text-5xl">
          {technician.emoji}
        </div>

        {technician.verified && (
          <div className="mt-4 inline-flex rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-400">
            ✓ Technicien vérifié
          </div>
        )}
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-slate-950">
          {technician.name}
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          📍 {technician.city}
        </p>

        <p className="mt-4 font-semibold text-emerald-600">
          {technician.speciality}
        </p>

        <div className="mt-4 flex items-center gap-2 text-sm">
          <span className="text-yellow-500">★★★★★</span>
          <strong>{technician.rating}</strong>
          <span className="text-slate-400">
            ({technician.reviews} avis)
          </span>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 border-y border-slate-100 py-4 text-sm">
          <div>
            <p className="text-slate-400">Expérience</p>
            <p className="mt-1 font-bold">{technician.experience} ans</p>
          </div>

          <div>
            <p className="text-slate-400">À partir de</p>
            <p className="mt-1 font-bold">{technician.price} €</p>
          </div>
        </div>

        <Link
          href={`/fr/technicians/${technician.id}`}
          className="mt-5 block rounded-xl bg-slate-950 px-4 py-3 text-center font-semibold text-white hover:bg-emerald-600"
        >
          Voir le profil
        </Link>
      </div>
    </article>
  );
}
TSX

cat > app/[locale]/technicians/page.tsx <<'TSX'
import TechnicianCard from '@/components/technicians/TechnicianCard';

const technicians = [
  {
    id: 1,
    name: 'Alex Martin',
    city: 'Strasbourg',
    speciality: 'Smartphones & tablettes',
    rating: 4.9,
    reviews: 184,
    price: 35,
    experience: 8,
    emoji: '👨‍🔧',
    verified: true,
  },
  {
    id: 2,
    name: 'Sarah Bernard',
    city: 'Paris',
    speciality: 'Mac & ordinateurs',
    rating: 4.8,
    reviews: 127,
    price: 45,
    experience: 10,
    emoji: '👩‍🔧',
    verified: true,
  },
  {
    id: 3,
    name: 'Thomas Leroy',
    city: 'Lyon',
    speciality: 'Consoles & gaming',
    rating: 4.9,
    reviews: 96,
    price: 40,
    experience: 7,
    emoji: '👨‍💻',
    verified: true,
  },
  {
    id: 4,
    name: 'Emma Petit',
    city: 'Bordeaux',
    speciality: 'Électronique',
    rating: 4.7,
    reviews: 72,
    price: 30,
    experience: 6,
    emoji: '👩‍💻',
    verified: true,
  },
];

export default function TechniciansPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <section className="bg-slate-950 text-white">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <p className="font-semibold text-emerald-400">
            RÉSEAU FOLIOGA
          </p>

          <h1 className="mt-3 text-4xl font-bold sm:text-5xl">
            Trouvez votre technicien.
          </h1>

          <p className="mt-4 max-w-2xl text-slate-300">
            Des professionnels vérifiés pour réparer vos appareils,
            localement ou à distance.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <input
              placeholder="Ville"
              className="rounded-xl px-4 py-3 text-slate-950 outline-none"
            />

            <select className="rounded-xl px-4 py-3 text-slate-950">
              <option>Toutes les spécialités</option>
              <option>Smartphones</option>
              <option>Ordinateurs</option>
              <option>Consoles</option>
              <option>Électronique</option>
            </select>

            <button className="rounded-xl bg-emerald-500 px-5 py-3 font-bold text-slate-950 hover:bg-emerald-400">
              Rechercher
            </button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-950">
              Techniciens recommandés
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Professionnels vérifiés par Folioga-tech
            </p>
          </div>

          <select className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm">
            <option>Meilleures notes</option>
            <option>Plus proches</option>
            <option>Prix</option>
          </select>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {technicians.map((technician) => (
            <TechnicianCard
              key={technician.id}
              technician={technician}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
TSX

# ============================================================
# REPAIRS
# ============================================================

cat > app/[locale]/repairs/page.tsx <<'TSX'
export default function RepairsPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <section className="bg-slate-950 text-white">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <p className="font-semibold text-emerald-400">
            SERVICE DE RÉPARATION
          </p>

          <h1 className="mt-3 text-4xl font-bold sm:text-5xl">
            Quel est le problème ?
          </h1>

          <p className="mt-4 max-w-2xl text-slate-300">
            Décrivez votre appareil et nous vous aiderons à trouver le bon
            technicien.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-12 lg:px-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="grid gap-6">
            <div>
              <label className="text-sm font-semibold">
                Type d'appareil
              </label>
              <select className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3">
                <option>Smartphone</option>
                <option>Ordinateur</option>
                <option>Tablette</option>
                <option>Console</option>
                <option>TV</option>
                <option>Autre</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-semibold">
                Marque
              </label>
              <input
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3"
                placeholder="Apple, Samsung, Dell..."
              />
            </div>

            <div>
              <label className="text-sm font-semibold">
                Décrivez le problème
              </label>
              <textarea
                rows={5}
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3"
                placeholder="Exemple : l'écran ne s'allume plus..."
              />
            </div>

            <div>
              <label className="text-sm font-semibold">
                Ville
              </label>
              <input
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3"
                placeholder="Votre ville"
              />
            </div>

            <button className="rounded-xl bg-emerald-500 px-6 py-4 font-bold text-slate-950 hover:bg-emerald-400">
              Trouver des techniciens
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
TSX

# ============================================================
# DASHBOARD
# ============================================================

cat > app/[locale]/dashboard/page.tsx <<'TSX'
const stats = [
  ['2', 'Réparations en cours'],
  ['1', 'Commande en préparation'],
  ['4', 'Réparations terminées'],
];

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div>
          <p className="font-semibold text-emerald-600">
            MON ESPACE
          </p>

          <h1 className="mt-2 text-4xl font-bold text-slate-950">
            Bonjour 👋
          </h1>

          <p className="mt-2 text-slate-500">
            Retrouvez toutes vos activités Folioga-tech.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {stats.map(([value, label]) => (
            <div
              key={label}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="text-3xl font-bold text-slate-950">
                {value}
              </div>

              <p className="mt-2 text-sm text-slate-500">
                {label}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-3">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 lg:col-span-2">
            <h2 className="text-xl font-bold text-slate-950">
              Mes réparations
            </h2>

            <div className="mt-6 divide-y divide-slate-100">
              <div className="flex items-center justify-between py-5">
                <div>
                  <p className="font-semibold">iPhone 13</p>
                  <p className="text-sm text-slate-500">
                    Remplacement écran
                  </p>
                </div>

                <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-bold text-yellow-700">
                  En cours
                </span>
              </div>

              <div className="flex items-center justify-between py-5">
                <div>
                  <p className="font-semibold">MacBook Air</p>
                  <p className="text-sm text-slate-500">
                    Diagnostic
                  </p>
                </div>

                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
                  Diagnostic
                </span>
              </div>
            </div>
          </section>

          <aside className="rounded-2xl bg-slate-950 p-6 text-white">
            <h2 className="text-xl font-bold">
              Besoin d'aide ?
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-300">
              Notre équipe peut vous aider à trouver un technicien ou
              résoudre un problème avec votre commande.
            </p>

            <button className="mt-6 w-full rounded-xl bg-emerald-500 px-4 py-3 font-bold text-slate-950">
              Contacter le support
            </button>
          </aside>
        </div>
      </div>
    </main>
  );
}
TSX

# ============================================================
# BUILD
# ============================================================

echo ""
echo "🧹 Nettoyage du cache Next.js..."
rm -rf .next

echo ""
echo "🔍 Vérification TypeScript + Next.js..."
npm run build

echo ""
echo "================================================"
echo "✅ MARKETPLACE FOLIOGA-TECH INSTALLÉE"
echo "================================================"
echo ""
echo "Pages disponibles :"
echo "  /fr"
echo "  /fr/shop"
echo "  /fr/technicians"
echo "  /fr/repairs"
echo "  /fr/dashboard"
echo ""
echo "Lance maintenant : npm run dev"
echo ""
