const categories = [
  ['📱', 'Smartphone', 'Écrans, batteries, connecteurs...'],
  ['💻', 'Ordinateur', 'Mac, PC, composants...'],
  ['🎮', 'Console', 'PlayStation, Xbox, Nintendo...'],
  ['⌚', 'Objets connectés', 'Montres, écouteurs...'],
  ['📺', 'TV', 'Écrans et électronique...'],
  ['🔌', 'Autres appareils', 'Tous vos équipements...'],
];

export default function Categories() {
  return (
    <section className="bg-slate-50 py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="font-semibold text-emerald-600">RÉPARATION</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Quel appareil voulez-vous réparer ?
          </h2>
          <p className="mt-4 text-slate-600">
            Choisissez votre appareil et trouvez rapidement le service adapté.
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map(([icon, title, description]) => (
            <div
              key={title}
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="text-4xl">{icon}</div>
              <h3 className="mt-5 text-xl font-bold text-slate-950">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                {description}
              </p>
              <div className="mt-5 font-semibold text-emerald-600">
                Trouver un technicien →
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
