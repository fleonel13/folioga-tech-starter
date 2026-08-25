const categories = [
  'Tous les produits',
  'Smartphones',
  'Ordinateurs',
  'Tablettes',
  'Consoles',
  'Accessoires',
];

export default function ShopFilters() {
  return (
    <aside className="rounded-2xl border border-slate-200 bg-white p-6">
      <h2 className="text-lg font-bold text-slate-950">
        Filtrer
      </h2>

      <div className="mt-6">
        <label className="text-sm font-semibold text-slate-700">
          Catégorie
        </label>

        <div className="mt-3 space-y-2">
          {categories.map((category, index) => (
            <label
              key={category}
              className="flex cursor-pointer items-center gap-3 rounded-lg p-2 hover:bg-slate-50"
            >
              <input
                type="radio"
                name="category"
                defaultChecked={index === 0}
                className="accent-emerald-500"
              />
              <span className="text-sm text-slate-600">
                {category}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="mt-8 border-t border-slate-100 pt-6">
        <label className="text-sm font-semibold text-slate-700">
          État
        </label>

        <div className="mt-3 space-y-3 text-sm text-slate-600">
          <label className="flex gap-3">
            <input type="checkbox" />
            Comme neuf
          </label>

          <label className="flex gap-3">
            <input type="checkbox" />
            Très bon état
          </label>

          <label className="flex gap-3">
            <input type="checkbox" />
            Bon état
          </label>
        </div>
      </div>

      <div className="mt-8 border-t border-slate-100 pt-6">
        <label className="text-sm font-semibold text-slate-700">
          Prix maximum
        </label>

        <input
          type="range"
          min="0"
          max="3000"
          defaultValue="1500"
          className="mt-4 w-full accent-emerald-500"
        />

        <div className="mt-2 flex justify-between text-xs text-slate-500">
          <span>0 €</span>
          <span>3 000 €</span>
        </div>
      </div>
    </aside>
  );
}
