"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProductCard from "@/app/catalog/components/ProductCard";
import { motion } from "framer-motion"; // Optional but recommended

// Define type (you can move this to a shared types file)
type CustomerProduct = {
  id: string;
  name: string;
  price: number;
  images?: string[];
  stock?: number;
  category?: string;
};

export default function HomePage() {
  const [items, setItems] = useState<CustomerProduct[]>([]);
  const [loading, setLoading] = useState(true);

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
      <section className="px-4 sm:px-6 py-16 md:py-24 text-center border-b border-gray-100 bg-gradient-to-b from-gray-50 to-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
            Добро пожаловать в <span className="text-emerald-700">Tanba Store</span>
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-8">
            Качественные товары с быстрой доставкой, надежной оплатой и заботой о каждом клиенте.
          </p>

          <Link
            href="/catalog"
            className="inline-flex items-center justify-center bg-emerald-700 hover:bg-emerald-800 text-white font-semibold px-8 py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5"
          >
            Перейти в каталог
          </Link>
        </motion.div>
      </section>

      {/* NEW PRODUCTS */}
      <section className="px-4 sm:px-6 py-12 md:py-16 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Новинки</h2>
          <Link
            href="/catalog"
            className="text-emerald-700 hover:text-emerald-800 font-medium flex items-center gap-1.5 group"
          >
            Смотреть все
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 group-hover:translate-x-0.5 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="bg-white border border-gray-200 rounded-xl p-4 animate-pulse"
              >
                <div className="w-full aspect-square bg-gray-200 rounded-lg mb-3" />
                <div className="h-4 bg-gray-200 rounded mb-2" />
                <div className="h-3 bg-gray-200 rounded w-3/4 mb-3" />
                <div className="h-5 bg-emerald-200 rounded w-1/3" />
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-2">📦</div>
            <p className="text-gray-600">Нет доступных товаров</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {items.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* MORE CTA */}
      <section className="px-4 sm:px-6 py-16 md:py-20 text-center border-t border-gray-100 bg-gradient-to-t from-gray-50 to-white">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="max-w-2xl mx-auto"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Готовы найти свой идеальный товар?
          </h3>
          <p className="text-gray-600 mb-8 max-w-lg mx-auto">
            Более 100 товаров ждут вас в нашем каталоге — с гарантией качества и поддержкой 24/7.
          </p>
          <Link
            href="/catalog"
            className="inline-flex items-center justify-center bg-black hover:bg-gray-800 text-white font-semibold px-8 py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
          >
            Открыть каталог
          </Link>
        </motion.div>
      </section>
    </main>
  );
}