// src/app/(admin)/products/page.tsx
"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AdminProductCard from "./components/AdminProductCard";

type Product = {
  id: string;
  name: string;
  price: number;
  stock: number;
  category?: string;
  images?: string[];
};

export default function AdminProductsPage() {
  const router = useRouter();
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState("");
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (q.trim()) params.set("q", q.trim());
      params.set("limit", "100");
      
      const res = await fetch(`/api/products?${params.toString()}`);
      if (!res.ok) throw new Error("Network response was not ok");
      
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Failed to load products");
      
      setItems(json.data?.items ?? []);
    } catch (err: any) {
      setError(err.message || "Ошибка загрузки товаров");
      console.error("Load products error:", err);
    } finally {
      setLoading(false);
    }
  }, [q]);

  useEffect(() => {
    load();
  }, [load]);

  const remove = async (id: string) => {
    if (!confirm("Вы уверены, что хотите удалить этот товар?")) return;
    
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      const json = await res.json();
      
      if (json.success) {
        setItems((prev) => prev.filter((p) => p.id !== id));
      } else {
        alert("Ошибка удаления: " + (json.error || "Неизвестная ошибка"));
      }
    } catch (err) {
      alert("Не удалось удалить товар. Проверьте соединение.");
    }
  };

  return (
    <>
      <div className="py-6">
        {/* Search & Create */}
        <div className="flex flex-row flex-wrap items-center justify-between gap-4 mb-6">
          <h1 className="text-2xl font-bold">Товары</h1>
          
          <div className="flex flex-row flex-wrap gap-2 w-full md:w-auto">
            <div className="flex items-center flex-1 min-w-[160px] bg-white border border-gray-300 rounded-lg shadow-sm focus-within:ring-2 focus-within:ring-indigo-500">
              <input
                type="text"
                placeholder="Поиск по названию..."
                className="w-full px-4 py-2 bg-transparent outline-none"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                aria-label="Поиск товаров"
              />
            </div>
            <button
              onClick={load}
              className="whitespace-nowrap px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition"
            >
              Найти
            </button>
            <Link
              href="/products/new"
              className="whitespace-nowrap px-4 py-2 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition text-center"
            >
              Создать
            </Link>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-4">
            ⚠️ {error}
          </div>
        )}

        {/* ✅ Grid of Admin Product Cards */}
        {loading ? (
          <div className="py-12 text-center">
            <div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
            <p className="mt-2 text-gray-600">Загрузка товаров...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="py-12 text-center text-gray-500">
            Товары не найдены
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((product) => (
              <AdminProductCard
                key={product.id}
                product={product}
                onDelete={() => remove(product.id)}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}