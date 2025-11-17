// import {
//   TableFilterCheckbox,
//   TableFilterItem,
//   TableFilterRadio,
//   TableFilterSwitch,
// } from '@/components/table/table-filter';
// import { ColumnDef } from '@tanstack/react-table';
// import { useCallback, useMemo, useState, useTransition } from 'react';
// import { useDebounce } from './use-debounce';

// interface UseTableFilterProps<TFilters, TData> {
//   columns: ColumnDef<TData>[];
//   defaultFilters: TFilters;
//   paramNames: Record<keyof TFilters, string>;
// }

// export function useTableFilter<
//   TFilters extends Record<string, string | boolean | unknown[]>,
//   TData
// >({ columns, defaultFilters }: UseTableFilterProps<TFilters, TData>) {
//   const [isPending, startTransition] = useTransition();
//   const [filters, setFilters] = useState(defaultFilters);
//   const debouncedFilters = useDebounce(filters);

//   const setFilter = useCallback(
//     <K extends keyof TFilters>(key: K, value: TFilters[K]) => {
//       startTransition(() => setFilters((s) => ({ ...s, [key]: value })));
//     },
//     []
//   );
//   const resetFilters = useCallback(
//     () => setFilters({ ...defaultFilters }),
//     [defaultFilters]
//   );

//   const tableFilters: TableFilterItem[] = useMemo(() => {
//     if (columns.length === 0) return [];
//     return columns
//       .map((c) => {
//         const meta = c.meta?.filter;
//         if (!meta) return null;
//         const key = meta.key;
//         if (!(key in defaultFilters)) {
//           console.log(`ERROR GETTING KEY ${key}`);
//           return null;
//         }
//         const value = filters[key];
//         switch (meta.type) {
//           case 'checkbox': {
//             if (!Array.isArray(value)) return null;
//             const item: TableFilterCheckbox = {
//               type: 'checkbox',
//               label: meta.label,
//               options: meta.options.map((o) => ({
//                 label: o.label,
//                 checked: value.includes(o.value),
//                 onCheckedChange: (e: boolean) => {
//                   setFilter(
//                     key,
//                     (e
//                       ? [...value, o.value]
//                       : value.filter((v) => v !== o.value)) as TFilters[string]
//                   );
//                 },
//               })),
//             };
//             return item;
//           }
//           case 'switch': {
//             const item: TableFilterSwitch = {
//               type: 'switch',
//               checked: value as boolean,
//               label: meta.label,
//               onCheckedChange: (e: boolean) => {
//                 setFilter(key, e as TFilters[string]);
//               },
//             };
//             return item;
//           }
//           case 'radio': {
//             const item: TableFilterRadio = {
//               type: 'radio',
//               label: meta.label,
//               value: value as string,
//               onValueChange: (v: string) =>
//                 setFilter(key, v as TFilters[string]),
//               options: meta.options.map((o) => ({
//                 label: o.label,
//                 value: o.value,
//               })),
//             };
//             return item;
//           }
//           default:
//             return null;
//         }
//       })
//       .filter((x) => x !== null) satisfies TableFilterItem[];
//   }, [columns, defaultFilters, filters, setFilter]);

//   return {
//     resetFilters,
//     filters,
//     setFilter,
//     tableFilters,
//   };
// }
