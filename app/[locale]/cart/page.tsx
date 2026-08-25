"use client";

import Link from "next/link";
import { use, useEffect, useState } from "react";
import {
  CartItem,
  getCart,
  removeFromCart,
  updateQuantity,
  cartTotal,
} from "@/lib/cart";

export default function CartPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);

  const [items, setItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);

  function refresh() {
    const cart = getCart();
    setItems(cart);
    setTotal(cartTotal());
  }

  useEffect(() => {
    refresh();

    const handler = () => refresh();

    window.addEventListener("cart-updated", handler);

    return () => {
      window.removeEventListener("cart-updated", handler);
    };
  }, []);

  function remove(id: string) {
    removeFromCart(id);
    refresh();
  }

  function changeQuantity(id: string, quantity: number) {
    updateQuantity(id, quantity);
    refresh();
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
            Découvrez nos produits reconditionnés.
          </p>

          <Link
            href={`/${locale}/shop`}
            className="mt-7 inline-block rounded-xl bg-slate-950 px-6 py-4 font-bold text-white transition hover:bg-blue-600"
          >
            Découvrir la boutique
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <div>
          <p className="text-sm font-bold uppercase tracking-widest text-blue-600">
            Folioga Shop
          </p>

          <h1 className="mt-2 text-4xl font-black text-slate-950">
            Votre panier
          </h1>

          <p className="mt-3 text-slate-500">
            Vérifiez vos produits avant de passer commande.
          </p>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex gap-5 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-28 w-28 shrink-0 rounded-2xl object-cover"
                />

                <div className="min-w-0 flex-1">
                  <div className="flex justify-between gap-3">
                    <div>
                      <Link
                        href={`/${locale}/shop/${item.id}`}
                        className="font-bold text-slate-950 transition hover:text-blue-600"
                      >
                        {item.name}
                      </Link>

                      <p className="mt-1 text-sm text-slate-500">
                        {item.condition}
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        {item.price.toFixed(2)} € / unité
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => remove(item.id)}
                      className="text-sm font-semibold text-red-500 transition hover:text-red-700"
                    >
                      Supprimer
                    </button>
                  </div>

                  <div className="mt-5 flex items-center justify-between gap-4">
                    <div className="flex items-center rounded-xl border border-slate-200 bg-white">
                      <button
                        type="button"
                        onClick={() =>
                          changeQuantity(item.id, item.quantity - 1)
                        }
                        className="px-4 py-2 text-lg font-bold text-slate-700 transition hover:bg-slate-50"
                        aria-label={`Diminuer la quantité de ${item.name}`}
                      >
                        −
                      </button>

                      <span className="min-w-10 px-3 text-center font-bold text-slate-900">
                        {item.quantity}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          changeQuantity(item.id, item.quantity + 1)
                        }
                        className="px-4 py-2 text-lg font-bold text-slate-700 transition hover:bg-slate-50"
                        aria-label={`Augmenter la quantité de ${item.name}`}
                      >
                        +
                      </button>
                    </div>

                    <strong className="text-xl text-slate-950">
                      {(item.price * item.quantity).toFixed(2)} €
                    </strong>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <aside className="h-fit rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-black text-slate-950">
              Résumé de la commande
            </h2>

            <div className="mt-6 flex justify-between text-slate-500">
              <span>Produits</span>
              <span>{items.length}</span>
            </div>

            <div className="mt-3 flex justify-between text-slate-500">
              <span>Sous-total</span>
              <span>{total.toFixed(2)} €</span>
            </div>

            <div className="mt-3 flex justify-between text-slate-500">
              <span>Livraison</span>
              <span>Calculée au paiement</span>
            </div>

            <div className="my-6 border-t border-slate-200" />

            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900">Total</span>

              <strong className="text-2xl font-black text-slate-950">
                {total.toFixed(2)} €
              </strong>
            </div>

            <Link
              href={`/${locale}/checkout`}
              className="mt-6 block w-full rounded-2xl bg-slate-950 px-5 py-4 text-center font-bold text-white shadow-lg transition hover:bg-blue-600"
            >
              Passer au paiement →
            </Link>

            <Link
              href={`/${locale}/shop`}
              className="mt-3 block text-center text-sm font-semibold text-slate-500 transition hover:text-blue-600"
            >
              ← Continuer mes achats
            </Link>

            <div className="mt-6 rounded-2xl bg-blue-50 p-4">
              <div className="flex gap-3">
                <span className="text-lg">🔒</span>

                <div>
                  <p className="text-sm font-bold text-slate-900">
                    Paiement sécurisé
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-600">
                    Vous serez redirigé vers l'étape de paiement après
                    validation de vos informations.
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
