import ServiceCard from "@/components/ServiceCard";
import SearchBar from "@/components/SearchBar";

export default async function RepairsPage() {
  return (
    <main>
      <section className="bg-slate-950 py-16 text-white">
        <div className="page-container">
          <div className="max-w-3xl">
            <div className="badge-primary">
              🔧 Service de réparation
            </div>

            <h1 className="mt-5 text-4xl font-black md:text-6xl">
              Votre appareil ne fonctionne plus ?
            </h1>

            <p className="mt-5 text-lg leading-8 text-slate-300">
              Décrivez votre problème et trouvez rapidement un technicien
              qualifié.
            </p>
          </div>

          <div className="mt-8 max-w-3xl">
            <SearchBar placeholder="Ex : écran cassé, batterie, Mac qui ne démarre plus..." />
          </div>
        </div>
      </section>

      <section className="section-space">
        <div className="page-container">
          <h2 className="section-title">
            Quel appareil voulez-vous réparer ?
          </h2>

          <p className="section-subtitle">
            Sélectionnez une catégorie pour commencer.
          </p>

          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            <ServiceCard
              icon="📱"
              title="Smartphone"
              description="Écran, batterie, caméra, connecteur..."
              href="/fr/repairs/smartphone"
            />

            <ServiceCard
              icon="💻"
              title="Ordinateur"
              description="Mac, PC, Windows, logiciels et matériel."
              href="/fr/repairs/ordinateur"
            />

            <ServiceCard
              icon="📲"
              title="Tablette"
              description="Écran, batterie et problèmes logiciels."
              href="/fr/repairs/tablette"
            />

            <ServiceCard
              icon="🎮"
              title="Console"
              description="Réparation et diagnostic de consoles."
              href="/fr/repairs/console"
            />
          </div>
        </div>
      </section>
    </main>
  );
}
