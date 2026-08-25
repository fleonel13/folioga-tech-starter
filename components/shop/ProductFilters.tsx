"use client";

export default function ProductFilters({
  category,
  condition,
  sort,
  onCategoryChange,
  onConditionChange,
  onSortChange,
  categories,
}: {
  category: string;
  condition: string;
  sort: string;
  onCategoryChange: (value: string) => void;
  onConditionChange: (value: string) => void;
  onSortChange: (value: string) => void;
  categories: string[];
}) {
  return (
    <div className="grid gap-3 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-3">
      <select
        value={category}
        onChange={(e) => onCategoryChange(e.target.value)}
        className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none focus:border-blue-500"
      >
        {categories.map((item) => (
          <option key={item}>{item}</option>
        ))}
      </select>

      <select
        value={condition}
        onChange={(e) => onConditionChange(e.target.value)}
        className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none focus:border-blue-500"
      >
        <option value="Tous">Tous les états</option>
        <option value="Excellent">Excellent</option>
        <option value="Très bon">Très bon</option>
        <option value="Bon">Bon</option>
        <option value="Neuf">Neuf</option>
      </select>

      <select
        value={sort}
        onChange={(e) => onSortChange(e.target.value)}
        className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none focus:border-blue-500"
      >
        <option value="featured">Recommandés</option>
        <option value="price-asc">Prix croissant</option>
        <option value="price-desc">Prix décroissant</option>
        <option value="rating">Meilleures notes</option>
      </select>
    </div>
  );
}
