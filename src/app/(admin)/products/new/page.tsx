"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewProductPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    price: "",
    stock: "",
    category: "",
    description: "",
  });
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function onFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const list = e.target.files;
    if (!list) return;
    setFiles(Array.from(list));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = new FormData();
      data.append("name", form.name);
      data.append("price", String(form.price));
      data.append("stock", String(form.stock));
      data.append("category", form.category);
      data.append("description", form.description);

      // Добавляем реальные файлы, если есть
      files.forEach((file) => data.append("images", file));

      const res = await fetch("/api/products", {
        method: "POST",
        body: data,
      });

      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Create failed");

      router.replace("/products");
    } catch (err: any) {
      setError(err.message || "Ошибка");
    } finally {
      setLoading(false);
    }
  }


  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Создать товар</h1>

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
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        />
        <textarea
          placeholder="Описание"
          className="border px-3 py-2 rounded"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <input type="file" multiple accept="image/*" onChange={onFiles} />
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
