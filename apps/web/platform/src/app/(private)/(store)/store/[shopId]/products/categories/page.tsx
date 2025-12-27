import { ProductCategoryTable } from '@/components/product-category/product-category-table';
import { getProductCategories } from '@/lib/queries/product-category/get-product-categories';
import { getQueryClient } from '@/lib/queries/shop/get-query-client';
import { productCategorySearchParamsCache } from '@/lib/search-params/product-category-search-params';
import { SearchParams } from 'nuqs';
import { GetProductCategoriesRequest } from '../../../../../../../../../../../libs/ts/proto-ts/src/gen/product/product_types';

type CategoriesPageProps = {
  searchParams: Promise<SearchParams>;
} & PageProps<'/store/[shopId]/products/categories'>;

export default async function CategoriesPage(props: CategoriesPageProps) {
  const { shopId } = await props.params;
  const queryClient = getQueryClient();
  const { search, pageIndex, pageSize, sort, desc, status } =
    await productCategorySearchParamsCache.parse(props.searchParams);

  const req: GetProductCategoriesRequest = {
    search: search,
    sortBy: sort,
    desc: desc,
    pageIndex: pageIndex,
    pageSize: pageSize,
    status: status,
    shopId: shopId,
  };

  await queryClient.prefetchQuery({
    queryKey: [
      'product-categories',
      shopId,
      {
        searchTerm: search,
        status,
        pagination: { pageIndex, pageSize },
        sorting: [{ id: sort.toString(), desc }],
      },
    ],
    queryFn: ({ signal }) => getProductCategories(req, signal),
    staleTime: 60 * 1000,
  });
  return <ProductCategoryTable />;
}
