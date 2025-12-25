"use client";

import { useState } from "react";
import { useCheckout } from "../hooks/useCheckout";
import SuccessMessage from "./SuccessMessage";

export default function CheckoutForm() {
  const { submitOrder, loading, successData } = useCheckout();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    comment: "",
  });

  function handleChange(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  if (successData) {
    return <SuccessMessage order={successData} />;
  }

  return (
    <div className="border rounded-lg p-6 shadow-sm">
      <h2 className="text-2xl font-semibold mb-6">Данные покупателя</h2>

      <div className="flex flex-col gap-4">
        <input
          className="border px-3 py-2 rounded"
          placeholder="Ваше имя"
          value={form.name}
          onChange={(e) => handleChange("name", e.target.value)}
        />

        <input
          className="border px-3 py-2 rounded"
          placeholder="Номер телефона"
          value={form.phone}
          onChange={(e) => handleChange("phone", e.target.value)}
        />

        <textarea
          className="border px-3 py-2 rounded"
          placeholder="Адрес доставки"
          value={form.address}
          onChange={(e) => handleChange("address", e.target.value)}
        />

        <textarea
          className="border px-3 py-2 rounded"
          placeholder="Комментарий к заказу (необязательно)"
          value={form.comment}
          onChange={(e) => handleChange("comment", e.target.value)}
        />

        <button
          disabled={loading}
          onClick={() => submitOrder(form)}
          className="bg-black text-white py-3 rounded"
        >
          {loading ? "Отправка..." : "Оформить заказ"}
        </button>
      </div>
    </div>
  );
}
