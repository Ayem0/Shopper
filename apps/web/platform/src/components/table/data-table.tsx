'use client';

import { DataTableConfig, NoBaseOverlap } from '@/lib/data-table/data-table';
import { bindFilters } from '@/lib/data-table/data-table-filter';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import {
  ExpandedState,
  getCoreRowModel,
  getExpandedRowModel,
  getGroupedRowModel,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import { useState } from 'react';
import { ApiError } from '../errors/api-error';
import { DataTableHeader } from './data-table-header';
import { DataTablePagination } from './data-table-pagination';
import { DataTableUI } from './data-table-ui';

export function DataTable<
  TSort extends number,
  TExtra extends NoBaseOverlap<object>,
  TRow extends { id: string }
>({ config }: { config: DataTableConfig<TSort, TExtra, TRow> }) {
  const [state, setState] = config.stateAdapter.useState();

  const filters = bindFilters(config.filters, state, setState);

  const query = useQuery({
    queryKey: [...config.queryKey, state],
    queryFn: ({ signal }) => config.fetchFn(state, signal),
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  });

  const [expanded, setExpanded] = useState<ExpandedState>({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    Object.fromEntries(
      config.alwaysHiddenColumns?.map((key) => [key, false]) ?? []
    )
  );

  const table = useReactTable({
    data: query.data?.items ?? [],
    columns: config.columns,
    manualFiltering: true,
    manualSorting: true,
    manualPagination: true,
    getGroupedRowModel: getGroupedRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getRowCanExpand: config.expendable?.getRowCanExpand
      ? (row) => config.expendable!.getRowCanExpand(row)
      : undefined,
    getIsRowExpanded: (row) =>
      typeof expanded === 'boolean' ? expanded : expanded[row.original.id],
    onExpandedChange: (updater) =>
      setExpanded(typeof updater === 'function' ? updater(expanded) : updater),
    pageCount: (query.data?.maxPageIndex ?? -1) + 1,
    state: {
      columnVisibility: columnVisibility,
      grouping: config.groupable?.groupingState,
      expanded: expanded,
      pagination: {
        pageIndex: state.pageIndex,
        pageSize: state.pageSize,
      },
      sorting: [
        {
          id: String(state.sort),
          desc: state.desc,
        },
      ],
    },
    autoResetExpanded: false,
    onPaginationChange: (updater) => {
      const next =
        typeof updater === 'function'
          ? updater({ pageIndex: state.pageIndex, pageSize: state.pageSize })
          : updater;

      setState((prev) => ({
        ...prev,
        ...next,
      }));
    },
    onSortingChange: (updater) => {
      const next =
        typeof updater === 'function'
          ? updater([{ id: String(state.sort), desc: state.desc }])
          : updater;

      setState((prev) => ({
        ...prev,
        sort: Number(next[0].id) as TSort,
        desc: next[0].desc,
      }));
    },
    meta: {
      isPending: query.isPending,
      isFetching: query.isFetching,
    },
  });

  return (
    <div className="flex w-full flex-col px-4 gap-2 over">
      <DataTableHeader
        filters={filters}
        search={state.search}
        setSearch={(value) =>
          setState((prev) => ({ ...prev, search: String(value) }))
        }
        table={table}
        createButton={config.createButton}
        sortOptions={config.sortOptions}
      />
      {query.isError ? (
        <ApiError
          message="Something went wrong"
          onClick={() => query.refetch()}
        />
      ) : (
        <>
          <DataTableUI
            table={table}
            expandedContent={config.expendable?.expandedContent}
          />
          <DataTablePagination
            hasSelection={config.hasSelection}
            pageSizes={config.pageSizes}
            table={table}
            className="pb-2"
          />
        </>
      )}
    </div>
  );
}
