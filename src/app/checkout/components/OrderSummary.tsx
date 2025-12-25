"use client";

import { useCartStore } from "@/store/cart.store";

export default function OrderSummary() {
  const items = useCartStore((s) => s.items);
  const total = useCartStore((s) => s.total());

  return (
    <div className="border rounded-lg p-6 shadow-sm">
      <h2 className="text-2xl font-semibold mb-6">Ваш заказ</h2>

      <div className="flex flex-col gap-4">
        {items.length === 0 && (
          <div className="text-gray-500">Корзина пуста</div>
        )}

        {items.map((item) => (
          <div
            key={item.id}
            className="flex justify-between border-b pb-2 text-sm"
          >
            <div>
              <div className="font-medium">{item.name}</div>
              <div className="text-gray-500">x{item.qty}</div>
            </div>
            <div>{item.qty * item.price} ₸</div>
          </div>
        ))}

        {items.length > 0 && (
          <div className="flex justify-between text-lg mt-4 font-semibold">
            <div>Итого:</div>
            <div>{total} ₸</div>
          </div>
        )}
      </div>
    </div>
  );
}
