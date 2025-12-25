// features/stats/stats.types.ts

import { ApiResponse } from "@/lib/types/api";
import { Order } from "@/features/orders/order.types";

export type SalesPoint = {
  date: string;     // YYYY-MM-DD
  total: number;    // total revenue for that date
  orders: number;   // number of orders for that date
};

export type SalesRange = {
  from: string; // YYYY-MM-DD
  to: string;   // YYYY-MM-DD
};

export type StatsSummary = {
  totalRevenue: number;
  totalOrders: number;
  averageCheck: number;
};

export type StatsPeriod = "day" | "week" | "month" | "year" | "custom";

export type StatsResponse = {
  summary: StatsSummary;
  chart: SalesPoint[];
  orders: Order[];
};

export type StatsApiResponse<T = StatsResponse> = ApiResponse<T>;
