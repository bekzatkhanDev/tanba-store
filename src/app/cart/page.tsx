"use client";

import { useCartStore } from "@/store/cart.store";

export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const total = useCartStore((state) => state.total());
  const clear = useCartStore((state) => state.clear);

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-10">
        <p>Корзина пуста</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Корзина</h1>

      {items.map((item) => (
        <div key={item.id} className="flex gap-4 mb-4">
          <img
            src={item.image}
            alt={item.name}
            className="w-20 h-20 object-cover"
          />
          <div>
            <p>{item.name}</p>
            <p>{item.qty} × {item.price}</p>
          </div>
        </div>
      ))}

      <div className="mt-6 font-bold">
        Итого: {total}
      </div>

      <button
        onClick={clear}
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
      >
        Очистить корзину
      </button>
    </div>
  );
}
