"use client";

import Link from "next/link";
import { useCartStore } from "@/store/cart.store";

export default function CartSummary() {
  const total = useCartStore((s) => s.total());
  const count = useCartStore((s) => s.count());

  return (
    <div className="border rounded-lg p-6 shadow-sm h-fit sticky top-20">
      <h2 className="text-xl font-semibold mb-4">Итого</h2>

      <div className="flex justify-between text-lg mb-2">
        <span>Товаров:</span>
        <span>{count}</span>
      </div>

      <div className="flex justify-between text-lg mb-4 font-semibold">
        <span>Сумма:</span>
        <span>{total} ₸</span>
      </div>

      <Link
        href="/checkout"
        className="block bg-black text-white text-center py-3 rounded"
      >
        Оформить заказ
      </Link>
    </div>
  );
}
