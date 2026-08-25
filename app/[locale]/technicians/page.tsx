import SearchBar from "@/components/SearchBar";
import TechnicianGrid from "@/components/TechnicianGrid";

const technicians = [
  {
    id: "alexandre-martin",
    name: "Alexandre Martin",
    specialty: "Réparation smartphones",
    location: "Strasbourg",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
    rating: 4.9,
    reviews: 182,
    price: 45,
    available: true,
    verified: true,
    experience: 8,
  },
  {
    id: "sarah-durand",
    name: "Sarah Durand",
    specialty: "Mac & PC",
    location: "Paris",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
    rating: 4.8,
    reviews: 96,
    price: 55,
    available: true,
    verified: true,
    experience: 6,
  },
  {
    id: "thomas-bernard",
    name: "Thomas Bernard",
    specialty: "Électronique",
    location: "Lyon",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    rating: 4.7,
    reviews: 71,
    price: 40,
    available: false,
    verified: true,
    experience: 10,
  },
];

export default async function TechniciansPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <main className="page-shell">
      {/* HERO */}
      <section className="border-b border-slate-200 bg-white">
        <div className="page-container py-14 sm:py-16 lg:py-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-widest text-blue-700 ring-1 ring-blue-100">
              Réseau Folioga
            </div>

            <h1 className="mt-5 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Trouvez le bon technicien.
            </h1>

            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
              Des professionnels vérifiés pour réparer vos appareils
              rapidement et en toute confiance.
            </p>
          </div>

          {/* SEARCH */}
          <div className="mt-8 max-w-3xl">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-2 shadow-sm">
              <SearchBar
                placeholder="Rechercher une spécialité ou une ville..."
              />
            </div>
          </div>

          {/* TRUST ITEMS */}
          <div className="mt-8 flex flex-wrap gap-3">
            <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm">
              ✓ Techniciens vérifiés
            </div>

            <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm">
              ★ Avis vérifiés
            </div>

            <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm">
              🔧 Experts spécialisés
            </div>
          </div>
        </div>
      </section>

      {/* TECHNICIENS */}
      <section className="section-space">
        <div className="page-container">
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="text-sm font-bold uppercase tracking-widest text-blue-600">
                Professionnels
              </div>

              <h2 className="section-title mt-2">
                Techniciens recommandés
              </h2>

              <p className="section-subtitle">
                Les meilleurs professionnels disponibles sur Folioga-Tech.
              </p>
            </div>

            <div className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-bold text-slate-600">
              {technicians.length} professionnels
            </div>
          </div>

          <TechnicianGrid
            technicians={technicians}
            locale={locale}
          />
        </div>
      </section>

      {/* CTA */}
      <section className="pb-16">
        <div className="page-container">
          <div className="overflow-hidden rounded-3xl bg-slate-950 px-6 py-10 text-white shadow-xl sm:px-10 lg:px-14">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <div className="text-sm font-bold uppercase tracking-widest text-blue-400">
                  Besoin d'aide ?
                </div>

                <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
                  Vous ne savez pas quel technicien choisir ?
                </h2>

                <p className="mt-4 leading-7 text-slate-400">
                  Décrivez votre problème et trouvez le professionnel
                  adapté à votre appareil.
                </p>
              </div>

              <a
                href={`/${locale}/repairs`}
                className="inline-flex shrink-0 items-center justify-center rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-500"
              >
                Demander une réparation →
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
