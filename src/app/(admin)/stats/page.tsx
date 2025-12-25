"use client";

import React, { useEffect, useState } from "react";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

type SalesPoint = { date: string; total: number; orders: number };
type StatsResponse = {
  summary: { totalRevenue: number; totalOrders: number; averageCheck: number };
  chart: SalesPoint[];
};

export default function AdminStatsPage() {
  const [data, setData] = useState<StatsResponse | null>(null);
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/stats?period=month");
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Error");
      setData(json.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  if (loading || !data) return <div>Загрузка статистики...</div>;

  const labels = data.chart.map((p) => p.date);
  const revenueData = data.chart.map((p) => p.total);
  const ordersData = data.chart.map((p) => p.orders);

  const line = {
    labels,
    datasets: [{ label: "Выручка", data: revenueData, fill: false, tension: 0.3 }],
  };

  const bar = {
    labels,
    datasets: [{ label: "Заказы", data: ordersData }],
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Статистика</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="border rounded p-4">
          <div className="text-sm text-gray-500">Выручка</div>
          <div className="text-2xl font-bold">{data.summary.totalRevenue} ₸</div>
        </div>
        <div className="border rounded p-4">
          <div className="text-sm text-gray-500">Заказы</div>
          <div className="text-2xl font-bold">{data.summary.totalOrders}</div>
        </div>
        <div className="border rounded p-4">
          <div className="text-sm text-gray-500">Средний чек</div>
          <div className="text-2xl font-bold">{data.summary.averageCheck} ₸</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="border rounded p-4">
          <h3 className="mb-4 font-medium">Выручка по дням</h3>
          <Line data={line as any} />
        </div>

        <div className="border rounded p-4">
          <h3 className="mb-4 font-medium">Количество заказов</h3>
          <Bar data={bar as any} />
        </div>
      </div>
    </div>
  );
}
