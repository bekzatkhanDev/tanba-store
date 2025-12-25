import { supabaseAdmin } from "@/lib/supabase/admin";
import {
  StatsPeriod,
  StatsResponse,
  StatsApiResponse,
  SalesRange,
} from "./stats.types";
import { Order } from "@/features/orders/order.types";
import {
  groupOrdersByDay,
  buildStatsSummary,
  normalizeDate,
} from "./stats.helpers";

const ORDERS_TABLE = "orders";

function toErrorResponse<T = never>(message: string): StatsApiResponse<T> {
  return { success: false, error: message };
}

// Вычисление диапазонов дат (day/week/month/year/custom)
function computeDateRange(period: StatsPeriod, custom?: SalesRange): SalesRange {
  const today = new Date();
  const to = normalizeDate(today.toISOString());

  let fromDate = new Date();

  switch (period) {
    case "day":
      // сегодня
      break;

    case "week":
      fromDate.setDate(fromDate.getDate() - 7);
      break;

    case "month":
      fromDate.setMonth(fromDate.getMonth() - 1);
      break;

    case "year":
      fromDate.setFullYear(fromDate.getFullYear() - 1);
      break;

    case "custom":
      if (!custom) {
        throw new Error("Для custom периода требуется указать from/to");
      }
      return custom;
  }

  const from = normalizeDate(fromDate.toISOString());
  return { from, to };
}

/**
 * ADMIN: Получить полную статистику за период
 * summary + chart + raw orders
 */
export async function getStats(
  period: StatsPeriod = "month",
  custom?: SalesRange
): Promise<StatsApiResponse<StatsResponse>> {
  try {
    const range = computeDateRange(period, custom);

    // получаем заказы за период
    const res = await supabaseAdmin
      .from(ORDERS_TABLE)
      .select("*")
      .gte("created_at", range.from)
      .lte("created_at", range.to)
      .order("created_at", { ascending: true });

    if (res.error) {
      return toErrorResponse("Ошибка получения статистики: " + res.error.message);
    }

    const orders = (res.data as unknown) as Order[];

    // Подсчёт итогов
    const summary = buildStatsSummary(orders);

    // Графики: группировка по дням
    const chart = groupOrdersByDay(orders);

    const payload: StatsResponse = {
      summary,
      chart,
      orders,
    };

    return { success: true, data: payload };
  } catch (err) {
    console.error("getStats error:", err);
    return toErrorResponse("Внутренняя ошибка при получении статистики.");
  }
}

/**
 * ADMIN: Получить только summary (без графика)
 */
export async function getStatsSummary(
  period: StatsPeriod = "month",
  custom?: SalesRange
): Promise<StatsApiResponse<StatsResponse["summary"]>> {
  const full = await getStats(period, custom);

  if (!full.success || !full.data) {
    return full as any;
  }

  return {
    success: true,
    data: full.data.summary,
  };
}

/**
 * ADMIN: Получить только данные для графика
 */
export async function getStatsChart(
  period: StatsPeriod = "month",
  custom?: SalesRange
): Promise<StatsApiResponse<StatsResponse["chart"]>> {
  const full = await getStats(period, custom);

  if (!full.success || !full.data) {
    return full as any;
  }

  return {
    success: true,
    data: full.data.chart,
  };
}
