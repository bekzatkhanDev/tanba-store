import { supabase } from "@/lib/supabase/client";
import { supabaseAdmin } from "@/lib/supabase/admin";
import {
  Product,
  ProductCreateInput,
  ProductFilters,
  PaginatedProducts,
  ProductUpdateInput,
} from "./product.types";
import { ApiResponse } from "@/lib/types/api";

const PRODUCTS_TABLE = "products";

function toErrorResponse<T = never>(message: string): ApiResponse<T> {
  return { success: false, error: message };
}

/** Публичный метод: получить список продуктов с фильтрацией/пагинацией */
export async function getPublicProducts(
  filters: ProductFilters = {}
): Promise<ApiResponse<PaginatedProducts>> {
  try {
    const limit = filters.limit ?? 20;
    const page = Math.max(1, filters.page ?? 1);
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    // Не указываем generic в from() — безопаснее для совместимости типов supabase-js
    let query = supabase
      .from(PRODUCTS_TABLE)
      .select("*", { count: "exact" })
      .order(filters.orderBy ?? "created_at", {
        ascending: (filters.orderDir ?? "desc") === "asc",
      });

    if (filters.q) {
      const q = filters.q.trim();
      // Примитивный ilike/OR: supabase-js поддерживает .or()
      // Для сложного поиска лучше использовать full-text search на стороне БД
      query = query.ilike("name", `%${q}%`).or(`description.ilike.%${q}%`);
    }

    if (filters.category) {
      query = query.eq("category", filters.category);
    }

    if (filters.minPrice !== undefined) {
      query = query.gte("price", filters.minPrice);
    }

    if (filters.maxPrice !== undefined) {
      query = query.lte("price", filters.maxPrice);
    }

    const res = await query.range(from, to);

    if (res.error) {
      return toErrorResponse("Ошибка при получении продуктов: " + res.error.message);
    }

    // Приводим тип данных к Product[] (runtime-типизация остаётся на вашей БД)
    const items = (res.data as unknown) as Product[];
    const total = (res.count ?? items.length) as number;

    const payload: PaginatedProducts = {
      items,
      total,
      page,
      limit,
    };

    return { success: true, data: payload };
  } catch (err) {
    console.error("getPublicProducts error:", err);
    return toErrorResponse("Внутренняя ошибка при получении продуктов.");
  }
}

/** Публичный метод: получить один продукт по id */
export async function getProductById(id: string): Promise<ApiResponse<Product>> {
  try {
    const res = await supabase.from(PRODUCTS_TABLE).select("*").eq("id", id).single();

    if (res.error) {
      if (res.status === 406 || res.status === 404) {
        return toErrorResponse("Продукт не найден.");
      }
      return toErrorResponse("Ошибка при получении продукта: " + res.error.message);
    }

    return { success: true, data: (res.data as unknown) as Product };
  } catch (err) {
    console.error("getProductById error:", err);
    return toErrorResponse("Внутренняя ошибка при получении продукта.");
  }
}

/** Admin: создать продукт (server-side) */
export async function adminCreateProduct(
  payload: ProductCreateInput
): Promise<ApiResponse<Product>> {
  try {
    const res = await supabaseAdmin
      .from(PRODUCTS_TABLE)
      .insert({
        ...payload,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (res.error) {
      return toErrorResponse("Ошибка при создании продукта: " + res.error.message);
    }

    return { success: true, data: (res.data as unknown) as Product };
  } catch (err) {
    console.error("adminCreateProduct error:", err);
    return toErrorResponse("Внутренняя ошибка при создании продукта.");
  }
}

/** Admin: обновить продукт (server-side) */
export async function adminUpdateProduct(
  payload: ProductUpdateInput
): Promise<ApiResponse<Product>> {
  try {
    const { id, ...rest } = payload;

    const res = await supabaseAdmin
      .from(PRODUCTS_TABLE)
      .update({
        ...rest,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (res.error) {
      return toErrorResponse("Ошибка при обновлении продукта: " + res.error.message);
    }

    return { success: true, data: (res.data as unknown) as Product };
  } catch (err) {
    console.error("adminUpdateProduct error:", err);
    return toErrorResponse("Внутренняя ошибка при обновлении продукта.");
  }
}

/** Admin: удалить продукт (server-side) */
export async function adminDeleteProduct(id: string): Promise<ApiResponse<null>> {
  try {
    const res = await supabaseAdmin.from(PRODUCTS_TABLE).delete().eq("id", id);

    if (res.error) {
      return toErrorResponse("Ошибка при удалении продукта: " + res.error.message);
    }

    return { success: true, data: null };
  } catch (err) {
    console.error("adminDeleteProduct error:", err);
    return toErrorResponse("Внутренняя ошибка при удалении продукта.");
  }
}

/** Admin: bulk update stock */
export async function adminBulkUpdateStock(
  items: { id: string; stock: number }[]
): Promise<ApiResponse<null>> {
  try {
    for (const it of items) {
      const res = await supabaseAdmin
        .from(PRODUCTS_TABLE)
        .update({ stock: it.stock })
        .eq("id", it.id);

      if (res.error) {
        console.warn("bulkUpdateStock partial error:", res.error);
      }
    }
    return { success: true, data: null };
  } catch (err) {
    console.error("adminBulkUpdateStock error:", err);
    return toErrorResponse("Внутренняя ошибка при обновлении остатков.");
  }
}
