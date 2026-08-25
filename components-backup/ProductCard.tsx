import Link from "next/link";
import Rating from "./Rating";
import Badge from "./Badge";

export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  oldPrice?: number;
  image: string;
  rating: number;
  reviews: number;
  condition: string;
  stock: number;
};

export default function ProductCard({
  product,
  locale,
}: {
  product: Product;
  locale: string;
}) {
  return (
    <article className="card group overflow-hidden transition hover:-translate-y-1 hover:shadow-xl">

      <Link href={`/${locale}/shop/${product.id}`}>

        <div className="relative flex h-56 items-center justify-center bg-slate-100 p-6">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-contain transition duration-300 group-hover:scale-105"
          />

          <div className="absolute left-3 top-3">
            <Badge type="green">{product.condition}</Badge>
          </div>
        </div>

        <div className="p-5">

          <div className="text-xs font-bold uppercase tracking-wide text-blue-600">
            {product.category}
          </div>

          <h3 className="mt-2 line-clamp-2 min-h-12 text-lg font-bold text-slate-900">
            {product.name}
          </h3>

          <div className="mt-3">
            <Rating rating={product.rating} reviews={product.reviews} />
          </div>

          <div className="mt-5 flex items-end justify-between gap-3">

            <div>
              {product.oldPrice && (
                <div className="text-sm text-slate-400 line-through">
                  {product.oldPrice.toFixed(2)} €
                </div>
              )}

              <div className="text-2xl font-black text-slate-900">
                {product.price.toFixed(2)} €
              </div>
            </div>

            <span className="rounded-xl bg-blue-600 px-3 py-2 text-sm font-bold text-white">
              Voir
            </span>

          </div>

          <div className="mt-4 border-t border-slate-100 pt-3 text-xs font-semibold text-slate-500">
            {product.stock > 0
              ? `${product.stock} disponible${product.stock > 1 ? "s" : ""}`
              : "Rupture de stock"}
          </div>

        </div>

      </Link>
    </article>
  );
}
