import { supabase } from "@/lib/supabase/client";
import { supabaseAdmin } from "@/lib/supabase/admin";

import {
  Order,
  OrderCreateInput,
  OrderFilters,
  OrderUpdateStatusInput,
  PaginatedOrders,
} from "./order.types";
import { ApiResponse } from "@/lib/types/api";
import { validateOrderCreate, validateOrderStatusUpdate } from "./order.validators";

const ORDERS_TABLE = "orders";

function toErrorResponse<T = never>(message: string): ApiResponse<T> {
  return { success: false, error: message };
}

function calculateTotal(items: { price: number; qty: number }[]) {
  return items.reduce((s, i) => s + i.price * i.qty, 0);
}

/**
 * PUBLIC: Получить заказ по ID (например, клиент может видеть свой заказ)
 */
export async function getOrderById(id: string): Promise<ApiResponse<Order>> {
  try {
    const res = await supabase.from(ORDERS_TABLE).select("*").eq("id", id).single();

    if (res.error) {
      return toErrorResponse("Ошибка получения заказа: " + res.error.message);
    }

    return { success: true, data: res.data as Order };
  } catch (err) {
    console.error("getOrderById error:", err);
    return toErrorResponse("Внутренняя ошибка при получении заказа.");
  }
}

/**
 * PUBLIC: Создать заказ (используется в checkout)
 */
export async function createOrder(
  payload: OrderCreateInput
): Promise<ApiResponse<Order>> {
  try {
    const { valid, errors } = validateOrderCreate(payload);
    if (!valid) {
      return { success: false, error: "Валидация не пройдена", data: errors as any };
    }

    const total = calculateTotal(payload.items);

    const res = await supabaseAdmin
      .from(ORDERS_TABLE)
      .insert({
        ...payload,
        total,
        status: "pending",
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (res.error) {
      return toErrorResponse("Ошибка создания заказа: " + res.error.message);
    }

    return { success: true, data: res.data as Order };
  } catch (err) {
    console.error("createOrder error:", err);
    return toErrorResponse("Внутренняя ошибка при создании заказа.");
  }
}

/**
 * ADMIN: Получить список заказов с фильтрами, поиском и пагинацией
 */
export async function adminGetOrders(
  filters: OrderFilters = {}
): Promise<ApiResponse<PaginatedOrders>> {
  try {
    const limit = filters.limit ?? 20;
    const page = Math.max(1, filters.page ?? 1);
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
      .from(ORDERS_TABLE)
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false });

    if (filters.status) {
      query = query.eq("status", filters.status);
    }

    if (filters.q) {
      const q = filters.q.trim();
      query = query.or(`customer_name.ilike.%${q}%,phone.ilike.%${q}%`);
    }

    const res = await query.range(from, to);

    if (res.error) {
      return toErrorResponse("Ошибка получения заказов: " + res.error.message);
    }

    const items = res.data as Order[];
    const total = res.count ?? items.length;

    const payload: PaginatedOrders = { items, total, page, limit };

    return { success: true, data: payload };
  } catch (err) {
    console.error("adminGetOrders error:", err);
    return toErrorResponse("Внутренняя ошибка при получении заказов.");
  }
}

/**
 * ADMIN: Обновить статус заказа
 */
export async function adminUpdateOrderStatus(
  payload: OrderUpdateStatusInput
): Promise<ApiResponse<Order>> {
  try {
    const { valid, errors } = validateOrderStatusUpdate(payload);
    if (!valid) {
      return { success: false, error: "Валидация не пройдена", data: errors as any };
    }

    const res = await supabaseAdmin
      .from(ORDERS_TABLE)
      .update({
        status: payload.status,
      })
      .eq("id", payload.id)
      .select()
      .single();

    if (res.error) {
      return toErrorResponse("Ошибка обновления статуса: " + res.error.message);
    }

    return { success: true, data: res.data as Order };
  } catch (err) {
    console.error("adminUpdateOrderStatus error:", err);
    return toErrorResponse("Внутренняя ошибка при обновлении статуса.");
  }
}

/**
 * ADMIN: Удалить заказ
 */
export async function adminDeleteOrder(id: string): Promise<ApiResponse<null>> {
  try {
    const res = await supabaseAdmin.from(ORDERS_TABLE).delete().eq("id", id);

    if (res.error) {
      return toErrorResponse("Ошибка удаления заказа: " + res.error.message);
    }

    return { success: true, data: null };
  } catch (err) {
    console.error("adminDeleteOrder error:", err);
    return toErrorResponse("Внутренняя ошибка при удалении заказа.");
  }
}
