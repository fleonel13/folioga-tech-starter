import ServiceCard from "@/components/ServiceCard";
import SearchBar from "@/components/SearchBar";

export default async function RepairsPage() {
  return (
    <main>

      <section className="bg-slate-950 py-16 text-white">
        <div className="container">

          <div className="max-w-3xl">

            <div className="badge badge-blue">
              🔧 Service de réparation
            </div>

            <h1 className="mt-5 text-4xl font-black md:text-6xl">
              Votre appareil ne fonctionne plus ?
            </h1>

            <p className="mt-5 text-lg leading-8 text-slate-300">
              Décrivez votre problème et trouvez rapidement un
              technicien qualifié.
            </p>

          </div>

          <div className="mt-8 max-w-3xl">
            <SearchBar placeholder="Ex : écran cassé, batterie, Mac qui ne démarre plus..." />
          </div>

        </div>
      </section>

      <section className="section">
        <div className="container">

          <h2 className="text-3xl font-black">
            Quel appareil voulez-vous réparer ?
          </h2>

          <p className="mt-2 text-slate-500">
            Sélectionnez une catégorie pour commencer.
          </p>

          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">

            <ServiceCard
              icon="📱"
              title="Smartphone"
              description="Écran, batterie, caméra, connecteur..."
              href="#"
            />

            <ServiceCard
              icon="💻"
              title="Ordinateur"
              description="Mac, PC, Windows, logiciels et matériel."
              href="#"
            />

            <ServiceCard
              icon="📲"
              title="Tablette"
              description="Écran, batterie et problèmes logiciels."
              href="#"
            />

            <ServiceCard
              icon="🎮"
              title="Console"
              description="Réparation et diagnostic de consoles."
              href="#"
            />

          </div>

        </div>
      </section>

    </main>
  );
}
