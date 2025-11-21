'use client';

import { ShopData, ShopSortBy, ShopType } from '@shopify-clone/proto-ts';
import { Badge, Button } from '@shopify-clone/ui';
import { ColumnDef } from '@tanstack/react-table';
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  BadgeCheckIcon,
  BadgeXIcon,
} from 'lucide-react';
import Link from 'next/link';

const shopTypeToLabel: Record<ShopType, string> = {
  [ShopType.SHOP_TYPE_FASHION]: 'Fashion',
  [ShopType.SHOP_TYPE_UNSPECIFIED]: 'Other',
  [ShopType.UNRECOGNIZED]: 'Unknow',
};

export const storeTableColumns: ColumnDef<ShopData>[] = [
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      return (
        <Badge variant="outline">
          {row.original.isActive ? <BadgeCheckIcon /> : <BadgeXIcon />}
          {row.original.isActive ? 'Active' : 'Inactive'}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'type',
    header: 'Type',
    cell: ({ row }) => {
      return (
        <Badge variant="default">{shopTypeToLabel[row.original.type]}</Badge>
      );
    },
  },
  {
    id: ShopSortBy.SHOP_SORT_BY_NAME.toString(),
    accessorKey: 'name',
    cell: ({ row }) => {
      return (
        <Link href={`/store/${row.original.id}`} className="hover:underline">
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
    id: ShopSortBy.SHOP_SORT_BY_UPDATED_AT.toString(),
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
] as const;
