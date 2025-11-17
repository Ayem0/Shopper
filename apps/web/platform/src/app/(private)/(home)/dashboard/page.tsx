import TestDropdownSelect from '@/components/test/test-dropdown-select';
import { getQueryClient } from '@/lib/queries/get-query-client';
import { getShops } from '@/lib/queries/get-shops-query';
import { GetShopsRequest, ShopSortBy, ShopType } from '@shopify-clone/proto-ts';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
}) {
  const queryClient = getQueryClient();
  const params = await searchParams;
  const searchTerm = (params.s as string) ?? '';
  const activeOnly = params.active === 'true';
  const pageIndex = Number(params.page ?? 0);
  const pageSize = Number(params.size ?? 10);
  let sortBy = Number(params.sort);
  if (sortBy !== 1 && sortBy !== 2) sortBy = 1;
  const sortDesc = params.desc === 'true';
  const types: ShopType[] = Array.isArray(params.type)
    ? params.type.map((t) => Number(t))
    : params.type
    ? [Number(params.type)]
    : [];

  const req: GetShopsRequest = {
    activeOnly,
    searchTerm,
    sortBy: sortBy as ShopSortBy,
    sortDescending: sortDesc,
    pageIndex,
    pageSize,
    types,
  };

  await queryClient.prefetchQuery({
    queryKey: [
      'shops',
      {
        pagination: { pageIndex, pageSize },
        sorting: [{ id: sortBy.toString(), desc: sortDesc }],
        searchTerm,
        activeOnly,
        types,
      },
    ],
    queryFn: ({ signal }) => getShops(req, signal),
    staleTime: 60 * 1000,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="flex size-full">
        <TestDropdownSelect />
        {/* <ShopTable
          activeOnly={activeOnly}
          pagination={{ pageIndex: pageIndex, pageSize: pageSize }}
          searchTerm={searchTerm}
          sorting={[{ id: String(sortBy), desc: sortDesc }]}
          types={types}
        /> */}
      </div>
    </HydrationBoundary>
  );
}
