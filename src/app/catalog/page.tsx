import CatalogPage from "./components/CatalogPage";
import { getPublicProducts } from "@/features/products/product.service";

export const revalidate = 30;

type CatalogSearchParams = {
  q?: string;
  category?: string;
  minPrice?: string;
  maxPrice?: string;
  page?: string;
};

function normalizeFilters(params: CatalogSearchParams) {
  const toNumber = (v?: string) =>
    v && !isNaN(Number(v)) ? Number(v) : undefined;

  const page = toNumber(params.page) ?? 1;
  const limit = 12;

  return {
    q: params.q || undefined,
    category: params.category || undefined,
    minPrice: toNumber(params.minPrice),
    maxPrice: toNumber(params.maxPrice),
    page,
    limit,
  };
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<CatalogSearchParams>;
}) {
  const filters = normalizeFilters(await searchParams);
  const result = await getPublicProducts(filters);

  const pagination = result.success
    ? {
        page: result.data?.page,
        totalPages: Math.ceil(result.data?.total / result.data?.limit),
      }
    : undefined;

  return (
    <CatalogPage
      products={result.success ? result.data?.items : []}
      pagination={pagination}
      filters={filters}
    />
  );
}
