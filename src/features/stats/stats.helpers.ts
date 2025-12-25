import { Order } from "@/features/orders/order.types";
import { SalesPoint, StatsSummary } from "./stats.types";

// Преобразуем дату в формат YYYY-MM-DD
export function normalizeDate(date: string) {
  return new Date(date).toISOString().slice(0, 10);
}

// Группировка заказов по дню
export function groupOrdersByDay(orders: Order[]): SalesPoint[] {
  const map = new Map<string, { total: number; orders: number }>();

  for (const order of orders) {
    const date = normalizeDate(order.created_at ?? "");
    const value = map.get(date) ?? { total: 0, orders: 0 };

    value.total += order.total;
    value.orders += 1;

    map.set(date, value);
  }

  // Преобразуем в массив, отсортированный по дате
  return Array.from(map.entries())
    .map(([date, v]) => ({
      date,
      total: v.total,
      orders: v.orders,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

// Итоги: сумма, количество, средний чек
export function buildStatsSummary(orders: Order[]): StatsSummary {
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((s, o) => s + o.total, 0);
  const averageCheck = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  return {
    totalRevenue,
    totalOrders,
    averageCheck: Math.round(averageCheck),
  };
}
