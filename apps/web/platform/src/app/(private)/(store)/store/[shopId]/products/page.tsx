import { ProductTable } from '@/components/product/product-table';
import { getProducts } from '@/lib/queries/product/get-products-query';
import { getQueryClient } from '@/lib/queries/shop/get-query-client';
import { productSearchParamsCache } from '@/lib/search-params/product-search-params';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { SearchParams } from 'nuqs/server';

type ProductsPageProps = {
  searchParams: Promise<SearchParams>;
} & PageProps<'/store/[shopId]/products'>;

export default async function ProductsPage({
  searchParams,
  params,
}: ProductsPageProps) {
  const { search, pageIndex, pageSize, sort, desc, status } =
    await productSearchParamsCache.parse(searchParams);
  const { shopId } = await params;

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
          pageSize: pageSize,
          pageIndex: pageIndex,
          desc: desc,
          search: search,
          shopId: shopId,
          status: status,
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
