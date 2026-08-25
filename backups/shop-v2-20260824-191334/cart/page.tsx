export default function CartPage() {
  return (
    <main className="section">
      <div className="container">

        <div className="mb-10">
          <div className="text-sm font-bold text-blue-600">
            FOLIOGA-TECH
          </div>

          <h1 className="mt-2 text-4xl font-black">
            Votre panier
          </h1>

          <p className="mt-2 text-slate-500">
            Vérifiez votre commande avant le paiement.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">

          <div className="card p-6">
            <div className="flex items-center justify-center py-16 text-center">
              <div>
                <div className="text-5xl">🛒</div>

                <h2 className="mt-5 text-xl font-black">
                  Votre panier est vide
                </h2>

                <p className="mt-2 text-slate-500">
                  Ajoutez des produits depuis notre boutique.
                </p>
              </div>
            </div>
          </div>

          <aside className="card h-fit p-6">

            <h2 className="text-xl font-black">
              Résumé
            </h2>

            <div className="mt-6 space-y-3 border-b border-slate-100 pb-5 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">
                  Sous-total
                </span>
                <strong>0,00 €</strong>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-500">
                  Livraison
                </span>
                <strong>—</strong>
              </div>
            </div>

            <div className="mt-5 flex justify-between text-lg font-black">
              <span>Total</span>
              <span>0,00 €</span>
            </div>

            <button
              disabled
              className="btn mt-6 w-full bg-slate-200 text-slate-400"
            >
              Passer au paiement
            </button>

          </aside>

        </div>

      </div>
    </main>
  );
}
