import Link from "next/link";
import { products } from "@/lib/products";

export default async function HomePage() {
  const featured = products.slice(0, 6);

  return (
    <main>
      <section className="overflow-hidden bg-slate-950 text-white">
        <div className="container-page grid min-h-[620px] items-center gap-12 py-20 lg:grid-cols-2">
          <div>
            <div className="mb-6 inline-flex rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-2 text-sm font-bold text-blue-300">
              La technologie mérite une seconde vie
            </div>

            <h1 className="max-w-3xl text-5xl font-black tracking-tight md:text-6xl lg:text-7xl">
              Réparez.
              <br />
              Reconditionnez.
              <br />
              <span className="text-blue-400">Recommencez.</span>
            </h1>

            <p className="mt-7 max-w-xl text-lg leading-8 text-slate-300">
              Trouvez un technicien qualifié, réparez vos appareils et
              découvrez du matériel reconditionné contrôlé.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/fr/repairs"
                className="rounded-xl bg-blue-600 px-6 py-4 text-center font-bold text-white hover:bg-blue-500"
              >
                Trouver un technicien
              </Link>

              <Link
                href="/fr/shop"
                className="rounded-xl border border-slate-700 bg-white/5 px-6 py-4 text-center font-bold text-white hover:bg-white/10"
              >
                Découvrir la boutique
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-10 rounded-full bg-blue-600/20 blur-3xl" />

            <div className="relative rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-white p-6 text-slate-950">
                  <div className="text-3xl">🔧</div>
                  <div className="mt-4 text-xl font-black">
                    Réparation
                  </div>
                  <p className="mt-2 text-sm text-slate-500">
                    Locale ou à distance.
                  </p>
                </div>

                <div className="rounded-2xl bg-blue-600 p-6">
                  <div className="text-3xl">♻️</div>
                  <div className="mt-4 text-xl font-black">
                    Reconditionné
                  </div>
                  <p className="mt-2 text-sm text-blue-100">
                    Contrôlé et prêt à repartir.
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-800 p-6">
                  <div className="text-3xl">👨‍🔧</div>
                  <div className="mt-4 text-xl font-black">
                    Experts
                  </div>
                  <p className="mt-2 text-sm text-slate-400">
                    Des techniciens sélectionnés.
                  </p>
                </div>

                <div className="rounded-2xl bg-white p-6 text-slate-950">
                  <div className="text-3xl">🔒</div>
                  <div className="mt-4 text-xl font-black">
                    Sécurisé
                  </div>
                  <p className="mt-2 text-sm text-slate-500">
                    Paiement et commandes protégés.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-page py-20">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            ["10k+", "Clients accompagnés"],
            ["500+", "Techniciens"],
            ["98%", "Clients satisfaits"],
          ].map(([number, label]) => (
            <div
              key={label}
              className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
            >
              <div className="text-4xl font-black text-slate-950">
                {number}
              </div>
              <div className="mt-2 text-slate-500">{label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="container-page pb-20">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <span className="text-sm font-black uppercase tracking-wider text-blue-600">
              Boutique
            </span>
            <h2 className="mt-2 text-4xl font-black tracking-tight text-slate-950">
              Les produits populaires
            </h2>
          </div>

          <Link
            href="/fr/shop"
            className="font-bold text-blue-600 hover:text-blue-700"
          >
            Voir toute la boutique →
          </Link>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((product) => (
            <Link
              key={product.id}
              href={`/fr/shop/${product.id}`}
              className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="aspect-square overflow-hidden bg-slate-100">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
              </div>

              <div className="p-5">
                <div className="text-xs font-bold uppercase text-blue-600">
                  {product.category}
                </div>
                <h3 className="mt-2 font-black text-slate-950">
                  {product.name}
                </h3>
                <div className="mt-4 text-xl font-black">
                  {product.price} €
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="container-page pb-20">
        <div className="rounded-3xl bg-blue-600 p-8 text-white md:p-12">
          <div className="max-w-3xl">
            <div className="text-sm font-black uppercase tracking-wider text-blue-100">
              Besoin d'aide ?
            </div>
            <h2 className="mt-3 text-3xl font-black md:text-4xl">
              Votre appareil a un problème ?
            </h2>
            <p className="mt-4 leading-7 text-blue-100">
              Décrivez votre problème et trouvez rapidement un technicien
              capable de vous accompagner.
            </p>
            <Link
              href="/fr/repairs"
              className="mt-7 inline-flex rounded-xl bg-white px-6 py-3 font-black text-blue-700 hover:bg-blue-50"
            >
              Demander une réparation
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
