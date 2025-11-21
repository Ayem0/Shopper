import { ProductData } from '@/components/product/product-table-columns';
import { ProductSortBy } from '@/lib/search-params/product-search-params';

interface GetProductsRequest {
  sortBy: ProductSortBy;
  pageSize: number;
  pageIndex: number;
  sortDescending: boolean;
  searchTerm: string;
}

export interface GetProductsResponse {
  products: ProductData[];
  totalResults: number;
  pageSize: number;
  pageIndex: number;
  maxPageIndex: number;
}

export async function getProducts(
  req: GetProductsRequest,
  signal: AbortSignal
): Promise<GetProductsResponse> {
  const searchParams = new URLSearchParams();
  searchParams.append('sortBy', req.sortBy.toString());
  searchParams.append('pageSize', req.pageSize.toString());
  searchParams.append('pageIndex', req.pageIndex.toString());
  searchParams.append('sortDescending', req.sortDescending.toString());
  if (req.searchTerm) searchParams.append('searchTerm', req.searchTerm);
  const res = await fetch(`/api/product?${searchParams.toString()}`, {
    method: 'GET',
    signal: signal,
  });
  return res.json();
}
