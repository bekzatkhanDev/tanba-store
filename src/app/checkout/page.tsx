import CheckoutForm from "./components/CheckoutForm";
import OrderSummary from "./components/OrderSummary";

export const metadata = {
  title: "Оформление заказа",
};

export default function CheckoutPage() {
  return (
    <div className="container mx-auto px-4 py-10 grid md:grid-cols-2 gap-10">
      <CheckoutForm />
      <OrderSummary />
    </div>
  );
}
