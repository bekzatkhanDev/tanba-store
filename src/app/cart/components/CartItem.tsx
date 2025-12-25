"use client";

import Image from "next/image";
import { useCartActions } from "../hooks/useCartActions";

export default function CartItem({ item }: any) {
  const { increment, decrement, remove } = useCartActions();

  return (
    <div className="flex gap-4 border rounded-lg p-4 shadow-sm">
      <div className="relative w-24 h-24 rounded bg-gray-100 overflow-hidden">
        <Image
          src={item.image ?? item.images?.[0] ?? "/placeholder.png"}
          alt={item.name}
          fill
          className="object-cover"
        />
      </div>

      <div className="flex flex-col flex-1">
        <div className="text-lg font-medium">{item.name}</div>

        <div className="text-gray-600 mt-1">{item.price} ₸</div>

        {/* actions */}
        <div className="flex items-center gap-3 mt-3">

          <button
            onClick={() => decrement(item.id)}
            className="px-3 py-1 border rounded"
          >
            −
          </button>

          <div className="w-8 text-center">{item.qty}</div>

          <button
            onClick={() => increment(item.id)}
            className="px-3 py-1 border rounded"
          >
            +
          </button>

          <button
            onClick={() => remove(item.id)}
            className="ml-auto text-red-600 hover:underline"
          >
            Удалить
          </button>
        </div>
      </div>
    </div>
  );
}
