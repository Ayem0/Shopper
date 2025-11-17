import { keepPreviousData, useQuery } from '@tanstack/react-query';
import {
  ColumnDef,
  getCoreRowModel,
  PaginationState,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDebounce } from './use-debounce';

type UseDataTableProps<TFilters, TData> = {
  columns: ColumnDef<TData>[];
  queryKey: string;
  filters: {
    values: TFilters;
    paramNames: {
      [K in keyof TFilters]: string;
    };
    defaultValues: TFilters;
  };
  pagination: PaginationState;
  defaultPageSize: number;
  defaultSorting: string;
  sorting: SortingState;
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

export function useDataTable<
  TFilters extends Record<string, string | boolean | unknown[]>,
  TData
>({
  queryKey,
  columns,
  fetchFn,
  filters: propsFilters,
  pagination: propsPagination,
  defaultPageSize,
  defaultSorting,
  sorting: propsSorting,
}: UseDataTableProps<TFilters, TData>) {
  const router = useRouter();
  const searchParams = useSearchParams();
  // const [, startTransition] = useTransition();

  const [pagination, setPagination] = useState(propsPagination);
  const [sorting, setSorting] = useState(propsSorting);
  const [filters, setFilters] = useState(propsFilters.values);

  const debouncedFilters = useDebounce(filters);
  const debouncedPagination = useDebounce(pagination);
  const debouncedSorting = useDebounce(sorting);

  const resetPagination = useCallback(
    () => setPagination((old) => ({ pageSize: old.pageSize, pageIndex: 0 })),
    []
  );
  const setFilter = useCallback(
    <K extends keyof TFilters>(
      key: K,
      value: TFilters[K] | ((prev: TFilters[K]) => TFilters[K])
    ) =>
      setFilters((s) => ({
        ...s,
        [key]: typeof value === 'function' ? value(s[key]) : value,
      })),
    []
  );

  const resetFilters = useCallback(
    () => setFilters(propsFilters.defaultValues),
    [propsFilters]
  );
  const stableKey = useMemo(
    () => [
      queryKey,
      {
        filters: debouncedFilters,
        pagination: debouncedPagination,
        sorting: debouncedSorting,
      },
    ],
    [queryKey, debouncedFilters, debouncedPagination, debouncedSorting]
  );

  const query = useQuery({
    queryKey: stableKey,
    queryFn: ({ signal }) =>
      fetchFn(debouncedFilters, debouncedPagination, debouncedSorting, signal),
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  });

  const computedParams = useMemo(() => {
    const params = new URLSearchParams(searchParams.toString());
    // Sync filters
    for (const [k, v] of Object.entries(debouncedFilters)) {
      const paramName = propsFilters.paramNames[k];
      const defaultValue = propsFilters.defaultValues[k];
      const isEmptyArray = Array.isArray(v) && v.length === 0;
      const isDefault = v === defaultValue;

      if (isEmptyArray || isDefault) {
        params.delete(paramName);
      } else {
        if (Array.isArray(v)) {
          params.delete(paramName);
          v.forEach((value) => params.append(paramName, String(value)));
        } else {
          params.set(paramName, String(v));
        }
      }
    }
    // Sync pagination
    if (debouncedPagination.pageIndex === 0) params.delete('page');
    else params.set('page', String(debouncedPagination.pageIndex));
    if (debouncedPagination.pageSize === defaultPageSize) params.delete('size');
    else params.set('size', String(debouncedPagination.pageSize));
    // Sync sorting
    if (debouncedSorting[0].id === defaultSorting) params.delete('sort');
    else params.set('sort', debouncedSorting[0].id);
    if (debouncedSorting[0].desc === false) params.delete('desc');
    else params.set('desc', 'true');

    return params;
  }, [
    debouncedFilters,
    propsFilters,
    debouncedPagination,
    searchParams,
    defaultPageSize,
    debouncedSorting,
    defaultSorting,
  ]);

  // Update URL when computed params change
  useEffect(() => {
    const newUrl = `?${computedParams.toString()}`;
    const currentUrl = `?${searchParams.toString()}`;
    if (newUrl !== currentUrl) router.replace(newUrl);
  }, [computedParams, router, searchParams]);

  useEffect(() => {
    if (query.data && pagination.pageIndex > (query.data.maxPageIndex ?? 0)) {
      setPagination((old) => ({ ...old, pageIndex: 0 }));
    }
  }, [pagination, query]);

  const table = useReactTable({
    columns: columns,
    data: query.data?.items ?? [],
    getCoreRowModel: getCoreRowModel(),
    onPaginationChange: setPagination,
    onSortingChange: (value) => {
      setSorting(value);
      resetPagination();
    },
    manualFiltering: true,
    manualSorting: true,
    manualPagination: true,
    autoResetPageIndex: false,
    pageCount: (query.data?.maxPageIndex ?? -1) + 1,
    state: {
      pagination: {
        pageIndex:
          pagination.pageIndex > (query.data?.maxPageIndex ?? 0)
            ? 0
            : pagination.pageIndex,
        pageSize: pagination.pageSize,
      },
      sorting: sorting,
    },
  });

  return {
    ...query,
    table,
    resetPagination,
    filters,
    setFilter,
    resetFilters,
  };
}
