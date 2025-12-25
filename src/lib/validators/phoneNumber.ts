export const isValidKazakhPhone = (phone: string) => {
  const cleaned = phone.replace(/\D/g, "");
  return /^7\d{10}$/.test(cleaned); // формат 7XXXXXXXXXX
};
