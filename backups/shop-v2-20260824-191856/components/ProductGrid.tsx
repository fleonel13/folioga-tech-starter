import ProductCard from './ProductCard';

type Product = {
  id: string;
  name: string;
  category: string;
  condition: string;
  price: number;
  oldPrice?: number;
  rating: number;
  reviews: number;
  stock: number;
  image: string;
  badge?: string;
};

export default function ProductGrid({products}: {products: Product[]}) {
  if (!products.length) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
        <div className="text-5xl">🔎</div>
        <h3 className="mt-4 text-xl font-bold text-slate-900">
          Aucun produit trouvé
        </h3>
        <p className="mt-2 text-sm text-slate-500">
          Essayez de modifier votre recherche ou vos filtres.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
