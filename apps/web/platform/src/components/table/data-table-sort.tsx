'use client';

import { TableSortOption } from '@/lib/data-table/data-table-sort';
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@shopify-clone/ui';
import { Table } from '@tanstack/react-table';
import { ArrowDownUp } from 'lucide-react';

type TableSortProps<TData, TSort> = {
  options: TableSortOption<TSort>[];
  table: Table<TData>;
};

export function DataTableSort<TData, TSort>({
  options,
  table,
}: TableSortProps<TData, TSort>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <ArrowDownUp />
          Sort
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <DropdownMenuRadioGroup
          value={`${table.getState().sorting[0].id}:${
            table.getState().sorting[0].desc
          }`}
          onValueChange={(v) => {
            const [type, desc] = v.split(':');
            table.setSorting([{ id: type, desc: desc === 'true' }]);
          }}
        >
          {options.map((o, i) => (
            <DropdownMenuRadioItem
              key={`${o.label}-${i}`}
              value={`${o.value}:${o.desc}`}
              className="justify-between"
            >
              {o.label}
              {o.icon && <o.icon />}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
