import { OrderCreateInput, OrderUpdateStatusInput } from "./order.types";
import { isValidKazakhPhone } from "@/lib/validators/phoneNumber";

export function validateOrderCreate(payload: OrderCreateInput) {
  const errors: Record<string, string> = {};

  if (!payload.customer_name || payload.customer_name.trim().length < 2) {
    errors.customer_name = "Имя должно содержать минимум 2 символа.";
  }

  if (!isValidKazakhPhone(payload.phone)) {
    errors.phone = "Введите корректный казахстанский номер телефона.";
  }

  if (!payload.address || payload.address.trim().length < 5) {
    errors.address = "Адрес должен содержать минимум 5 символов.";
  }

  if (!payload.delivery_method) {
    errors.delivery_method = "Необходимо выбрать способ доставки.";
  }

  if (!payload.payment_method) {
    errors.payment_method = "Необходимо выбрать способ оплаты.";
  }

  if (!Array.isArray(payload.items) || payload.items.length === 0) {
    errors.items = "Список товаров не может быть пустым.";
  }

  payload.items.forEach((i, idx) => {
    if (!i.id || !i.name || !i.price || !i.qty) {
      errors[`items[${idx}]`] = "У товара отсутствуют обязательные поля.";
    }
  });

  return { valid: Object.keys(errors).length === 0, errors };
}

export function validateOrderStatusUpdate(payload: OrderUpdateStatusInput) {
  const errors: Record<string, string> = {};

  if (!payload.id) {
    errors.id = "ID заказа обязателен.";
  }

  if (!["pending", "confirmed", "delivered", "cancelled"].includes(payload.status)) {
    errors.status = "Недопустимый статус.";
  }

  return { valid: Object.keys(errors).length === 0, errors };
}
