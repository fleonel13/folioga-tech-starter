"use client";

import Link from "next/link";

export default function PaymentCancelledPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-lg rounded-2xl border bg-white p-8 text-center shadow-sm">
        <div className="mb-4 text-5xl">↩️</div>

        <h1 className="text-2xl font-bold">
          Paiement annulé
        </h1>

        <p className="mt-3 text-gray-600">
          Le paiement n'a pas été effectué.
          Aucun paiement n'a été confirmé.
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
