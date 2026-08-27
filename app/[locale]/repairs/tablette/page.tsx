import Link from "next/link";

const problems = [
  {
    title: "Écran cassé",
    description: "Écran fissuré, noir ou tactile qui ne répond plus.",
    icon: "📲",
  },
  {
    title: "Batterie",
    description: "Batterie qui se décharge rapidement ou ne charge plus.",
    icon: "🔋",
  },
  {
    title: "Charge",
    description: "Problème de connecteur ou tablette qui ne charge plus.",
    icon: "🔌",
  },
  {
    title: "Écran tactile",
    description: "Zones qui ne répondent plus ou tactile imprécis.",
    icon: "👆",
  },
  {
    title: "Logiciel",
    description: "Tablette bloquée, lente ou problème de système.",
    icon: "⚙️",
  },
  {
    title: "Autre problème",
    description: "Décrivez votre problème pour obtenir de l'aide.",
    icon: "🔧",
  },
];

export default function TabletRepairsPage() {
  return (
    <main>
      <section className="bg-slate-950 py-16 text-white">
        <div className="page-container">
          <Link
            href="/fr/repairs"
            className="text-sm font-bold text-blue-300 hover:text-white"
          >
            ← Retour aux réparations
          </Link>

          <div className="mt-8 max-w-3xl">
            <div className="badge-primary">
              📲 Réparation tablette
            </div>

            <h1 className="mt-5 text-4xl font-black md:text-6xl">
              Quel est le problème avec votre tablette ?
            </h1>

            <p className="mt-5 text-lg leading-8 text-slate-300">
              Sélectionnez le problème rencontré pour trouver rapidement
              la solution adaptée.
            </p>
          </div>
        </div>
      </section>

      <section className="section-space">
        <div className="page-container">
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {problems.map((problem) => (
              <div
                key={problem.title}
                className="surface-hover p-6"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-3xl">
                  {problem.icon}
                </div>

                <h2 className="mt-5 text-xl font-black text-slate-950">
                  {problem.title}
                </h2>

                <p className="mt-2 leading-6 text-slate-600">
                  {problem.description}
                </p>

                <Link
                  href={`/fr/repairs/request?device=Tablette&problem=${encodeURIComponent(problem.title)}`}
                  className="mt-6 inline-flex font-bold text-blue-600 hover:text-blue-700"
                >
                  Trouver un technicien →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="page-container pb-20">
        <div className="rounded-3xl bg-blue-600 p-8 text-white md:p-12">
          <h2 className="text-3xl font-black">
            Vous ne trouvez pas votre problème ?
          </h2>

          <p className="mt-4 max-w-2xl text-blue-100">
            Décrivez simplement la panne de votre tablette et un technicien
            pourra vous orienter.
          </p>

          <Link
            href="/fr/repairs/request?device=Tablette&problem=Autre%20probl%C3%A8me"
            className="mt-7 inline-flex rounded-xl bg-white px-6 py-3 font-black text-blue-700 hover:bg-blue-50"
          >
            Trouver un technicien
          </Link>
        </div>
      </section>
    </main>
  );
}
