import Link from "next/link";
import Rating from "./Rating";
import Badge from "./Badge";

export type Technician = {
  id: string;
  name: string;
  specialty: string;
  location: string;
  image: string;
  rating: number;
  reviews: number;
  price: number;
  available: boolean;
  verified: boolean;
  experience: number;
};

export default function TechnicianCard({
  technician,
  locale,
}: {
  technician: Technician;
  locale: string;
}) {
  return (
    <article className="card overflow-hidden transition hover:-translate-y-1 hover:shadow-xl">

      <div className="h-24 bg-gradient-to-r from-blue-600 to-indigo-600" />

      <div className="-mt-12 px-5">

        <div className="flex items-end justify-between">

          <img
            src={technician.image}
            alt={technician.name}
            className="h-24 w-24 rounded-2xl border-4 border-white bg-slate-200 object-cover shadow"
          />

          {technician.verified && (
            <Badge type="blue">✓ Vérifié</Badge>
          )}

        </div>

        <div className="pb-5 pt-4">

          <h3 className="text-xl font-black text-slate-900">
            {technician.name}
          </h3>

          <p className="mt-1 font-semibold text-blue-600">
            {technician.specialty}
          </p>

          <p className="mt-2 text-sm text-slate-500">
            📍 {technician.location}
          </p>

          <div className="mt-4">
            <Rating
              rating={technician.rating}
              reviews={technician.reviews}
            />
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">

            <div className="rounded-xl bg-slate-50 p-3">
              <div className="font-black text-slate-900">
                {technician.experience} ans
              </div>
              <div className="text-slate-500">
                expérience
              </div>
            </div>

            <div className="rounded-xl bg-slate-50 p-3">
              <div className="font-black text-slate-900">
                {technician.price} €/h
              </div>
              <div className="text-slate-500">
                tarif moyen
              </div>
            </div>

          </div>

          <div className="mt-5 flex items-center justify-between">

            {technician.available ? (
              <span className="text-sm font-bold text-green-600">
                ● Disponible
              </span>
            ) : (
              <span className="text-sm font-bold text-slate-400">
                ● Indisponible
              </span>
            )}

            <Link
              href={`/${locale}/technicians/${technician.id}`}
              className="btn btn-primary"
            >
              Voir le profil
            </Link>

          </div>

        </div>
      </div>
    </article>
  );
}
