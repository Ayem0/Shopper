'use client';

import {
  Button,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  Switch,
} from '@shopify-clone/ui';
import { ListFilter } from 'lucide-react';

export type TableFilterType = 'checkbox' | 'switch' | 'radio';

type TableFilterBase = {
  type: TableFilterType;
  label: string;
};

export type TableFilterCheckbox = {
  type: 'checkbox';
  options: {
    label: string;
    onCheckedChange: (e: boolean) => void;
    checked: boolean;
  }[];
} & TableFilterBase;

export type TableFilterSwitch = {
  type: 'switch';
  checked: boolean;
  onCheckedChange: (e: boolean) => void;
} & TableFilterBase;

export type TableFilterRadio = {
  type: 'radio';
  value?: string;
  onValueChange: (value: string) => void;
  options: {
    label: string;
    value: string;
  }[];
} & TableFilterBase;

export type TableFilterItem =
  | TableFilterCheckbox
  | TableFilterSwitch
  | TableFilterRadio;

type TableFilterProps = {
  filters: TableFilterItem[];
};

export function TableFilter({ filters }: TableFilterProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <ListFilter />
          Filter
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {filters.map((filter) => {
          if (filter.type === 'checkbox') {
            return <TableFilterCheckbox filter={filter} key={filter.label} />;
          } else if (filter.type === 'switch') {
            return <TableFilterSwitch filter={filter} key={filter.label} />;
          } else if (filter.type === 'radio') {
            return <TableFilterRadio filter={filter} key={filter.label} />;
          } else return null;
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function TableFilterRadio({ filter }: { filter: TableFilterRadio }) {
  return (
    <TableFilterGroup label={filter.label}>
      <DropdownMenuRadioGroup
        value={filter.value}
        onValueChange={(v) => filter.onValueChange(v)}
      >
        {filter.options.map((o) => (
          <DropdownMenuRadioItem key={o.label} value={o.value}>
            {o.label}
          </DropdownMenuRadioItem>
        ))}
      </DropdownMenuRadioGroup>
    </TableFilterGroup>
  );
}

function TableFilterCheckbox({ filter }: { filter: TableFilterCheckbox }) {
  return (
    <TableFilterGroup label={filter.label}>
      {filter.options.map((o) => (
        <DropdownMenuCheckboxItem
          checked={o.checked}
          key={o.label}
          onSelect={(e) => e.preventDefault()}
          onCheckedChange={(e) => o.onCheckedChange(e)}
        >
          {o.label}
        </DropdownMenuCheckboxItem>
      ))}
    </TableFilterGroup>
  );
}

function TableFilterSwitch({ filter }: { filter: TableFilterSwitch }) {
  return (
    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
      {filter.label}
      <Switch
        checked={filter.checked}
        onCheckedChange={(e) => filter.onCheckedChange(e)}
      />
    </DropdownMenuItem>
  );
}

function TableFilterGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>{label}</DropdownMenuSubTrigger>
      <DropdownMenuPortal>
        <DropdownMenuSubContent>{children}</DropdownMenuSubContent>
      </DropdownMenuPortal>
    </DropdownMenuSub>
  );
}
