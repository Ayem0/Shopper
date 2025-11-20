"use client";

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@shopify-clone/ui';
import { Table } from '@tanstack/react-table';
import { ArrowDownUp, LucideIcon } from 'lucide-react';
import { memo } from 'react';

export interface TableSortOptions {
  label: string;
  icon?: LucideIcon;
  value: string;
}

type TableSortProps<TData> = {
  options: TableSortOptions[];
  table: Table<TData>;
};

function TableSort<TData>({ options, table }: TableSortProps<TData>) {
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
              value={o.value}
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
export const DataTableSort = memo(TableSort) as typeof TableSort;
