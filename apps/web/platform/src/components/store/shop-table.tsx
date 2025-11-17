'use client';

import { useDebounce } from '@/hooks/use-debounce';
import { getShops } from '@/lib/queries/get-shops-query';
import { ShopSortBy, ShopType } from '@shopify-clone/proto-ts';
import { Input } from '@shopify-clone/ui';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import {
  getCoreRowModel,
  PaginationState,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import {
  ArrowDown01,
  ArrowDownZa,
  ArrowUp10,
  ArrowUpAz,
  Search,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { DataTable } from '../table/data-table';
import { TableFilter, TableFilterItem } from '../table/table-filter';
import { DataTablePagination } from '../table/table-pagination';
import { SortOptions, TableSort } from '../table/table-sort';
import { ShopCreateDialog } from './shop-create-dialog';
import { shopColumns } from './shops-columns';

const shopSortByOptions: SortOptions[] = [
  {
    label: 'Name',
    icon: ArrowUpAz,
    value: `${ShopSortBy.SHOP_SORT_BY_NAME}:${false}`,
  },
  {
    label: 'Name',
    icon: ArrowDownZa,
    value: `${ShopSortBy.SHOP_SORT_BY_NAME}:${true}`,
  },
  {
    label: 'Last updated: Newest first',
    icon: ArrowUp10,
    value: `${ShopSortBy.SHOP_SORT_BY_UPDATED_AT}:${true}`,
  },
  {
    label: 'Last updated: Oldest first',
    icon: ArrowDown01,
    value: `${ShopSortBy.SHOP_SORT_BY_UPDATED_AT}:${false}`,
  },
] as const;

const shopTypes: {
  label: string;
  value: Exclude<ShopType, ShopType.UNRECOGNIZED>;
}[] = [
  { label: 'Fashion', value: ShopType.SHOP_TYPE_FASHION },
  { label: 'Other', value: ShopType.SHOP_TYPE_UNSPECIFIED },
] as const;

interface ShopTableProps {
  searchTerm: string;
  activeOnly: boolean;
  pagination: PaginationState;
  sorting: SortingState;
  types: ShopType[];
}

export function ShopTable(props: ShopTableProps) {
  const [searchTerm, setSearchTerm] = useState(props.searchTerm);
  const [activeOnly, setActiveOnly] = useState(props.activeOnly);
  const [types, setTypes] = useState(props.types);
  const [pagination, setPagination] = useState(props.pagination);
  const [sorting, setSorting] = useState(props.sorting);

  const debouncedSearchTerm = useDebounce(searchTerm);
  const debouncedActiveOnly = useDebounce(activeOnly);
  const debouncedTypes = useDebounce(types);
  const debouncedPagination = useDebounce(pagination);
  const debouncedSorting = useDebounce(sorting);

  const resetPagination = () => setPagination({ ...pagination, pageIndex: 0 });

  const key = useMemo(
    () => [
      'shops',
      {
        debouncedSearchTerm,
        debouncedActiveOnly,
        debouncedTypes,
        debouncedPagination,
        debouncedSorting,
      },
    ],
    [
      debouncedSearchTerm,
      debouncedActiveOnly,
      debouncedTypes,
      debouncedPagination,
      debouncedSorting,
    ]
  );

  const { isError, data, isPending, isFetching } = useQuery({
    queryKey: key,
    queryFn: ({ signal }) =>
      getShops(
        {
          activeOnly: debouncedActiveOnly,
          pageIndex: debouncedPagination.pageIndex,
          pageSize: debouncedPagination.pageSize,
          searchTerm: debouncedSearchTerm,
          sortBy: Number(debouncedSorting[0].id) as ShopSortBy,
          sortDescending: debouncedSorting[0].desc,
          types: debouncedTypes,
        },
        signal
      ),
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  });

  const table = useReactTable({
    columns: shopColumns,
    data: data?.shops ?? [],
    getCoreRowModel: getCoreRowModel(),
    onPaginationChange: setPagination,
    onSortingChange: (value) => {
      setSorting(value);
      resetPagination();
    },
    meta: {
      isPending,
      isFetching,
    },
    manualFiltering: true,
    manualSorting: true,
    manualPagination: true,
    autoResetPageIndex: false,
    pageCount: (data?.maxPageIndex ?? -1) + 1,
    state: {
      pagination: {
        pageIndex:
          pagination.pageIndex > (data?.maxPageIndex ?? 0)
            ? 0
            : pagination.pageIndex,
        pageSize: pagination.pageSize,
      },
      sorting: sorting,
    },
  });

  const filters: TableFilterItem[] = useMemo(
    () => [
      {
        type: 'switch',
        checked: activeOnly,
        label: 'Active only',
        onCheckedChange: setActiveOnly,
      },
      {
        type: 'checkbox',
        label: 'Types',
        options: shopTypes.map((st) => ({
          checked: types.includes(st.value),
          label: st.label,
          onCheckedChange: (e) =>
            setTypes((prev) =>
              e ? [...prev, st.value] : prev.filter((t) => t !== st.value)
            ),
        })),
      },
    ],
    [activeOnly, types]
  );

  return (
    <div className="flex w-full flex-col px-4 gap-2 over">
      <div className="flex w-full justify-between gap-2">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative">
            <Input
              className="pl-9"
              id="shop-search"
              type="search"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
          </div>
          <div className="gap-2 flex">
            <TableFilter filters={filters} />
            <TableSort options={shopSortByOptions} table={table} />
          </div>
        </div>
        <ShopCreateDialog />
      </div>

      {isError ? (
        <div className="p-6 text-center text-red-500">
          Something went wrong.
        </div>
      ) : (
        <DataTable table={table} />
      )}
      <DataTablePagination
        disabled={isFetching}
        hasSelection={true}
        pageSizes={[10, 25, 50]}
        table={table}
        className="pb-2"
      />
    </div>
  );
}
/* <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <ListFilter />
                  Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  Active only
                  <Switch
                    checked={activeOnly}
                    onCheckedChange={setActiveOnly}
                  />
                </DropdownMenuItem>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>Types</DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      {shopTypes.map((st) => (
                        <DropdownMenuCheckboxItem
                          checked={types[st.value]}
                          key={st.label}
                          onSelect={(e) => e.preventDefault()}
                          onCheckedChange={(e) =>
                            setTypes({ ...types, [st.value]: e })
                          }
                        >
                          {st.label}
                        </DropdownMenuCheckboxItem>
                      ))}
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
              </DropdownMenuContent>
            </DropdownMenu> */
// const { table, isError, isFetching, isPending, filters, setFilter } =
//     useDataTable({
//       queryKey: 'shops',
//       columns: shopColumns,
//       filters: {
//         values: {
//           activeOnly: props.activeOnly,
//           searchTerm: props.searchTerm,
//           types: props.types,
//         },
//         defaultValues: {
//           activeOnly: false,
//           searchTerm: '',
//           types: [],
//         },
//         paramNames: {
//           activeOnly: 'active',
//           searchTerm: 's',
//           types: 'type',
//         },
//       },
//       pagination: props.pagination,
//       sorting: props.sorting,
//       defaultPageSize: 10,
//       defaultSorting: ShopSortBy.SHOP_SORT_BY_UPDATED_AT.toString(),
//       fetchFn: async (filters, pagination, sorting, signal) => {
//         const res = await getShops(
//           {
//             activeOnly: filters.activeOnly,
//             pageIndex: pagination.pageIndex,
//             pageSize: pagination.pageSize,
//             searchTerm: filters.searchTerm,
//             sortBy: Number(sorting[0].id) as ShopSortBy,
//             sortDescending: sorting[0].desc,
//             types: filters.types,
//           },
//           signal
//         );
//         return { ...res, items: res.shops };
//       },
//     });

//   const handleTypesCheckedChange = useCallback(
//     (e: boolean, value: ShopType) =>
//       setFilter('types', (prev) =>
//         e ? [...prev, value] : prev.filter((v) => v !== value)
//       ),
//     [setFilter]
//   );

//   const tableFilters: TableFilterItem[] = useMemo(
//     () => [
//       {
//         type: 'checkbox',
//         label: 'Types',
//         options: shopTypes.map((t) => ({
//           label: t.label,
//           checked: filters.types.includes(t.value),
//           onCheckedChange: (e: boolean) => handleTypesCheckedChange(e, t.value),
//         })),
//       },
//     ],
//     [handleTypesCheckedChange, filters.types]
//   );

//   return (
//     <div className="flex w-full flex-col px-4 gap-2 over">
//       <div className="flex w-full justify-between gap-2">
//         <div className="flex flex-col sm:flex-row gap-2">
//           <div className="relative">
//             <Input
//               className="pl-9"
//               id="shop-search"
//               type="search"
//               placeholder="Search"
//               value={filters.searchTerm}
//               onChange={(e) => setFilter('searchTerm', e.target.value)}
//             />
//             <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
//           </div>
//           <div className="gap-2 flex">
//             <TableFilter filters={tableFilters} />
//             <TableSort options={shopSortByOptions} table={table} />
//           </div>
//         </div>
//         <ShopCreateDialog />
//       </div>

//       {isError ? (
//         <div className="p-6 text-center text-red-500">
//           Something went wrong.
//         </div>
//       ) : (
//         <DataTable
//           table={table}
//           isPending={isPending}
//           isFetching={isFetching}
//         />
//       )}
//       <DataTablePagination
//         disabled={isFetching}
//         hasSelection={true}
//         pageSizes={[10, 25, 50]}
//         table={table}
//         className="pb-2"
//       />
//     </div>
//   );
// }

// const [filters, dispatch] = useReducer(shopfiltersReducer, {
//   activeOnly: props.activeOnly,
//   searchTerm: props.searchTerm,
//   types: props.types,
// });
// const { filters, resetFilters, setFilter, tableFilters } = useTableFilter({
//   columns: shopColumns,
//   defaultFilters: {
//     activeOnly: props.activeOnly,
//     searchTerm: props.searchTerm,
//     types: props.types,
//   },
//   paramNames: {
//     activeOnly: 'active',
//     searchTerm: 's',
//     types: 'type',
//   },
// });
// function shopfiltersReducer(
//   state: {
//     searchTerm: string;
//     activeOnly: boolean;
//     types: ShopType[];
//   },
//   action:
//     | {
//         type: 'setSearchTerm';
//         newSearchTerm: string;
//       }
//     | {
//         type: 'setActiveOnly';
//         newActiveOnly: boolean;
//       }
//     | {
//         type: 'setTypes';
//         newTypes: ShopType[];
//       }
// ): {
//   searchTerm: string;
//   activeOnly: boolean;
//   types: ShopType[];
// } {
//   switch (action.type) {
//     case 'setActiveOnly':
//       return {
//         ...state,
//         activeOnly: action.newActiveOnly,
//       };
//     case 'setSearchTerm':
//       return {
//         ...state,
//         searchTerm: action.newSearchTerm,
//       };
//     case 'setTypes':
//       return {
//         ...state,
//         types: action.newTypes,
//       };
//   }
// }

// {
/* <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <ListFilter />
                  Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  Active only
                  <Switch
                    checked={filters.activeOnly}
                    onCheckedChange={(e) => {
                      dispatch({ type: 'setActiveOnly', newActiveOnly: e });
                      resetPagination();
                    }}
                  />
                </DropdownMenuItem>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>Types</DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      {shopTypes.map((item) => (
                        <DropdownMenuCheckboxItem
                          checked={filters.types.includes(item.value)}
                          key={item.label}
                          onSelect={(e) => e.preventDefault()}
                          onCheckedChange={(e) => {
                            dispatch({
                              type: 'setTypes',
                              newTypes: e
                                ? [...filters.types, item.value]
                                : filters.types.filter((i) => i !== item.value),
                            });
                            resetPagination();
                          }}
                        >
                          {item.label}
                        </DropdownMenuCheckboxItem>
                      ))}
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
              </DropdownMenuContent>
            </DropdownMenu> */
// }

// const filterItems: FilterItem[] = [
//     {
//       filterType: 'selectMultiple',
//       placeholder: 'Types',
//       defaultValues: shopTypes.filter((t) => filters.types.includes(t.value)),
//       id: 'shop-types-select-multiple',
//       onChange: (value) => {
//         dispatch({
//           type: 'setTypes',
//           newTypes: value.map((v) => v.value as ShopType),
//         });
//         resetPagination();
//       },

//       values: shopTypes,
//     },
//     {
//       filterType: 'switch',
//       defaultValue: filters.activeOnly,
//       label: 'Active only',
//       id: 'shop-active-switch',
//       onChange: (value) => {
//         dispatch({
//           type: 'setActiveOnly',
//           newActiveOnly: value,
//         });
//         resetPagination();
//       },
//     },
//   ];

// 'use client';
// import { shopColumns } from '@/components/store/shops-columns';
// import { useDebounce } from '@/hooks/use-debounce';
// import { getShops } from '@/lib/queries/get-shops-query';
// import { ShopSortBy, ShopType } from '@shopify-clone/proto-ts';
// import {
//   Input,
//   Label,
//   SelectMultiple,
//   SelectMultipleItem,
//   Switch,
// } from '@shopify-clone/ui';
// import { keepPreviousData, useQuery } from '@tanstack/react-query';
// import {
//   getCoreRowModel,
//   PaginationState,
//   SortingState,
//   useReactTable,
// } from '@tanstack/react-table';
// import { Search } from 'lucide-react';
// import { useRouter, useSearchParams } from 'next/navigation';
// import { useEffect, useMemo, useState } from 'react';
// import { DataTable } from '../table/data-table';
// import { DataTablePagination } from '../table/table-pagination';
// import { ShopCreateDialog } from './shop-create-dialog';

// export const shopTypes: SelectMultipleItem<ShopType>[] = [
//   { label: 'Fashion', value: ShopType.SHOP_TYPE_FASHION },
//   { label: 'Other', value: ShopType.SHOP_TYPE_UNSPECIFIED },
// ];

// interface ShopTableProps {
//   searchTerm: string;
//   activeOnly: boolean;
//   pagination: PaginationState;
//   sorting: SortingState;
//   types: ShopType[];
// }

// export function ShopTable(props: ShopTableProps) {
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   const [searchTerm, setSearchTerm] = useState(props.searchTerm);
//   const [activeOnly, setActiveOnly] = useState(props.activeOnly);
//   const [pagination, setPagination] = useState(props.pagination);
//   const [sorting, setSorting] = useState(props.sorting);
//   const [types, setTypes] = useState(props.types);
//   const debouncedSearchTerm = useDebounce(searchTerm);
//   const debouncedActiveOnly = useDebounce(activeOnly);
//   const debouncedPagination = useDebounce(pagination);
//   const debouncedSorting = useDebounce(sorting);
//   const debouncedTypes = useDebounce(types);

//   const resetPage = () =>
//     setPagination((old) => ({ pageSize: old.pageSize, pageIndex: 0 }));

//   useEffect(() => {
//     const params = new URLSearchParams(searchParams.toString());
//     if (debouncedPagination.pageIndex !== 0)
//       params.set('page', debouncedPagination.pageIndex.toString());
//     else params.delete('page');

//     if (debouncedPagination.pageSize !== 10)
//       params.set('size', debouncedPagination.pageSize.toString());
//     else params.delete('size');

//     if (debouncedSearchTerm) params.set('s', debouncedSearchTerm);
//     else params.delete('s');

//     if (debouncedActiveOnly) params.set('active', String(debouncedActiveOnly));
//     else params.delete('active');

//     if (Number(debouncedSorting[0]?.id) !== ShopSortBy.SHOP_SORT_BY_UPDATED_AT)
//       params.set('sort', debouncedSorting[0]?.id);
//     else params.delete('sort');

//     if (debouncedSorting[0]?.desc)
//       params.set('desc', String(debouncedSorting[0]?.desc));
//     else params.delete('desc');

//     params.delete('type');
//     if (debouncedTypes.length > 0) {
//       for (const debounceType of debouncedTypes) {
//         params.append('type', debounceType.toString());
//       }
//     }

//     const newUrl = `?${params.toString()}`;
//     const currentUrl = `?${searchParams.toString()}`;
//     if (newUrl !== currentUrl) {
//       router.replace(newUrl);
//     }
//   }, [
//     debouncedPagination,
//     debouncedSearchTerm,
//     debouncedActiveOnly,
//     router,
//     searchParams,
//     debouncedSorting,
//     debouncedTypes,
//   ]);

//   const key = useMemo(
//     () => [
//       'shops',
//       {
//         pagination: debouncedPagination,
//         sorting: debouncedSorting,
//         searchTerm: debouncedSearchTerm,
//         activeOnly: debouncedActiveOnly,
//         types: debouncedTypes,
//       },
//     ],
//     [
//       debouncedPagination,
//       debouncedSorting,
//       debouncedSearchTerm,
//       debouncedActiveOnly,
//       debouncedTypes,
//     ]
//   );

//   const { data, isError, isFetching, isPending } = useQuery({
//     queryKey: key,
//     queryFn: ({ signal }) =>
//       getShops(
//         {
//           activeOnly: debouncedActiveOnly,
//           searchTerm: debouncedSearchTerm,
//           sortBy: Number(debouncedSorting[0]?.id) as ShopSortBy,
//           sortDescending: debouncedSorting[0]?.desc ?? false,
//           pageIndex: debouncedPagination.pageIndex,
//           pageSize: debouncedPagination.pageSize,
//           types: debouncedTypes,
//         },
//         signal
//       ),
//     refetchOnWindowFocus: false,
//     placeholderData: keepPreviousData,
//   });

//   const table = useReactTable({
//     data: data?.shops ?? [],
//     columns: shopColumns,
//     getCoreRowModel: getCoreRowModel(),
//     onSortingChange: (value) => {
//       setSorting(value);
//       resetPage();
//     },
//     // onColumnFiltersChange: setColumnFilters,
//     // getFilteredRowModel: getFilteredRowModel(),
//     onPaginationChange: setPagination,
//     manualSorting: true,
//     manualPagination: true,
//     manualFiltering: true,
//     autoResetPageIndex: false,
//     pageCount: (data?.maxPageIndex ?? -1) + 1,
//     state: {
//       pagination: pagination,
//       sorting: sorting,
//       // columnFilters,
//     },
//   });
//   return (
//     <div className="flex w-full flex-col px-4 gap-2 over">
//       <div className="flex w-full justify-between">
//         <div className="flex flex-col sm:flex-row gap-2">
//           <div className="relative">
//             <Input
//               className=" pl-9"
//               id="search-input"
//               type="text"
//               placeholder="Search..."
//               value={searchTerm}
//               onChange={(e) => {
//                 setSearchTerm(e.target.value);
//                 resetPage();
//               }}
//             />
//             <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
//           </div>
//           <div className="flex gap-2">
//             <SelectMultiple
//               placeholder="Types"
//               items={shopTypes}
//               selectedItems={shopTypes.filter((t) => types.includes(t.value))}
//               onChange={(items) => setTypes(items.map((i) => i.value))}
//             />
//             <div className="flex items-center space-x-2">
//               <Switch
//                 checked={activeOnly}
//                 onCheckedChange={(value) => {
//                   setActiveOnly(value);
//                   resetPage();
//                 }}
//                 id="active-switch"
//               />
//               <Label htmlFor="active-switch">Active only</Label>
//             </div>
//           </div>
//         </div>
//         <ShopCreateDialog />
//       </div>

//       {isError ? (
//         <div className="p-6 text-center text-red-500">
//           Something went wrong.
//         </div>
//       ) : (
//         <DataTable
//           table={table}
//           isPending={isPending}
//           isFetching={isFetching}
//           onRowClick={(id) => router.push(`/store/${id}`)}
//         />
//       )}
//       <DataTablePagination
//         disabled={isFetching}
//         hasSelection={true}
//         pageSizes={[10, 25, 50]}
//         table={table}
//         className="pb-2"
//       />
//     </div>
//   );
// }
