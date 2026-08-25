export default function Rating({
  rating = 5,
  reviews = 0,
}: {
  rating?: number;
  reviews?: number;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-amber-500">
        {"★".repeat(Math.round(rating))}
        <span className="text-slate-200">
          {"★".repeat(5 - Math.round(rating))}
        </span>
      </span>

      <span className="text-sm font-semibold text-slate-600">
        {rating.toFixed(1)}
      </span>

      {reviews > 0 && (
        <span className="text-sm text-slate-400">
          ({reviews})
        </span>
      )}
    </div>
  );
}
