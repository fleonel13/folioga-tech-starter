"use client";

import Link from "next/link";

export default function PaymentSuccessPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-lg rounded-2xl border bg-white p-8 text-center shadow-sm">
        <div className="mb-4 text-5xl">✅</div>

        <h1 className="text-2xl font-bold">
          Paiement effectué
        </h1>

        <p className="mt-3 text-gray-600">
          Votre paiement a bien été transmis à Stripe.
          Le statut du paiement sera confirmé automatiquement.
        </p>

        <Link
          href="/dashboard"
          className="mt-6 inline-block rounded-lg bg-black px-5 py-3 text-white"
        >
          Retour au tableau de bord
        </Link>
      </div>
    </main>
  );
}
