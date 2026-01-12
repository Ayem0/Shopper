'use client';
import { DataTableSort } from '@/components/table/data-table-sort';
import { BoundTableFilter } from '@/lib/data-table/data-table-filter';
import { TableSortOption } from '@/lib/data-table/data-table-sort';
import { buttonVariants, Input } from '@shopify-clone/ui';
import { Table } from '@tanstack/react-table';
import { Plus, Search } from 'lucide-react';
import Link from 'next/link';
import { DataTableFilter } from './data-table-filter';
import { DebounceComponent } from './debounce-component';

type TableHeaderProps<TData, TSort extends number, TExtra> = {
  filters: readonly BoundTableFilter<TExtra>[];
  createButton: string;
  sortOptions: TableSortOption<TSort>[];
  table: Table<TData>;
  search: string;
  setSearch: (search: string) => void;
};

export function DataTableHeader<TData, TSort extends number, TExtra>({
  filters,
  createButton,
  sortOptions,
  table,
  search,
  setSearch,
}: TableHeaderProps<TData, TSort, TExtra>) {
  return (
    <div className="flex w-full justify-between gap-2">
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative">
          <DebounceComponent
            value={search}
            onChange={(value) => setSearch(value)}
          >
            {({ value, onChange }) => (
              <Input
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Search"
                className="pl-9"
                id="table-search"
                type="search"
              />
            )}
          </DebounceComponent>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
        </div>
        <div className="gap-2 flex">
          <DataTableFilter filters={filters} />
          <DataTableSort options={sortOptions} table={table} />
        </div>
      </div>
      <Link href={createButton} className={buttonVariants()}>
        <Plus />
        Create
      </Link>
    </div>
  );
}

// export const DataTableHeader = memo(TableHeader) as typeof TableHeader;

// import { DataTableFilter } from './data-table-filter copy 2';

// interface TableHeaderProps<TData, TSort> {
//   filters: readonly TableFilter<TableBaseState<TSort>>[];
//   state: TableBaseState<TSort>;
//   setState: (state: Partial<TableBaseState<TSort>>) => void;
//   createButton: string;
//   sortOptions: TableSortOption<TSort>[];
//   table: Table<TData>;
// }

// function TableHeader<TData, TSort>({
//   filters,
//   createButton,
//   sortOptions,
//   table,
//   state,
//   setState,
// }: TableHeaderProps<TData, TSort>) {
//   return (
//     <div className="flex w-full justify-between gap-2">
//       <div className="flex flex-col sm:flex-row gap-2">
//         <div className="relative">
//           <DebouncedInput
//             className="pl-9"
//             id="table-search"
//             type="search"
//             placeholder="Search"
//             value={state.search}
//             onChange={(value) => setState({ search: String(value) })}
//           />
//           <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
//         </div>
//         <div className="gap-2 flex">
//           <DataTableFilter
//             filters={filters}
//             state={state}
//             setState={setState}
//           />
//           <DataTableSort options={sortOptions} table={table} />
//         </div>
//       </div>
//       <Link href={createButton} className={buttonVariants()}>
//         <Plus />
//         Create
//       </Link>
//     </div>
//   );
// }

// export const DataTableHeader = memo(TableHeader) as typeof TableHeader;
