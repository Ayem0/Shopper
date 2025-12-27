'use client';

import { DataTable } from '@/components/table/data-table';
import { createTableConfig } from '@/lib/data-table/data-table';
import { getProductCategories } from '@/lib/queries/product-category/get-product-categories';
import {
  productCategorySearchParamsParsers,
  productCategorySearchParamsUrlKeys,
} from '@/lib/search-params/product-category-search-params';
import { activeStatusOptions } from '@/lib/types/active-status';
import { useParams } from 'next/navigation';
import { productCategorySortByOptions } from './product-category-sort-options';
import { productCategoryTableColumns } from './product-category-table-colums';

export function ProductCategoryTable() {
  const { shopId } = useParams<{ shopId: string }>();
  return (
    <DataTable
      config={createTableConfig({
        state: productCategorySearchParamsParsers,
        filters: [
          {
            key: 'status',
            type: 'checkbox',
            label: 'Status',
            options: activeStatusOptions,
          },
        ],
        columns: productCategoryTableColumns,
        urlKeys: productCategorySearchParamsUrlKeys,
        hasSelection: false,
        pageSizes: [10, 25, 50],
        sortOptions: productCategorySortByOptions,
        createButton: `/store/${shopId}/products/categories/create`,
        queryKey: ['products', shopId],
        fetchFn: (state, signal) =>
          getProductCategories(
            {
              desc: state.desc,
              pageIndex: state.pageIndex,
              pageSize: state.pageSize,
              search: state.search,
              sortBy: state.sort,
              status: state.status,
              shopId: shopId,
            },
            signal
          ),
      })}
    />
  );

  // const { shopId } = useParams<{ shopId: string }>();
  // const [values, setValues] = useQueryStates(
  //   productCategorySearchParamsParsers,
  //   {
  //     urlKeys: productCategorySearchParamsUrlKeys,
  //   }
  // );

  // const filters: TableFilterItem[] = useMemo(
  //   () => [
  //     {
  //       type: 'checkbox',
  //       label: 'Status',
  //       options: activeStatusOptions,
  //       defaultValues: values.status,
  //       onChange: (value) => setValues({ status: value as ActiveStatus[] }),
  //     },
  //   ],
  //   [values.status]
  // );

  // const { table, isError, refetch } = useDataTable({
  //   columns: productCategoryTableColumns,
  //   filters: {
  //     search: values.search,
  //     status: values.status,
  //   },
  //   queryKey: ['products', shopId],
  //   pagination: {
  //     pageIndex: values.pageIndex,
  //     pageSize: values.pageSize,
  //   },
  //   sorting: [
  //     {
  //       id: values.sort.toString(),
  //       desc: values.desc,
  //     },
  //   ],
  //   fetchFn: (filters, pagination, sorting, signal) =>
  //     getProductCategories(
  //       {
  //         pageIndex: pagination.pageIndex,
  //         pageSize: pagination.pageSize,
  //         search: filters.search,
  //         sortBy: Number(sorting[0].id) as ProductCategorySortBy,
  //         desc: sorting[0].desc,
  //         status: filters.status,
  //         shopId: shopId,
  //       },
  //       signal
  //     ),
  //   onPaginationChange(pagination) {
  //     setValues({
  //       pageIndex: pagination.pageIndex,
  //       pageSize: pagination.pageSize,
  //     });
  //   },
  //   onSortingChange(sorting) {
  //     setValues({
  //       sort: Number(sorting[0].id),
  //       desc: sorting[0].desc,
  //     });
  //   },
  // });

  // return (
  //   <div className="flex w-full flex-col px-4 gap-2 over">
  //     <DataTableHeader
  //       filters={filters}
  //       search={{
  //         value: values.search,
  //         onChange: (v) => setValues({ search: v }),
  //       }}
  //       sortOptions={productCategorySortByOptions}
  //       table={table}
  //       createButton={`/store/${shopId}/products/categories/create`}
  //     />
  //     {isError ? (
  //       <ApiError message="Something went wrong" onClick={() => refetch()} />
  //     ) : (
  //       <DataTable table={table} />
  //     )}
  //     <DataTablePagination
  //       hasSelection={false}
  //       pageSizes={[10, 25, 50]}
  //       table={table}
  //       className="pb-2"
  //     />
  //   </div>
  // );
}
