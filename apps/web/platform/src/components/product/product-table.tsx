'use client';

import { DataTable } from '@/components/table/data-table';
import { createTableConfig } from '@/lib/data-table/data-table';
import { getProducts } from '@/lib/queries/product/get-products-query';
import {
  productSearchParamsParsers,
  productSearchParamsUrlKeys,
} from '@/lib/search-params/product-search-params';
import { activeStatusOptions } from '@/lib/types/active-status';
import { useParams } from 'next/navigation';
import { productCategorySortByOptions } from '../product-category/product-category-sort-options';
import { productTableColumns } from './product-table-columns';

export function ProductTable() {
  const { shopId } = useParams<{ shopId: string }>();

  return (
    <DataTable
      config={createTableConfig({
        state: productSearchParamsParsers,
        filters: [
          {
            key: 'status',
            type: 'checkbox',
            label: 'Status',
            options: activeStatusOptions,
          },
        ],
        columns: productTableColumns,
        urlKeys: productSearchParamsUrlKeys,
        hasSelection: false,
        pageSizes: [10, 25, 50],
        sortOptions: productCategorySortByOptions,
        createButton: `/store/${shopId}/products/create`,
        queryKey: ['products', shopId],
        fetchFn: (state, signal) =>
          getProducts(
            {
              pageIndex: state.pageIndex,
              pageSize: state.pageSize,
              searchTerm: state.search,
              sortBy: state.sort,
              sortDescending: state.desc,
            },
            signal
          ),
      })}
    />
  );

  // const [page, setPage] = useQueryState(
  //   productSearchParamsUrlKeys.pageIndex,
  //   productSearchParamsParsers.pageIndex
  // );
  // const [size, setSize] = useQueryState(
  //   productSearchParamsUrlKeys.pageSize,
  //   productSearchParamsParsers.pageSize
  // );
  // const [sort, setSort] = useQueryState(
  //   productSearchParamsUrlKeys.sort,
  //   productSearchParamsParsers.sort
  // );
  // const [desc, setDesc] = useQueryState(
  //   productSearchParamsUrlKeys.desc,
  //   productSearchParamsParsers.desc
  // );
  // const [search, setSearch] = useQueryState(
  //   productSearchParamsUrlKeys.search,
  //   productSearchParamsParsers.search
  // );
  // const pagination: PaginationState = useMemo(
  //   () => ({
  //     pageIndex: page,
  //     pageSize: size,
  //   }),
  //   [page, size]
  // );

  // const sorting: SortingState = useMemo(
  //   () => [
  //     {
  //       id:
  //         sort.toString() ??
  //         ProductSortBy.PRODUCT_SORT_BY_UPDATED_AT.toString(),
  //       desc: desc,
  //     },
  //   ],
  //   [sort, desc]
  // );

  // const { table, isError, refetch } = useDataTable({
  //   columns: productTableColumns,
  //   filters: {
  //     search,
  //   },
  //   queryKey: ['products', shopId],
  //   pagination: pagination,
  //   sorting: sorting,
  //   fetchFn: async (filters, pagination, sorting, signal) => {
  //     const res = await getProducts(
  //       {
  //         pageIndex: pagination.pageIndex,
  //         pageSize: pagination.pageSize,
  //         searchTerm: filters.search,
  //         sortBy: Number(sorting[0].id) as ProductSortBy,
  //         sortDescending: sorting[0].desc,
  //       },
  //       signal
  //     );
  //     return { ...res, items: res.products };
  //   },
  //   onPaginationChange(pagination) {
  //     setPage(pagination.pageIndex);
  //     setSize(pagination.pageSize);
  //   },
  //   onSortingChange(sorting) {
  //     setSort(Number(sorting[0].id));
  //     setDesc(sorting[0].desc);
  //   },
  // });

  // const filters: TableFilterItem[] = [
  //   {
  //     type: 'radio',
  //     label: 'Status',
  //     options: [
  //       { label: 'All', value: 'all' },
  //       { label: 'Active', value: 'active' },
  //       { label: 'Inactive', value: 'inactive' },
  //     ],
  //     value: 'all',
  //     onValueChange: (value) => console.log(value),
  //   },
  // ];

  // return (
  //   <div className="flex w-full flex-col px-4 gap-2 over">
  //     <DataTableHeader
  //       filters={filters}
  //       search={{ value: search, onChange: setSearch }}
  //       sortOptions={[]}
  //       table={table}
  //       createButton={`/store/${shopId}/products/create`}
  //     />
  //     {isError ? (
  //       <ApiError message="Something went wrong" onClick={() => refetch()} />
  //     ) : (
  //       <DataTable table={table} />
  //     )}
  //     <DataTablePagination
  //       hasSelection={true}
  //       pageSizes={[10, 25, 50]}
  //       table={table}
  //       className="pb-2"
  //     />
  //   </div>
  // );
}
