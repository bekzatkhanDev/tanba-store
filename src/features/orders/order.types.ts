import { ApiResponse, Pagination } from "@/lib/types/api";

export type OrderItem = {
  id: string;
  name: string;
  price: number;
  qty: number;
};

export type Order = {
  id: string;
  customer_name: string;
  phone: string;
  address: string;
  delivery_method: string;
  payment_method: string;
  items: OrderItem[];
  total: number;
  status: "pending" | "confirmed" | "delivered" | "cancelled";
  created_at?: string;
};

export type OrderCreateInput = {
  customer_name: string;
  phone: string;
  address: string;
  delivery_method: string;
  payment_method: string;
  items: OrderItem[];
  total: number;
};

export type OrderUpdateStatusInput = {
  id: string;
  status: Order["status"];
};

export type OrderFilters = {
  q?: string; // по имени или номеру телефона
  status?: Order["status"];
  page?: number;
  limit?: number;
};

export type PaginatedOrders = Pagination<Order>;

export type OrdersApiResponse<T = Order | Order[] | PaginatedOrders> =
  ApiResponse<T>;
