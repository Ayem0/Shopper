'use client';

import { DataTable } from '@/components/table/data-table';
import { DataTableFilter } from '@/components/table/data-table-filter';
import { DataTablePagination } from '@/components/table/data-table-pagination';
import { DataTableSort } from '@/components/table/data-table-sort';
import { Button } from '@shopify-clone/ui';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useReducer } from 'react';
import { productColumns, ProductData } from './product-columns';

export function ProductTable() {
  const router = useRouter();
  const { shopId } = useParams<{ shopId: string }>();
  //   const { isLoading, data, isFetching, isError, isPending } = useQuery({
  //     queryKey: ['products'],
  //     queryFn: async () => {
  //       await fetch('someUrl');
  //     },
  //   });
  const { data, isFetching, isError, isPending } = {
    data: [],
    isFetching: false,
    isError: false,
    isPending: false,
  };
  const [filters, dispatch] = useReducer(filtersReducer, {
    searchTerm: '',
    status: 'all',
    categories: [],
    sorting: 1,
  });
  // const filterItems: FilterItem[] = [
  //   {
  //     filterType: 'input',
  //     type: 'search',
  //     defaultValue: filters.searchTerm,
  //     id: 'product-search-input',
  //     onChange: (value) =>
  //       dispatch({ type: 'setSearchTerm', newSearchTerm: value }),
  //     placehodler: 'Search',
  //     icon: Search,
  //   },
  //   {
  //     filterType: 'select',
  //     defaultValue: { label: 'All', value: 'all' },
  //     id: 'product-status-select',
  //     onChange: (value) =>
  //       dispatch({
  //         type: 'setStatus',
  //         newStatus: value as 'all' | 'draft' | 'active' | 'inactive',
  //       }),
  //     values: [
  //       { label: 'All', value: 'all' },
  //       { label: 'Draft', value: 'draft' },
  //       { label: 'Active', value: 'active' },
  //       { label: 'Inactive', value: 'inactive' },
  //     ],
  //   },
  // ];
  const table = useReactTable({
    columns: productColumns,
    data: [
      {
        id: '',
        name: 'Shirt full logo',
        status: 'draft',
        stock: 1,
        categories: [
          { id: '1', name: 'Shirts' },
          { id: '2', name: 'Pants' },
          { id: '3', name: 'Shoes' },
        ],
      },
      {
        id: '',
        name: 'Shirt full logo',
        status: 'draft',
        stock: 1,
        categories: [
          { id: '1', name: 'Shirts' },
          { id: '2', name: 'Pants' },
          { id: '3', name: 'Shoes' },
        ],
      },
      {
        id: '',
        name: 'Shirt full logo',
        status: 'draft',
        stock: 1,
        categories: [
          { id: '1', name: 'Shirts' },
          { id: '2', name: 'Pants' },
          { id: '3', name: 'Shoes' },
        ],
      },
      {
        id: '',
        name: 'Shirt full logo',
        status: 'draft',
        stock: 1,
        categories: [
          { id: '1', name: 'Shirts' },
          { id: '2', name: 'Pants' },
          { id: '3', name: 'Shoes' },
        ],
      },
      {
        id: '',
        name: 'Shirt full logo',
        status: 'draft',
        stock: 1,
        categories: [
          { id: '1', name: 'Shirts' },
          { id: '2', name: 'Pants' },
          { id: '3', name: 'Shoes' },
        ],
      },
      {
        id: '',
        name: 'Shirt full logo',
        status: 'draft',
        stock: 1,
        categories: [
          { id: '1', name: 'Shirts' },
          { id: '2', name: 'Pants' },
          { id: '3', name: 'Shoes' },
        ],
      },
      {
        id: '',
        name: 'Shirt full logo',
        status: 'draft',
        stock: 1,
        categories: [
          { id: '1', name: 'Shirts' },
          { id: '2', name: 'Pants' },
          { id: '3', name: 'Shoes' },
        ],
      },
      {
        id: '',
        name: 'Shirt full logo',
        status: 'draft',
        stock: 1,
        categories: [
          { id: '1', name: 'Shirts' },
          { id: '2', name: 'Pants' },
          { id: '3', name: 'Shoes' },
        ],
      },
      {
        id: '',
        name: 'Shirt full logo',
        status: 'draft',
        stock: 1,
        categories: [
          { id: '1', name: 'Shirts' },
          { id: '2', name: 'Pants' },
          { id: '3', name: 'Shoes' },
        ],
      },
      {
        id: '',
        name: 'Shirt full logo',
        status: 'draft',
        stock: 1,
        categories: [
          { id: '1', name: 'Shirts' },
          { id: '2', name: 'Pants' },
          { id: '3', name: 'Shoes' },
        ],
      },

      {
        id: '',
        name: 'Shirt full logo',
        status: 'draft',
        stock: 1,
        categories: [
          { id: '1', name: 'Shirts' },
          { id: '2', name: 'Pants' },
          { id: '3', name: 'Shoes' },
        ],
      },
      {
        id: '',
        name: 'Shirt full logo',
        status: 'draft',
        stock: 1,
        categories: [
          { id: '1', name: 'Shirts' },
          { id: '2', name: 'Pants' },
          { id: '3', name: 'Shoes' },
        ],
      },
      {
        id: '',
        name: 'Shirt full logo',
        status: 'draft',
        stock: 1,
        categories: [
          { id: '1', name: 'Shirts' },
          { id: '2', name: 'Pants' },
          { id: '3', name: 'Shoes' },
        ],
      },
      {
        id: '',
        name: 'Shirt full logo',
        status: 'draft',
        stock: 1,
        categories: [
          { id: '1', name: 'Shirts' },
          { id: '2', name: 'Pants' },
          { id: '3', name: 'Shoes' },
        ],
      },
      {
        id: '',
        name: 'Shirt full logo',
        status: 'draft',
        stock: 1,
        categories: [
          { id: '1', name: 'Shirts' },
          { id: '2', name: 'Pants' },
          { id: '3', name: 'Shoes' },
        ],
      },
      {
        id: '',
        name: 'Shirt full logo',
        status: 'draft',
        stock: 1,
        categories: [
          { id: '1', name: 'Shirts' },
          { id: '2', name: 'Pants' },
          { id: '3', name: 'Shoes' },
        ],
      },
      {
        id: '',
        name: 'Shirt full logo',
        status: 'draft',
        stock: 1,
        categories: [
          { id: '1', name: 'Shirts' },
          { id: '2', name: 'Pants' },
          { id: '3', name: 'Shoes' },
        ],
      },
      {
        id: '',
        name: 'Shirt full logo',
        status: 'draft',
        stock: 1,
        categories: [
          { id: '1', name: 'Shirts' },
          { id: '2', name: 'Pants' },
          { id: '3', name: 'Shoes' },
        ],
      },

      {
        id: '',
        name: 'Shirt full logo',
        status: 'draft',
        stock: 1,
        categories: [
          { id: '1', name: 'Shirts' },
          { id: '2', name: 'Pants' },
          { id: '3', name: 'Shoes' },
        ],
      },
      {
        id: '',
        name: 'Shirt full logo',
        status: 'draft',
        stock: 1,
        categories: [
          { id: '1', name: 'Shirts' },
          { id: '2', name: 'Pants' },
          { id: '3', name: 'Shoes' },
        ],
      },
      {
        id: '',
        name: 'Shirt full logo',
        status: 'draft',
        stock: 1,
        categories: [
          { id: '1', name: 'Shirts' },
          { id: '2', name: 'Pants' },
          { id: '3', name: 'Shoes' },
        ],
      },
      {
        id: '',
        name: 'Shirt full logo',
        status: 'draft',
        stock: 1,
        categories: [
          { id: '1', name: 'Shirts' },
          { id: '2', name: 'Pants' },
          { id: '3', name: 'Shoes' },
        ],
      },
      {
        id: '',
        name: 'Shirt full logo',
        status: 'draft',
        stock: 1,
        categories: [
          { id: '1', name: 'Shirts' },
          { id: '2', name: 'Pants' },
          { id: '3', name: 'Shoes' },
        ],
      },
      {
        id: '',
        name: 'Shirt full logo',
        status: 'draft',
        stock: 1,
        categories: [
          { id: '1', name: 'Shirts' },
          { id: '2', name: 'Pants' },
          { id: '3', name: 'Shoes' },
        ],
      },
      {
        id: 'some fake id',
        name: 'Shirt full logo',
        status: 'draft',
        stock: 1,
        categories: [
          { id: '1', name: 'Shirts' },
          { id: '2', name: 'Pants' },
          { id: '3', name: 'Shoes' },
        ],
      },
      {
        id: '',
        name: 'Shirt full logo',
        status: 'draft',
        stock: 1,
        categories: [
          { id: '1', name: 'Shirts' },
          { id: '2', name: 'Pants' },
          { id: '3', name: 'Shoes' },
        ],
      },
    ] as ProductData[],
    getCoreRowModel: getCoreRowModel(),
    // onPaginationChange: setPagi
    manualFiltering: true,
    manualSorting: true,
    manualPagination: true,
    state: {
      pagination: {
        pageIndex: 0,
        pageSize: 10,
      },
    },
  });
  return (
    <div className="flex w-full flex-col gap-2 mx-4 overflow-hidden">
      <div className="flex w-full justify-between">
        <div className="flex flex-col md:flex-row gap-2">
          <DataTableFilter filters={[]} />
          <DataTableSort options={[]} table={table} />
        </div>
        <Button asChild>
          <Link href={`/store/${shopId}/products/create`}>
            <Plus />
            Create
          </Link>
        </Button>
      </div>
      <DataTable table={table} />
      <DataTablePagination
        hasSelection={false}
        pageSizes={[10, 25, 50]}
        table={table}
        className="pb-2"
      />
    </div>
  );
}

function filtersReducer(
  state: {
    searchTerm: string;
    status: 'all' | 'draft' | 'active' | 'inactive';
    categories: string[];
    sorting: number;
  },
  action:
    | { type: 'setSearchTerm'; newSearchTerm: string }
    | { type: 'setStatus'; newStatus: 'all' | 'draft' | 'active' | 'inactive' }
    | { type: 'setCategories'; newCategories: string[] }
    | { type: 'setSorting'; newCategories: string[] }
) {
  switch (action.type) {
    case 'setSearchTerm':
      return {
        ...state,
        searchTerm: action.newSearchTerm,
      };
    case 'setStatus':
      return {
        ...state,
        status: action.newStatus,
      };
    case 'setCategories':
      return {
        ...state,
        categories: action.newCategories,
      };
    default:
      throw new Error('Invalid action');
  }
}
