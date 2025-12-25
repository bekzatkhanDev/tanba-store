export type Product = {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  description?: string;
  images: string[];
  created_at: string;
};

export type Order = {
  id: string;
  customer_name: string;
  phone: string;
  address: string;
  items: Array<{
    id: string;
    name: string;
    price: number;
    qty: number;
  }>;
  total: number;
  status: "pending" | "confirmed" | "delivered" | "cancelled";
  created_at: string;
};
