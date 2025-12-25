// app/(main)/catalog/page.tsx
"use client";

import { useEffect } from "react";
import Search from "@/components/Search";
import CatalogGrid from "./CatalogGrid";

export default function CatalogPage({
  products,
  pagination,
}: {
  products: CustomerProduct[];
  pagination?: { page: number; totalPages: number };
}) {
  // Optional: Scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="container mx-auto max-w-7xl px-4 py-6">
      <h1 className="text-2xl md:text-3xl font-semibold mb-6 text-center">
        Каталог товаров
      </h1>

      {/* ✅ Replaced manual form with Search component */}
      <Search />

      <CatalogGrid products={products} />

      {/* Optional: Pagination if needed */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-10">
          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
            .slice(Math.max(0, pagination.page - 3), pagination.page + 2)
            .map((p) => (
              <button
                key={p}
                onClick={() => {
                  // You can add page navigation here if needed
                }}
                className={`px-4 py-2 rounded-md border ${
                  pagination.page === p ? "bg-indigo-600 text-white" : "bg-white"
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