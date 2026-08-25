import SearchBar from "@/components/SearchBar";
import TechnicianGrid from "@/components/TechnicianGrid";

const technicians = [
  {
    id: "alexandre-martin",
    name: "Alexandre Martin",
    specialty: "Réparation smartphones",
    location: "Strasbourg",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
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
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
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
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
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
    <main>

      <section className="bg-blue-600 py-16 text-white">
        <div className="container">

          <div className="max-w-3xl">
            <div className="text-sm font-bold uppercase tracking-widest text-blue-200">
              Réseau Folioga
            </div>

            <h1 className="mt-4 text-4xl font-black md:text-6xl">
              Trouvez le bon technicien.
            </h1>

            <p className="mt-5 text-lg leading-8 text-blue-100">
              Des professionnels vérifiés pour réparer vos appareils
              rapidement et en toute confiance.
            </p>
          </div>

          <div className="mt-8 max-w-3xl">
            <SearchBar placeholder="Rechercher une spécialité ou une ville..." />
          </div>

        </div>
      </section>

      <section className="section">
        <div className="container">

          <div className="mb-8">
            <h2 className="text-3xl font-black">
              Techniciens recommandés
            </h2>

            <p className="mt-2 text-slate-500">
              Les meilleurs professionnels disponibles sur Folioga-tech.
            </p>
          </div>

          <TechnicianGrid
            technicians={technicians}
            locale={locale}
          />

        </div>
      </section>

    </main>
  );
}
