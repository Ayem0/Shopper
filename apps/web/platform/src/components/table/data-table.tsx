'use client';

import {
  Base,
  DataTableConfig,
  NoBaseOverlap,
} from '@/lib/data-table/data-table';
import { bindFilters } from '@/lib/data-table/data-table-filter';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { SetValues, useQueryStates, UseQueryStatesKeysMap, Values } from 'nuqs';
import { ApiError } from '../errors/api-error';
import { DataTableHeader } from './data-table-header';
import { DataTablePagination } from './data-table-pagination';
import { DataTableUI } from './data-table-ui';

export function DataTable<
  TSort extends number,
  TExtra extends NoBaseOverlap<object>,
  TRow extends { id: string },
  TParser extends UseQueryStatesKeysMap<Base<TSort> & TExtra>
>({ config }: { config: DataTableConfig<TSort, TExtra, TRow, TParser> }) {
  const [state, rawState, setState] = useTypedQueryStates<
    TSort,
    TExtra,
    TParser
  >(config.state, {
    urlKeys: config.urlKeys,
  });

  const filters = bindFilters(config.filters, rawState, setState);

  const query = useQuery({
    queryKey: [...config.queryKey, state],
    queryFn: ({ signal }) => config.fetchFn(rawState, signal),
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  });

  const table = useReactTable({
    data: query.data?.items ?? [],
    columns: config.columns,
    manualFiltering: true,
    manualSorting: true,
    manualPagination: true,
    getCoreRowModel: getCoreRowModel(),
    pageCount: (query.data?.maxPageIndex ?? -1) + 1,
    state: {
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
          <DataTableUI table={table} />
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

function useTypedQueryStates<
  TSort extends number,
  TExtra extends NoBaseOverlap<object>,
  TParser extends UseQueryStatesKeysMap<Base<TSort> & TExtra>
>(
  parsers: TParser,
  options?: Parameters<typeof useQueryStates>[1]
): [Base<TSort> & TExtra, Values<TParser>, SetValues<TParser>] {
  const [state, setState] = useQueryStates(parsers, options);
  return [state as Base<TSort> & TExtra, state, setState];
}
