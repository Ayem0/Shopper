'use client';

import { DataTable } from '@/components/table/data-table';
import { createTableConfig } from '@/lib/data-table/data-table';
import { createNuqsTableState } from '@/lib/data-table/data-table-nuqs-adapter';
import { TableSortOption } from '@/lib/data-table/data-table-sort';
import { getProductCategories } from '@/lib/queries/product-category/get-product-categories';
import {
  productCategorySearchParamsParsers,
  productCategorySearchParamsUrlKeys,
} from '@/lib/search-params/product-category-search-params';
import { activeStatusOptions } from '@/lib/types/active-status';
import { ProductCategorySortBy } from '@shopify-clone/proto-ts';
import { ArrowDown01, ArrowDownZa, ArrowUp10, ArrowUpAz } from 'lucide-react';
import { useParams } from 'next/navigation';
import { productCategoryTableColumns } from './product-category-table-colums';

const productCategorySortByOptions: TableSortOption<ProductCategorySortBy>[] = [
  {
    label: 'Name',
    icon: ArrowUpAz,
    value: ProductCategorySortBy.PRODUCT_CATEGORY_SORT_BY_NAME,
    desc: false,
  },
  {
    label: 'Name',
    icon: ArrowDownZa,
    value: ProductCategorySortBy.PRODUCT_CATEGORY_SORT_BY_NAME,
    desc: true,
  },
  {
    label: 'Last updated: Newest first',
    icon: ArrowUp10,
    value: ProductCategorySortBy.PRODUCT_CATEGORY_SORT_BY_UPDATED_AT,
    desc: true,
  },
  {
    label: 'Last updated: Oldest first',
    icon: ArrowDown01,
    value: ProductCategorySortBy.PRODUCT_CATEGORY_SORT_BY_UPDATED_AT,
    desc: false,
  },
] as const;

export function ProductCategoryTable() {
  const { shopId } = useParams<{ shopId: string }>();
  return (
    <DataTable
      config={createTableConfig({
        stateAdapter: createNuqsTableState(
          productCategorySearchParamsParsers,
          productCategorySearchParamsUrlKeys
        ),
        filters: [
          {
            key: 'status',
            type: 'checkbox',
            label: 'Status',
            options: activeStatusOptions,
          },
        ],
        columns: productCategoryTableColumns,
        hasSelection: false,
        pageSizes: [10, 25, 50],
        sortOptions: productCategorySortByOptions,
        createButton: `/store/${shopId}/products/categories/create`,
        queryKey: ['product-categories', shopId],
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
}
