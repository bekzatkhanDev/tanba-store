"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import { useCartStore } from "@/store/cart.store";
import { useState } from "react";

export default function ProductCard({ product }: { product: CustomerProduct }) {
  const addToCart = useCartStore((state) => state.add);
  const [showFallback, setShowFallback] = useState(false);

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

  const whatsappUrl = `https://wa.me/77700000000?text=${encodeURIComponent(
    `Здравствуйте! Хочу купить товар: ${product.name}`
  )}`;

  const copyWhatsAppLink = () => {
    navigator.clipboard.writeText(whatsappUrl).then(() => {
      alert("Ссылка скопирована! Откройте WhatsApp и вставьте ее.");
    });
  };

  return (
    <div className="bg-white border rounded-xl shadow-sm hover:shadow-md transition flex flex-col h-full w-full min-w-0">
      {/* Product Link */}
      <Link
        href={`/catalog/${product.id}`}
        className="flex flex-col flex-1"
        aria-label={`View details for ${product.name}`}
      >
        {/* Image */}
        <div className="relative aspect-[3/4] w-full bg-gray-100 rounded-t-xl overflow-hidden">
          <Image
            src={product.images?.[0] ?? "/placeholder.png"}
            alt={product.name}
            fill
            sizes="(min-width: 1280px) 20vw, (min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
            className="object-cover"
          />
        </div>

        {/* Title & Price */}
        <div className="p-3 flex-1">
          <h3 className="text-sm font-medium line-clamp-2 min-h-[2.5rem]">
            {product.name}
          </h3>
          <p className="text-base md:text-lg font-bold text-red-600 mt-1">
            {product.price} ₸
          </p>
        </div>
      </Link>

      {/* Sizes */}
      {product.sizes && product.sizes.length > 0 && (
        <div className="px-3 pb-2">
          <p className="text-xs text-gray-500 mb-1">Размеры</p>
          <div className="flex flex-wrap gap-1.5">
            {product.sizes.map((size: string) => (
              <span
                key={size}
                className="px-2 py-1 bg-gray-100 rounded text-[10px] font-medium whitespace-nowrap"
              >
                {size}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2 px-3 pb-3 mt-auto">
        {/* WhatsApp Button */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => {
            e.stopPropagation();
            // Optional: Show fallback after 1s if page doesn't navigate
            setTimeout(() => {
              setShowFallback(true);
            }, 1000);
          }}
          className="flex-1 text-center bg-green-500 hover:bg-green-600 text-white font-medium py-2 text-xs sm:text-sm rounded-lg transition whitespace-nowrap"
        >
          WhatsApp
        </a>

        {/* Cart Button */}
        <button
          onClick={handleAddToCart}
          className="flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
          aria-label="Добавить в корзину"
        >
          <ShoppingCartIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
        </button>
      </div>

      {/* Fallback UI if WhatsApp doesn't open */}
      {showFallback && (
        <div className="px-3 pb-3 mt-auto bg-yellow-50 border-t border-yellow-200 rounded-b-xl">
          <p className="text-xs text-yellow-800 mb-2">
            WhatsApp не открылся? Попробуйте:
          </p>
          <div className="flex gap-2">
            <button
              onClick={copyWhatsAppLink}
              className="flex-1 text-xs bg-yellow-200 hover:bg-yellow-300 text-yellow-800 font-medium py-1.5 rounded"
            >
              Скопировать ссылку
            </button>
            <a
              href="mailto:support@example.com"
              className="text-xs text-blue-600 hover:underline"
            >
              Написать на email
            </a>
          </div>
        </div>
      )}
    </div>
  );
}