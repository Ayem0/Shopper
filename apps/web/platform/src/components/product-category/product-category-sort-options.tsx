import { ProductCategorySortBy } from '@shopify-clone/proto-ts';
import { ArrowDown01, ArrowDownZa, ArrowUp10, ArrowUpAz } from 'lucide-react';
import { TableSortOptions } from '../table/data-table-sort';

export const productCategorySortByOptions: TableSortOptions[] = [
  {
    label: 'Name',
    icon: ArrowUpAz,
    value: `${ProductCategorySortBy.PRODUCT_CATEGORY_SORT_BY_NAME}:${false}`,
  },
  {
    label: 'Name',
    icon: ArrowDownZa,
    value: `${ProductCategorySortBy.PRODUCT_CATEGORY_SORT_BY_NAME}:${true}`,
  },
  {
    label: 'Last updated: Newest first',
    icon: ArrowUp10,
    value: `${
      ProductCategorySortBy.PRODUCT_CATEGORY_SORT_BY_UPDATED_AT
    }:${true}`,
  },
  {
    label: 'Last updated: Oldest first',
    icon: ArrowDown01,
    value: `${
      ProductCategorySortBy.PRODUCT_CATEGORY_SORT_BY_UPDATED_AT
    }:${false}`,
  },
] as const;
