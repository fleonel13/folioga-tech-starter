import Link from "next/link";
import { notFound } from "next/navigation";

const technicians = {
  "alexandre-martin": {
    name: "Alexandre Martin",
    specialty: "Réparation smartphones",
    location: "Strasbourg",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600",
    rating: 4.9,
    reviews: 182,
    price: 45,
    available: true,
    verified: true,
    experience: 8,
    description:
      "Technicien spécialisé dans la réparation de smartphones. J'interviens principalement sur les problèmes d'écran, de batterie, de connecteur et de caméra.",
    services: [
      "Remplacement d'écran",
      "Remplacement de batterie",
      "Réparation du connecteur de charge",
      "Réparation caméra",
      "Diagnostic complet",
    ],
  },

  "sarah-durand": {
    name: "Sarah Durand",
    specialty: "Mac & PC",
    location: "Paris",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600",
    rating: 4.8,
    reviews: 96,
    price: 55,
    available: true,
    verified: true,
    experience: 6,
    description:
      "Technicienne spécialisée dans les ordinateurs Mac et PC. Je vous accompagne pour les problèmes matériels, logiciels et les diagnostics.",
    services: [
      "Diagnostic ordinateur",
      "Installation système",
      "Réparation matériel",
      "Nettoyage et optimisation",
      "Récupération de données",
    ],
  },

  "thomas-bernard": {
    name: "Thomas Bernard",
    specialty: "Électronique",
    location: "Lyon",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600",
    rating: 4.7,
    reviews: 71,
    price: 40,
    available: false,
    verified: true,
    experience: 10,
    description:
      "Technicien expérimenté spécialisé dans le diagnostic et la réparation électronique de nombreux appareils.",
    services: [
      "Diagnostic électronique",
      "Réparation de cartes",
      "Soudure électronique",
      "Recherche de panne",
      "Maintenance",
    ],
  },
};

export default async function TechnicianProfilePage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;

  const technician =
    technicians[id as keyof typeof technicians];

  if (!technician) {
    notFound();
  }

  return (
    <main className="page-shell bg-slate-50">
      <section className="bg-slate-950 text-white">
        <div className="page-container py-14 sm:py-16">
          <Link
            href={`/${locale}/technicians`}
            className="text-sm font-bold text-slate-400 transition hover:text-white"
          >
            ← Retour aux techniciens
          </Link>

          <div className="mt-10 flex flex-col gap-8 md:flex-row md:items-center">
            <img
              src={technician.image}
              alt={technician.name}
              className="h-32 w-32 rounded-3xl border-4 border-white/10 object-cover shadow-2xl"
            />

            <div>
              <div className="flex flex-wrap items-center gap-3">
                {technician.verified && (
                  <span className="rounded-full bg-blue-500/15 px-3 py-1 text-xs font-bold text-blue-300">
                    ✓ Technicien vérifié
                  </span>
                )}

                {technician.available ? (
                  <span className="rounded-full bg-green-500/15 px-3 py-1 text-xs font-bold text-green-300">
                    ● Disponible
                  </span>
                ) : (
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-slate-400">
                    ● Indisponible
                  </span>
                )}
              </div>

              <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">
                {technician.name}
              </h1>

              <p className="mt-3 text-lg font-bold text-blue-400">
                {technician.specialty}
              </p>

              <p className="mt-2 text-slate-400">
                📍 {technician.location}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-space">
        <div className="page-container">
          <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
            <div className="space-y-8">
              <section className="surface p-6 sm:p-8">
                <h2 className="text-2xl font-black text-slate-950">
                  À propos
                </h2>

                <p className="mt-4 leading-8 text-slate-600">
                  {technician.description}
                </p>
              </section>

              <section className="surface p-6 sm:p-8">
                <h2 className="text-2xl font-black text-slate-950">
                  Services proposés
                </h2>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {technician.services.map((service) => (
                    <div
                      key={service}
                      className="rounded-xl bg-slate-50 p-4 font-semibold text-slate-700"
                    >
                      ✓ {service}
                    </div>
                  ))}
                </div>
              </section>

              <section className="surface p-6 sm:p-8">
                <h2 className="text-2xl font-black text-slate-950">
                  Avis clients
                </h2>

                <div className="mt-6 flex items-center gap-4">
                  <div className="text-4xl font-black text-slate-950">
                    {technician.rating}
                  </div>

                  <div>
                    <div className="text-xl tracking-wide text-yellow-500">
                      ★★★★★
                    </div>

                    <p className="mt-1 text-sm text-slate-500">
                      {technician.reviews} avis vérifiés
                    </p>
                  </div>
                </div>
              </section>
            </div>

            <aside className="h-fit lg:sticky lg:top-24">
              <div className="surface p-6 shadow-lg">
                <div className="text-sm font-bold uppercase tracking-widest text-slate-400">
                  Tarif
                </div>

                <div className="mt-2 text-4xl font-black text-slate-950">
                  {technician.price} €
                  <span className="text-base font-semibold text-slate-400">
                    {" "}
                    / heure
                  </span>
                </div>

                <div className="mt-6 space-y-3 border-t border-slate-200 pt-6">
                  <div className="flex justify-between">
                    <span className="text-slate-500">
                      Expérience
                    </span>
                    <strong>{technician.experience} ans</strong>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-500">
                      Note
                    </span>
                    <strong>⭐ {technician.rating}</strong>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-500">
                      Localisation
                    </span>
                    <strong>{technician.location}</strong>
                  </div>
                </div>

                <Link
                  href={`/${locale}/repairs`}
                  className="btn-primary mt-7 w-full"
                >
                  Demander une réparation
                </Link>

                <p className="mt-4 text-center text-xs leading-5 text-slate-400">
                  Vous pourrez préciser votre problème et vos besoins
                  avant de confirmer.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}
