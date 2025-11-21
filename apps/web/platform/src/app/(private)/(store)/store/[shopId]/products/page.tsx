import { ProductTable } from '@/components/product/product-table';
import { getProducts } from '@/lib/queries/product/get-products-query';
import { getQueryClient } from '@/lib/queries/shop/get-query-client';
import { productSearchParamsCache } from '@/lib/search-params/product-search-params';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { SearchParams } from 'nuqs/server';

type PageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function ProductsPage({ searchParams }: PageProps) {
  const { search, pageIndex, pageSize, sort, desc } =
    await productSearchParamsCache.parse(searchParams);

  const queryClient = getQueryClient();

  void (await queryClient.prefetchQuery({
    queryKey: [
      'shops',
      {
        pagination: { pageIndex, pageSize },
        sorting: [{ id: sort.toString(), desc }],
        searchTerm: search,
      },
    ],
    queryFn: ({ signal }) =>
      getProducts(
        {
          sortBy: sort,
          pageSize,
          pageIndex,
          sortDescending: desc,
          searchTerm: search,
        },
        signal
      ),
    staleTime: 60 * 1000,
  }));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="flex size-full">
        <ProductTable />
      </div>
    </HydrationBoundary>
  );
}
