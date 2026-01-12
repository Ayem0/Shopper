'use client';

import {
  Skeleton,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@shopify-clone/ui';
import {
  flexRender,
  RowData,
  Table as TanstackTable,
} from '@tanstack/react-table';
import { motion } from 'motion/react';
import { Fragment } from 'react';

declare module '@tanstack/react-table' {
  export interface TableMeta<TData extends RowData> {
    isPending?: boolean;
    isFetching?: boolean;
  }
}
interface DataTableProps<TData> {
  table: TanstackTable<TData>;
  expandedContent?: (row: TData) => React.ReactNode;
  expandedContentProps?: {
    className?: string;
  };
}

export function DataTableUI<TData>({
  table,
  expandedContent,
  expandedContentProps,
}: DataTableProps<TData & { id: string }>) {
  const isFetching = table.options.meta?.isFetching;
  const isPending = table.options.meta?.isPending;
  return (
    <div className="relative w-full overflow-auto rounded-md border">
      <Table>
        <TableHeader className="sticky top-0 bg-background">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="border-b-0!">
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    key={header.id}
                    className="border-b"
                    style={{
                      width: `${header.getSize()}px`,
                      maxWidth: `${header.getSize()}px`,
                      minWidth: `${header.getSize()}px`,
                    }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {isPending ? (
            Array.from({ length: 5 }).map((_, index) => (
              <tr key={`skeleton-${index}`}>
                {table.getVisibleLeafColumns().map((column) => (
                  <TableCell key={column.id} className="h-[49px]">
                    <Skeleton className="size-full" />
                  </TableCell>
                ))}
              </tr>
            ))
          ) : table.getRowModel().rows?.length > 0 ? (
            table.getRowModel().rows.map((row) => (
              <Fragment key={row.id}>
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      style={{
                        width: `${cell.column.getSize()}px`,
                        maxWidth: `${cell.column.getSize()}px`,
                        minWidth: `${cell.column.getSize()}px`,
                      }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
                {row.getCanExpand() &&
                  row.getIsExpanded() &&
                  expandedContent && (
                    <tr>
                      <td
                        colSpan={row.getAllCells().length}
                        className={expandedContentProps?.className}
                      >
                        {expandedContent?.(row.original)}
                      </td>
                    </tr>
                  )}
              </Fragment>
            ))
          ) : (
            <tr>
              <TableCell
                colSpan={table.options.columns.length}
                className="h-24 text-center"
              >
                No results.
              </TableCell>
            </tr>
          )}
        </TableBody>
      </Table>
      {isFetching && !isPending && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 top-10 flex items-center justify-center rounded-xl bg-background/50"
        >
          <Spinner className="size-12" />
        </motion.div>
      )}
    </div>
  );
}
