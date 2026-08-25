import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32">
        <div className="max-w-3xl">
          <div className="mb-6 inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300">
            ♻️ La technologie mérite une seconde vie
          </div>

          <h1 className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
            Réparez.
            <span className="block text-emerald-400">
              Reconditionnez.
            </span>
            Recommencez.
          </h1>

          <p className="mt-8 max-w-2xl text-lg leading-8 text-slate-300">
            Trouvez un technicien qualifié, faites réparer vos appareils et
            découvrez du matériel reconditionné près de chez vous.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/fr/repairs"
              className="rounded-xl bg-emerald-500 px-6 py-3 font-semibold text-slate-950 hover:bg-emerald-400"
            >
              Trouver une réparation
            </Link>

            <Link
              href="/fr/shop"
              className="rounded-xl border border-white/20 px-6 py-3 font-semibold text-white hover:bg-white/10"
            >
              Voir la boutique
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
