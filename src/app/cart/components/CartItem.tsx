"use client";

import Image from "next/image";
import { useCartActions } from "../hooks/useCartActions";

export default function CartItem({ item }: { item: any }) {
  const { increment, decrement, remove } = useCartActions();

  // Safely get image URL
  const imageSrc = item.image || (item.images && item.images[0]) || "/placeholder.png";

  return (
    <div className="flex gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
      {/* Product Image */}
      <div className="relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-gray-50">
        <Image
          src={imageSrc}
          alt={item.name || "Product image"}
          fill
          className="object-cover"
        />
      </div>

      {/* Product Info & Actions */}
      <div className="flex flex-col flex-1 min-w-0">
        <h3 className="text-base font-semibold text-gray-900 line-clamp-2">
          {item.name}
        </h3>

        <p className="text-lg font-bold text-emerald-700 mt-1">
          {(item.price * (item.qty || 1)).toLocaleString()} ₸
        </p>
        <p className="text-sm text-gray-500">
          {item.price.toLocaleString()} ₸ × {item.qty}
        </p>

        {/* Quantity Controls & Remove */}
        <div className="flex items-center gap-2 mt-3">
          <button
            onClick={() => decrement(item.id)}
            disabled={item.qty <= 1}
            className="w-9 h-9 flex items-center justify-center text-lg font-bold bg-gray-100 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg transition-colors"
            aria-label="Уменьшить количество"
          >
            −
          </button>

          <span className="w-10 text-center font-medium text-gray-800">
            {item.qty}
          </span>

          <button
            onClick={() => increment(item.id)}
            className="w-9 h-9 flex items-center justify-center text-lg font-bold bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            aria-label="Увеличить количество"
          >
            +
          </button>

          <button
            onClick={() => remove(item.id)}
            className="ml-auto text-red-600 hover:text-red-800 font-medium text-sm flex items-center gap-1.5 px-2 py-1 rounded hover:bg-red-50 transition-colors"
            aria-label="Удалить из корзины"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            Удалить
          </button>
        </div>
      </div>
    </div>
  );
}