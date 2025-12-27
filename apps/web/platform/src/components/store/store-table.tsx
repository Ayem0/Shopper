'use client';

import { storeTableColumns } from '@/components/store/store-table-columns';
import { DataTable } from '@/components/table/data-table';
import { createTableConfig } from '@/lib/data-table/data-table';
import { TableSortOption } from '@/lib/data-table/data-table-sort';
import { getShops } from '@/lib/queries/shop/get-shops-query';
import {
  storeSearchParamsParsers,
  storeSearchParamsUrlKeys,
} from '@/lib/search-params/store-search-params';
import { ShopSortBy, ShopType } from '@shopify-clone/proto-ts';
import { ArrowDown01, ArrowDownZa, ArrowUp10, ArrowUpAz } from 'lucide-react';

const shopSortByOptions: TableSortOption<ShopSortBy>[] = [
  {
    label: 'Name',
    icon: ArrowUpAz,
    value: ShopSortBy.SHOP_SORT_BY_NAME,
    desc: false,
  },
  {
    label: 'Name',
    icon: ArrowDownZa,
    value: ShopSortBy.SHOP_SORT_BY_NAME,
    desc: true,
  },
  {
    label: 'Last updated: Newest first',
    icon: ArrowUp10,
    value: ShopSortBy.SHOP_SORT_BY_UPDATED_AT,
    desc: true,
  },
  {
    label: 'Last updated: Oldest first',
    icon: ArrowDown01,
    value: ShopSortBy.SHOP_SORT_BY_UPDATED_AT,
    desc: false,
  },
];

export function StoreTable() {
  return (
    <DataTable
      config={createTableConfig({
        columns: storeTableColumns,
        state: storeSearchParamsParsers,
        urlKeys: storeSearchParamsUrlKeys,
        hasSelection: false,
        createButton: '/dashboard/create',
        pageSizes: [10, 25, 50],
        queryKey: ['shops'],
        fetchFn: (state, signal) =>
          getShops(
            {
              activeOnly: state.active,
              pageIndex: state.pageIndex,
              pageSize: state.pageSize,
              searchTerm: state.search,
              sortBy: state.sort,
              sortDescending: state.desc,
              types: state.types,
            },
            signal
          ),
        filters: [
          {
            key: 'types',
            type: 'checkbox',
            label: 'Types',
            options: [
              { label: 'Fashion', value: ShopType.SHOP_TYPE_FASHION },
              { label: 'Other', value: ShopType.SHOP_TYPE_UNSPECIFIED },
            ],
          },
          {
            key: 'active',
            type: 'switch',
            label: 'Only active',
          },
        ],
        sortOptions: shopSortByOptions,
      })}
    />
  );
}
