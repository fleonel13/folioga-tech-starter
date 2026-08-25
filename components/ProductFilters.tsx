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
    <div className="grid gap-3 sm:grid-cols-3">
      <select
        value={category}
        onChange={(e) => onCategoryChange(e.target.value)}
        className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium outline-none focus:border-blue-500"
      >
        <option value="all">Toutes les catégories</option>
        <option value="smartphones">Smartphones</option>
        <option value="ordinateurs">Ordinateurs</option>
        <option value="tablettes">Tablettes</option>
        <option value="accessoires">Accessoires</option>
      </select>

      <select
        value={condition}
        onChange={(e) => onConditionChange(e.target.value)}
        className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium outline-none focus:border-blue-500"
      >
        <option value="all">Tous les états</option>
        <option value="reconditionné">Reconditionné</option>
        <option value="neuf">Neuf</option>
      </select>

      <select
        value={sort}
        onChange={(e) => onSortChange(e.target.value)}
        className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium outline-none focus:border-blue-500"
      >
        <option value="featured">Nos recommandations</option>
        <option value="price-low">Prix croissant</option>
        <option value="price-high">Prix décroissant</option>
        <option value="rating">Mieux notés</option>
      </select>
    </div>
  );
}
