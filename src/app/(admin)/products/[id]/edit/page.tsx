// src/app/(admin)/products/[id]/edit/page.tsx
"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: "",
    price: "",
    stock: "",
    category: "",
    description: "",
    images: [] as string[],
  });
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  // ===== Load Product =====
  useEffect(() => {
    if (!id) return;

    let mounted = true;
    const loadProduct = async () => {
      try {
        const res = await fetch(`/api/products/${id}`);
        const json = await res.json();

        if (!json.success) throw new Error(json.error || "Товар не найден");

        if (mounted) {
          setForm(json.data);
          setLoading(false);
        }
      } catch (err: any) {
        if (mounted) {
          setError(err.message || "Ошибка загрузки товара");
          setLoading(false);
        }
      }
    };

    loadProduct();
    return () => { mounted = false; };
  }, [id]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setNewFiles(prev => [...prev, ...Array.from(files)]);
    }
  };

  const removeNewFile = (index: number) => {
    setNewFiles(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (url: string) => {
    setForm(prev => ({
      ...prev,
      images: prev.images.filter(img => img !== url)
    }));
  };

  // ===== Save Product =====
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!form.name.trim() || !form.price || !form.stock) {
      setError("Пожалуйста, заполните все обязательные поля");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      let finalImages = [...form.images];

      // Upload new files if any
      if (newFiles.length > 0) {
        setUploading(true);
        const uploadData = new FormData();
        newFiles.forEach(file => uploadData.append("files", file));
        uploadData.append("bucket", "products");
        uploadData.append("folder", "product-gallery");

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: uploadData,
        });

        const uploadJson = await uploadRes.json();
        if (!uploadJson.success) {
          throw new Error(uploadJson.error || "Ошибка загрузки изображений");
        }

        finalImages = [
          ...finalImages,
          ...uploadJson.data.success.map((item: any) => item.url)
        ];
        setUploading(false);
      }

      // Update product
      const updateRes = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          price: Number(form.price),
          stock: Number(form.stock),
          category: form.category?.trim() || undefined,
          description: form.description?.trim() || undefined,
          images: finalImages,
        }),
      });

      const updateJson = await updateRes.json();
      if (!updateJson.success) {
        throw new Error(updateJson.error || "Не удалось обновить товар");
      }

      router.replace("/products");
    } catch (err: any) {
      setError(err.message || "Произошла ошибка при сохранении");
      console.error("Update product error:", err);
      setLoading(false);
      setUploading(false);
    }
  };

  const handleFileInputClick = () => {
    fileInputRef.current?.click();
  };

  // ===== Loading & Error States =====
  if (!id) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">Некорректный ID товара</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto p-6 flex items-center justify-center h-64">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-3 text-gray-600">Загрузка товара...</p>
        </div>
      </div>
    );
  }

  if (!form.name && error) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Редактировать товар</h1>
        <p className="text-gray-600 mt-1">Обновите информацию о товаре</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-100 flex items-start">
          <span>⚠️</span>
          <span className="ml-2">{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="space-y-5">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Название товара <span className="text-red-500">*</span>
            </label>
            <input
              required
              type="text"
              placeholder="Например: Футболка с принтом"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          {/* Price & Stock */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Цена (₸) <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="number"
                min="0"
                placeholder="0"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Остаток <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="number"
                min="0"
                placeholder="0"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Категория
            </label>
            <input
              type="text"
              placeholder="Например: Одежда, Электроника"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              value={form.category || ""}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Описание
            </label>
            <textarea
              rows={4}
              placeholder="Подробное описание товара..."
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              value={form.description || ""}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>

          {/* Images Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Изображения товара
            </label>
            
            {/* Existing Images */}
            {form.images && form.images.length > 0 && (
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Текущие изображения:</p>
                <div className="flex flex-wrap gap-3">
                  {form.images.map((url, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={url}
                        alt={`existing-${index}`}
                        className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => removeExistingImage(url)}
                        className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition"
                        aria-label="Удалить изображение"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New Images Upload */}
            <div 
              onClick={handleFileInputClick}
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 hover:bg-blue-50 transition cursor-pointer"
            >
              <div className="flex flex-col items-center justify-center">
                <svg 
                  className="w-8 h-8 text-gray-400 mb-2" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                  ></path>
                </svg>
                <p className="text-gray-600">
                  <span className="text-blue-600 font-medium">Нажмите</span> чтобы добавить новые изображения
                </p>
                <p className="text-xs text-gray-500 mt-1">Поддерживаются JPG, PNG, до 5 МБ</p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            {/* New File Previews */}
            {newFiles.length > 0 && (
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">Новые изображения:</p>
                <div className="flex flex-wrap gap-3">
                  {newFiles.map((file, index) => (
                    <div key={index} className="relative group">
                      <div className="w-20 h-20 bg-gray-100 rounded-lg border border-gray-200 overflow-hidden">
                        {file.type.startsWith('image/') ? (
                          <img 
                            src={URL.createObjectURL(file)} 
                            alt={`preview-${index}`} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-500">
                            📄
                          </div>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeNewFile(index)}
                        className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition"
                        aria-label="Удалить изображение"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row sm:justify-end gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-5 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition"
          >
            Отмена
          </button>
          <button
            type="submit"
            disabled={loading || uploading}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading || uploading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {uploading ? "Загрузка..." : "Сохранение..."}
              </>
            ) : (
              "Сохранить изменения"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}