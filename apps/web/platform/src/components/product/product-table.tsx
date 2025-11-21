'use client';

import { ApiError } from '@/components/errors/api-error';
import { DataTable } from '@/components/table/data-table';
import { DataTableHeader } from '@/components/table/data-table-header';
import { DataTablePagination } from '@/components/table/data-table-pagination';
import { useDataTable } from '@/hooks/use-data-table';
import { getProducts } from '@/lib/queries/product/get-products-query';
import {
  productSearchParamsParsers,
  productSearchParamsUrlKeys,
  ProductSortBy,
} from '@/lib/search-params/product-search-params';
import { PaginationState, SortingState } from '@tanstack/react-table';
import { useParams } from 'next/navigation';
import { useQueryState } from 'nuqs';
import { useMemo } from 'react';
import { TableFilterItem } from '../table/data-table-filter';
import { productTableColumns } from './product-table-columns';

export function ProductTable() {
  const { shopId } = useParams<{ shopId: string }>();
  const [page, setPage] = useQueryState(
    productSearchParamsUrlKeys.pageIndex,
    productSearchParamsParsers.pageIndex
  );
  const [size, setSize] = useQueryState(
    productSearchParamsUrlKeys.pageSize,
    productSearchParamsParsers.pageSize
  );
  const [sort, setSort] = useQueryState(
    productSearchParamsUrlKeys.sort,
    productSearchParamsParsers.sort
  );
  const [desc, setDesc] = useQueryState(
    productSearchParamsUrlKeys.desc,
    productSearchParamsParsers.desc
  );
  const [search, setSearch] = useQueryState(
    productSearchParamsUrlKeys.search,
    productSearchParamsParsers.search
  );
  const pagination: PaginationState = useMemo(
    () => ({
      pageIndex: page,
      pageSize: size,
    }),
    [page, size]
  );

  const sorting: SortingState = useMemo(
    () => [
      {
        id:
          sort.toString() ??
          ProductSortBy.PRODUCT_SORT_BY_UPDATED_AT.toString(),
        desc: desc,
      },
    ],
    [sort, desc]
  );

  const { table, isError, refetch } = useDataTable({
    columns: productTableColumns,
    filters: {
      search,
    },
    queryKey: 'products',
    pagination: pagination,
    sorting: sorting,
    fetchFn: async (filters, pagination, sorting, signal) => {
      const res = await getProducts(
        {
          pageIndex: pagination.pageIndex,
          pageSize: pagination.pageSize,
          searchTerm: filters.search,
          sortBy: Number(sorting[0].id) as ProductSortBy,
          sortDescending: sorting[0].desc,
        },
        signal
      );
      return { ...res, items: res.products };
    },
    onPaginationChange(pagination) {
      setPage(pagination.pageIndex);
      setSize(pagination.pageSize);
    },
    onSortingChange(sorting) {
      setSort(Number(sorting[0].id));
      setDesc(sorting[0].desc);
    },
  });

  const filters: TableFilterItem[] = [
    {
      type: 'radio',
      label: 'Status',
      options: [
        { label: 'All', value: 'all' },
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' },
      ],
      value: 'all',
      onValueChange: (value) => console.log(value),
    },
  ];

  return (
    <div className="flex w-full flex-col px-4 gap-2 over">
      <DataTableHeader
        filters={filters}
        search={{ value: search, onChange: setSearch }}
        sortOptions={[]}
        table={table}
        createButton={`/store/${shopId}/products/create`}
      />
      {isError ? (
        <ApiError message="Something went wrong" onClick={() => refetch()} />
      ) : (
        <DataTable table={table} />
      )}
      <DataTablePagination
        hasSelection={true}
        pageSizes={[10, 25, 50]}
        table={table}
        className="pb-2"
      />
    </div>
  );
}
