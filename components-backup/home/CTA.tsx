import Link from 'next/link';

export default function CTA() {
  return (
    <section className="bg-emerald-500">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-center">
          <div>
            <h2 className="text-3xl font-bold text-slate-950 sm:text-4xl">
              Votre appareil mérite une seconde vie.
            </h2>
            <p className="mt-3 max-w-2xl text-slate-800">
              Commencez votre réparation ou découvrez notre sélection de
              matériel reconditionné.
            </p>
          </div>

          <Link
            href="/fr/repairs"
            className="shrink-0 rounded-xl bg-slate-950 px-6 py-3 text-center font-semibold text-white hover:bg-slate-800"
          >
            Commencer
          </Link>
        </div>
      </div>
    </section>
  );
}
