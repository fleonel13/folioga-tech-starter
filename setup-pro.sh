#!/usr/bin/env bash

set -e

echo "=========================================="
echo " FOLIOGA-TECH - PROFESSIONAL UI SETUP"
echo "=========================================="

echo ""
echo "Création des dossiers..."

mkdir -p components
mkdir -p "app/[locale]/repairs"
mkdir -p "app/[locale]/technicians/[id]"
mkdir -p "app/[locale]/shop/[id]"
mkdir -p "app/[locale]/cart"
mkdir -p "app/[locale]/dashboard"

echo "Création de globals.css..."

cat > app/globals.css <<'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --primary: #2563eb;
  --primary-dark: #1d4ed8;
  --dark: #0f172a;
  --muted: #64748b;
  --border: #e2e8f0;
  --background: #f8fafc;
}

* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  background: var(--background);
  color: var(--dark);
  font-family: Arial, Helvetica, sans-serif;
}

a {
  text-decoration: none;
  color: inherit;
}

button,
input,
select {
  font: inherit;
}

.container {
  width: min(1180px, calc(100% - 32px));
  margin: 0 auto;
}

.card {
  background: white;
  border: 1px solid var(--border);
  border-radius: 18px;
  box-shadow: 0 8px 30px rgba(15, 23, 42, 0.06);
}

.section {
  padding: 72px 0;
}

.badge {
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  padding: 5px 10px;
  font-size: 12px;
  font-weight: 700;
}

.badge-green {
  background: #dcfce7;
  color: #166534;
}

.badge-blue {
  background: #dbeafe;
  color: #1d4ed8;
}

.badge-gray {
  background: #f1f5f9;
  color: #475569;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: 0;
  border-radius: 12px;
  padding: 12px 18px;
  font-weight: 700;
  cursor: pointer;
  transition: 0.2s ease;
}

.btn:hover {
  transform: translateY(-1px);
}

.btn-primary {
  background: var(--primary);
  color: white;
}

.btn-primary:hover {
  background: var(--primary-dark);
}

.btn-secondary {
  background: white;
  color: var(--dark);
  border: 1px solid var(--border);
}

.btn-dark {
  background: var(--dark);
  color: white;
}

.input {
  width: 100%;
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 13px 14px;
  outline: none;
  background: white;
}

.input:focus {
  border-color: #93c5fd;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

@media (max-width: 700px) {
  .section {
    padding: 48px 0;
  }

  .container {
    width: min(100% - 24px, 1180px);
  }
}
EOF

echo "Création de Navbar.tsx..."

cat > components/Navbar.tsx <<'EOF'
import Link from "next/link";

export default function Navbar({ locale }: { locale: string }) {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="container">
        <div className="flex h-16 items-center justify-between gap-6">

          <Link href={`/${locale}`} className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 font-bold text-white">
              F
            </div>

            <div>
              <div className="text-lg font-black text-slate-900">
                Folioga-tech
              </div>
              <div className="hidden text-[10px] font-semibold text-slate-400 sm:block">
                TECHNOLOGY MARKETPLACE
              </div>
            </div>
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            <Link href={`/${locale}`} className="text-sm font-semibold text-slate-600 hover:text-blue-600">
              Accueil
            </Link>

            <Link href={`/${locale}/repairs`} className="text-sm font-semibold text-slate-600 hover:text-blue-600">
              Réparations
            </Link>

            <Link href={`/${locale}/technicians`} className="text-sm font-semibold text-slate-600 hover:text-blue-600">
              Techniciens
            </Link>

            <Link href={`/${locale}/shop`} className="text-sm font-semibold text-slate-600 hover:text-blue-600">
              Boutique
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href={`/${locale}/cart`}
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-bold hover:bg-slate-50"
            >
              🛒
            </Link>

            <Link
              href={`/${locale}/dashboard`}
              className="hidden rounded-xl bg-slate-900 px-4 py-2 text-sm font-bold text-white sm:block"
            >
              Mon espace
            </Link>

            <Link
              href={`/${locale === "fr" ? "en" : "fr"}`}
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-bold"
            >
              {locale === "fr" ? "EN" : "FR"}
            </Link>
          </div>

        </div>
      </div>
    </header>
  );
}
EOF

echo "Création de Footer.tsx..."

cat > components/Footer.tsx <<'EOF'
import Link from "next/link";

export default function Footer({ locale }: { locale: string }) {
  return (
    <footer className="mt-20 bg-slate-950 text-white">
      <div className="container py-14">

        <div className="grid gap-10 md:grid-cols-4">

          <div>
            <div className="text-xl font-black">Folioga-tech</div>
            <p className="mt-3 text-sm leading-6 text-slate-400">
              La marketplace dédiée à la réparation, aux techniciens
              et au matériel reconditionné.
            </p>
          </div>

          <div>
            <h3 className="font-bold">Services</h3>
            <div className="mt-4 space-y-3 text-sm text-slate-400">
              <Link href={`/${locale}/repairs`} className="block hover:text-white">
                Réparations
              </Link>
              <Link href={`/${locale}/technicians`} className="block hover:text-white">
                Techniciens
              </Link>
              <Link href={`/${locale}/shop`} className="block hover:text-white">
                Boutique
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-bold">Entreprise</h3>
            <div className="mt-4 space-y-3 text-sm text-slate-400">
              <p>À propos</p>
              <p>Contact</p>
              <p>Devenir technicien</p>
            </div>
          </div>

          <div>
            <h3 className="font-bold">Besoin d'aide ?</h3>
            <p className="mt-4 text-sm leading-6 text-slate-400">
              Notre équipe est disponible pour vous accompagner.
            </p>

            <button className="btn btn-primary mt-4">
              Contacter Folioga
            </button>
          </div>

        </div>

        <div className="mt-12 border-t border-slate-800 pt-6 text-sm text-slate-500">
          © {new Date().getFullYear()} Folioga-tech. Tous droits réservés.
        </div>

      </div>
    </footer>
  );
}
EOF

echo "Création de Rating.tsx..."

cat > components/Rating.tsx <<'EOF'
export default function Rating({
  rating = 5,
  reviews = 0,
}: {
  rating?: number;
  reviews?: number;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-amber-500">
        {"★".repeat(Math.round(rating))}
        <span className="text-slate-200">
          {"★".repeat(5 - Math.round(rating))}
        </span>
      </span>

      <span className="text-sm font-semibold text-slate-600">
        {rating.toFixed(1)}
      </span>

      {reviews > 0 && (
        <span className="text-sm text-slate-400">
          ({reviews})
        </span>
      )}
    </div>
  );
}
EOF

echo "Création de Badge.tsx..."

cat > components/Badge.tsx <<'EOF'
export default function Badge({
  children,
  type = "blue",
}: {
  children: React.ReactNode;
  type?: "green" | "blue" | "gray";
}) {
  return (
    <span className={`badge badge-${type}`}>
      {children}
    </span>
  );
}
EOF

echo "Création de ProductCard.tsx..."

cat > components/ProductCard.tsx <<'EOF'
import Link from "next/link";
import Rating from "./Rating";
import Badge from "./Badge";

export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  oldPrice?: number;
  image: string;
  rating: number;
  reviews: number;
  condition: string;
  stock: number;
};

export default function ProductCard({
  product,
  locale,
}: {
  product: Product;
  locale: string;
}) {
  return (
    <article className="card group overflow-hidden transition hover:-translate-y-1 hover:shadow-xl">

      <Link href={`/${locale}/shop/${product.id}`}>

        <div className="relative flex h-56 items-center justify-center bg-slate-100 p-6">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-contain transition duration-300 group-hover:scale-105"
          />

          <div className="absolute left-3 top-3">
            <Badge type="green">{product.condition}</Badge>
          </div>
        </div>

        <div className="p-5">

          <div className="text-xs font-bold uppercase tracking-wide text-blue-600">
            {product.category}
          </div>

          <h3 className="mt-2 line-clamp-2 min-h-12 text-lg font-bold text-slate-900">
            {product.name}
          </h3>

          <div className="mt-3">
            <Rating rating={product.rating} reviews={product.reviews} />
          </div>

          <div className="mt-5 flex items-end justify-between gap-3">

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

            <span className="rounded-xl bg-blue-600 px-3 py-2 text-sm font-bold text-white">
              Voir
            </span>

          </div>

          <div className="mt-4 border-t border-slate-100 pt-3 text-xs font-semibold text-slate-500">
            {product.stock > 0
              ? `${product.stock} disponible${product.stock > 1 ? "s" : ""}`
              : "Rupture de stock"}
          </div>

        </div>

      </Link>
    </article>
  );
}
EOF

echo "Création de ProductGrid.tsx..."

cat > components/ProductGrid.tsx <<'EOF'
import ProductCard, { Product } from "./ProductCard";

export default function ProductGrid({
  products,
  locale,
}: {
  products: Product[];
  locale: string;
}) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          locale={locale}
        />
      ))}
    </div>
  );
}
EOF

echo "Création de TechnicianCard.tsx..."

cat > components/TechnicianCard.tsx <<'EOF'
import Link from "next/link";
import Rating from "./Rating";
import Badge from "./Badge";

export type Technician = {
  id: string;
  name: string;
  specialty: string;
  location: string;
  image: string;
  rating: number;
  reviews: number;
  price: number;
  available: boolean;
  verified: boolean;
  experience: number;
};

export default function TechnicianCard({
  technician,
  locale,
}: {
  technician: Technician;
  locale: string;
}) {
  return (
    <article className="card overflow-hidden transition hover:-translate-y-1 hover:shadow-xl">

      <div className="h-24 bg-gradient-to-r from-blue-600 to-indigo-600" />

      <div className="-mt-12 px-5">

        <div className="flex items-end justify-between">

          <img
            src={technician.image}
            alt={technician.name}
            className="h-24 w-24 rounded-2xl border-4 border-white bg-slate-200 object-cover shadow"
          />

          {technician.verified && (
            <Badge type="blue">✓ Vérifié</Badge>
          )}

        </div>

        <div className="pb-5 pt-4">

          <h3 className="text-xl font-black text-slate-900">
            {technician.name}
          </h3>

          <p className="mt-1 font-semibold text-blue-600">
            {technician.specialty}
          </p>

          <p className="mt-2 text-sm text-slate-500">
            📍 {technician.location}
          </p>

          <div className="mt-4">
            <Rating
              rating={technician.rating}
              reviews={technician.reviews}
            />
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">

            <div className="rounded-xl bg-slate-50 p-3">
              <div className="font-black text-slate-900">
                {technician.experience} ans
              </div>
              <div className="text-slate-500">
                expérience
              </div>
            </div>

            <div className="rounded-xl bg-slate-50 p-3">
              <div className="font-black text-slate-900">
                {technician.price} €/h
              </div>
              <div className="text-slate-500">
                tarif moyen
              </div>
            </div>

          </div>

          <div className="mt-5 flex items-center justify-between">

            {technician.available ? (
              <span className="text-sm font-bold text-green-600">
                ● Disponible
              </span>
            ) : (
              <span className="text-sm font-bold text-slate-400">
                ● Indisponible
              </span>
            )}

            <Link
              href={`/${locale}/technicians/${technician.id}`}
              className="btn btn-primary"
            >
              Voir le profil
            </Link>

          </div>

        </div>
      </div>
    </article>
  );
}
EOF

echo "Création de TechnicianGrid.tsx..."

cat > components/TechnicianGrid.tsx <<'EOF'
import TechnicianCard, { Technician } from "./TechnicianCard";

export default function TechnicianGrid({
  technicians,
  locale,
}: {
  technicians: Technician[];
  locale: string;
}) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {technicians.map((technician) => (
        <TechnicianCard
          key={technician.id}
          technician={technician}
          locale={locale}
        />
      ))}
    </div>
  );
}
EOF

echo "Création de ProductFilters.tsx..."

cat > components/ProductFilters.tsx <<'EOF'
export default function ProductFilters() {
  return (
    <aside className="card hidden h-fit p-5 lg:block">

      <h3 className="text-lg font-black">
        Filtrer
      </h3>

      <div className="mt-6">
        <label className="text-sm font-bold text-slate-700">
          Catégorie
        </label>

        <div className="mt-3 space-y-2 text-sm text-slate-600">
          <label className="flex gap-2">
            <input type="checkbox" />
            Smartphones
          </label>

          <label className="flex gap-2">
            <input type="checkbox" />
            Ordinateurs
          </label>

          <label className="flex gap-2">
            <input type="checkbox" />
            Tablettes
          </label>

          <label className="flex gap-2">
            <input type="checkbox" />
            Accessoires
          </label>
        </div>
      </div>

      <div className="mt-6">
        <label className="text-sm font-bold text-slate-700">
          État
        </label>

        <div className="mt-3 space-y-2 text-sm text-slate-600">
          <label className="flex gap-2">
            <input type="checkbox" />
            Comme neuf
          </label>

          <label className="flex gap-2">
            <input type="checkbox" />
            Très bon état
          </label>

          <label className="flex gap-2">
            <input type="checkbox" />
            Bon état
          </label>
        </div>
      </div>

      <div className="mt-6">
        <label className="text-sm font-bold text-slate-700">
          Prix maximum
        </label>

        <input
          type="range"
          min="0"
          max="3000"
          defaultValue="1500"
          className="mt-4 w-full"
        />
      </div>

    </aside>
  );
}
EOF

echo "Création de SearchBar.tsx..."

cat > components/SearchBar.tsx <<'EOF'
export default function SearchBar({
  placeholder = "Que recherchez-vous ?",
}: {
  placeholder?: string;
}) {
  return (
    <div className="flex w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">

      <div className="flex flex-1 items-center px-4">
        <span className="mr-3 text-xl">
          🔎
        </span>

        <input
          className="w-full bg-transparent py-4 outline-none"
          placeholder={placeholder}
        />
      </div>

      <button className="hidden bg-blue-600 px-7 font-bold text-white hover:bg-blue-700 sm:block">
        Rechercher
      </button>

    </div>
  );
}
EOF

echo "Création de ServiceCard.tsx..."

cat > components/ServiceCard.tsx <<'EOF'
import Link from "next/link";

export default function ServiceCard({
  icon,
  title,
  description,
  href,
}: {
  icon: string;
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="card group p-6 transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-2xl">
        {icon}
      </div>

      <h3 className="mt-5 text-xl font-black">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        {description}
      </p>

      <div className="mt-5 font-bold text-blue-600">
        Découvrir →
      </div>
    </Link>
  );
}
EOF

echo "Création de ReviewCard.tsx..."

cat > components/ReviewCard.tsx <<'EOF'
import Rating from "./Rating";

export default function ReviewCard({
  name,
  text,
  rating,
}: {
  name: string;
  text: string;
  rating: number;
}) {
  return (
    <article className="card p-6">
      <Rating rating={rating} />

      <p className="mt-4 leading-7 text-slate-600">
        “{text}”
      </p>

      <div className="mt-5 font-bold text-slate-900">
        {name}
      </div>

      <div className="text-sm text-slate-400">
        Client vérifié
      </div>
    </article>
  );
}
EOF

echo "Création de la boutique..."

cat > "app/[locale]/shop/page.tsx" <<'EOF'
import ProductGrid from "@/components/ProductGrid";
import ProductFilters from "@/components/ProductFilters";
import SearchBar from "@/components/SearchBar";

const products = [
  {
    id: "iphone-13",
    name: "iPhone 13 128 Go",
    category: "Smartphone",
    price: 399,
    oldPrice: 499,
    image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=700",
    rating: 4.8,
    reviews: 124,
    condition: "Très bon état",
    stock: 7,
  },
  {
    id: "macbook-air",
    name: "MacBook Air M2",
    category: "Ordinateur",
    price: 849,
    oldPrice: 999,
    image: "https://images.unsplash.com/photo-1517336714739-489689fd1ca8?w=700",
    rating: 4.9,
    reviews: 87,
    condition: "Comme neuf",
    stock: 4,
  },
  {
    id: "ipad-air",
    name: "iPad Air",
    category: "Tablette",
    price: 429,
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=700",
    rating: 4.7,
    reviews: 63,
    condition: "Très bon état",
    stock: 9,
  },
  {
    id: "airpods-pro",
    name: "AirPods Pro",
    category: "Audio",
    price: 159,
    oldPrice: 219,
    image: "https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?w=700",
    rating: 4.6,
    reviews: 201,
    condition: "Comme neuf",
    stock: 12,
  },
];

export default async function ShopPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <main>

      <section className="bg-slate-950 py-16 text-white">
        <div className="container">

          <div className="max-w-3xl">
            <div className="badge badge-blue">
              ♻️ Matériel reconditionné
            </div>

            <h1 className="mt-5 text-4xl font-black tracking-tight md:text-6xl">
              La technologie de qualité, à prix intelligent.
            </h1>

            <p className="mt-5 text-lg leading-8 text-slate-300">
              Découvrez notre sélection de smartphones, ordinateurs,
              tablettes et accessoires reconditionnés.
            </p>
          </div>

          <div className="mt-8 max-w-3xl">
            <SearchBar placeholder="Rechercher un produit..." />
          </div>

        </div>
      </section>

      <section className="section">
        <div className="container">

          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

            <div>
              <h2 className="text-3xl font-black">
                Tous les produits
              </h2>

              <p className="mt-1 text-slate-500">
                Produits vérifiés et sélectionnés par Folioga-tech
              </p>
            </div>

            <select className="input w-auto">
              <option>Plus populaires</option>
              <option>Prix croissant</option>
              <option>Prix décroissant</option>
              <option>Mieux notés</option>
            </select>

          </div>

          <div className="grid gap-8 lg:grid-cols-[250px_1fr]">

            <ProductFilters />

            <ProductGrid
              products={products}
              locale={locale}
            />

          </div>

        </div>
      </section>

    </main>
  );
}
EOF

echo "Création de la page techniciens..."

cat > "app/[locale]/technicians/page.tsx" <<'EOF'
import SearchBar from "@/components/SearchBar";
import TechnicianGrid from "@/components/TechnicianGrid";

const technicians = [
  {
    id: "alexandre-martin",
    name: "Alexandre Martin",
    specialty: "Réparation smartphones",
    location: "Strasbourg",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
    rating: 4.9,
    reviews: 182,
    price: 45,
    available: true,
    verified: true,
    experience: 8,
  },
  {
    id: "sarah-durand",
    name: "Sarah Durand",
    specialty: "Mac & PC",
    location: "Paris",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
    rating: 4.8,
    reviews: 96,
    price: 55,
    available: true,
    verified: true,
    experience: 6,
  },
  {
    id: "thomas-bernard",
    name: "Thomas Bernard",
    specialty: "Électronique",
    location: "Lyon",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    rating: 4.7,
    reviews: 71,
    price: 40,
    available: false,
    verified: true,
    experience: 10,
  },
];

export default async function TechniciansPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <main>

      <section className="bg-blue-600 py-16 text-white">
        <div className="container">

          <div className="max-w-3xl">
            <div className="text-sm font-bold uppercase tracking-widest text-blue-200">
              Réseau Folioga
            </div>

            <h1 className="mt-4 text-4xl font-black md:text-6xl">
              Trouvez le bon technicien.
            </h1>

            <p className="mt-5 text-lg leading-8 text-blue-100">
              Des professionnels vérifiés pour réparer vos appareils
              rapidement et en toute confiance.
            </p>
          </div>

          <div className="mt-8 max-w-3xl">
            <SearchBar placeholder="Rechercher une spécialité ou une ville..." />
          </div>

        </div>
      </section>

      <section className="section">
        <div className="container">

          <div className="mb-8">
            <h2 className="text-3xl font-black">
              Techniciens recommandés
            </h2>

            <p className="mt-2 text-slate-500">
              Les meilleurs professionnels disponibles sur Folioga-tech.
            </p>
          </div>

          <TechnicianGrid
            technicians={technicians}
            locale={locale}
          />

        </div>
      </section>

    </main>
  );
}
EOF

echo "Création de la page réparations..."

cat > "app/[locale]/repairs/page.tsx" <<'EOF'
import ServiceCard from "@/components/ServiceCard";
import SearchBar from "@/components/SearchBar";

export default async function RepairsPage() {
  return (
    <main>

      <section className="bg-slate-950 py-16 text-white">
        <div className="container">

          <div className="max-w-3xl">

            <div className="badge badge-blue">
              🔧 Service de réparation
            </div>

            <h1 className="mt-5 text-4xl font-black md:text-6xl">
              Votre appareil ne fonctionne plus ?
            </h1>

            <p className="mt-5 text-lg leading-8 text-slate-300">
              Décrivez votre problème et trouvez rapidement un
              technicien qualifié.
            </p>

          </div>

          <div className="mt-8 max-w-3xl">
            <SearchBar placeholder="Ex : écran cassé, batterie, Mac qui ne démarre plus..." />
          </div>

        </div>
      </section>

      <section className="section">
        <div className="container">

          <h2 className="text-3xl font-black">
            Quel appareil voulez-vous réparer ?
          </h2>

          <p className="mt-2 text-slate-500">
            Sélectionnez une catégorie pour commencer.
          </p>

          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">

            <ServiceCard
              icon="📱"
              title="Smartphone"
              description="Écran, batterie, caméra, connecteur..."
              href="#"
            />

            <ServiceCard
              icon="💻"
              title="Ordinateur"
              description="Mac, PC, Windows, logiciels et matériel."
              href="#"
            />

            <ServiceCard
              icon="📲"
              title="Tablette"
              description="Écran, batterie et problèmes logiciels."
              href="#"
            />

            <ServiceCard
              icon="🎮"
              title="Console"
              description="Réparation et diagnostic de consoles."
              href="#"
            />

          </div>

        </div>
      </section>

    </main>
  );
}
EOF

echo "Création du panier..."

cat > "app/[locale]/cart/page.tsx" <<'EOF'
export default function CartPage() {
  return (
    <main className="section">
      <div className="container">

        <div className="mb-10">
          <div className="text-sm font-bold text-blue-600">
            FOLIOGA-TECH
          </div>

          <h1 className="mt-2 text-4xl font-black">
            Votre panier
          </h1>

          <p className="mt-2 text-slate-500">
            Vérifiez votre commande avant le paiement.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">

          <div className="card p-6">
            <div className="flex items-center justify-center py-16 text-center">
              <div>
                <div className="text-5xl">🛒</div>

                <h2 className="mt-5 text-xl font-black">
                  Votre panier est vide
                </h2>

                <p className="mt-2 text-slate-500">
                  Ajoutez des produits depuis notre boutique.
                </p>
              </div>
            </div>
          </div>

          <aside className="card h-fit p-6">

            <h2 className="text-xl font-black">
              Résumé
            </h2>

            <div className="mt-6 space-y-3 border-b border-slate-100 pb-5 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">
                  Sous-total
                </span>
                <strong>0,00 €</strong>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-500">
                  Livraison
                </span>
                <strong>—</strong>
              </div>
            </div>

            <div className="mt-5 flex justify-between text-lg font-black">
              <span>Total</span>
              <span>0,00 €</span>
            </div>

            <button
              disabled
              className="btn mt-6 w-full bg-slate-200 text-slate-400"
            >
              Passer au paiement
            </button>

          </aside>

        </div>

      </div>
    </main>
  );
}
EOF

echo "Création du dashboard..."

cat > "app/[locale]/dashboard/page.tsx" <<'EOF'
const stats = [
  {
    label: "Réparations",
    value: "0",
    icon: "🔧",
  },
  {
    label: "Commandes",
    value: "0",
    icon: "📦",
  },
  {
    label: "Favoris",
    value: "0",
    icon: "❤️",
  },
  {
    label: "Messages",
    value: "0",
    icon: "💬",
  },
];

export default function DashboardPage() {
  return (
    <main className="section">
      <div className="container">

        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">

          <div>
            <div className="text-sm font-bold text-blue-600">
              MON ESPACE
            </div>

            <h1 className="mt-2 text-4xl font-black">
              Bienvenue 👋
            </h1>

            <p className="mt-2 text-slate-500">
              Gérez vos réparations, commandes et informations personnelles.
            </p>
          </div>

          <button className="btn btn-dark">
            Modifier mon profil
          </button>

        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

          {stats.map((stat) => (
            <div key={stat.label} className="card p-5">

              <div className="flex items-center justify-between">
                <span className="text-2xl">
                  {stat.icon}
                </span>

                <span className="text-3xl font-black">
                  {stat.value}
                </span>
              </div>

              <div className="mt-4 font-semibold text-slate-500">
                {stat.label}
              </div>

            </div>
          ))}

        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">

          <section className="card p-6">
            <h2 className="text-xl font-black">
              Activité récente
            </h2>

            <div className="py-12 text-center text-sm text-slate-400">
              Aucune activité pour le moment.
            </div>
          </section>

          <section className="card p-6">
            <h2 className="text-xl font-black">
              Actions rapides
            </h2>

            <div className="mt-5 grid gap-3">

              <button className="btn btn-secondary justify-start">
                🔧 Demander une réparation
              </button>

              <button className="btn btn-secondary justify-start">
                👨‍🔧 Trouver un technicien
              </button>

              <button className="btn btn-secondary justify-start">
                🛒 Explorer la boutique
              </button>

            </div>
          </section>

        </div>

      </div>
    </main>
  );
}
EOF

echo ""
echo "=========================================="
echo " UI PROFESSIONNELLE CRÉÉE"
echo "=========================================="
echo ""
echo "Prochaine étape :"
echo "  npm run build"
echo ""
echo "Puis :"
echo "  npm run dev"
echo ""
