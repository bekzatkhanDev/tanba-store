"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  qty: number;
};

type CartState = {
  items: CartItem[];

  add: (item: CartItem) => void;
  remove: (id: string) => void;
  clear: () => void;
  increment: (id: string) => void;
  decrement: (id: string) => void;

  total: () => number;
  count: () => number;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      add: (item) =>
        set((state) => {
          const exists = state.items.find((i) => i.id === item.id);

          if (exists) {
            return {
              items: state.items.map((i) =>
                i.id === item.id
                  ? { ...i, qty: i.qty + item.qty }
                  : i
              ),
            };
          }

          return { items: [...state.items, item] };
        }),

      remove: (id) =>
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        })),

      clear: () => set({ items: [] }),

      increment: (id) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id ? { ...i, qty: i.qty + 1 } : i
          ),
        })),

      decrement: (id) =>
        set((state) => ({
          items: state.items
            .map((i) =>
              i.id === id
                ? { ...i, qty: Math.max(1, i.qty - 1) }
                : i
            )
            .filter((i) => i.qty > 0),
        })),

      total: () =>
        get().items.reduce((sum, i) => sum + i.price * i.qty, 0),

      count: () =>
        get().items.reduce((sum, i) => sum + i.qty, 0),
    }),
    {
      name: "cart-storage",
    }
  )
);
