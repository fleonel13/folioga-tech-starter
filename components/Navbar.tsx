"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [walletLoading, setWalletLoading] = useState(false);

  const locale = pathname?.split("/")[1] === "en" ? "en" : "fr";
  const base = `/${locale}`;

  const links = [
    {
      href: base,
      label: locale === "fr" ? "Accueil" : "Home",
    },
    {
      href: `${base}/repairs`,
      label: locale === "fr" ? "Réparations" : "Repairs",
    },
    {
      href: `${base}/technicians`,
      label: locale === "fr" ? "Techniciens" : "Technicians",
    },
    {
      href: `${base}/shop`,
      label: locale === "fr" ? "Boutique" : "Shop",
    },
    {
      href: `${base}/posts`,
      label: locale === "fr" ? "Réalisations" : "Projects",
    },
  ];

  const isActive = (href: string) => {
    if (href === base) {
      return pathname === href;
    }

    return pathname?.startsWith(href);
  };

  const switchLocale =
    locale === "fr"
      ? pathname?.replace(/^\/fr/, "/en")
      : pathname?.replace(/^\/en/, "/fr");

  const closeMenu = () => setOpen(false);

  async function handleWallet() {
    if (walletLoading) return;

    try {
      setWalletLoading(true);

      /*
       * =========================================================
       * 1. Récupérer l'utilisateur connecté
       * =========================================================
       */

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error(
          "Utilisateur non connecté :",
          userError
        );

        alert(
          locale === "fr"
            ? "Vous devez être connecté pour accéder au portefeuille."
            : "You must be logged in to access your wallet."
        );

        return;
      }

      console.log(
        "Utilisateur connecté :",
        user.id
      );

      /*
       * =========================================================
       * 2. Vérifier le profil
       * =========================================================
       */

      const { data: profile, error: profileError } =
        await supabase
          .from("profiles")
          .select("id, role")
          .eq("id", user.id)
          .maybeSingle();

      if (profileError) {
        console.error(
          "Erreur récupération profil :",
          profileError
        );

        alert(
          locale === "fr"
            ? "Impossible de récupérer votre profil."
            : "Unable to load your profile."
        );

        return;
      }

      if (!profile) {
        alert(
          locale === "fr"
            ? "Votre profil est introuvable."
            : "Your profile was not found."
        );

        return;
      }

      /*
       * =========================================================
       * 3. Vérifier que c'est bien un technicien
       * =========================================================
       */

      if (
        profile.role !== "technicien" &&
        profile.role !== "technician"
      ) {
        alert(
          locale === "fr"
            ? "Le portefeuille Stripe est réservé aux techniciens."
            : "The Stripe wallet is only available to technicians."
        );

        return;
      }

      /*
       * =========================================================
       * 4. Appeler Stripe Connect
       * =========================================================
       */

      const response = await fetch(
        "/api/stripe/connect/onboard",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            technicianId: user.id,
          }),
        }
      );

      const data = await response.json();

      console.log(
        "Réponse Stripe Connect :",
        data
      );

      if (!response.ok) {
        console.error(
          "Erreur Stripe Connect :",
          data
        );

        alert(
          data?.error ||
            (locale === "fr"
              ? "Impossible d'ouvrir le portefeuille Stripe."
              : "Unable to open the Stripe wallet.")
        );

        return;
      }

      /*
       * =========================================================
       * 5. Redirection vers Stripe
       * =========================================================
       */

      if (data.url) {
        window.location.href = data.url;
        return;
      }

      alert(
        locale === "fr"
          ? "Stripe n'a pas retourné de lien de connexion."
          : "Stripe did not return a connection link."
      );
    } catch (error) {
      console.error(
        "Erreur portefeuille :",
        error
      );

      alert(
        locale === "fr"
          ? "Une erreur est survenue lors de l'ouverture du portefeuille."
          : "An error occurred while opening the wallet."
      );
    } finally {
      setWalletLoading(false);
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/85 backdrop-blur-xl">
      <div className="page-container flex h-[76px] items-center justify-between">

        {/* =====================================================
            LOGO
        ===================================================== */}

        <Link
          href={base}
          onClick={closeMenu}
          className="group flex items-center gap-3"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-lg text-white shadow-lg shadow-slate-950/15 transition-all duration-300 group-hover:-rotate-3 group-hover:bg-blue-600">
            F
          </div>

          <div className="leading-none">
            <div className="text-lg font-black tracking-tight text-slate-950">
              Folioga<span className="text-blue-600">Tech</span>
            </div>

            <div className="mt-1 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
              Tech seconde vie
            </div>
          </div>
        </Link>

        {/* =====================================================
            NAVIGATION DESKTOP
        ===================================================== */}

        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((link) => {
            const active = isActive(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative rounded-xl px-4 py-2.5 text-sm font-bold transition-all duration-200 ${
                  active
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                }`}
              >
                {link.label}

                {active && (
                  <span className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-blue-600" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* =====================================================
            ACTIONS DESKTOP
        ===================================================== */}

        <div className="hidden items-center gap-2 sm:flex">

          {/* Langue */}
          <Link
            href={switchLocale || "/fr"}
            className="rounded-xl px-3 py-2 text-xs font-black tracking-wide text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
          >
            {locale === "fr" ? "EN" : "FR"}
          </Link>

          {/* Panier */}
          <Link
            href={`${base}/cart`}
            className="group relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition-all duration-200 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
            aria-label={
              locale === "fr"
                ? "Panier"
                : "Cart"
            }
          >
            <span className="text-base">
              🛒
            </span>
          </Link>

          {/* =================================================
              PORTEFEUILLE STRIPE
          ================================================= */}

          <button
            type="button"
            onClick={handleWallet}
            disabled={walletLoading}
            className="group flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold text-slate-700 transition-all duration-200 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 disabled:cursor-wait disabled:opacity-60"
            aria-label={
              locale === "fr"
                ? "Portefeuille"
                : "Wallet"
            }
          >
            <span className="text-base">
              {walletLoading ? "⏳" : "💳"}
            </span>

            <span className="hidden xl:inline">
              {walletLoading
                ? locale === "fr"
                  ? "Ouverture..."
                  : "Opening..."
                : locale === "fr"
                ? "Portefeuille"
                : "Wallet"}
            </span>
          </button>

          {/* Mon espace */}
          <Link
            href={`${base}/dashboard`}
            className="rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-slate-950/15 transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-600 hover:shadow-blue-600/20"
          >
            {locale === "fr"
              ? "Mon espace"
              : "Dashboard"}
          </Link>
        </div>

        {/* =====================================================
            BOUTON MOBILE
        ===================================================== */}

        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 lg:hidden"
          aria-label={
            open
              ? "Fermer le menu"
              : "Ouvrir le menu"
          }
          aria-expanded={open}
        >
          <span className="text-lg">
            {open ? "✕" : "☰"}
          </span>
        </button>
      </div>

      {/* =======================================================
          MENU MOBILE
      ======================================================= */}

      <div
        className={`overflow-hidden border-t border-slate-200/70 bg-white transition-all duration-300 lg:hidden ${
          open
            ? "max-h-[750px] opacity-100"
            : "max-h-0 opacity-0"
        }`}
      >
        <div className="page-container py-4">

          <nav className="flex flex-col gap-1">
            {links.map((link) => {
              const active = isActive(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMenu}
                  className={`rounded-xl px-4 py-3.5 text-sm font-bold transition ${
                    active
                      ? "bg-blue-50 text-blue-700"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-3 grid grid-cols-3 gap-2">

            {/* Panier */}
            <Link
              href={`${base}/cart`}
              onClick={closeMenu}
              className="rounded-xl border border-slate-200 px-3 py-3 text-center text-sm font-bold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50"
            >
              <span className="block text-lg">
                🛒
              </span>

              <span className="mt-1 block text-xs">
                {locale === "fr"
                  ? "Panier"
                  : "Cart"}
              </span>
            </Link>

            {/* Portefeuille */}
            <button
              type="button"
              onClick={() => {
                closeMenu();
                handleWallet();
              }}
              disabled={walletLoading}
              className="rounded-xl border border-slate-200 px-3 py-3 text-center text-sm font-bold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 disabled:opacity-60"
            >
              <span className="block text-lg">
                {walletLoading
                  ? "⏳"
                  : "💳"}
              </span>

              <span className="mt-1 block text-xs">
                {locale === "fr"
                  ? "Portefeuille"
                  : "Wallet"}
              </span>
            </button>

            {/* Mon espace */}
            <Link
              href={`${base}/dashboard`}
              onClick={closeMenu}
              className="rounded-xl bg-slate-950 px-3 py-3 text-center text-sm font-bold text-white transition hover:bg-blue-600"
            >
              <span className="block text-lg">
                👤
              </span>

              <span className="mt-1 block text-xs">
                {locale === "fr"
                  ? "Mon espace"
                  : "Dashboard"}
              </span>
            </Link>

          </div>

          {/* Langue */}
          <Link
            href={switchLocale || "/fr"}
            onClick={closeMenu}
            className="mt-2 block rounded-xl px-4 py-3 text-center text-sm font-bold text-slate-500 transition hover:bg-slate-50 hover:text-slate-900"
          >
            {locale === "fr"
              ? "Passer en anglais"
              : "Passer en français"}
          </Link>

        </div>
      </div>
    </header>
  );
}
