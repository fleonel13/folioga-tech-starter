"use client";

import Link from "next/link";
import { use, useEffect, useState } from "react";
import { CartItem, getCart, cartTotal } from "@/lib/cart";

export default function CheckoutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);

  const [items, setItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const cart = getCart();

    setItems(cart);
    setTotal(cartTotal());
  }, []);

  async function handleCheckout() {
    if (items.length === 0) {
      setError("Votre panier est vide.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items,
          locale,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Impossible de démarrer le paiement."
        );
      }

      if (!data.url) {
        throw new Error("URL Stripe introuvable.");
      }

      window.location.href = data.url;
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Une erreur est survenue."
      );

      setLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-20">
        <div className="mx-auto max-w-xl rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm">
          <div className="text-6xl">🛒</div>

          <h1 className="mt-5 text-3xl font-black text-slate-950">
            Votre panier est vide
          </h1>

          <p className="mt-3 text-slate-500">
            Ajoutez un produit avant de passer commande.
          </p>

          <Link
            href={`/${locale}/shop`}
            className="mt-7 inline-flex rounded-xl bg-slate-950 px-6 py-4 font-bold text-white transition hover:bg-blue-600"
          >
            Retour à la boutique
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-widest text-blue-600">
            Folioga Shop
          </p>

          <h1 className="mt-2 text-4xl font-black text-slate-950">
            Finaliser votre commande
          </h1>

          <p className="mt-3 text-slate-500">
            Renseignez vos informations pour préparer votre commande.
          </p>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_380px]">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-2xl font-black text-slate-950">
              Informations de livraison
            </h2>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="firstName"
                  className="mb-2 block text-sm font-bold text-slate-700"
                >
                  Prénom
                </label>

                <input
                  id="firstName"
                  type="text"
                  placeholder="Jean"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div>
                <label
                  htmlFor="lastName"
                  className="mb-2 block text-sm font-bold text-slate-700"
                >
                  Nom
                </label>

                <input
                  id="lastName"
                  type="text"
                  placeholder="Dupont"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-bold text-slate-700"
                >
                  Adresse email
                </label>

                <input
                  id="email"
                  type="email"
                  placeholder="jean@example.com"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="phone"
                  className="mb-2 block text-sm font-bold text-slate-700"
                >
                  Téléphone
                </label>

                <input
                  id="phone"
                  type="tel"
                  placeholder="06 12 34 56 78"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="address"
                  className="mb-2 block text-sm font-bold text-slate-700"
                >
                  Adresse
                </label>

                <input
                  id="address"
                  type="text"
                  placeholder="12 rue de la République"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div>
                <label
                  htmlFor="postalCode"
                  className="mb-2 block text-sm font-bold text-slate-700"
                >
                  Code postal
                </label>

                <input
                  id="postalCode"
                  type="text"
                  placeholder="67000"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div>
                <label
                  htmlFor="city"
                  className="mb-2 block text-sm font-bold text-slate-700"
                >
                  Ville
                </label>

                <input
                  id="city"
                  type="text"
                  placeholder="Strasbourg"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="country"
                  className="mb-2 block text-sm font-bold text-slate-700"
                >
                  Pays
                </label>

                <select
                  id="country"
                  defaultValue="France"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                >
                  <option>France</option>
                  <option>Belgique</option>
                  <option>Luxembourg</option>
                  <option>Allemagne</option>
                </select>
              </div>
            </div>

            <div className="mt-8 rounded-2xl bg-blue-50 p-5">
              <div className="flex gap-3">
                <div className="text-xl">🔒</div>

                <div>
                  <h3 className="font-bold text-slate-900">
                    Paiement sécurisé
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    Le paiement sera effectué de manière sécurisée
                    par Stripe.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <aside className="h-fit rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-black text-slate-950">
              Résumé de la commande
            </h2>

            <div className="mt-6 space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3 border-b border-slate-100 pb-4"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-16 w-16 rounded-xl object-cover"
                  />

                  <div className="min-w-0 flex-1">
                    <h3 className="line-clamp-2 text-sm font-bold text-slate-900">
                      {item.name}
                    </h3>

                    <p className="mt-1 text-xs text-slate-500">
                      Quantité : {item.quantity}
                    </p>
                  </div>

                  <strong className="whitespace-nowrap text-sm text-slate-900">
                    {(item.price * item.quantity).toFixed(2)} €
                  </strong>
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-3">
              <div className="flex justify-between text-sm text-slate-500">
                <span>Sous-total</span>
                <span>{total.toFixed(2)} €</span>
              </div>

              <div className="flex justify-between text-sm text-slate-500">
                <span>Livraison</span>
                <span>À calculer</span>
              </div>
            </div>

            <div className="my-6 border-t border-slate-200" />

            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900">Total</span>

              <strong className="text-2xl font-black text-slate-950">
                {total.toFixed(2)} €
              </strong>
            </div>

            {error && (
              <div className="mt-5 rounded-xl bg-red-50 p-4 text-sm font-semibold text-red-700">
                {error}
              </div>
            )}

            <button
              type="button"
              onClick={handleCheckout}
              disabled={loading}
              className="mt-6 w-full rounded-2xl bg-blue-600 px-5 py-4 font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Redirection vers Stripe..."
                : "Continuer vers le paiement →"}
            </button>

            <Link
              href={`/${locale}/cart`}
              className="mt-3 block text-center text-sm font-semibold text-slate-500 hover:text-blue-600"
            >
              ← Retour au panier
            </Link>
          </aside>
        </div>
      </div>
    </main>
  );
}
