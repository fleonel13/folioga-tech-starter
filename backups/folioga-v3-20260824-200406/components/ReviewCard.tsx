import Rating from "./Rating";

export default function ReviewCard({
  name,
  text,
  rating,
}: {
  name: string;
  text: string;
  rating: number;
}) {
  return (
    <article className="card p-6">
      <Rating rating={rating} />

      <p className="mt-4 leading-7 text-slate-600">
        “{text}”
      </p>

      <div className="mt-5 font-bold text-slate-900">
        {name}
      </div>

      <div className="text-sm text-slate-400">
        Client vérifié
      </div>
    </article>
  );
}
