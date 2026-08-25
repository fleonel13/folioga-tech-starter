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
