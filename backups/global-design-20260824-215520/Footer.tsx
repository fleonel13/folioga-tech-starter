import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-200 bg-slate-950 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">

        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">

          <div className="lg:col-span-1">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-lg text-white">
                ⚡
              </div>

              <div>
                <div className="text-xl font-black text-white">
                  Folioga<span className="text-blue-400">Tech</span>
                </div>

                <div className="text-xs text-slate-500">
                  Donner une seconde vie à la technologie
                </div>
              </div>
            </div>

            <p className="mt-5 max-w-sm text-sm leading-6 text-slate-400">
              Réparation, reconditionnement et accompagnement
              par des professionnels pour une technologie
              plus durable.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-white">
              Services
            </h3>

            <div className="mt-4 flex flex-col gap-3 text-sm">
              <Link href="/fr/repairs" className="hover:text-white">
                Réparer un appareil
              </Link>

              <Link href="/fr/technicians" className="hover:text-white">
                Trouver un technicien
              </Link>

              <Link href="/fr/shop" className="hover:text-white">
                Produits reconditionnés
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-white">
              Plateforme
            </h3>

            <div className="mt-4 flex flex-col gap-3 text-sm">
              <Link href="/fr/dashboard" className="hover:text-white">
                Mon espace
              </Link>

              <Link href="/fr/cart" className="hover:text-white">
                Mon panier
              </Link>

              <Link href="/fr/shop" className="hover:text-white">
                Boutique
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-white">
              Notre mission
            </h3>

            <p className="mt-4 text-sm leading-6 text-slate-400">
              ♻️ Réduire les déchets électroniques.
              <br />
              🔧 Encourager la réparation.
              <br />
              🌍 Connecter les meilleurs techniciens.
            </p>
          </div>

        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-slate-800 pt-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} Folioga-Tech.
            Tous droits réservés.
          </p>

          <div className="flex gap-5">
            <span>🔒 Paiement sécurisé</span>
            <span>♻️ Technologie durable</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
