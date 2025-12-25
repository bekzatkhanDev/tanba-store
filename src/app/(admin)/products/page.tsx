"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

type Product = {
  id: string;
  name: string;
  price: number;
  stock: number;
  category?: string;
  images?: string[];
};

export default function AdminProductsPage() {
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (q) params.set("q", q);
      params.set("limit", "100");
      const res = await fetch(`/api/products?${params.toString()}`);
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Error");
      // API returns paginated shape (data.items)
      const data = json.data;
      const products = data?.items ?? [];
      setItems(products);
    } catch (err: any) {
      setError(err.message || "Ошибка загрузки");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function remove(id: string) {
    if (!confirm("Удалить товар?")) return;
    const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
    const json = await res.json();
    if (json.success) {
      setItems((s) => s.filter((p) => p.id !== id));
    } else {
      alert("Ошибка удаления: " + json.error);
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Товары</h1>
        <div className="flex gap-3">
          <input
            className="border px-3 py-2 rounded"
            placeholder="Поиск"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <button className="px-4 py-2 border rounded" onClick={() => load()}>
            Найти
          </button>
          <Link href="/products/new" className="bg-black text-white px-4 py-2 rounded">Создать</Link>
        </div>
      </div>

      {error && <div className="text-red-600 mb-4">{error}</div>}

      <div className="grid gap-2">
        <div className="hidden md:flex font-semibold border-b py-2 px-3">
          <div className="w-10">#</div>
          <div className="flex-1">Название</div>
          <div className="w-28 text-right">Цена</div>
          <div className="w-24 text-right">Остаток</div>
          <div className="w-36 text-right">Действия</div>
        </div>

        {loading ? (
          <div>Загрузка...</div>
        ) : items.length === 0 ? (
          <div className="py-6 text-gray-600">Товары не найдены</div>
        ) : (
          items.map((p, idx) => (
            <div key={p.id} className="flex items-center border-b py-3 px-3">
              <div className="w-10 text-sm text-gray-500">{idx + 1}</div>
              <div className="flex-1">
                <div className="font-medium">{p.name}</div>
                <div className="text-xs text-gray-500">{p.category}</div>
              </div>
              <div className="w-28 text-right">{p.price} ₸</div>
              <div className="w-24 text-right">{p.stock}</div>
              <div className="w-36 text-right flex justify-end gap-2">
                <Link href={`/products/${p.id}/edit`} className="px-3 py-1 border rounded">Edit</Link>
                <button onClick={() => remove(p.id)} className="px-3 py-1 border rounded text-red-600">Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
