'use client';

import {
  DataTableFilter,
  TableFilterItem,
} from '@/components/table/data-table-filter';
import {
  DataTableSort,
  TableSortOptions,
} from '@/components/table/data-table-sort';
import { DebouncedInput } from '@/components/table/debounced-input';
import { Button } from '@shopify-clone/ui';
import { Table } from '@tanstack/react-table';
import { Plus, Search } from 'lucide-react';
import Link from 'next/link';
import { memo } from 'react';

interface TableHeaderProps<TData> {
  filters: TableFilterItem[];
  search?: {
    value: string;
    onChange: (value: string) => void;
  };
  createButton?: string;
  sortOptions: TableSortOptions[];
  table: Table<TData>;
}

function TableHeader<TData>({
  filters,
  search,
  createButton,
  sortOptions,
  table,
}: TableHeaderProps<TData>) {
  return (
    <div className="flex w-full justify-between gap-2">
      <div className="flex flex-col sm:flex-row gap-2">
        {search && (
          <div className="relative">
            <DebouncedInput
              className="pl-9"
              id="shop-search"
              type="search"
              placeholder="Search"
              value={search.value}
              onChange={(value) => search.onChange(String(value))}
            />
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
          </div>
        )}

        <div className="gap-2 flex">
          <DataTableFilter filters={filters} />
          <DataTableSort options={sortOptions} table={table} />
        </div>
      </div>
      {createButton && (
        <Button asChild>
          <Link href={createButton}>
            <Plus />
            Create
          </Link>
        </Button>
      )}
    </div>
  );
}

export const DataTableHeader = memo(TableHeader) as typeof TableHeader;
