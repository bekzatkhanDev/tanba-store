"use client";

import { useState } from "react";
import { useCartStore } from "@/store/cart.store";
import { createOrder } from "@/features/orders/order.service";
import { OrderCreateInput } from "@/features/orders/order.types";

export function useCheckout() {
  const cart = useCartStore();
  const [loading, setLoading] = useState(false);
  const [successData, setSuccessData] = useState<any>(null);

  async function submitOrder(form: OrderCreateInput) {
    if (cart.items.length === 0) return;

    setLoading(true);

    const payload = {
      customer_name: form.customer_name,
      phone: form.phone,
      address: form.address,
      delivery_method: form.delivery_method,
      payment_method: form.payment_method,
      items: cart.items.map((i) => ({
        id: i.id,
        name: i.name,
        qty: i.qty,
        price: i.price,
      })),
      total: cart.total(),
    };

    const res = await createOrder(payload);

    if (res.success) {
      setSuccessData(res.data);
      cart.clear();
    }

    setLoading(false);
  }

  return {
    submitOrder,
    loading,
    successData,
  };
}
