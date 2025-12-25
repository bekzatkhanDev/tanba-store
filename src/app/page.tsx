"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProductCard from "@/app/catalog/components/ProductCard";



export default function HomePage() {
  const [items, setItems] = useState<CustomerProduct[]>([]);
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        limit: "8",
        page: "1",
      });

      const res = await fetch(`/api/products?${params.toString()}`, {
        cache: "no-store",
      });

      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Ошибка загрузки");

      setItems(json.data.items ?? []);
    } catch (e) {
      console.error(e);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <main className="min-h-screen bg-white">
      {/* HERO */}
      <section className="px-6 py-16 text-center border-b bg-gradient-to-b from-gray-50 to-white">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Добро пожаловать в Tanba Store
        </h1>
        <p className="text-gray-600 max-w-xl mx-auto mb-6">
          Магазин качественных товаров с быстрой доставкой и удобной оплатой.
        </p>

        <Link
          href="/catalog"
          className="inline-block bg-black text-white px-6 py-3 rounded text-lg"
        >
          Перейти в каталог
        </Link>
      </section>

      {/* NEW PRODUCTS */}
      <section className="px-6 py-12 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl md:text-2xl font-semibold">Новинки</h2>
          <Link
            href="/catalog"
            className="text-sm text-gray-600 hover:underline"
          >
            Смотреть все →
          </Link>
        </div>

        {loading ? (
          <div className="text-gray-600">Загрузка...</div>
        ) : items.length === 0 ? (
          <div className="text-gray-600">Товары отсутствуют</div>
        ) : (
          <div
            className="
              grid
              grid-cols-1        /* 📱 mobile: 1 карточка */
              sm:grid-cols-2     /* tablet */
              md:grid-cols-3     /* laptop */
              lg:grid-cols-4     /* desktop */
              gap-4
            "
          >
            {items.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* MORE CTA */}
      <section className="px-6 py-16 text-center border-t">
        <h3 className="text-xl font-semibold mb-4">
          Хотите посмотреть больше?
        </h3>
        <Link
          href="/catalog"
          className="bg-black text-white px-6 py-3 rounded text-lg"
        >
          Открыть каталог
        </Link>
      </section>
    </main>
  );
}
