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
