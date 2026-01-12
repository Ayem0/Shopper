import { ColumnDef, Row } from '@tanstack/react-table';
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

export interface TableStateAdapter<TState> {
  useState(): [
    state: TState,
    setState: (updater: (prev: TState) => TState) => void
  ];
}

export type DataTableConfig<
  TSort extends number,
  TExtra extends NoBaseOverlap<any>,
  TRow extends { id: string }
> = {
  stateAdapter: TableStateAdapter<Base<TSort> & TExtra>;
  filters: readonly TableFilterDef<Omit<TExtra, BaseFieldKeys>>[];
  columns: ColumnDef<TRow>[];
  expendable?: {
    expandedContent?: (row: TRow) => React.ReactNode;
    getRowCanExpand: (row: Row<TRow>) => boolean;
  };
  groupable?: {
    groupingState: string[];
  };
  alwaysHiddenColumns?: string[];
  hasSelection: boolean;
  pageSizes: readonly number[];
  sortOptions: TableSortOption<TSort>[];
  createButton: string;
  queryKey: readonly unknown[];
  fetchFn: (
    state: Base<TSort> & TExtra,
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
  TRow extends { id: string },
  TExtra extends NoBaseOverlap<any>
>(config: DataTableConfig<TSort, TExtra, TRow>) {
  return config;
}
