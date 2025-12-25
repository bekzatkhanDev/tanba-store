"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    // check admin email
    const allowed = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
    if (allowed && data.user?.email !== allowed) {
      setError("Доступ запрещён. Неверный админ-аккаунт.");
      await supabase.auth.signOut();
      setLoading(false);
      return;
    }

    router.replace("/products");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-md border rounded p-6 shadow">
        <h1 className="text-2xl font-semibold mb-4">Вход в админ-панель</h1>

        {error && <div className="text-red-600 mb-3">{error}</div>}

        <form onSubmit={submit} className="flex flex-col gap-3">
          <input
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="Email"
            className="border px-3 py-2 rounded"
            type="email"
            required
          />
          <input
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="Пароль"
            className="border px-3 py-2 rounded"
            type="password"
            required
          />
          <button disabled={loading} className="bg-black text-white px-4 py-2 rounded">
            {loading ? "Вход..." : "Войти"}
          </button>
        </form>
      </div>
    </div>
  );
}
