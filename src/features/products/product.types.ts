import { ApiResponse, Pagination } from "@/lib/types/api";

export type Product = {
  id: string;
  name: string;
  price: number;
  stock: number;
  category?: string | null;
  description?: string | null;
  images: string[]; 
  created_at?: string | null;
  updated_at?: string | null;
};

export type ProductCreateInput = {
  name: string;
  price: number;
  stock: number;
  category?: string | null;
  description?: string | null;
  sizes?: string[],
  images?: string[]; 
};

export type ProductUpdateInput = Partial<ProductCreateInput> & {
  id: string;
};

export type ProductFilters = {
  q?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  limit?: number;
  page?: number;
  orderBy?: "price" | "created_at" | "name";
  orderDir?: "asc" | "desc";
};

export type PaginatedProducts = Pagination<Product>;

export type ProductsApiResponse<T = Product | Product[] | PaginatedProducts> =
  ApiResponse<T>;
