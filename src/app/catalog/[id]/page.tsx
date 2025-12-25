import Image from "next/image";
import { notFound } from "next/navigation";

type Product = {
  id: string;
  name: string;
  price: number;
  stock: number;
  category?: string;
  description?: string;
  sizes?: string[];
  images?: string[];
};

async function getProduct(id: string): Promise<Product | null> {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const res = await fetch(`${baseUrl}/api/products/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) return null;

  const json = await res.json();
  if (!json.success) return null;

  return json.data;
}

export default async function CatalogProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // ✅ ВАЖНО
  const { id } = await params;

  if (!id) {
    notFound();
  }

  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  return (
    <div className="max-w-5xl mx-auto p-4 grid md:grid-cols-2 gap-6">
      {/* ===== Галерея ===== */}
      <div className="space-y-3">
        {product.images && product.images.length > 0 ? (
          product.images.map((url, i) => (
            <div
              key={i}
              className="relative w-full aspect-square border rounded overflow-hidden"
            >
              <Image
                src={url}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          ))
        ) : (
          <div className="w-full aspect-square flex items-center justify-center border rounded text-gray-400">
            Нет изображения
          </div>
        )}
      </div>

      {/* ===== Информация ===== */}
      <div>
        <h1 className="text-3xl font-semibold mb-3">{product.name}</h1>

        <div className="text-2xl font-bold mb-4">
          {product.price.toLocaleString()} ₸
        </div>

        {product.category && (
          <div className="text-sm text-gray-500 mb-2">
            Категория: {product.category}
          </div>
        )}

        <div className="mb-4">
          {product.stock > 0 ? (
            <span className="text-green-600">
              В наличии: {product.stock}
            </span>
          ) : (
            <span className="text-red-600">Нет в наличии</span>
          )}
        </div>

        {product.description && (
          <p className="text-gray-700 whitespace-pre-line mb-6">
            {product.description}
          </p>
        )}

        <a
          href={`https://wa.me/+77788152803?text=${encodeURIComponent(
            `Здравствуйте! Интересует товар: ${product.name}`
          )}`}
          target="_blank"
          className="inline-block bg-black text-white px-6 py-3 rounded"
        >
          Заказать через WhatsApp
        </a>
      </div>
    </div>
  );
}
