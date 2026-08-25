import Link from 'next/link';

type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  oldPrice?: number;
  condition: string;
  rating: number;
  reviews: number;
  stock: number;
  emoji: string;
};

export default function ProductCard({product}: {product: Product}) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative flex h-64 items-center justify-center bg-slate-100">
        {product.oldPrice && (
          <span className="absolute left-4 top-4 rounded-full bg-emerald-500 px-3 py-1 text-xs font-bold text-white">
            PROMO
          </span>
        )}

        <button
          aria-label="Ajouter aux favoris"
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white text-xl shadow-sm hover:bg-slate-50"
        >
          ♡
        </button>

        <div className="text-8xl transition duration-300 group-hover:scale-110">
          {product.emoji}
        </div>
      </div>

      <div className="p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
          {product.category}
        </p>

        <Link href={`/fr/shop/${product.id}`}>
          <h3 className="mt-2 text-lg font-bold text-slate-950 hover:text-emerald-600">
            {product.name}
          </h3>
        </Link>

        <div className="mt-2 flex items-center gap-2 text-sm">
          <span className="text-yellow-500">★★★★★</span>
          <span className="text-slate-500">
            {product.rating} ({product.reviews})
          </span>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <span className="text-2xl font-bold text-slate-950">
            {product.price.toFixed(2)} €
          </span>

          {product.oldPrice && (
            <span className="text-sm text-slate-400 line-through">
              {product.oldPrice.toFixed(2)} €
            </span>
          )}
        </div>

        <div className="mt-2 text-sm">
          <span className="font-medium text-emerald-600">
            ● En stock
          </span>
          <span className="ml-2 text-slate-400">
            {product.stock} disponibles
          </span>
        </div>

        <button className="mt-5 w-full rounded-xl bg-slate-950 px-4 py-3 font-semibold text-white hover:bg-emerald-600">
          Ajouter au panier
        </button>
      </div>
    </article>
  );
}
