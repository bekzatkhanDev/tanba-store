"use client";

import React, { useEffect, useState } from "react";

type Order = {
  id: string;
  customer_name: string;
  phone: string;
  total: number;
  status: "pending" | "confirmed" | "delivered" | "cancelled";
  created_at: string;
};

export default function AdminOrdersPage() {
  const [items, setItems] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState("");

  async function load() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (q) params.set("q", q);
      params.set("limit", "100");
      const res = await fetch(`/api/orders?${params.toString()}`);
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Error");
      const data = json.data;
      setItems(data?.items ?? []);
    } catch (err) {
      console.error(err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function updateStatus(orderId: string, status: Order["status"]) {
    const res = await fetch(`/api/orders/${orderId}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const json = await res.json();
    if (json.success) {
      setItems((s) => s.map((o) => (o.id === orderId ? json.data : o)));
    } else {
      alert("Ошибка: " + json.error);
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Заказы</h1>
        <div className="flex gap-2">
          <input className="border px-3 py-2 rounded" placeholder="Поиск" value={q} onChange={(e)=>setQ(e.target.value)} />
          <button className="px-3 py-2 border rounded" onClick={load}>Найти</button>
        </div>
      </div>

      <div className="grid gap-2">
        <div className="hidden md:flex font-semibold border-b py-2 px-3">
          <div className="w-10">#</div>
          <div className="flex-1">Клиент</div>
          <div className="w-32 text-right">Сумма</div>
          <div className="w-48 text-right">Дата</div>
          <div className="w-48 text-right">Статус</div>
        </div>

        {loading ? (<div>Загрузка...</div>) : items.length === 0 ? (
          <div className="py-6 text-gray-600">Заказы не найдены</div>
        ) : items.map((o, idx) => (
          <div key={o.id} className="flex items-center border-b py-3 px-3">
            <div className="w-10 text-sm text-gray-500">{idx + 1}</div>
            <div className="flex-1">
              <div className="font-medium">{o.customer_name}</div>
              <div className="text-xs text-gray-500">{o.phone}</div>
            </div>
            <div className="w-32 text-right">{o.total} ₸</div>
            <div className="w-48 text-right">{new Date(o.created_at).toLocaleString()}</div>
            <div className="w-48 text-right">
              <select value={o.status} onChange={(e) => updateStatus(o.id, e.target.value as any)} className="border px-2 py-1 rounded">
                <option value="pending">pending</option>
                <option value="confirmed">confirmed</option>
                <option value="delivered">delivered</option>
                <option value="cancelled">cancelled</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
