"use client";

import { useState } from "react";
import { Order, useOrders, useCreateOrder, useUpdateOrderStatus } from "./hooks/useOrders";
import { useOrderFormStore } from "@/store/orderFormStore";

export default function AdminOrdersPage() {
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { form, setField, reset, loadOrder } = useOrderFormStore();

  const { data: orders = [], isLoading } = useOrders(search);
  const createOrder = useCreateOrder();
  const updateOrder = useUpdateOrderStatus();

  const openNewOrder = () => {
    reset();
    setIsModalOpen(true);
  };

  const openEditOrder = (order: Order) => {
    loadOrder(order);
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    try {
      if (form.id) {
        await updateOrder.mutateAsync({ id: form.id, status: form.status });
      } else {
        await createOrder.mutateAsync({
          customer_name: form.customer_name,
          phone: form.phone,
          total: form.total,
          status: form.status,
        });
      }
      setIsModalOpen(false);
      reset();
    } catch (err: any) {
      alert("Ошибка: " + (err.message || "Не удалось сохранить заказ"));
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Заказы</h1>
        <div className="flex gap-2">
          <input
            placeholder="Поиск по имени или телефону..."
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
          />
          <button
            onClick={openNewOrder}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors"
          >
            + Новый заказ
          </button>
        </div>
      </div>

      {/* Orders List */}
      {isLoading ? (
        <div className="text-center py-8 text-gray-600">Загрузка заказов...</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <div className="text-5xl mb-4">📭</div>
          Нет заказов
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <div
              key={order.id}
              className="p-4 border border-gray-200 rounded-lg hover:shadow-md cursor-pointer transition-shadow bg-white"
              onClick={() => openEditOrder(order)}
            >
              <div className="flex justify-between">
                <strong className="text-gray-900">{order.customer_name}</strong>
                <span className="font-bold text-emerald-700">{order.total.toLocaleString()} ₸</span>
              </div>
              <div className="text-sm text-gray-600 mt-1">{order.phone}</div>
              <div className="text-xs mt-2">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  order.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                  order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {order.status === 'pending' ? 'Ожидает' :
                   order.status === 'confirmed' ? 'Подтвержден' :
                   order.status === 'delivered' ? 'Доставлен' : 'Отменен'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal (Jira-like popup) */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div 
            className="bg-white rounded-xl w-full max-w-md p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {form.id ? "Редактировать заказ" : "Новый заказ"}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Имя клиента</label>
                <input
                  placeholder="Иван Иванов"
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  value={form.customer_name}
                  onChange={(e) => setField("customer_name", e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Телефон</label>
                <input
                  placeholder="+7 (777) 881 5280"
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  value={form.phone}
                  onChange={(e) => setField("phone", e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Сумма (₸)</label>
                <input
                  type="number"
                  min="0"
                  placeholder="15000"
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  value={form.total || ""}
                  onChange={(e) => setField("total", Number(e.target.value) || 0)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Статус</label>
                <select
                  value={form.status}
                  onChange={(e) => setField("status", e.target.value as any)}
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
                >
                  <option value="pending">Ожидает подтверждения</option>
                  <option value="confirmed">Подтвержден</option>
                  <option value="delivered">Доставлен</option>
                  <option value="cancelled">Отменен</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Отмена
              </button>
              <button
                onClick={handleSubmit}
                disabled={createOrder.isPending || updateOrder.isPending}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-medium rounded-lg transition-colors"
              >
                {createOrder.isPending || updateOrder.isPending ? "Сохранение..." : "Сохранить"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}