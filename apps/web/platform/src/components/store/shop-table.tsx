'use client';

import { ApiError } from '@/components/errors/api-error';
import { shopColumns } from '@/components/store/shops-columns';
import { DataTable } from '@/components/table/data-table';
import { TableFilterItem } from '@/components/table/data-table-filter';
import { DataTableHeader } from '@/components/table/data-table-header';
import { DataTablePagination } from '@/components/table/data-table-pagination';
import { TableSortOptions } from '@/components/table/data-table-sort';
import { useDataTable } from '@/hooks/use-data-table';
import { getShops } from '@/lib/queries/get-shops-query';
import {
  storeSearchParamsParsers,
  storeSearchParamsUrlKeys,
} from '@/lib/search-params/store-search-params';
import { ShopSortBy, ShopType } from '@shopify-clone/proto-ts';
import { PaginationState, SortingState } from '@tanstack/react-table';
import { ArrowDown01, ArrowDownZa, ArrowUp10, ArrowUpAz } from 'lucide-react';
import { useQueryState } from 'nuqs';
import { useMemo } from 'react';

const shopSortByOptions: TableSortOptions[] = [
  {
    label: 'Name',
    icon: ArrowUpAz,
    value: `${ShopSortBy.SHOP_SORT_BY_NAME}:${false}`,
  },
  {
    label: 'Name',
    icon: ArrowDownZa,
    value: `${ShopSortBy.SHOP_SORT_BY_NAME}:${true}`,
  },
  {
    label: 'Last updated: Newest first',
    icon: ArrowUp10,
    value: `${ShopSortBy.SHOP_SORT_BY_UPDATED_AT}:${true}`,
  },
  {
    label: 'Last updated: Oldest first',
    icon: ArrowDown01,
    value: `${ShopSortBy.SHOP_SORT_BY_UPDATED_AT}:${false}`,
  },
] as const;

const shopTypes: {
  label: string;
  value: Exclude<ShopType, ShopType.UNRECOGNIZED>;
}[] = [
  { label: 'Fashion', value: ShopType.SHOP_TYPE_FASHION },
  { label: 'Other', value: ShopType.SHOP_TYPE_UNSPECIFIED },
] as const;

export function ShopTable() {
  const [page, setPage] = useQueryState(
    storeSearchParamsUrlKeys.pageIndex,
    storeSearchParamsParsers.pageIndex
  );
  const [size, setSize] = useQueryState(
    storeSearchParamsUrlKeys.pageSize,
    storeSearchParamsParsers.pageSize
  );
  const [sort, setSort] = useQueryState(
    storeSearchParamsUrlKeys.sort,
    storeSearchParamsParsers.sort
  );
  const [desc, setDesc] = useQueryState(
    storeSearchParamsUrlKeys.desc,
    storeSearchParamsParsers.desc
  );
  const [search, setSearch] = useQueryState(
    storeSearchParamsUrlKeys.search,
    storeSearchParamsParsers.search
  );
  const [active, setActive] = useQueryState(
    storeSearchParamsUrlKeys.active,
    storeSearchParamsParsers.active
  );
  const [types, setTypes] = useQueryState(
    storeSearchParamsUrlKeys.types,
    storeSearchParamsParsers.types
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
        id: sort.toString() ?? ShopSortBy.SHOP_SORT_BY_UPDATED_AT.toString(),
        desc: desc,
      },
    ],
    [sort, desc]
  );

  const { table, isError, refetch } = useDataTable({
    queryKey: 'shops',
    columns: shopColumns,
    filters: {
      active,
      search,
      types,
    },
    pagination,
    onPaginationChange: (updater) => {
      setPage(updater.pageIndex);
      setSize(updater.pageSize);
    },
    sorting,
    onSortingChange: (sorting) => {
      setSort(Number(sorting[0].id));
      setDesc(sorting[0].desc);
    },
    fetchFn: async (filters, pagination, sorting, signal) => {
      const res = await getShops(
        {
          activeOnly: filters.active,
          pageIndex: pagination.pageIndex,
          pageSize: pagination.pageSize,
          searchTerm: filters.search,
          sortBy: Number(sorting[0].id) as ShopSortBy,
          sortDescending: sorting[0].desc,
          types: filters.types,
        },
        signal
      );
      return { ...res, items: res.shops };
    },
  });

  const filters: TableFilterItem[] = useMemo(
    () => [
      {
        type: 'switch',
        checked: active,
        label: 'Active Only',
        onCheckedChange: (c) => setActive(c),
      },
      {
        type: 'checkbox',
        label: 'Types',
        options: shopTypes.map((st) => ({
          checked: types.includes(st.value),
          label: st.label,
          onCheckedChange: (checked) => {
            if (checked) {
              if (!types.includes(st.value)) {
                setTypes([...types, st.value]);
              }
            } else {
              setTypes(types.filter((t) => t !== st.value));
            }
          },
        })),
      },
    ],
    [active, setActive, types, setTypes]
  );

  return (
    <div className="flex w-full flex-col px-4 gap-2 over">
      <DataTableHeader
        filters={filters}
        search={{ value: search, onChange: setSearch }}
        sortOptions={shopSortByOptions}
        table={table}
        createButton={'/dashboard/create'}
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
