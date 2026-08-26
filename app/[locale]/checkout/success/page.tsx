"use client";

import Link from "next/link";
import { use, useEffect } from "react";
import { saveCart } from "@/lib/cart";

export default function CheckoutSuccessPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);

  useEffect(() => {
    // Le paiement Stripe a réussi :
    // on vide le panier local du client.
    saveCart([]);
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-20">
      <div className="mx-auto max-w-2xl">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-12">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-4xl text-emerald-600">
            ✓
          </div>

          <p className="mt-8 text-sm font-bold uppercase tracking-widest text-blue-600">
            Folioga Shop
          </p>

          <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950">
            Merci pour votre commande !
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-slate-600">
            Votre paiement a bien été pris en compte. Nous allons préparer
            votre commande avec soin.
          </p>

          <div className="mt-8 rounded-2xl bg-slate-50 p-5 text-left">
            <div className="flex gap-3">
              <div className="text-xl">📦</div>

              <div>
                <h2 className="font-bold text-slate-900">
                  Votre commande est en préparation
                </h2>

                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Vous recevrez les informations de suivi dès que votre
                  commande sera expédiée.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href={`/${locale}/shop`}
              className="inline-flex items-center justify-center rounded-xl bg-slate-950 px-6 py-3.5 font-bold text-white transition hover:bg-blue-600"
            >
              Retour à la boutique
            </Link>

            <Link
              href={`/${locale}/repairs`}
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3.5 font-bold text-slate-700 transition hover:border-blue-300 hover:text-blue-600"
            >
              Besoin d'une réparation ?
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
