export default function SearchBar({
  placeholder = "Que recherchez-vous ?",
}: {
  placeholder?: string;
}) {
  return (
    <div className="flex w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">

      <div className="flex flex-1 items-center px-4">
        <span className="mr-3 text-xl">
          🔎
        </span>

        <input
          className="w-full bg-transparent py-4 outline-none"
          placeholder={placeholder}
        />
      </div>

      <button className="hidden bg-blue-600 px-7 font-bold text-white hover:bg-blue-700 sm:block">
        Rechercher
      </button>

    </div>
  );
}
