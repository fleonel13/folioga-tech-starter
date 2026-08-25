import Link from "next/link";

export default function Footer({ locale }: { locale: string }) {
  return (
    <footer className="mt-20 bg-slate-950 text-white">
      <div className="container py-14">

        <div className="grid gap-10 md:grid-cols-4">

          <div>
            <div className="text-xl font-black">Folioga-tech</div>
            <p className="mt-3 text-sm leading-6 text-slate-400">
              La marketplace dédiée à la réparation, aux techniciens
              et au matériel reconditionné.
            </p>
          </div>

          <div>
            <h3 className="font-bold">Services</h3>
            <div className="mt-4 space-y-3 text-sm text-slate-400">
              <Link href={`/${locale}/repairs`} className="block hover:text-white">
                Réparations
              </Link>
              <Link href={`/${locale}/technicians`} className="block hover:text-white">
                Techniciens
              </Link>
              <Link href={`/${locale}/shop`} className="block hover:text-white">
                Boutique
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-bold">Entreprise</h3>
            <div className="mt-4 space-y-3 text-sm text-slate-400">
              <p>À propos</p>
              <p>Contact</p>
              <p>Devenir technicien</p>
            </div>
          </div>

          <div>
            <h3 className="font-bold">Besoin d'aide ?</h3>
            <p className="mt-4 text-sm leading-6 text-slate-400">
              Notre équipe est disponible pour vous accompagner.
            </p>

            <button className="btn btn-primary mt-4">
              Contacter Folioga
            </button>
          </div>

        </div>

        <div className="mt-12 border-t border-slate-800 pt-6 text-sm text-slate-500">
          © {new Date().getFullYear()} Folioga-tech. Tous droits réservés.
        </div>

      </div>
    </footer>
  );
}
