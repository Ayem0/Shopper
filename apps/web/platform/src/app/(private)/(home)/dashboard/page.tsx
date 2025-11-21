import { StoreTable } from '@/components/store/store-table';
import { getQueryClient } from '@/lib/queries/shop/get-query-client';
import { getShops } from '@/lib/queries/shop/get-shops-query';
import { storeSearchParamsCache } from '@/lib/search-params/store-search-params';
import { GetShopsRequest } from '@shopify-clone/proto-ts';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { SearchParams } from 'nuqs/server';

type PageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function DashboardPage({ searchParams }: PageProps) {
  const queryClient = getQueryClient();
  const { search, active, pageIndex, pageSize, sort, desc, types } =
    await storeSearchParamsCache.parse(searchParams);

  const req: GetShopsRequest = {
    activeOnly: active,
    searchTerm: search,
    sortBy: sort,
    sortDescending: desc,
    pageIndex,
    pageSize,
    types,
  };

  await queryClient.prefetchQuery({
    queryKey: [
      'shops',
      {
        pagination: { pageIndex, pageSize },
        sorting: [{ id: sort.toString(), desc }],
        searchTerm: search,
        activeOnly: active,
        types,
      },
    ],
    queryFn: ({ signal }) => getShops(req, signal),
    staleTime: 60 * 1000,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="flex size-full">
        <StoreTable />
      </div>
    </HydrationBoundary>
  );
}
