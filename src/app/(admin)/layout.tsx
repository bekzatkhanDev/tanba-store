"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function check() {
      const { data } = await supabase.auth.getUser();
      const user = data.user;
      const allowed = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
      if (!user || (allowed && user.email !== allowed)) {
        if (mounted) {
          router.replace("/login");
          setIsAdmin(false);
        }
      } else {
        if (mounted) setIsAdmin(true);
      }
      if (mounted) setLoading(false);
    }

    check();

    return () => {
      mounted = false;
    };
  }, [router]);

  async function signOut() {
    await supabase.auth.signOut();
    router.replace("/login");
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Загрузка админ-панели...</div>
      </div>
    );
  }

  if (!isAdmin) return null; 

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <div className="flex">
        <aside className="w-64 border-r h-screen sticky top-0 p-6">
          <div className="mb-8">
            <Link href="/"><div className="text-xl font-bold">Tanba Store</div></Link>
            <div className="text-sm text-gray-500 mt-1">Admin panel</div>
          </div>

          <nav className="flex flex-col gap-2">
            <Link href="/products" className="px-3 py-2 rounded hover:bg-gray-100">Товары</Link>
            <Link href="/orders" className="px-3 py-2 rounded hover:bg-gray-100">Заказы</Link>
            <Link href="/stats" className="px-3 py-2 rounded hover:bg-gray-100">Статистика</Link>
          </nav>

          <div className="mt-auto pt-6">
            <button onClick={signOut} className="w-full text-left px-3 py-2 rounded hover:bg-gray-100 text-red-600">Выйти</button>
          </div>
        </aside>

        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
