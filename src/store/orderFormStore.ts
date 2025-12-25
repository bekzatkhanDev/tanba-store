// store/orderFormStore.ts
import { create } from 'zustand';
import { Order } from '@/app/(admin)/orders/hooks/useOrders';

type OrderForm = Omit<Order, 'id' | 'created_at' | 'updated_at'> & { id?: string };

type OrderFormStore = {
  form: OrderForm;
  setField: (key: keyof OrderForm, value: any) => void;
  reset: () => void;
  loadOrder: (order: Partial<Order>) => void;
};

export const useOrderFormStore = create<OrderFormStore>((set) => ({
  form: {
    customer_name: '',
    phone: '',
    total: 0,
    status: 'pending',
  },
  setField: (key, value) =>
    set((state) => ({
      form: { ...state.form, [key]: value },
    })),
  reset: () =>
    set({
      form: {
        customer_name: '',
        phone: '',
        total: 0,
        status: 'pending',
      },
    }),
  loadOrder: (order) =>
    set({
      form: {
        id: order.id,
        customer_name: order.customer_name || '',
        phone: order.phone || '',
        total: order.total || 0,
        status: order.status || 'pending',
      },
    }),
}));