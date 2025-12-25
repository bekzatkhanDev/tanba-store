"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<any>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);

  // ===== Загрузка товара =====
  useEffect(() => {
    if (!id) return;

    let mounted = true;

    async function load() {
      setLoading(true);
      try {
        const res = await fetch(`/api/products/${id}`);
        const json = await res.json();

        if (!json.success) {
          throw new Error(json.error || "Товар не найден");
        }

        if (mounted) {
          setForm(json.data);
        }
      } catch (err: any) {
        if (mounted) {
          setError(err.message || "Ошибка загрузки");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, [id]);

  function onFiles(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return;
    setFiles(Array.from(e.target.files));
  }

  // ===== Сохранение =====
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      let imageUrls: string[] = form.images ?? [];

      // Загрузка новых файлов (если выбраны)
      if (files.length > 0) {
        const data = new FormData();
        files.forEach((f) => data.append("files", f));
        data.append("bucket", "products");
        data.append("folder", "product-gallery");

        const up = await fetch("/api/upload", {
          method: "POST",
          body: data,
        });

        const upJson = await up.json();
        if (!upJson.success) {
          throw new Error(upJson.error || "Upload failed");
        }

        imageUrls = [
          ...imageUrls,
          ...upJson.data.success.map((s: any) => s.url),
        ];
      }

      const payload = {
        name: form.name,
        price: Number(form.price),
        stock: Number(form.stock),
        category: form.category,
        description: form.description,
        images: imageUrls,
      };

      const res = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!json.success) {
        throw new Error(json.error || "Update failed");
      }

      router.replace("/(admin)/products");
    } catch (err: any) {
      setError(err.message || "Ошибка сохранения");
    } finally {
      setLoading(false);
    }
  }

  // ===== Состояния =====
  if (!id) {
    return <div className="text-red-600">Некорректный ID товара</div>;
  }

  if (loading && !form) {
    return <div>Загрузка...</div>;
  }

  if (!form) {
    return <div className="text-red-600">{error ?? "Товар не найден"}</div>;
  }

  // ===== UI =====
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Редактировать товар</h1>

      {error && <div className="text-red-600 mb-3">{error}</div>}

      <form onSubmit={submit} className="grid gap-3 max-w-xl">
        <input
          required
          placeholder="Название"
          className="border px-3 py-2 rounded"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          required
          placeholder="Цена"
          type="number"
          className="border px-3 py-2 rounded"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
        />

        <input
          required
          placeholder="Остаток"
          type="number"
          className="border px-3 py-2 rounded"
          value={form.stock}
          onChange={(e) => setForm({ ...form, stock: e.target.value })}
        />

        <input
          placeholder="Категория"
          className="border px-3 py-2 rounded"
          value={form.category ?? ""}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        />

        <textarea
          placeholder="Описание"
          className="border px-3 py-2 rounded"
          value={form.description ?? ""}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />

        <div>
          <div className="text-sm text-gray-600 mb-2">
            Текущие изображения:
          </div>

          <div className="flex gap-2 mb-2 flex-wrap">
            {form.images?.map((url: string) => (
              <img
                key={url}
                src={url}
                className="w-20 h-20 object-cover rounded border"
                alt=""
              />
            ))}
          </div>

          <input type="file" multiple accept="image/*" onChange={onFiles} />
        </div>

        <div className="flex gap-3">
          <button
            disabled={loading}
            className="bg-black text-white px-4 py-2 rounded"
          >
            {loading ? "Сохранение..." : "Сохранить"}
          </button>

          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 border rounded"
          >
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
}
