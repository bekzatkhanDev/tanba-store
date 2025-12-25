"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import FiltersSidebar from "./FiltersSideBar";
import CatalogGrid from "./CatalogGrid";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

type Filters = {
  q?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
};

function buildQuery(
  params: Record<string, string | number | undefined>
) {
  return new URLSearchParams(
    Object.entries(params)
      .filter(([, v]) => v !== undefined && v !== "")
      .map(([k, v]) => [k, String(v)])
  ).toString();
}

export default function CatalogPage({
  products,
  pagination,
  filters,
}: {
  products: CustomerProduct[];
  pagination?: { page: number; totalPages: number };
  filters: Filters;
}) {
  const router = useRouter();
  const [search, setSearch] = useState(filters.q ?? "");
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    setSearch(filters.q ?? "");
  }, [filters.q]);

  const navigate = (next: Filters) => {
    router.push(`/catalog?${buildQuery(next)}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({ ...filters, q: search, page: 1 });
  };

  return (
    <div className="container mx-auto max-w-7xl px-4 py-6">
      <h1 className="text-2xl md:text-3xl font-semibold mb-6 text-center">
        Каталог товаров
      </h1>

      <form
        onSubmit={handleSearch}
        className="flex gap-2 items-center bg-gray-100 rounded-lg p-3 mb-6"
      >
        <MagnifyingGlassIcon className="w-5 h-5 text-gray-500" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Поиск по товарам..."
          className="flex-1 bg-transparent outline-none"
        />
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-md">
          Найти
        </button>
        <button
          type="button"
          onClick={() => setFiltersOpen(true)}
          className="border px-3 py-2 rounded-md"
        >
          Фильтры
        </button>
      </form>

      <FiltersSidebar
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        currentFilters={filters}
        onApply={(f) =>
          navigate({ ...filters, ...f, page: 1 })
        }
      />

      <CatalogGrid products={products} />

      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-10">
          {Array.from(
            { length: pagination.totalPages },
            (_, i) => i + 1
          )
            .slice(
              Math.max(0, pagination.page - 3),
              pagination.page + 2
            )
            .map((p) => (
              <button
                key={p}
                onClick={() => navigate({ ...filters, page: p })}
                className={`px-4 py-2 rounded-md border ${
                  pagination.page === p
                    ? "bg-indigo-600 text-white"
                    : "bg-white"
                }`}
              >
                {p}
              </button>
            ))}
        </div>
      )}
    </div>
  );
}
