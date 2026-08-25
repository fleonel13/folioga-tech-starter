export default function ProductFilters() {
  return (
    <aside className="card hidden h-fit p-5 lg:block">

      <h3 className="text-lg font-black">
        Filtrer
      </h3>

      <div className="mt-6">
        <label className="text-sm font-bold text-slate-700">
          Catégorie
        </label>

        <div className="mt-3 space-y-2 text-sm text-slate-600">
          <label className="flex gap-2">
            <input type="checkbox" />
            Smartphones
          </label>

          <label className="flex gap-2">
            <input type="checkbox" />
            Ordinateurs
          </label>

          <label className="flex gap-2">
            <input type="checkbox" />
            Tablettes
          </label>

          <label className="flex gap-2">
            <input type="checkbox" />
            Accessoires
          </label>
        </div>
      </div>

      <div className="mt-6">
        <label className="text-sm font-bold text-slate-700">
          État
        </label>

        <div className="mt-3 space-y-2 text-sm text-slate-600">
          <label className="flex gap-2">
            <input type="checkbox" />
            Comme neuf
          </label>

          <label className="flex gap-2">
            <input type="checkbox" />
            Très bon état
          </label>

          <label className="flex gap-2">
            <input type="checkbox" />
            Bon état
          </label>
        </div>
      </div>

      <div className="mt-6">
        <label className="text-sm font-bold text-slate-700">
          Prix maximum
        </label>

        <input
          type="range"
          min="0"
          max="3000"
          defaultValue="1500"
          className="mt-4 w-full"
        />
      </div>

    </aside>
  );
}
