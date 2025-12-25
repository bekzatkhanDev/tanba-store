export const formatPrice = (value: number) => {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "KZT",
    minimumFractionDigits: 0
  }).format(value);
};
