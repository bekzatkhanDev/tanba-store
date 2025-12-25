export default function SuccessMessage({ order }: any) {
  return (
    <div className="p-6 border rounded-lg shadow-sm">
      <h2 className="text-2xl font-semibold mb-4">Заказ оформлен</h2>

      <div className="text-gray-700">
        Спасибо за заказ! Наш менеджер скоро свяжется с вами.
      </div>

      <div className="mt-4 text-sm text-gray-500">
        Номер заказа: <b>{order.id}</b>
      </div>
    </div>
  );
}
