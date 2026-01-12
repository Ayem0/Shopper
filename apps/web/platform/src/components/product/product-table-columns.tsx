import { activeStatusToLabel } from '@/lib/types/active-status';
import { ProductSortBy, ProductVariantData } from '@shopify-clone/proto-ts';
import {
  Badge,
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@shopify-clone/ui';
import { ColumnDef } from '@tanstack/react-table';
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import Link from 'next/link';

export const productTableColumns: ColumnDef<ProductVariantData>[] = [
  {
    id: 'productId',
    accessorFn: (row) => row.product?.id,
    enableGrouping: true,
    enableSorting: false,
    enableColumnFilter: false,
    enableHiding: true,
  },

  {
    accessorKey: 'expand',
    size: 52,
    enableResizing: false,
    enableSorting: false,
    enableColumnFilter: false,
    enableHiding: false,
    header: ({ table }) => {
      return (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => table.toggleAllRowsExpanded()}
        >
          {table.getIsAllRowsExpanded() ? <ChevronUp /> : <ChevronDown />}
        </Button>
      );
    },
    cell: ({ row }) => {
      if (!row.getIsGrouped()) {
        return null;
      }
      return (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => row.toggleExpanded()}
        >
          {row.getIsExpanded() ? <ChevronUp /> : <ChevronDown />}
        </Button>
      );
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <Badge variant="default">
            {activeStatusToLabel[row.original.status]}
          </Badge>
        </div>
      );
    },
  },
  {
    id: ProductSortBy.PRODUCT_SORT_BY_NAME.toString(),
    accessorKey: 'name',
    cell: ({ row }) => {
      if (row.getIsGrouped()) {
        return null;
      }
      return (
        <Link
          href={`/store/${row.original.shopId}/products/categories/${row.original.id}`}
          className="hover:underline"
        >
          {row.original.name}
        </Link>
      );
    },
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Name
          {column.getIsSorted() === false && (
            <ArrowUpDown className="ml-2 h-4 w-4" />
          )}
          {column.getIsSorted() === 'asc' && (
            <ArrowUp className="ml-2 h-4 w-4" />
          )}
          {column.getIsSorted() === 'desc' && (
            <ArrowDown className="ml-2 h-4 w-4" />
          )}
        </Button>
      );
    },
  },
  {
    accessorKey: 'categories',
    header: 'Categories',
    cell: ({ row }) => {
      if (!row.original.product) {
        return null;
      }
      if (row.original.product.categories.length > 2) {
        return (
          <div className="flex flex-row gap-1">
            {row.original.product.categories.slice(0, 2).map((category) => (
              <Badge key={category.id}>{category.name}</Badge>
            ))}
            <Popover>
              <PopoverTrigger asChild>
                <Badge>+{row.original.product.categories.length - 2}</Badge>
              </PopoverTrigger>
              <PopoverContent className="max-w-32">
                {row.original.product.categories.slice(2).map((category) => (
                  <span key={category.id}>{category.name}</span>
                ))}
              </PopoverContent>
            </Popover>
          </div>
        );
      }
      return (
        <>
          {row.original.product.categories.map((category) => (
            <Badge key={category.id}>{category.name}</Badge>
          ))}
        </>
      );
    },
  },
];

// const getOptionKeys = (variants: ProductVariantData) => {
//   const set = new Set<string>();

//   variants.forEach((variant) => {
//     variant.variantOptionValues.forEach((opt) => {
//       set.add(opt.name);
//     });
//   });

//   return Array.from(set);
// };

const colSize = productTableColumns.length;
// export const ExpandableProductRow = (row: ProductData) => {
//   const optionKeys = getOptionKeys(row.variants);

//   const gridTemplateColumns = `
//     96px
//     minmax(240px, 1fr)
//     repeat(${optionKeys.length}, minmax(120px, 1fr))
//   `;

//   return row.variants.map((variant) => {
//     const orderedOptions = optionKeys.map((key) =>
//       variant.variantOptionValues.find((v) => v.name === key)
//     );

//     return (
//       <TableRow key={variant.id}>
//         <div className="grid"></div>
//         <TableCell colSpan={colSize} className="p-0">
//           <div
//             className="
//               grid
//               w-full
//               pl-13
//               py-2
//               items-center
//               gap-4
//               border-t
//               border-border/50
//             "
//             style={{ gridTemplateColumns }}
//           >
//             {/* Status */}
//             <Badge className="justify-center">
//               {activeStatusToLabel[variant.status]}
//             </Badge>

//             {/* Name */}
//             <span className="truncate">{variant.name}</span>

//             {/* Variant option values */}
//             {orderedOptions.map((opt, index) => (
//               <span
//                 key={index}
//                 className="truncate text-muted-foreground"
//                 title={opt?.value}
//               >
//                 {opt?.value ?? '—'}
//               </span>
//             ))}
//           </div>
//         </TableCell>
//       </TableRow>
//     );
//   });
// };

// export const ExpandableProductRow = (row: ProductData) => {
//   const optionKeys = getOptionKeys(row.variants);
//   return (
//     <tr>
//       <td colSpan={colSize} className="pl-13 bg-muted/30 py-2 pr-2">
//         <div className="w-full bg-background rounded-md border">
//           <Table>
//             <TableHeader>
//               <TableRow className="border-b">
//                 <TableHead>Status</TableHead>
//                 <TableHead>Name</TableHead>
//                 {optionKeys.map((key) => (
//                   <TableHead key={key}>{key}</TableHead>
//                 ))}
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {row.variants.map((variant) => (
//                 <Fragment key={variant.id}>
//                   <TableRow key={variant.id}>
//                     <TableCell>{activeStatusToLabel[variant.status]}</TableCell>
//                     <TableCell>{variant.name}</TableCell>
//                     {optionKeys.map((key) => (
//                       <TableCell key={key}>
//                         {
//                           variant.variantOptionValues.find(
//                             (v) => v.name === key
//                           )?.value
//                         }
//                       </TableCell>
//                     ))}
//                   </TableRow>
//                 </Fragment>
//               ))}
//             </TableBody>
//           </Table>
//         </div>
//       </td>
//     </tr>
//   );
// };
