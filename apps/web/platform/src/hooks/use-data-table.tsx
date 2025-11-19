import { keepPreviousData, useQuery } from '@tanstack/react-query';
import {
  ColumnDef,
  getCoreRowModel,
  PaginationState,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { useMemo } from 'react';

type UseDataTableProps<TFilters, TData> = {
  columns: ColumnDef<TData>[];
  queryKey: string;
  filters: TFilters;
  pagination: PaginationState;
  onPaginationChange: (pagination: PaginationState) => void;
  sorting: SortingState;
  onSortingChange: (sorting: SortingState) => void;
  fetchFn: (
    filters: TFilters,
    pagination: PaginationState,
    sorting: SortingState,
    signal: AbortSignal
  ) => Promise<{
    totalResults: number;
    pageSize: number;
    pageIndex: number;
    maxPageIndex: number;
    items: TData[];
  }>;
};

export function useDataTable<TFilters, TData>({
  queryKey,
  columns,
  fetchFn,
  filters,
  pagination,
  sorting,
  onPaginationChange,
  onSortingChange,
}: UseDataTableProps<TFilters, TData>) {
  const stableKey = useMemo(
    () => [
      queryKey,
      {
        filters,
        pagination,
        sorting,
      },
    ],
    [queryKey, filters, pagination, sorting]
  );

  const query = useQuery({
    queryKey: stableKey,
    queryFn: ({ signal }) => fetchFn(filters, pagination, sorting, signal),
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  });

  const table = useReactTable({
    columns: columns,
    data: query.data?.items ?? [],
    getCoreRowModel: getCoreRowModel(),
    onPaginationChange: (updaterOrValue) => {
      if (typeof updaterOrValue === 'function') {
        const newPagination = updaterOrValue(pagination);
        onPaginationChange(newPagination);
      } else {
        onPaginationChange(updaterOrValue);
      }
    },
    onSortingChange: (updaterOrValue) => {
      if (typeof updaterOrValue === 'function') {
        const newSorting = updaterOrValue(sorting);
        onSortingChange(newSorting);
      } else {
        onSortingChange(updaterOrValue);
      }
    },
    manualFiltering: true,
    manualSorting: true,
    manualPagination: true,
    autoResetPageIndex: false,
    meta: {
      isFetching: query.isFetching,
      isPending: query.isPending,
    },
    pageCount: (query.data?.maxPageIndex ?? -1) + 1,
    state: {
      pagination,
      sorting,
    },
  });

  return {
    ...query,
    table,
  };
}
