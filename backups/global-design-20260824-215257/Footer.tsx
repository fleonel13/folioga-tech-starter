import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-20 bg-slate-950 text-slate-300">
      <div className="container-page py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="text-xl font-black text-white">
              Folioga<span className="text-blue-400">-tech</span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-7 text-slate-400">
              Réparation, reconditionnement et expertise technologique
              accessibles partout.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-white">Services</h3>
            <div className="mt-4 grid gap-3 text-sm">
              <Link href="/fr/repairs" className="hover:text-white">
                Réparations
              </Link>
              <Link href="/fr/technicians" className="hover:text-white">
                Techniciens
              </Link>
              <Link href="/fr/shop" className="hover:text-white">
                Boutique
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-white">Entreprise</h3>
            <div className="mt-4 grid gap-3 text-sm">
              <span>À propos</span>
              <span>Nous contacter</span>
              <span>Confidentialité</span>
              <span>Conditions</span>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-white">Pourquoi Folioga-tech ?</h3>
            <div className="mt-4 grid gap-3 text-sm">
              <span>✓ Techniciens vérifiés</span>
              <span>✓ Produits contrôlés</span>
              <span>✓ Paiement sécurisé</span>
              <span>✓ Support client</span>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-800 pt-6 text-sm text-slate-500">
          © {new Date().getFullYear()} Folioga-tech. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
}
