'use client';

import {
  Badge,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@shopify-clone/ui';
import { ColumnDef } from '@tanstack/react-table';

export interface ProductData {
  id: string;
  name: string;
  status: 'draft' | 'active' | 'inactive';
  categories: {
    id: string;
    name: string;
  }[];
  stock: number;
}

const statusToLabel: Record<'draft' | 'active' | 'inactive', string> = {
  active: 'Active',
  draft: 'Draft',
  inactive: 'Inactive',
};

export const productTableColumns: ColumnDef<ProductData>[] = [
  {
    accessorKey: 'name',
    header: 'Product',
  },
  {
    accessorKey: 'id',
    header: 'Id',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      return (
        <Badge variant="default">{statusToLabel[row.original.status]}</Badge>
      );
    },
  },
  {
    accessorKey: 'stock',
    header: 'Stock',
  },
  {
    accessorKey: 'categories',
    header: 'Categories',
    cell: ({ row }) => {
      if (row.original.categories.length > 2) {
        return (
          <div className="flex flex-row gap-1">
            {row.original.categories.slice(0, 2).map((category) => (
              <Badge key={category.id}>{category.name}</Badge>
            ))}
            <Popover>
              <PopoverTrigger asChild>
                <Badge>+{row.original.categories.length - 2}</Badge>
              </PopoverTrigger>
              <PopoverContent className="max-w-32">
                {row.original.categories.slice(2).map((category) => (
                  <span key={category.id}>{category.name}</span>
                ))}
              </PopoverContent>
            </Popover>
          </div>
        );
      }
      return (
        <>
          {row.original.categories.map((category) => (
            <Badge key={category.id}>{category.name}</Badge>
          ))}
        </>
      );
    },
  },
];
