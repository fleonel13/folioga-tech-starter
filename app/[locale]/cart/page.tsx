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

          <h1 className="mt-5 text-3xl font-black">
            Votre panier est vide
          </h1>

          <p className="mt-3 text-slate-500">
            Découvrez nos produits reconditionnés.
          </p>

          <Link
            href={`/${locale}/shop`}
            className="mt-7 inline-block rounded-xl bg-slate-950 px-6 py-4 font-bold text-white hover:bg-blue-600"
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

          <h1 className="mt-2 text-4xl font-black">
            Votre panier
          </h1>
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
                  className="h-28 w-28 rounded-2xl object-cover"
                />

                <div className="min-w-0 flex-1">
                  <div className="flex justify-between gap-3">
                    <div>
                      <h2 className="font-bold text-slate-950">
                        {item.name}
                      </h2>

                      <p className="mt-1 text-sm text-slate-500">
                        {item.condition}
                      </p>
                    </div>

                    <button
                      onClick={() => remove(item.id)}
                      className="text-sm font-semibold text-red-500 hover:text-red-700"
                    >
                      Supprimer
                    </button>
                  </div>

                  <div className="mt-5 flex items-center justify-between">
                    <div className="flex items-center rounded-xl border border-slate-200">
                      <button
                        onClick={() =>
                          changeQuantity(item.id, item.quantity - 1)
                        }
                        className="px-4 py-2"
                      >
                        −
                      </button>

                      <span className="px-3 font-bold">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() =>
                          changeQuantity(item.id, item.quantity + 1)
                        }
                        className="px-4 py-2"
                      >
                        +
                      </button>
                    </div>

                    <strong className="text-xl">
                      {(item.price * item.quantity).toFixed(2)} €
                    </strong>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <aside className="h-fit rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-black">Résumé</h2>

            <div className="mt-6 flex justify-between text-slate-500">
              <span>Sous-total</span>
              <span>{total.toFixed(2)} €</span>
            </div>

            <div className="mt-3 flex justify-between text-slate-500">
              <span>Livraison</span>
              <span>Calculée au paiement</span>
            </div>

            <div className="my-6 border-t border-slate-200" />

            <div className="flex justify-between">
              <span className="font-bold">Total</span>
              <strong className="text-2xl">{total.toFixed(2)} €</strong>
            </div>

            <button
              className="mt-6 w-full rounded-2xl bg-slate-950 px-5 py-4 font-bold text-white hover:bg-blue-600"
              onClick={() => alert("Paiement Stripe à connecter.")}
            >
              Passer au paiement
            </button>

            <Link
              href={`/${locale}/shop`}
              className="mt-3 block text-center text-sm font-semibold text-slate-500 hover:text-blue-600"
            >
              Continuer mes achats
            </Link>
          </aside>
        </div>
      </div>
    </main>
  );
}
