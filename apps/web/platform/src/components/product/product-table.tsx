'use client';

import { DataTable } from '@/components/table/data-table';
import { createTableConfig } from '@/lib/data-table/data-table';
import { createNuqsTableState } from '@/lib/data-table/data-table-nuqs-adapter';
import { TableSortOption } from '@/lib/data-table/data-table-sort';
import { getProducts } from '@/lib/queries/product/get-products-query';
import {
  productSearchParamsParsers,
  productSearchParamsUrlKeys,
} from '@/lib/search-params/product-search-params';
import { activeStatusOptions } from '@/lib/types/active-status';
import { ProductSortBy } from '@shopify-clone/proto-ts';
import { ArrowDown01, ArrowDownZa, ArrowUp10, ArrowUpAz } from 'lucide-react';
import { useParams } from 'next/navigation';
import { productTableColumns } from './product-table-columns';

const productSortByOptions: TableSortOption<ProductSortBy>[] = [
  {
    label: 'Name',
    icon: ArrowUpAz,
    value: ProductSortBy.PRODUCT_SORT_BY_NAME,
    desc: false,
  },
  {
    label: 'Name',
    icon: ArrowDownZa,
    value: ProductSortBy.PRODUCT_SORT_BY_NAME,
    desc: true,
  },
  {
    label: 'Last updated: Newest first',
    icon: ArrowUp10,
    value: ProductSortBy.PRODUCT_SORT_BY_UPDATED_AT,
    desc: true,
  },
  {
    label: 'Last updated: Oldest first',
    icon: ArrowDown01,
    value: ProductSortBy.PRODUCT_SORT_BY_UPDATED_AT,
    desc: false,
  },
] as const;

export function ProductTable() {
  const { shopId } = useParams<{ shopId: string }>();

  return (
    <DataTable
      config={createTableConfig({
        stateAdapter: createNuqsTableState(
          productSearchParamsParsers,
          productSearchParamsUrlKeys
        ),
        filters: [
          {
            key: 'status',
            type: 'checkbox',
            label: 'Status',
            options: activeStatusOptions,
          },
        ],
        columns: productTableColumns,
        hasSelection: false,
        pageSizes: [10, 25, 50],
        createButton: `/store/${shopId}/products/create`,
        queryKey: ['products', shopId],
        // expendable: {
        //   getRowCanExpand: (row) => true,
        // },
        groupable: {
          groupingState: ['productId'],
        },
        alwaysHiddenColumns: ['productId'],
        sortOptions: productSortByOptions,
        fetchFn: (state, signal) =>
          getProducts(
            {
              pageIndex: state.pageIndex,
              pageSize: state.pageSize,
              search: state.search,
              desc: state.desc,
              sortBy: state.sort,
              shopId: shopId,
              status: state.status,
            },
            signal
          ),
      })}
    />
  );
}
