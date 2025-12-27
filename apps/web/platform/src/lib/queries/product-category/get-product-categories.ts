import {
  GetProductCategoriesRequest,
  GetProductCategoriesResponse,
} from '@shopify-clone/proto-ts';

export async function getProductCategories(
  req: GetProductCategoriesRequest,
  signal: AbortSignal
): Promise<GetProductCategoriesResponse> {
  const searchParams = new URLSearchParams();
  searchParams.append('sortBy', req.sortBy.toString());
  searchParams.append('pageSize', req.pageSize.toString());
  searchParams.append('pageIndex', req.pageIndex.toString());
  searchParams.append('desc', req.desc.toString());
  searchParams.append('shopId', req.shopId);
  if (req.status.length > 0)
    searchParams.append('status', req.status.toString());
  if (req.search) searchParams.append('search', req.search);
  const res = await fetch(`/api/product-category?${searchParams.toString()}`, {
    method: 'GET',
    signal: signal,
  });
  return res.json();
}
