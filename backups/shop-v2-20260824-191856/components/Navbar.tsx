
'use client';

import Link from 'next/link';
import {useParams} from 'next/navigation';

export default function Navbar() {
  const params = useParams();
  const locale = typeof params.locale === 'string' ? params.locale : 'fr';

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        <Link
          href={`/${locale}`}
          className="text-2xl font-bold tracking-tight text-slate-900"
        >
          Folioga<span className="text-blue-600">-tech</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link
            href={`/${locale}`}
            className="text-sm font-medium text-slate-600 transition hover:text-blue-600"
          >
            Accueil
          </Link>

          <Link
            href={`/${locale}/repairs`}
            className="text-sm font-medium text-slate-600 transition hover:text-blue-600"
          >
            Réparations
          </Link>

          <Link
            href={`/${locale}/technicians`}
            className="text-sm font-medium text-slate-600 transition hover:text-blue-600"
          >
            Techniciens
          </Link>

          <Link
            href={`/${locale}/shop`}
            className="text-sm font-medium text-slate-600 transition hover:text-blue-600"
          >
            Boutique
          </Link>

          <Link
            href={`/${locale}/dashboard`}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-600"
          >
            Mon espace
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href={locale === 'fr' ? '/en' : '/fr'}
            className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            {locale === 'fr' ? 'EN' : 'FR'}
          </Link>
        </div>

      </div>
    </header>
  );
}
