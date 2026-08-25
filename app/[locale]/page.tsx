import Link from "next/link";
import { products } from "@/lib/products";

const services = [
  {
    icon: "🔧",
    title: "Réparation",
    description:
      "Un appareil en panne ? Trouvez un technicien qualifié près de chez vous.",
    href: "/fr/repairs",
  },
  {
    icon: "♻️",
    title: "Reconditionnement",
    description:
      "Donnez une seconde vie à vos appareils grâce à notre expertise.",
    href: "/fr/shop",
  },
  {
    icon: "👨‍🔧",
    title: "Techniciens experts",
    description:
      "Des professionnels sélectionnés pour leur savoir-faire et leur sérieux.",
    href: "/fr/technicians",
  },
];

const testimonials = [
  {
    text: "Une réparation rapide, simple et professionnelle. Je recommande !",
    name: "Sophie M.",
    role: "Cliente Folioga-tech",
  },
  {
    text: "J'ai trouvé un technicien très compétent et mon téléphone fonctionne parfaitement.",
    name: "Thomas R.",
    role: "Client Folioga-tech",
  },
  {
    text: "Le concept du reconditionné est excellent. La qualité est au rendez-vous.",
    name: "Camille D.",
    role: "Cliente Folioga-tech",
  },
];

export default async function HomePage() {
  const featured = products.slice(0, 6);

  return (
    <div className="bg-slate-50">

      {/* HERO */}
      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div className="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="page-container relative grid min-h-[680px] items-center gap-14 py-20 lg:grid-cols-[1.05fr_0.95fr]">

          <div>
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-2 text-sm font-bold text-blue-300">
              <span>✦</span>
              La technologie mérite une seconde vie
            </div>

            <h1 className="max-w-4xl text-5xl font-black leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
              Réparez.
              <br />
              Reconditionnez.
              <br />
              <span className="text-blue-400">Recommencez.</span>
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
              Folioga-tech vous accompagne pour réparer, reconditionner et
              acheter des appareils électroniques de qualité.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/fr/repairs"
                className="rounded-xl bg-blue-600 px-7 py-4 text-center font-black transition hover:-translate-y-0.5 hover:bg-blue-500"
              >
                Trouver un technicien →
              </Link>

              <Link
                href="/fr/shop"
                className="rounded-xl border border-white/15 bg-white/5 px-7 py-4 text-center font-black transition hover:bg-white/10"
              >
                Découvrir la boutique
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm text-slate-400">
              <span>✓ Techniciens sélectionnés</span>
              <span>✓ Produits contrôlés</span>
              <span>✓ Paiement sécurisé</span>
            </div>
          </div>

          {/* HERO CARD */}
          <div className="relative">
            <div className="absolute inset-0 rounded-[2rem] bg-blue-600/20 blur-3xl" />

            <div className="relative rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur-xl sm:p-7">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-slate-400">
                    L'écosystème Folioga
                  </p>
                  <h2 className="mt-1 text-2xl font-black">
                    Une tech plus durable.
                  </h2>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-xl">
                  ⚡
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-white p-6 text-slate-950">
                  <div className="text-3xl">🔧</div>
                  <h3 className="mt-4 text-lg font-black">Réparer</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Prolongez la durée de vie de vos appareils.
                  </p>
                </div>

                <div className="rounded-2xl bg-blue-600 p-6">
                  <div className="text-3xl">♻️</div>
                  <h3 className="mt-4 text-lg font-black">Reconditionner</h3>
                  <p className="mt-2 text-sm leading-6 text-blue-100">
                    Une alternative économique et responsable.
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-800 p-6">
                  <div className="text-3xl">👨‍🔧</div>
                  <h3 className="mt-4 text-lg font-black">Experts</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    Des professionnels à votre service.
                  </p>
                </div>

                <div className="rounded-2xl bg-white p-6 text-slate-950">
                  <div className="text-3xl">🔒</div>
                  <h3 className="mt-4 text-lg font-black">Sécurisé</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Vos commandes et paiements protégés.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="page-container py-16 sm:py-20">
        <div className="grid overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm md:grid-cols-3">
          {[
            ["10k+", "Clients accompagnés"],
            ["500+", "Techniciens"],
            ["98%", "Clients satisfaits"],
          ].map(([number, label]) => (
            <div
              key={label}
              className="border-b border-slate-200 p-8 text-center last:border-0 md:border-b-0 md:border-r md:last:border-0"
            >
              <div className="text-4xl font-black text-slate-950 sm:text-5xl">
                {number}
              </div>
              <div className="mt-2 font-medium text-slate-500">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* SERVICES */}
      <section className="page-container section-space">
        <div className="max-w-2xl">
          <span className="text-sm font-black uppercase tracking-[0.18em] text-blue-600">
            Nos solutions
          </span>

          <h2 className="section-title mt-3">
            Tout ce qu'il faut pour votre technologie.
          </h2>

          <p className="section-subtitle">
            Une plateforme pensée pour simplifier la réparation, le
            reconditionnement et l'achat de matériel électronique.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {services.map((service) => (
            <Link
              key={service.title}
              href={service.href}
              className="group rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-2xl transition group-hover:bg-blue-600">
                {service.icon}
              </div>

              <h3 className="mt-6 text-xl font-black text-slate-950">
                {service.title}
              </h3>

              <p className="mt-3 leading-7 text-slate-600">
                {service.description}
              </p>

              <div className="mt-6 font-bold text-blue-600">
                Découvrir →
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* RECONDITIONNEMENT */}
      <section className="page-container pb-20">
        <div className="overflow-hidden rounded-[2rem] bg-slate-950 text-white">
          <div className="grid items-center gap-10 p-8 md:p-12 lg:grid-cols-2 lg:p-16">

            <div>
              <span className="text-sm font-black uppercase tracking-[0.18em] text-blue-400">
                Une seconde vie
              </span>

              <h2 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">
                Acheter autrement,
                <br />
                consommer mieux.
              </h2>

              <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
                Découvrez des appareils reconditionnés contrôlés avec soin,
                accessibles à un prix plus juste et pensés pour durer.
              </p>

              <Link
                href="/fr/shop"
                className="mt-8 inline-flex rounded-xl bg-white px-6 py-3.5 font-black text-slate-950 transition hover:bg-blue-50"
              >
                Explorer la boutique →
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-7">
                <div className="text-3xl">♻️</div>
                <div className="mt-5 text-xl font-black">Plus durable</div>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Prolongez la vie des équipements électroniques.
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-7">
                <div className="text-3xl">💰</div>
                <div className="mt-5 text-xl font-black">Plus accessible</div>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Une technologie de qualité à prix maîtrisé.
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-7">
                <div className="text-3xl">✓</div>
                <div className="mt-5 text-xl font-black">Contrôlé</div>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Des produits vérifiés avant leur mise en vente.
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-7">
                <div className="text-3xl">🚀</div>
                <div className="mt-5 text-xl font-black">Prêt à repartir</div>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Une nouvelle vie commence avec Folioga-tech.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* BOUTIQUE */}
      <section className="page-container section-space">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <span className="text-sm font-black uppercase tracking-[0.18em] text-blue-600">
              Boutique
            </span>

            <h2 className="section-title mt-3">
              Nos produits populaires.
            </h2>
          </div>

          <Link
            href="/fr/shop"
            className="font-black text-blue-600 hover:text-blue-700"
          >
            Voir toute la boutique →
          </Link>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((product) => (
            <Link
              key={product.id}
              href={`/fr/shop/${product.id}`}
              className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="aspect-square overflow-hidden bg-slate-100">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
              </div>

              <div className="p-6">
                <div className="text-xs font-black uppercase tracking-wider text-blue-600">
                  {product.category}
                </div>

                <h3 className="mt-2 font-black text-slate-950">
                  {product.name}
                </h3>

                <div className="mt-4 text-xl font-black text-slate-950">
                  {product.price} €
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* TEMOIGNAGES */}
      <section className="bg-white">
        <div className="page-container section-space">
          <div className="text-center">
            <span className="text-sm font-black uppercase tracking-[0.18em] text-blue-600">
              Ils nous font confiance
            </span>

            <h2 className="section-title mt-3">
              Ce que pensent nos clients.
            </h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.name}
                className="rounded-3xl border border-slate-200 bg-slate-50 p-7"
              >
                <div className="text-lg tracking-widest text-amber-500">
                  ★★★★★
                </div>

                <p className="mt-5 leading-7 text-slate-600">
                  "{testimonial.text}"
                </p>

                <div className="mt-6">
                  <div className="font-black text-slate-950">
                    {testimonial.name}
                  </div>

                  <div className="mt-1 text-sm text-slate-500">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="page-container py-16 sm:py-20">
        <div className="relative overflow-hidden rounded-[2rem] bg-blue-600 p-8 text-white md:p-12 lg:p-16">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

          <div className="relative max-w-3xl">
            <span className="text-sm font-black uppercase tracking-[0.18em] text-blue-100">
              Besoin d'aide ?
            </span>

            <h2 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">
              Votre appareil mérite une seconde chance.
            </h2>

            <p className="mt-5 max-w-2xl text-lg leading-8 text-blue-100">
              Décrivez votre problème et trouvez rapidement la solution
              adaptée à votre appareil.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/fr/repairs"
                className="rounded-xl bg-white px-6 py-4 text-center font-black text-blue-700 transition hover:bg-blue-50"
              >
                Demander une réparation
              </Link>

              <Link
                href="/fr/technicians"
                className="rounded-xl border border-white/30 px-6 py-4 text-center font-black transition hover:bg-white/10"
              >
                Voir les techniciens
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}