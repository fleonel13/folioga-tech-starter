const stats = [
  {
    label: "Réparations",
    value: "0",
    icon: "🔧",
  },
  {
    label: "Commandes",
    value: "0",
    icon: "📦",
  },
  {
    label: "Favoris",
    value: "0",
    icon: "❤️",
  },
  {
    label: "Messages",
    value: "0",
    icon: "💬",
  },
];

export default function DashboardPage() {
  return (
    <main className="section">
      <div className="container">

        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">

          <div>
            <div className="text-sm font-bold text-blue-600">
              MON ESPACE
            </div>

            <h1 className="mt-2 text-4xl font-black">
              Bienvenue 👋
            </h1>

            <p className="mt-2 text-slate-500">
              Gérez vos réparations, commandes et informations personnelles.
            </p>
          </div>

          <button className="btn btn-dark">
            Modifier mon profil
          </button>

        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

          {stats.map((stat) => (
            <div key={stat.label} className="card p-5">

              <div className="flex items-center justify-between">
                <span className="text-2xl">
                  {stat.icon}
                </span>

                <span className="text-3xl font-black">
                  {stat.value}
                </span>
              </div>

              <div className="mt-4 font-semibold text-slate-500">
                {stat.label}
              </div>

            </div>
          ))}

        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">

          <section className="card p-6">
            <h2 className="text-xl font-black">
              Activité récente
            </h2>

            <div className="py-12 text-center text-sm text-slate-400">
              Aucune activité pour le moment.
            </div>
          </section>

          <section className="card p-6">
            <h2 className="text-xl font-black">
              Actions rapides
            </h2>

            <div className="mt-5 grid gap-3">

              <button className="btn btn-secondary justify-start">
                🔧 Demander une réparation
              </button>

              <button className="btn btn-secondary justify-start">
                👨‍🔧 Trouver un technicien
              </button>

              <button className="btn btn-secondary justify-start">
                🛒 Explorer la boutique
              </button>

            </div>
          </section>

        </div>

      </div>
    </main>
  );
}
