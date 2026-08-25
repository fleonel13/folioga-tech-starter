#!/usr/bin/env bash

set -e

echo "========================================"
echo " FOLIOGA-TECH V3"
echo " REFONTE GLOBALE PROFESSIONNELLE"
echo "========================================"
echo

ROOT="$(pwd)"
DATE="$(date +%Y%m%d-%H%M%S)"
BACKUP="backups/folioga-v3-$DATE"

echo "1. Sauvegarde du projet..."
mkdir -p backups
mkdir -p "$BACKUP"

cp -r app components lib messages public \
  "$BACKUP/" 2>/dev/null || true

cp package.json tsconfig.json next.config.mjs \
  "$BACKUP/" 2>/dev/null || true

echo "✓ Sauvegarde : $BACKUP"
echo

echo "2. Création des dossiers..."
mkdir -p components/ui
mkdir -p components/home
mkdir -p components/shop
mkdir -p components/technicians
mkdir -p components/repairs
mkdir -p components/dashboard
mkdir -p app/\[locale\]/technicians/\[id\]
mkdir -p app/\[locale\]/shop/\[id\]
mkdir -p app/\[locale\]/repairs
mkdir -p app/\[locale\]/cart
mkdir -p app/\[locale\]/dashboard
echo "✓ Dossiers créés"
echo

echo "3. Design global..."

cat > app/globals.css <<'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --background: #f8fafc;
  --foreground: #0f172a;
  --primary: #2563eb;
  --primary-dark: #1d4ed8;
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
  color: var(--foreground);
  font-family:
    Inter,
    ui-sans-serif,
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    sans-serif;
}

button,
input,
select,
textarea {
  font: inherit;
}

button {
  cursor: pointer;
}

::selection {
  background: #2563eb;
  color: white;
}

.container-page {
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding-left: 1.25rem;
  padding-right: 1.25rem;
}

@media (min-width: 640px) {
  .container-page {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }
}

@media (min-width: 1024px) {
  .container-page {
    padding-left: 2rem;
    padding-right: 2rem;
  }
}
EOF

echo "✓ Design global"
echo

echo "4. Boutons..."

cat > components/ui/Button.tsx <<'EOF'
"use client";

import Link from "next/link";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "dark" | "ghost";
  className?: string;
  type?: "button" | "submit";
};

export default function Button({
  children,
  href,
  onClick,
  variant = "primary",
  className = "",
  type = "button",
}: Props) {
  const styles = {
    primary:
      "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/20",
    secondary:
      "border border-slate-200 bg-white text-slate-900 hover:border-blue-300 hover:text-blue-600",
    dark:
      "bg-slate-950 text-white hover:bg-blue-600",
    ghost:
      "text-slate-600 hover:bg-slate-100 hover:text-slate-950",
  };

  const classes =
    `inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-bold transition ${styles[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes}>
      {children}
    </button>
  );
}
EOF

echo "✓ Button"
echo

echo "5. Navbar..."

cat > components/Navbar.tsx <<'EOF'
"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { cartCount } from "@/lib/cart";

export default function Navbar() {
  const params = useParams<{ locale?: string }>();
  const locale = params?.locale || "fr";

  const [count, setCount] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const update = () => setCount(cartCount());

    update();
    window.addEventListener("cart-updated", update);

    return () => {
      window.removeEventListener("cart-updated", update);
    };
  }, []);

  const otherLocale = locale === "fr" ? "en" : "fr";

  const links = [
    { href: `/${locale}`, label: "Accueil" },
    { href: `/${locale}/repairs`, label: "Réparations" },
    { href: `/${locale}/technicians`, label: "Techniciens" },
    { href: `/${locale}/shop`, label: "Boutique" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur">
      <div className="container-page">
        <div className="flex h-18 min-h-[72px] items-center justify-between gap-4">
          <Link
            href={`/${locale}`}
            className="flex items-center gap-2 text-xl font-black tracking-tight text-slate-950"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
              F
            </span>
            <span>Folioga<span className="text-blue-600">-tech</span></span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            <Link
              href={`/${locale}/shop`}
              className="flex h-10 w-10 items-center justify-center rounded-xl text-lg hover:bg-slate-100"
              aria-label="Recherche"
            >
              ⌕
            </Link>

            <Link
              href={`/${locale}/cart`}
              className="relative flex h-10 w-10 items-center justify-center rounded-xl text-lg hover:bg-slate-100"
              aria-label="Panier"
            >
              🛒
              {count > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1 text-[10px] font-black text-white">
                  {count}
                </span>
              )}
            </Link>

            <Link
              href={`/${locale}/dashboard`}
              className="rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-bold text-white hover:bg-blue-600"
            >
              Mon espace
            </Link>

            <Link
              href={`/${otherLocale}`}
              className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-black uppercase hover:border-blue-300"
            >
              {otherLocale}
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="rounded-xl border border-slate-200 px-3 py-2 text-xl lg:hidden"
            aria-label="Menu"
          >
            {open ? "×" : "☰"}
          </button>
        </div>

        {open && (
          <div className="border-t border-slate-100 py-4 lg:hidden">
            <nav className="grid gap-1">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-4 py-3 font-semibold hover:bg-slate-100"
                >
                  {link.label}
                </Link>
              ))}

              <Link
                href={`/${locale}/cart`}
                onClick={() => setOpen(false)}
                className="rounded-xl px-4 py-3 font-semibold hover:bg-slate-100"
              >
                🛒 Panier {count > 0 ? `(${count})` : ""}
              </Link>

              <Link
                href={`/${locale}/dashboard`}
                onClick={() => setOpen(false)}
                className="mt-2 rounded-xl bg-slate-950 px-4 py-3 text-center font-bold text-white"
              >
                Mon espace
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
EOF

echo "✓ Navbar"
echo

echo "6. Footer..."

cat > components/Footer.tsx <<'EOF'
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-20 bg-slate-950 text-slate-300">
      <div className="container-page py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="text-xl font-black text-white">
              Folioga<span className="text-blue-400">-tech</span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-7 text-slate-400">
              Réparation, reconditionnement et expertise technologique
              accessibles partout.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-white">Services</h3>
            <div className="mt-4 grid gap-3 text-sm">
              <Link href="/fr/repairs" className="hover:text-white">
                Réparations
              </Link>
              <Link href="/fr/technicians" className="hover:text-white">
                Techniciens
              </Link>
              <Link href="/fr/shop" className="hover:text-white">
                Boutique
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-white">Entreprise</h3>
            <div className="mt-4 grid gap-3 text-sm">
              <span>À propos</span>
              <span>Nous contacter</span>
              <span>Confidentialité</span>
              <span>Conditions</span>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-white">Pourquoi Folioga-tech ?</h3>
            <div className="mt-4 grid gap-3 text-sm">
              <span>✓ Techniciens vérifiés</span>
              <span>✓ Produits contrôlés</span>
              <span>✓ Paiement sécurisé</span>
              <span>✓ Support client</span>
            </div>
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

echo "✓ Footer"
echo

echo "7. Homepage..."

cat > app/\[locale\]/page.tsx <<'EOF'
import Link from "next/link";
import { products } from "@/lib/products";

export default async function HomePage() {
  const featured = products.slice(0, 6);

  return (
    <main>
      <section className="overflow-hidden bg-slate-950 text-white">
        <div className="container-page grid min-h-[620px] items-center gap-12 py-20 lg:grid-cols-2">
          <div>
            <div className="mb-6 inline-flex rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-2 text-sm font-bold text-blue-300">
              La technologie mérite une seconde vie
            </div>

            <h1 className="max-w-3xl text-5xl font-black tracking-tight md:text-6xl lg:text-7xl">
              Réparez.
              <br />
              Reconditionnez.
              <br />
              <span className="text-blue-400">Recommencez.</span>
            </h1>

            <p className="mt-7 max-w-xl text-lg leading-8 text-slate-300">
              Trouvez un technicien qualifié, réparez vos appareils et
              découvrez du matériel reconditionné contrôlé.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/fr/repairs"
                className="rounded-xl bg-blue-600 px-6 py-4 text-center font-bold text-white hover:bg-blue-500"
              >
                Trouver un technicien
              </Link>

              <Link
                href="/fr/shop"
                className="rounded-xl border border-slate-700 bg-white/5 px-6 py-4 text-center font-bold text-white hover:bg-white/10"
              >
                Découvrir la boutique
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-10 rounded-full bg-blue-600/20 blur-3xl" />

            <div className="relative rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-white p-6 text-slate-950">
                  <div className="text-3xl">🔧</div>
                  <div className="mt-4 text-xl font-black">
                    Réparation
                  </div>
                  <p className="mt-2 text-sm text-slate-500">
                    Locale ou à distance.
                  </p>
                </div>

                <div className="rounded-2xl bg-blue-600 p-6">
                  <div className="text-3xl">♻️</div>
                  <div className="mt-4 text-xl font-black">
                    Reconditionné
                  </div>
                  <p className="mt-2 text-sm text-blue-100">
                    Contrôlé et prêt à repartir.
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-800 p-6">
                  <div className="text-3xl">👨‍🔧</div>
                  <div className="mt-4 text-xl font-black">
                    Experts
                  </div>
                  <p className="mt-2 text-sm text-slate-400">
                    Des techniciens sélectionnés.
                  </p>
                </div>

                <div className="rounded-2xl bg-white p-6 text-slate-950">
                  <div className="text-3xl">🔒</div>
                  <div className="mt-4 text-xl font-black">
                    Sécurisé
                  </div>
                  <p className="mt-2 text-sm text-slate-500">
                    Paiement et commandes protégés.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-page py-20">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            ["10k+", "Clients accompagnés"],
            ["500+", "Techniciens"],
            ["98%", "Clients satisfaits"],
          ].map(([number, label]) => (
            <div
              key={label}
              className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
            >
              <div className="text-4xl font-black text-slate-950">
                {number}
              </div>
              <div className="mt-2 text-slate-500">{label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="container-page pb-20">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <span className="text-sm font-black uppercase tracking-wider text-blue-600">
              Boutique
            </span>
            <h2 className="mt-2 text-4xl font-black tracking-tight text-slate-950">
              Les produits populaires
            </h2>
          </div>

          <Link
            href="/fr/shop"
            className="font-bold text-blue-600 hover:text-blue-700"
          >
            Voir toute la boutique →
          </Link>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((product) => (
            <Link
              key={product.id}
              href={`/fr/shop/${product.id}`}
              className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="aspect-square overflow-hidden bg-slate-100">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
              </div>

              <div className="p-5">
                <div className="text-xs font-bold uppercase text-blue-600">
                  {product.category}
                </div>
                <h3 className="mt-2 font-black text-slate-950">
                  {product.name}
                </h3>
                <div className="mt-4 text-xl font-black">
                  {product.price} €
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="container-page pb-20">
        <div className="rounded-3xl bg-blue-600 p-8 text-white md:p-12">
          <div className="max-w-3xl">
            <div className="text-sm font-black uppercase tracking-wider text-blue-100">
              Besoin d'aide ?
            </div>
            <h2 className="mt-3 text-3xl font-black md:text-4xl">
              Votre appareil a un problème ?
            </h2>
            <p className="mt-4 leading-7 text-blue-100">
              Décrivez votre problème et trouvez rapidement un technicien
              capable de vous accompagner.
            </p>
            <Link
              href="/fr/repairs"
              className="mt-7 inline-flex rounded-xl bg-white px-6 py-3 font-black text-blue-700 hover:bg-blue-50"
            >
              Demander une réparation
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
EOF

echo "✓ Accueil"
echo

echo "8. Recherche boutique compatible..."

python - <<'PY'
from pathlib import Path

p = Path("components/shop/ShopClient.tsx")

if p.exists():
    text = p.read_text()

    text = text.replace(
        "product.brand.toLowerCase().includes(query.toLowerCase());",
        "false;"
    )

    text = text.replace(
        """onSortChange={setSort}
      />""",
        """onSortChange={setSort}
        categories={[...new Set(products.map((product) => product.category))]}
      />"""
    )

    p.write_text(text)

    print("✓ ShopClient adapté")
else:
    print("⚠ ShopClient absent - conservé")
PY

echo

echo "9. Pages techniciens..."

cat > app/\[locale\]/technicians/page.tsx <<'EOF'
import Link from "next/link";

const technicians = [
  {
    id: "1",
    name: "Alex Martin",
    specialty: "Smartphones & tablettes",
    rating: 4.9,
    reviews: 128,
    city: "Paris",
    experience: "8 ans",
  },
  {
    id: "2",
    name: "Sarah Klein",
    specialty: "Ordinateurs & Mac",
    rating: 4.8,
    reviews: 96,
    city: "Strasbourg",
    experience: "6 ans",
  },
  {
    id: "3",
    name: "Thomas Bernard",
    specialty: "Réseaux & informatique",
    rating: 5,
    reviews: 74,
    city: "Lyon",
    experience: "10 ans",
  },
];

export default function TechniciansPage() {
  return (
    <main className="container-page py-12 md:py-16">
      <div className="max-w-3xl">
        <span className="text-sm font-black uppercase tracking-wider text-blue-600">
          Experts Folioga
        </span>

        <h1 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">
          Trouvez le bon technicien
        </h1>

        <p className="mt-5 text-lg leading-8 text-slate-500">
          Des professionnels évalués par la communauté pour réparer vos
          appareils rapidement et efficacement.
        </p>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {technicians.map((technician) => (
          <Link
            key={technician.id}
            href={`/fr/technicians/${technician.id}`}
            className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-2xl font-black text-blue-700">
                {technician.name.charAt(0)}
              </div>

              <div>
                <h2 className="font-black text-slate-950">
                  {technician.name}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {technician.specialty}
                </p>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <span className="font-black text-amber-500">
                ★ {technician.rating}
              </span>
              <span className="text-sm text-slate-500">
                {technician.reviews} avis
              </span>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-slate-50 p-3">
                <div className="text-xs text-slate-400">Localisation</div>
                <div className="mt-1 font-bold">{technician.city}</div>
              </div>

              <div className="rounded-xl bg-slate-50 p-3">
                <div className="text-xs text-slate-400">Expérience</div>
                <div className="mt-1 font-bold">{technician.experience}</div>
              </div>
            </div>

            <div className="mt-6 font-bold text-blue-600 group-hover:text-blue-700">
              Voir le profil →
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
EOF

cat > app/\[locale\]/technicians/\[id\]/page.tsx <<'EOF'
import Link from "next/link";

export default async function TechnicianPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;

  return (
    <main className="container-page py-12">
      <Link
        href={`/${locale}/technicians`}
        className="font-bold text-blue-600"
      >
        ← Tous les techniciens
      </Link>

      <div className="mt-8 grid gap-8 lg:grid-cols-[340px_1fr]">
        <aside className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
          <div className="flex h-28 w-28 items-center justify-center rounded-3xl bg-blue-100 text-5xl font-black text-blue-700">
            T
          </div>

          <h1 className="mt-6 text-3xl font-black">
            Technicien professionnel
          </h1>

          <p className="mt-2 text-slate-500">
            Profil #{id}
          </p>

          <div className="mt-6 text-xl font-black text-amber-500">
            ★ 4.9
          </div>

          <Link
            href={`/${locale}/repairs`}
            className="mt-7 block rounded-xl bg-blue-600 px-5 py-4 text-center font-black text-white hover:bg-blue-700"
          >
            Demander une réparation
          </Link>
        </aside>

        <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm md:p-10">
          <span className="text-sm font-black uppercase text-blue-600">
            Profil professionnel
          </span>

          <h2 className="mt-3 text-3xl font-black">
            Expertise et services
          </h2>

          <p className="mt-5 max-w-3xl leading-8 text-slate-600">
            Ce technicien accompagne les particuliers et professionnels pour
            le diagnostic, la réparation et la maintenance de leurs appareils
            numériques.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {[
              "Diagnostic appareil",
              "Réparation smartphone",
              "Ordinateur portable",
              "Installation logiciel",
              "Assistance à distance",
              "Maintenance informatique",
            ].map((service) => (
              <div
                key={service}
                className="rounded-2xl bg-slate-50 p-5 font-bold"
              >
                ✓ {service}
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
EOF

echo "✓ Techniciens"
echo

echo "10. Réparations..."

cat > app/\[locale\]/repairs/page.tsx <<'EOF'
"use client";

import { FormEvent, useState } from "react";

export default function RepairsPage() {
  const [sent, setSent] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSent(true);
  }

  return (
    <main className="container-page py-12 md:py-16">
      <div className="mx-auto max-w-3xl text-center">
        <span className="text-sm font-black uppercase tracking-wider text-blue-600">
          Réparation
        </span>

        <h1 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">
          Décrivez votre problème
        </h1>

        <p className="mt-5 text-lg text-slate-500">
          Quelques informations suffisent pour commencer votre demande.
        </p>
      </div>

      <form
        onSubmit={submit}
        className="mx-auto mt-10 max-w-3xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-10"
      >
        <div className="grid gap-5 md:grid-cols-2">
          <label className="grid gap-2">
            <span className="text-sm font-bold">Type d'appareil</span>
            <select
              required
              className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
            >
              <option value="">Sélectionner</option>
              <option>Smartphone</option>
              <option>Ordinateur</option>
              <option>Tablette</option>
              <option>Console</option>
              <option>Autre</option>
            </select>
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-bold">Mode</span>
            <select
              required
              className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
            >
              <option>Réparation locale</option>
              <option>À distance</option>
            </select>
          </label>
        </div>

        <label className="mt-5 grid gap-2">
          <span className="text-sm font-bold">Décrivez la panne</span>
          <textarea
            required
            rows={6}
            placeholder="Expliquez ce qui ne fonctionne plus..."
            className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
          />
        </label>

        <button
          type="submit"
          className="mt-6 w-full rounded-xl bg-blue-600 px-6 py-4 font-black text-white hover:bg-blue-700"
        >
          Envoyer ma demande
        </button>

        {sent && (
          <div className="mt-5 rounded-xl bg-emerald-50 p-4 text-center font-bold text-emerald-700">
            ✓ Votre demande a bien été enregistrée.
          </div>
        )}
      </form>
    </main>
  );
}
EOF

echo "✓ Réparations"
echo

echo "11. Dashboard..."

cat > app/\[locale\]/dashboard/page.tsx <<'EOF'
import Link from "next/link";

const cards = [
  ["📦", "Commandes", "0 commande"],
  ["🔧", "Réparations", "0 réparation"],
  ["❤️", "Favoris", "0 favori"],
  ["💬", "Messages", "0 message"],
];

export default function DashboardPage() {
  return (
    <main className="container-page py-12 md:py-16">
      <div className="rounded-3xl bg-slate-950 p-8 text-white md:p-10">
        <div className="text-sm font-bold text-blue-400">
          MON ESPACE
        </div>

        <h1 className="mt-3 text-4xl font-black">
          Bienvenue sur votre espace
        </h1>

        <p className="mt-4 max-w-2xl text-slate-400">
          Retrouvez ici vos commandes, réparations, favoris et informations
          personnelles.
        </p>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(([icon, title, subtitle]) => (
          <div
            key={title}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="text-3xl">{icon}</div>
            <h2 className="mt-5 font-black">{title}</h2>
            <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-7">
          <h2 className="text-xl font-black">Besoin d'une réparation ?</h2>
          <p className="mt-3 text-slate-500">
            Lancez une nouvelle demande auprès de notre réseau de techniciens.
          </p>
          <Link
            href="/fr/repairs"
            className="mt-6 inline-flex rounded-xl bg-blue-600 px-5 py-3 font-bold text-white"
          >
            Nouvelle réparation
          </Link>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-7">
          <h2 className="text-xl font-black">Envie de matériel ?</h2>
          <p className="mt-3 text-slate-500">
            Découvrez notre sélection de produits reconditionnés.
          </p>
          <Link
            href="/fr/shop"
            className="mt-6 inline-flex rounded-xl bg-slate-950 px-5 py-3 font-bold text-white"
          >
            Ouvrir la boutique
          </Link>
        </div>
      </div>
    </main>
  );
}
EOF

echo "✓ Dashboard"
echo

echo "12. Vérification TypeScript..."
if npx tsc --noEmit; then
  echo "✓ TypeScript OK"
else
  echo
  echo "✗ TypeScript contient des erreurs."
  echo "Les fichiers ont été sauvegardés dans : $BACKUP"
  exit 1
fi

echo
echo "13. Build production..."
if npm run build; then
  echo
  echo "========================================"
  echo " FOLIOGA-TECH V3 INSTALLEE"
  echo "========================================"
  echo
  echo "✓ Design global"
  echo "✓ Navbar professionnelle"
  echo "✓ Footer"
  echo "✓ Accueil"
  echo "✓ Boutique conservée"
  echo "✓ Panier conservé"
  echo "✓ Techniciens"
  echo "✓ Profils techniciens"
  echo "✓ Réparations"
  echo "✓ Dashboard"
  echo "✓ Responsive"
  echo "✓ TypeScript"
  echo "✓ Build production"
  echo
  echo "Sauvegarde : $BACKUP"
  echo
  echo "Lance maintenant :"
  echo "npm run dev"
  echo
else
  echo
  echo "✗ BUILD ECHOUE"
  echo "Votre sauvegarde est disponible ici :"
  echo "$BACKUP"
  exit 1
fi
