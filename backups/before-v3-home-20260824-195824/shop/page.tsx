"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import ProductCard from "@/components/shop/ProductCard";
import ProductFilters from "@/components/shop/ProductFilters";
import { categories, products } from "@/lib/products";

export default function ShopPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const [locale, setLocale] = useState("fr");
  const [category, setCategory] = useState("Tous");
  const [condition, setCondition] = useState("Tous");
  const [sort, setSort] = useState("featured");
  const [search, setSearch] = useState("");

  useMemo(() => {
    params.then((value) => setLocale(value.locale));
  }, [params]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (category !== "Tous") {
      result = result.filter((p) => p.category === category);
    }

    if (condition !== "Tous") {
      result = result.filter((p) => p.condition === condition);
    }

    if (search.trim()) {
      const query = search.toLowerCase();

      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query)
      );
    }

    if (sort === "price-asc") {
      result.sort((a, b) => a.price - b.price);
    }

    if (sort === "price-desc") {
      result.sort((a, b) => b.price - a.price);
    }

    if (sort === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [category, condition, sort, search]);

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="border-b border-slate-200 bg-slate-950 text-white">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm">
              ♻️ Technologie reconditionnée
            </div>

            <h1 className="text-4xl font-black tracking-tight md:text-6xl">
              La technologie,
              <br />
              <span className="text-blue-400">en mieux.</span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              Découvrez des appareils contrôlés par des professionnels,
              proposés à des prix plus responsables.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={`/${locale}/repairs`}
                className="rounded-xl bg-white px-5 py-3 font-bold text-slate-950 hover:bg-slate-100"
              >
                Faire réparer
              </Link>

              <Link
                href={`/${locale}/technicians`}
                className="rounded-xl border border-white/20 px-5 py-3 font-bold text-white hover:bg-white/10"
              >
                Trouver un technicien
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-blue-600">
              Folioga Shop
            </p>
            <h2 className="mt-1 text-3xl font-black text-slate-950">
              Nos produits
            </h2>
          </div>

          <Link
            href={`/${locale}/cart`}
            className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold shadow-sm hover:border-blue-300"
          >
            🛒 Voir mon panier
          </Link>
        </div>

        <div className="mb-6">
          <div className="relative">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un smartphone, ordinateur..."
              className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 pl-12 shadow-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />

            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">
              🔎
            </span>
          </div>
        </div>

        <ProductFilters
          category={category}
          condition={condition}
          sort={sort}
          onCategoryChange={setCategory}
          onConditionChange={setCondition}
          onSortChange={setSort}
          categories={categories}
        />

        <div className="mt-8 flex items-center justify-between">
          <p className="text-sm text-slate-500">
            <strong className="text-slate-900">
              {filteredProducts.length}
            </strong>{" "}
            produit{filteredProducts.length > 1 ? "s" : ""}
          </p>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                locale={locale}
              />
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-3xl border border-dashed border-slate-300 bg-white p-16 text-center">
            <div className="text-5xl">🔎</div>
            <h3 className="mt-4 text-xl font-bold">
              Aucun produit trouvé
            </h3>
            <p className="mt-2 text-slate-500">
              Essayez une autre recherche ou modifiez les filtres.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
