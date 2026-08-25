#!/usr/bin/env bash

set -e

echo "🚀 Installation de l'interface Folioga-tech..."

mkdir -p components/home
mkdir -p components/ui

cat > app/globals.css <<'CSS'
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --background: #f8fafc;
  --foreground: #0f172a;
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
  font-family: Arial, Helvetica, sans-serif;
}

a {
  text-decoration: none;
}

button {
  cursor: pointer;
}
CSS

cat > components/home/Hero.tsx <<'TSX'
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32">
        <div className="max-w-3xl">
          <div className="mb-6 inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300">
            ♻️ La technologie mérite une seconde vie
          </div>

          <h1 className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
            Réparez.
            <span className="block text-emerald-400">
              Reconditionnez.
            </span>
            Recommencez.
          </h1>

          <p className="mt-8 max-w-2xl text-lg leading-8 text-slate-300">
            Trouvez un technicien qualifié, faites réparer vos appareils et
            découvrez du matériel reconditionné près de chez vous.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/fr/repairs"
              className="rounded-xl bg-emerald-500 px-6 py-3 font-semibold text-slate-950 hover:bg-emerald-400"
            >
              Trouver une réparation
            </Link>

            <Link
              href="/fr/shop"
              className="rounded-xl border border-white/20 px-6 py-3 font-semibold text-white hover:bg-white/10"
            >
              Voir la boutique
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
TSX

cat > components/home/Stats.tsx <<'TSX'
const stats = [
  ['10k+', 'Appareils réparés'],
  ['2k+', 'Techniciens'],
  ['25+', 'Pays'],
  ['4.9/5', 'Satisfaction'],
];

export default function Stats() {
  return (
    <section className="border-b border-slate-200 bg-white">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 py-10 md:grid-cols-4 lg:px-8">
        {stats.map(([value, label]) => (
          <div key={label}>
            <div className="text-3xl font-bold text-slate-950">{value}</div>
            <div className="mt-1 text-sm text-slate-500">{label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
TSX

cat > components/home/Categories.tsx <<'TSX'
const categories = [
  ['📱', 'Smartphone', 'Écrans, batteries, connecteurs...'],
  ['💻', 'Ordinateur', 'Mac, PC, composants...'],
  ['🎮', 'Console', 'PlayStation, Xbox, Nintendo...'],
  ['⌚', 'Objets connectés', 'Montres, écouteurs...'],
  ['📺', 'TV', 'Écrans et électronique...'],
  ['🔌', 'Autres appareils', 'Tous vos équipements...'],
];

export default function Categories() {
  return (
    <section className="bg-slate-50 py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="font-semibold text-emerald-600">RÉPARATION</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Quel appareil voulez-vous réparer ?
          </h2>
          <p className="mt-4 text-slate-600">
            Choisissez votre appareil et trouvez rapidement le service adapté.
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map(([icon, title, description]) => (
            <div
              key={title}
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="text-4xl">{icon}</div>
              <h3 className="mt-5 text-xl font-bold text-slate-950">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                {description}
              </p>
              <div className="mt-5 font-semibold text-emerald-600">
                Trouver un technicien →
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
TSX

cat > components/home/HowItWorks.tsx <<'TSX'
const steps = [
  ['01', 'Décrivez votre problème', 'Expliquez simplement ce qui ne fonctionne plus.'],
  ['02', 'Trouvez un technicien', 'Comparez les professionnels et leurs avis.'],
  ['03', 'Faites réparer', 'Organisez votre réparation localement ou à distance.'],
];

export default function HowItWorks() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center">
          <p className="font-semibold text-emerald-600">SIMPLE ET RAPIDE</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-950 sm:text-4xl">
            Comment ça marche ?
          </h2>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {steps.map(([number, title, description]) => (
            <div key={number} className="relative rounded-2xl bg-slate-50 p-8">
              <div className="text-sm font-bold text-emerald-600">{number}</div>
              <h3 className="mt-4 text-xl font-bold text-slate-950">
                {title}
              </h3>
              <p className="mt-3 leading-7 text-slate-600">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
TSX

cat > components/home/CTA.tsx <<'TSX'
import Link from 'next/link';

export default function CTA() {
  return (
    <section className="bg-emerald-500">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-center">
          <div>
            <h2 className="text-3xl font-bold text-slate-950 sm:text-4xl">
              Votre appareil mérite une seconde vie.
            </h2>
            <p className="mt-3 max-w-2xl text-slate-800">
              Commencez votre réparation ou découvrez notre sélection de
              matériel reconditionné.
            </p>
          </div>

          <Link
            href="/fr/repairs"
            className="shrink-0 rounded-xl bg-slate-950 px-6 py-3 text-center font-semibold text-white hover:bg-slate-800"
          >
            Commencer
          </Link>
        </div>
      </div>
    </section>
  );
}
TSX

cat > app/[locale]/page.tsx <<'TSX'
import Hero from '@/components/home/Hero';
import Stats from '@/components/home/Stats';
import Categories from '@/components/home/Categories';
import HowItWorks from '@/components/home/HowItWorks';
import CTA from '@/components/home/CTA';

export default function HomePage() {
  return (
    <main>
      <Hero />
      <Stats />
      <Categories />
      <HowItWorks />
      <CTA />
    </main>
  );
}
TSX

echo ""
echo "✅ Interface Folioga-tech créée."
echo ""
echo "👉 Nettoyage du cache Next.js..."
rm -rf .next

echo ""
echo "👉 Vérification du build..."
npm run build

echo ""
echo "🎉 Terminé !"
echo "Lance maintenant : npm run dev"
