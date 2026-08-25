import Link from 'next/link';

type Technician = {
  id: number;
  name: string;
  city: string;
  speciality: string;
  rating: number;
  reviews: number;
  price: number;
  experience: number;
  emoji: string;
  verified: boolean;
};

export default function TechnicianCard({
  technician,
}: {
  technician: Technician;
}) {
  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <div className="bg-slate-950 px-6 py-8 text-center">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-white text-5xl">
          {technician.emoji}
        </div>

        {technician.verified && (
          <div className="mt-4 inline-flex rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-400">
            ✓ Technicien vérifié
          </div>
        )}
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-slate-950">
          {technician.name}
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          📍 {technician.city}
        </p>

        <p className="mt-4 font-semibold text-emerald-600">
          {technician.speciality}
        </p>

        <div className="mt-4 flex items-center gap-2 text-sm">
          <span className="text-yellow-500">★★★★★</span>
          <strong>{technician.rating}</strong>
          <span className="text-slate-400">
            ({technician.reviews} avis)
          </span>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 border-y border-slate-100 py-4 text-sm">
          <div>
            <p className="text-slate-400">Expérience</p>
            <p className="mt-1 font-bold">{technician.experience} ans</p>
          </div>

          <div>
            <p className="text-slate-400">À partir de</p>
            <p className="mt-1 font-bold">{technician.price} €</p>
          </div>
        </div>

        <Link
          href={`/fr/technicians/${technician.id}`}
          className="mt-5 block rounded-xl bg-slate-950 px-4 py-3 text-center font-semibold text-white hover:bg-emerald-600"
        >
          Voir le profil
        </Link>
      </div>
    </article>
  );
}
