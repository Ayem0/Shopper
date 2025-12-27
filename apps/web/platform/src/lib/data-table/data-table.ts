import { ColumnDef } from '@tanstack/react-table';
import { UseQueryStatesKeysMap, Values } from 'nuqs';
import { TableFilterDef } from './data-table-filter';
import { TableSortOption } from './data-table-sort';

export type Base<T extends number> = {
  pageIndex: number;
  pageSize: number;
  sort: T;
  desc: boolean;
  search: string;
};

type BaseFieldKeys = keyof Base<number>;

export type NoBaseOverlap<T extends object> = {
  [K in keyof T]: K extends BaseFieldKeys ? never : T[K];
};

export type DataTableConfig<
  TSort extends number,
  TExtra extends NoBaseOverlap<object>,
  TRow extends { id: string },
  TParser extends UseQueryStatesKeysMap<Base<TSort> & TExtra>
> = {
  state: TParser;
  filters: readonly TableFilterDef<Values<Omit<TParser, keyof Base<TSort>>>>[];
  columns: ColumnDef<TRow>[];
  urlKeys: Record<keyof TParser, string>;
  hasSelection: boolean;
  pageSizes: readonly number[];
  sortOptions: TableSortOption<TSort>[];
  createButton: string;
  queryKey: readonly unknown[];
  fetchFn: (
    state: Values<TParser>,
    signal: AbortSignal
  ) => Promise<{
    items: TRow[];
    totalResults: number;
    pageIndex: number;
    pageSize: number;
    maxPageIndex: number;
  }>;
};

export function createTableConfig<
  TSort extends number,
  TExtra extends NoBaseOverlap<object>,
  TRow extends { id: string },
  TParser extends UseQueryStatesKeysMap<Base<TSort> & TExtra>
>(config: DataTableConfig<TSort, TExtra, TRow, TParser>) {
  return config;
}
