import Link from "next/link";

const problems = [
  {
    title: "Écran",
    description: "Écran noir, cassé, scintillant ou problème d'affichage.",
    icon: "🖥️",
  },
  {
    title: "Batterie",
    description: "Ordinateur portable qui ne tient plus la charge.",
    icon: "🔋",
  },
  {
    title: "Démarrage",
    description: "PC ou Mac qui ne démarre plus correctement.",
    icon: "⚡",
  },
  {
    title: "Lenteur",
    description: "Ordinateur lent, qui bloque ou qui chauffe beaucoup.",
    icon: "🐢",
  },
  {
    title: "Logiciel",
    description: "Windows, macOS, virus ou problème de programme.",
    icon: "⚙️",
  },
  {
    title: "Matériel",
    description: "Clavier, disque dur, mémoire ou autre composant.",
    icon: "🔧",
  },
];

export default function ComputerRepairsPage() {
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
              💻 Réparation ordinateur
            </div>

            <h1 className="mt-5 text-4xl font-black md:text-6xl">
              Quel est le problème avec votre ordinateur ?
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
                  href={`/fr/repairs/request?device=Ordinateurhref="/fr/technicians"problem=${encodeURIComponent(problem.title)}`}
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
            Décrivez simplement la panne de votre ordinateur et un technicien
            pourra vous orienter.
          </p>

          <Link
            href="/fr/repairs/request?device=Ordinateur&problem=Autre%20probl%C3%A8me"
            className="mt-7 inline-flex rounded-xl bg-white px-6 py-3 font-black text-blue-700 hover:bg-blue-50"
          >
            Trouver un technicien
          </Link>
        </div>
      </section>
    </main>
  );
}
