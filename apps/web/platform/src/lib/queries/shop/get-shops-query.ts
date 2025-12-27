import { GetShopsRequest, GetShopsResponse } from '@shopify-clone/proto-ts';

export async function getShops(
  req: GetShopsRequest,
  signal: AbortSignal
): Promise<GetShopsResponse> {
  const searchParams = new URLSearchParams();
  searchParams.append('sortBy', req.sortBy.toString());
  searchParams.append('pageSize', req.pageSize.toString());
  searchParams.append('pageIndex', req.pageIndex.toString());
  searchParams.append('sortDescending', req.sortDescending.toString());
  req.types.forEach((type) => {
    searchParams.append('types', type.toString());
  });
  if (req.activeOnly) searchParams.append('activeOnly', 'true');
  if (req.searchTerm) searchParams.append('searchTerm', req.searchTerm);
  const res = await fetch(`/api/shop?${searchParams.toString()}`, {
    method: 'GET',
    signal: signal,
  });
  return res.json();
}
