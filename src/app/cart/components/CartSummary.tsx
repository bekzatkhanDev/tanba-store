"use client";

import Link from "next/link";
import { useCartStore } from "@/store/cart.store";

export default function CartSummary() {
  const total = useCartStore((s) => s.total());
  const count = useCartStore((s) => s.count());

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm h-fit sticky top-6 lg:top-8 z-10 transition-all duration-300">
      <h2 className="text-xl font-bold text-gray-900 mb-5">Итого по заказу</h2>

      <div className="space-y-3 mb-6">
        <div className="flex justify-between">
          <span className="text-gray-600">Товаров в корзине</span>
          <span className="font-medium text-gray-900">{count} шт.</span>
        </div>

        <div className="flex justify-between pt-2 border-t border-gray-100">
          <span className="text-lg font-semibold text-gray-900">Итого</span>
          <span className="text-lg font-bold text-emerald-700">
            {total.toLocaleString()} ₸
          </span>
        </div>
      </div>

      <Link
        href="/checkout"
        className="block w-full bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-center py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
      >
        Оформить заказ
      </Link>

      <p className="text-center text-xs text-gray-500 mt-3">
        Безопасная оплата • Быстрая доставка
      </p>
    </div>
  );
}