// components/Search.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MagnifyingGlassIcon, FunnelIcon } from "@heroicons/react/24/outline";
import FiltersSidebar from "@/components/FiltersSideBar"; // ✅ Adjust path if needed

type Filters = {
  q?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
};

export default function Search() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Initialize with URL values
  const initialSearch = searchParams.get("q") || "";
  const [search, setSearch] = useState(initialSearch);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Sync with URL when back/forward buttons are used
  useEffect(() => {
    setSearch(searchParams.get("q") || "");
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters({ q: search.trim() || undefined });
  };

  const applyFilters = (newFilters: Partial<Filters>) => {
    const params = new URLSearchParams();

    // Merge new filters with existing URL params (excluding q, category, minPrice, maxPrice, page)
    for (const [key, value] of searchParams.entries()) {
      if (!['q', 'category', 'minPrice', 'maxPrice', 'page'].includes(key)) {
        params.set(key, value);
      }
    }

    // Apply updated filters
    if (newFilters.q !== undefined) params.set("q", newFilters.q);
    if (newFilters.category !== undefined) params.set("category", newFilters.category);
    if (newFilters.minPrice !== undefined) params.set("minPrice", newFilters.minPrice.toString());
    if (newFilters.maxPrice !== undefined) params.set("maxPrice", newFilters.maxPrice.toString());

    router.push(`/catalog?${params.toString()}`);
  };

  return (
    <>
      {/* Search Form */}
      <form onSubmit={handleSearch} className="flex flex-row sm:flex-row gap-3 mb-6">
        {/* Search Input */}
        <div className="relative flex-1 bg-white border border-gray-300 rounded-lg shadow-sm focus-within:ring-2 focus-within:ring-indigo-500">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск по товарам..."
            className="w-full pl-10 pr-4 py-3 bg-transparent outline-none"
          />
        </div>

        {/* Find Button */}
        <button
          type="submit"
          className="px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg whitespace-nowrap transition"
        >
          Найти
        </button>

        {/* Filter Button */}
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg whitespace-nowrap transition"
        >
          <FunnelIcon className="h-5 w-5" />
          <span className="hidden sm:inline">Фильтры</span>
        </button>
      </form>

      {/* Filter Sidebar */}
      <FiltersSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        currentFilters={{
          category: searchParams.get("category") || undefined,
          minPrice: searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined,
          maxPrice: searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined,
        }}
        onApply={(filters) => {
          applyFilters(filters);
          setSidebarOpen(false);
        }}
      />
    </>
  );
}