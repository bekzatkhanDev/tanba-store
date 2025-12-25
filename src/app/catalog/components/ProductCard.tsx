"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import { useCartStore } from "@/store/cart.store";

export default function ProductCard({ product }: { product: CustomerProduct }) {
  const addToCart = useCartStore((state) => state.add);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images?.[0] ?? "/placeholder.png",
      qty: 1,
    });
  };

  return (
    <div className="bg-white border rounded-xl shadow-sm hover:shadow-md transition flex flex-col">
      
      {/* Переход на страницу товара */}
      <Link href={`/catalog/${product.id}`} className="flex flex-col flex-1">
        
        {/* Фото */}
        <div className="relative aspect-[3/4] w-full bg-gray-100 rounded-t-xl overflow-hidden">
          <Image
            src={product.images?.[0] ?? "/placeholder.png"}
            alt={product.name}
            fill
            sizes="100%"
            className="object-cover"
          />
        </div>

        {/* Название + цена */}
        <div className="p-3">
          <h3 className="text-sm font-medium line-clamp-2">
            {product.name}
          </h3>
          <p className="text-lg font-bold text-red-600 mt-1">
            {product.price} ₸
          </p>
        </div>
      </Link>

      {/* Размеры */}
      {product.sizes && product.sizes.length > 0 && (
        <div className="px-3 pb-2">
          <p className="text-xs text-gray-400 mb-1">Размеры</p>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((size: string) => (
              <span
                key={size}
                className="px-2 py-1 bg-gray-200 rounded-md text-sm font-medium"
              >
                {size}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Кнопки */}
      <div className="flex gap-2 px-3 pb-3">
        {/* WhatsApp */}
        <a
          href={`https://wa.me/77700000000?text=${encodeURIComponent(
            `Здравствуйте! Хочу купить товар: ${product.name}`
          )}`}
          target="_blank"
          onClick={(e) => e.stopPropagation()}
          className="flex-1 text-center bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg transition"
        >
          Купить в WhatsApp
        </a>

        {/* В корзину */}
        <button
          onClick={handleAddToCart}
          className="flex items-center justify-center w-12 h-12 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
          aria-label="Добавить в корзину"
        >
          <ShoppingCartIcon className="w-6 h-6 text-gray-700" />
        </button>
      </div>
    </div>
  );
}
