const steps = [
  ['01', 'Décrivez votre problème', 'Expliquez simplement ce qui ne fonctionne plus.'],
  ['02', 'Trouvez un technicien', 'Comparez les professionnels et leurs avis.'],
  ['03', 'Faites réparer', 'Organisez votre réparation localement ou à distance.'],
];

export default function HowItWorks() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center">
          <p className="font-semibold text-emerald-600">SIMPLE ET RAPIDE</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-950 sm:text-4xl">
            Comment ça marche ?
          </h2>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {steps.map(([number, title, description]) => (
            <div key={number} className="relative rounded-2xl bg-slate-50 p-8">
              <div className="text-sm font-bold text-emerald-600">{number}</div>
              <h3 className="mt-4 text-xl font-bold text-slate-950">
                {title}
              </h3>
              <p className="mt-3 leading-7 text-slate-600">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
