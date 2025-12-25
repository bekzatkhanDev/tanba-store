import Image from "next/image";
import { notFound } from "next/navigation";
import Menu from "@/components/Menu";

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
  const { id } = await params;

  if (!id) {
    notFound();
  }

  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  return (
    <>
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
          {/* ===== Image Gallery ===== */}
          <div className="space-y-4">
            {product.images && product.images.length > 0 ? (
              product.images.map((url, i) => (
                <div
                  key={i}
                  className="relative w-full aspect-square rounded-xl overflow-hidden shadow-md ring-1 ring-gray-200/50"
                >
                  <Image
                    src={url}
                    alt={`${product.name} – view ${i + 1}`}
                    fill
                    className="object-cover transition-transform duration-300 hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 40vw"
                  />
                </div>
              ))
            ) : (
              <div className="w-full aspect-square flex items-center justify-center rounded-xl bg-gray-100 border-2 border-dashed border-gray-300 text-gray-400">
                Изображения отсутствуют
              </div>
            )}
          </div>

          {/* ===== Product Details ===== */}
          <div className="flex flex-col">
            <div>
              {/* Category */}
              {product.category && (
                <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-full mb-4">
                  {product.category}
                </span>
              )}

              {/* Name */}
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                {product.name}
              </h1>

              {/* Price & Stock */}
              <div className="flex flex-wrap items-center gap-3 mb-5">
                <span className="text-2xl md:text-3xl font-extrabold text-gray-900">
                  {product.price.toLocaleString()} ₸
                </span>
                {product.stock > 0 ? (
                  <span className="text-sm font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full">
                    В наличии: {product.stock}
                  </span>
                ) : (
                  <span className="text-sm font-semibold text-red-600 bg-red-50 px-3 py-1 rounded-full">
                    Нет в наличии
                  </span>
                )}
              </div>

              {/* Description */}
              {product.description && (
                <div className="mb-6">
                  <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-2">
                    Описание
                  </h2>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {product.description}
                  </p>
                </div>
              )}

              {/* Sizes */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-2">
                    Доступные размеры
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 bg-gray-100 text-gray-800 text-sm font-medium rounded-lg border border-gray-200"
                      >
                        {size}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* WhatsApp CTA */}
            <div className="mt-auto pt-4">
              <a
                href={`https://wa.me/+77788152803?text=${encodeURIComponent(
                  `Здравствуйте! Интересует товар: ${product.name} (ID: ${product.id})`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center w-full px-6 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-md transition-all duration-200 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="w-5 h-5 mr-2 fill-current"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.247-.595-.497-1.017-.497-1.017-.05-.099.173-.572.497-.795.298-.148 1.164-.595 2.54-.694 1.375-.099 2.993.273 4.492 1.565.446.396.743.843 1.04 1.29.297.446.446.843.421 1.24-.025.421-.52 1.064-.916 1.312-.395.248-.966.372-1.362.174-.396-.198-.67-.496-.967-.794-.297-.297-.594-.273-.817-.174-.223.1-.496.347-.298.644.198.298.693.967.866 1.215.174.247.347.297.62.471.272.173 1.653.967 2.519 1.34 1.339.546 1.587.645 1.785.967.198.321.198.743.149 1.065-.05.321-.173.668-.273.916-.248.62-.94 1.565-1.412 2.087-.477.52-1.002.893-1.573 1.141z" />
                </svg>
                Заказать через WhatsApp
              </a>
              <p className="text-center text-xs text-gray-500 mt-2">
                Ответим в течение нескольких минут
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Menu />
    </>
  );
}