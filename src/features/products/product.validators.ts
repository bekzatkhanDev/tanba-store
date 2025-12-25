import { ProductCreateInput, ProductUpdateInput } from "./product.types";

export const validateProductCreate = (payload: ProductCreateInput) => {
  const errors: Record<string, string> = {};

  if (!payload.name || payload.name.trim().length < 2) {
    errors.name = "Название должно содержать минимум 2 символа.";
  }

  if (typeof payload.price !== "number" || Number.isNaN(payload.price) || payload.price < 0) {
    errors.price = "Цена должна быть числом >= 0.";
  }

  if (!Number.isInteger(payload.stock) || payload.stock < 0) {
    errors.stock = "Остаток (stock) должен быть целым числом >= 0.";
  }

  if (payload.images && !Array.isArray(payload.images)) {
    errors.images = "Images должен быть массивом строк (путей/URL).";
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateProductUpdate = (payload: ProductUpdateInput) => {
  const errors: Record<string, string> = {};

  if (!payload.id) {
    errors.id = "ID продукта обязателен.";
  }

  if (payload.name !== undefined && payload.name.trim().length < 2) {
    errors.name = "Название должно содержать минимум 2 символа.";
  }

  if (payload.price !== undefined && (typeof payload.price !== "number" || Number.isNaN(payload.price) || payload.price < 0)) {
    errors.price = "Цена должна быть числом >= 0.";
  }

  if (payload.stock !== undefined && (!Number.isInteger(payload.stock) || payload.stock < 0)) {
    errors.stock = "Остаток (stock) должен быть целым числом >= 0.";
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
};
