import { activeStatusToLabel } from '@/lib/types/active-status';
import {
  ProductCategoryData,
  ProductCategorySortBy,
} from '@shopify-clone/proto-ts';
import { Badge, Button } from '@shopify-clone/ui';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import Link from 'next/link';

export const productCategoryTableColumns: ColumnDef<ProductCategoryData>[] = [
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      return (
        <Badge variant="default">
          {activeStatusToLabel[row.original.status]}
        </Badge>
      );
    },
  },
  {
    id: ProductCategorySortBy.PRODUCT_CATEGORY_SORT_BY_NAME.toString(),
    accessorKey: 'name',
    cell: ({ row }) => {
      return (
        <Link
          href={`/store/${row.original.shopId}/products/categories/${row.original.id}`}
          className="hover:underline"
        >
          {row.original.name}
        </Link>
      );
    },
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Name
          {column.getIsSorted() === false && (
            <ArrowUpDown className="ml-2 h-4 w-4" />
          )}
          {column.getIsSorted() === 'asc' && (
            <ArrowUp className="ml-2 h-4 w-4" />
          )}
          {column.getIsSorted() === 'desc' && (
            <ArrowDown className="ml-2 h-4 w-4" />
          )}
        </Button>
      );
    },
  },
  {
    accessorKey: 'parent',
    header: 'Parent Category',
    cell: ({ row }) => {
      if (row.original.parentCategory) {
        return (
          <Link
            href={`/store/${row.original.shopId}/products/categories/${row.original.id}`}
          >
            <Badge variant="secondary">
              {row.original.parentCategory.name}
            </Badge>
          </Link>
        );
      }
      return null;
    },
  },
  {
    id: ProductCategorySortBy.PRODUCT_CATEGORY_SORT_BY_UPDATED_AT.toString(),
    accessorKey: 'updatedAt',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Last updated
          {column.getIsSorted() === false && (
            <ArrowUpDown className="ml-2 h-4 w-4" />
          )}
          {column.getIsSorted() === 'asc' && (
            <ArrowUp className="ml-2 h-4 w-4" />
          )}
          {column.getIsSorted() === 'desc' && (
            <ArrowDown className="ml-2 h-4 w-4" />
          )}
        </Button>
      );
    },
  },
];
