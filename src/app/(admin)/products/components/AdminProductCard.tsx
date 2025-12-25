// src/components/AdminProductCard.tsx
"use client";

import Image from "next/image";
import Link from "next/link";

type Product = {
  id: string;
  name: string;
  price: number;
  stock: number;
  category?: string;
  images?: string[];
};

export default function AdminProductCard({
  product,
  onDelete,
}: {
  product: Product;
  onDelete: () => void;
}) {
  const imageUrl = product.images?.[0] || "/placeholder.png";

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 flex flex-col h-full">
      {/* Product Image */}
      <div className="relative aspect-square w-full bg-gray-100 rounded-t-xl overflow-hidden">
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
      </div>

      {/* Product Info */}
      <div className="p-4 flex flex-col flex-1">
        {/* Name */}
        <h3 className="font-semibold text-sm text-gray-900 line-clamp-2 mb-3">
          {product.name}
        </h3>

        {/* Details */}
        <div className="text-xs text-gray-600 space-y-1.5 mb-4">
          {product.category && (
            <div className="flex items-center">
              <span className="font-medium">Категория:</span>
              <span className="ml-1">{product.category}</span>
            </div>
          )}
          <div className="flex items-center">
            <span className="font-medium">Остаток:</span>
            <span className={`ml-1 ${product.stock === 0 ? "text-red-600 font-bold" : ""}`}>
              {product.stock}
            </span>
          </div>
          <div className="flex items-center">
            <span className="font-bold text-red-600">{product.price} ₸</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-auto flex gap-2">
          <Link
            href={`/products/${product.id}/edit`}
            className="flex-1 text-center bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 py-2 rounded-lg text-xs font-medium transition-colors duration-150"
          >
            Редактировать
          </Link>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 py-2 rounded-lg text-xs font-medium transition-colors duration-150"
          >
            Удалить
          </button>
        </div>
      </div>
    </div>
  );
}