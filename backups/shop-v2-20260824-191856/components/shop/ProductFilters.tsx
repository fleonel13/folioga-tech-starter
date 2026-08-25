'use client';

type Props = {
  category: string;
  condition: string;
  sort: string;
  onCategoryChange: (value: string) => void;
  onConditionChange: (value: string) => void;
  onSortChange: (value: string) => void;
};

export default function ProductFilters({
  category,
  condition,
  sort,
  onCategoryChange,
  onConditionChange,
  onSortChange
}: Props) {
  return (
    <div className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 md:grid-cols-3">
      <select
        value={category}
        onChange={(e) => onCategoryChange(e.target.value)}
        className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium outline-none focus:border-blue-500"
      >
        <option value="Tous">Toutes les catégories</option>
        <option value="Smartphones">Smartphones</option>
        <option value="Ordinateurs">Ordinateurs</option>
        <option value="Tablettes">Tablettes</option>
        <option value="Audio">Audio</option>
      </select>

      <select
        value={condition}
        onChange={(e) => onConditionChange(e.target.value)}
        className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium outline-none focus:border-blue-500"
      >
        <option value="Tous">Tous les états</option>
        <option value="Excellent">Excellent</option>
        <option value="Très bon">Très bon</option>
        <option value="Bon">Bon</option>
        <option value="Reconditionné">Reconditionné</option>
      </select>

      <select
        value={sort}
        onChange={(e) => onSortChange(e.target.value)}
        className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium outline-none focus:border-blue-500"
      >
        <option value="featured">Recommandés</option>
        <option value="price-asc">Prix croissant</option>
        <option value="price-desc">Prix décroissant</option>
        <option value="rating">Mieux notés</option>
      </select>
    </div>
  );
}
