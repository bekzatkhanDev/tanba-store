"use client";

import { useCartStore } from "@/store/cart.store";

export function useCartActions() {
  return {
    increment: useCartStore((s) => s.increment),
    decrement: useCartStore((s) => s.decrement),
    remove: useCartStore((s) => s.remove),
  };
}
