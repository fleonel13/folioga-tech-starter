import ProductCard, { Product } from "./ProductCard";

export default function ProductGrid({
  products,
  locale,
}: {
  products: Product[];
  locale: string;
}) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          locale={locale}
        />
      ))}
    </div>
  );
}
