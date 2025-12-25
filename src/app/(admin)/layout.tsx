// src/app/(admin)/layout.tsx
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

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
    return () => { mounted = false; };
  }, [router]);

  async function signOut() {
    await supabase.auth.signOut();
    router.replace("/login");
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Загрузка админ-панели...</div>
      </div>
    );
  }

  if (!isAdmin) return null;

  // Mobile toggle button
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Mobile header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-md hover:bg-gray-100"
          aria-label="Toggle menu"
        >
          <div className="w-6 h-0.5 bg-gray-700 mb-1.5"></div>
          <div className="w-6 h-0.5 bg-gray-700 mb-1.5"></div>
          <div className="w-6 h-0.5 bg-gray-700"></div>
        </button>
        <Link href="/" className="text-xl font-bold">Tanba Store</Link>
        <div className="w-6"></div> {/* Spacer for alignment */}
      </div>

      <div className="flex">
        {/* Sidebar - hidden on mobile by default */}
        <aside
          className={`${
            sidebarOpen ? 'block' : 'hidden'
          } md:block fixed md:sticky z-20 md:z-auto top-0 left-0 h-screen w-64 bg-white border-r p-6 overflow-y-auto transition-transform md:translate-x-0 ${
            !sidebarOpen ? '-translate-x-full' : ''
          }`}
        >
          <div className="mb-8">
            <Link href="/" onClick={() => setSidebarOpen(false)}>
              <div className="text-xl font-bold">Tanba Store</div>
            </Link>
            <div className="text-sm text-gray-500 mt-1">Admin panel</div>
          </div>

          <nav className="flex flex-col gap-2">
            <Link
              href="/products"
              className="px-3 py-2 rounded hover:bg-gray-100"
              onClick={() => setSidebarOpen(false)}
            >
              Товары
            </Link>
            <Link
              href="/orders"
              className="px-3 py-2 rounded hover:bg-gray-100"
              onClick={() => setSidebarOpen(false)}
            >
              Заказы
            </Link>
            <Link
              href="/stats"
              className="px-3 py-2 rounded hover:bg-gray-100"
              onClick={() => setSidebarOpen(false)}
            >
              Статистика
            </Link>
          </nav>

          <div className="mt-auto pt-6">
            <button
              onClick={() => {
                signOut();
                setSidebarOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded hover:bg-gray-100 text-red-600"
            >
              Выйти
            </button>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="md:hidden fixed inset-0 bg-black bg-opacity-30 z-10"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}

        {/* Main content */}
        <main className="flex-1 p-4 md:p-8 w-full">
          {children}
        </main>
      </div>
    </div>
  );
}