#!/usr/bin/env bash

set -e

echo "=========================================="
echo " FOLIOGA-TECH - DESIGN GLOBAL PRO"
echo "=========================================="
echo ""

STAMP=$(date +"%Y%m%d-%H%M%S")
BACKUP_DIR="backups/global-design-$STAMP"

echo "1. Création de la sauvegarde..."
mkdir -p "$BACKUP_DIR"

[ -f "app/globals.css" ] && cp "app/globals.css" "$BACKUP_DIR/globals.css"
[ -f "components/Navbar.tsx" ] && cp "components/Navbar.tsx" "$BACKUP_DIR/Navbar.tsx"
[ -f "components/Footer.tsx" ] && cp "components/Footer.tsx" "$BACKUP_DIR/Footer.tsx"

echo "✓ Sauvegarde créée : $BACKUP_DIR"
echo ""

echo "2. Création des composants globaux..."
mkdir -p components/ui

cat > components/ui/Container.tsx <<'EOF'
import { ReactNode } from 'react';

export default function Container({
  children,
  className = ''
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  );
}
EOF

cat > components/ui/Section.tsx <<'EOF'
import { ReactNode } from 'react';
import Container from './Container';

export default function Section({
  children,
  className = ''
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`py-12 sm:py-16 lg:py-20 ${className}`}>
      <Container>{children}</Container>
    </section>
  );
}
EOF

cat > components/ui/Button.tsx <<'EOF'
import Link from 'next/link';
import { ReactNode } from 'react';

type Props = {
  href?: string;
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
};

const styles = {
  primary:
    'bg-blue-600 text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 hover:-translate-y-0.5',
  secondary:
    'bg-slate-950 text-white shadow-lg shadow-slate-950/20 hover:bg-slate-800 hover:-translate-y-0.5',
  outline:
    'border border-slate-200 bg-white text-slate-900 hover:border-blue-300 hover:bg-blue-50',
  ghost:
    'bg-transparent text-slate-700 hover:bg-slate-100'
};

export default function Button({
  href,
  children,
  variant = 'primary',
  className = '',
  type = 'button',
  onClick
}: Props) {
  const classes =
    `inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-bold transition-all duration-200 ${styles[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={classes}
    >
      {children}
    </button>
  );
}
EOF

cat > components/ui/Badge.tsx <<'EOF'
import { ReactNode } from 'react';

export default function Badge({
  children,
  variant = 'blue'
}: {
  children: ReactNode;
  variant?: 'blue' | 'green' | 'orange' | 'slate';
}) {
  const styles = {
    blue: 'bg-blue-50 text-blue-700 ring-blue-100',
    green: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
    orange: 'bg-orange-50 text-orange-700 ring-orange-100',
    slate: 'bg-slate-100 text-slate-700 ring-slate-200'
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ring-1 ${styles[variant]}`}
    >
      {children}
    </span>
  );
}
EOF

cat > components/ui/Card.tsx <<'EOF'
import { ReactNode } from 'react';

export default function Card({
  children,
  className = ''
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-slate-200/80 bg-white shadow-sm transition duration-300 hover:shadow-lg ${className}`}
    >
      {children}
    </div>
  );
}
EOF

echo "✓ Composants globaux créés"
echo ""

echo "3. Installation du nouveau CSS global..."

cat > app/globals.css <<'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --background: #f8fafc;
  --foreground: #0f172a;
  --primary: #2563eb;
}

* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  min-height: 100vh;
  background:
    radial-gradient(
      circle at top right,
      rgba(37, 99, 235, 0.08),
      transparent 30%
    ),
    #f8fafc;
  color: #0f172a;
  font-family:
    Arial,
    Helvetica,
    sans-serif;
}

a {
  color: inherit;
  text-decoration: none;
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

@layer base {
  h1 {
    @apply tracking-tight;
  }

  h2 {
    @apply tracking-tight;
  }
}

@layer components {
  .page-shell {
    @apply min-h-screen;
  }

  .page-container {
    @apply mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8;
  }

  .section-space {
    @apply py-12 sm:py-16 lg:py-20;
  }

  .surface {
    @apply rounded-2xl border border-slate-200/80 bg-white shadow-sm;
  }

  .surface-hover {
    @apply rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl;
  }

  .section-title {
    @apply text-3xl font-black tracking-tight text-slate-950 sm:text-4xl;
  }

  .section-subtitle {
    @apply mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg;
  }

  .input-pro {
    @apply w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10;
  }

  .label-pro {
    @apply mb-2 block text-sm font-bold text-slate-700;
  }
}

@media (max-width: 640px) {
  body {
    overflow-x: hidden;
  }
}
EOF

echo "✓ CSS global installé"
echo ""

echo "4. Création de la Navbar professionnelle..."

cat > components/Navbar.tsx <<'EOF'
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const locale =
    pathname?.split('/')[1] === 'en'
      ? 'en'
      : 'fr';

  const base = `/${locale}`;

  const links = [
    { href: base, label: locale === 'fr' ? 'Accueil' : 'Home' },
    {
      href: `${base}/repairs`,
      label: locale === 'fr' ? 'Réparations' : 'Repairs'
    },
    {
      href: `${base}/technicians`,
      label: locale === 'fr' ? 'Techniciens' : 'Technicians'
    },
    {
      href: `${base}/shop`,
      label: locale === 'fr' ? 'Boutique' : 'Shop'
    }
  ];

  const isActive = (href: string) => {
    if (href === base) {
      return pathname === href;
    }

    return pathname?.startsWith(href);
  };

  const switchLocale =
    locale === 'fr'
      ? pathname?.replace(/^\/fr/, '/en')
      : pathname?.replace(/^\/en/, '/fr');

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        <Link
          href={base}
          className="flex items-center gap-3"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-lg shadow-lg shadow-slate-950/20">
            ⚡
          </div>

          <div>
            <div className="text-lg font-black tracking-tight text-slate-950">
              Folioga<span className="text-blue-600">Tech</span>
            </div>

            <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
              Tech seconde vie
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-xl px-4 py-2 text-sm font-bold transition ${
                isActive(link.href)
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 sm:flex">
          <Link
            href={switchLocale || '/fr'}
            className="rounded-xl px-3 py-2 text-xs font-bold text-slate-500 transition hover:bg-slate-100"
          >
            {locale === 'fr' ? 'EN' : 'FR'}
          </Link>

          <Link
            href={`${base}/cart`}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50"
          >
            🛒
          </Link>

          <Link
            href={`${base}/dashboard`}
            className="rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-slate-950/20 transition hover:bg-blue-600"
          >
            {locale === 'fr' ? 'Mon espace' : 'Dashboard'}
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="rounded-xl border border-slate-200 p-2.5 text-slate-700 lg:hidden"
          aria-label="Menu"
        >
          {open ? '✕' : '☰'}
        </button>
      </div>

      {open && (
        <div className="border-t border-slate-200 bg-white px-4 py-4 lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-2">

            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`rounded-xl px-4 py-3 font-bold ${
                  isActive(link.href)
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                {link.label}
              </Link>
            ))}

            <div className="mt-2 grid grid-cols-2 gap-2">
              <Link
                href={`${base}/cart`}
                onClick={() => setOpen(false)}
                className="rounded-xl border border-slate-200 px-4 py-3 text-center font-bold"
              >
                🛒 Panier
              </Link>

              <Link
                href={`${base}/dashboard`}
                onClick={() => setOpen(false)}
                className="rounded-xl bg-slate-950 px-4 py-3 text-center font-bold text-white"
              >
                {locale === 'fr' ? 'Mon espace' : 'Dashboard'}
              </Link>
            </div>

            <Link
              href={switchLocale || '/fr'}
              onClick={() => setOpen(false)}
              className="mt-1 rounded-xl px-4 py-3 text-center font-bold text-slate-500 hover:bg-slate-100"
            >
              {locale === 'fr'
                ? 'Switch to English'
                : 'Passer en français'}
            </Link>

          </div>
        </div>
      )}
    </header>
  );
}
EOF

echo "✓ Navbar installée"
echo ""

echo "5. Création du Footer professionnel..."

cat > components/Footer.tsx <<'EOF'
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-200 bg-slate-950 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">

        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">

          <div className="lg:col-span-1">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-lg text-white">
                ⚡
              </div>

              <div>
                <div className="text-xl font-black text-white">
                  Folioga<span className="text-blue-400">Tech</span>
                </div>

                <div className="text-xs text-slate-500">
                  Donner une seconde vie à la technologie
                </div>
              </div>
            </div>

            <p className="mt-5 max-w-sm text-sm leading-6 text-slate-400">
              Réparation, reconditionnement et accompagnement
              par des professionnels pour une technologie
              plus durable.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-white">
              Services
            </h3>

            <div className="mt-4 flex flex-col gap-3 text-sm">
              <Link href="/fr/repairs" className="hover:text-white">
                Réparer un appareil
              </Link>

              <Link href="/fr/technicians" className="hover:text-white">
                Trouver un technicien
              </Link>

              <Link href="/fr/shop" className="hover:text-white">
                Produits reconditionnés
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-white">
              Plateforme
            </h3>

            <div className="mt-4 flex flex-col gap-3 text-sm">
              <Link href="/fr/dashboard" className="hover:text-white">
                Mon espace
              </Link>

              <Link href="/fr/cart" className="hover:text-white">
                Mon panier
              </Link>

              <Link href="/fr/shop" className="hover:text-white">
                Boutique
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-white">
              Notre mission
            </h3>

            <p className="mt-4 text-sm leading-6 text-slate-400">
              ♻️ Réduire les déchets électroniques.
              <br />
              🔧 Encourager la réparation.
              <br />
              🌍 Connecter les meilleurs techniciens.
            </p>
          </div>

        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-slate-800 pt-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} Folioga-Tech.
            Tous droits réservés.
          </p>

          <div className="flex gap-5">
            <span>🔒 Paiement sécurisé</span>
            <span>♻️ Technologie durable</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
EOF

echo "✓ Footer installé"
echo ""

echo "6. Vérification de la structure..."

if [ ! -f "app/[locale]/layout.tsx" ]; then
  echo "⚠ Attention : app/[locale]/layout.tsx introuvable"
else
  echo "✓ Layout trouvé"
fi

echo ""
echo "7. Vérification TypeScript..."
npx tsc --noEmit

echo ""
echo "8. Build Next.js..."
npm run build

echo ""
echo "=========================================="
echo " INSTALLATION TERMINEE AVEC SUCCES"
echo "=========================================="
echo ""
echo "Sauvegarde disponible dans :"
echo "$BACKUP_DIR"
echo ""
echo "Pour lancer le site :"
echo "npm run dev"
echo ""
