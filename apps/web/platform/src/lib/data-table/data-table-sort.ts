import { LucideIcon } from 'lucide-react';

export interface TableSortOption<TSort> {
  label: string;
  icon?: LucideIcon;
  value: TSort;
  desc: boolean;
}
