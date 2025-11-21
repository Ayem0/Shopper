'use client';

import { useDebounceCallback } from '@/hooks/use-debounce-callback';
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
import { memo, useState } from 'react';

export type TableFilterType = 'checkbox' | 'switch' | 'radio';

type TableFilterBase = {
  type: TableFilterType;
  label: string;
};

export type TableFilterCheckbox<T = unknown> = {
  type: 'checkbox';
  options: {
    label: string;
    value: T;
  }[];
  defaultValues: T[];
  onChange: (values: T[]) => void;
} & TableFilterBase;

export type TableFilterSwitch = {
  type: 'switch';
  checked: boolean;
  onCheckedChange: (e: boolean) => void;
} & TableFilterBase;

export type TableFilterRadio = {
  type: 'radio';
  value: string;
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

export const DataTableFilter = memo(function DataTableFilter({
  filters,
}: TableFilterProps) {
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
});

const TableFilterRadio = memo(function TableFilterRadio({
  filter,
}: {
  filter: TableFilterRadio;
}) {
  const [value, setValue] = useState(filter.value);

  useDebounceCallback(value, filter.onValueChange, 500);

  return (
    <TableFilterGroup label={filter.label}>
      <DropdownMenuRadioGroup value={value} onValueChange={(v) => setValue(v)}>
        {filter.options.map((o) => (
          <DropdownMenuRadioItem key={o.label} value={o.value}>
            {o.label}
          </DropdownMenuRadioItem>
        ))}
      </DropdownMenuRadioGroup>
    </TableFilterGroup>
  );
});

const TableFilterCheckbox = memo(function TableFilterCheckbox({
  filter,
}: {
  filter: TableFilterCheckbox;
}) {
  const [values, setValues] = useState(filter.defaultValues);

  useDebounceCallback(values, filter.onChange, 500);

  return (
    <TableFilterGroup label={filter.label}>
      {filter.options.map((o) => (
        <DropdownMenuCheckboxItem
          onSelect={(e) => e.preventDefault()}
          key={o.label}
          checked={values.includes(o.value)}
          onCheckedChange={(checked) => {
            if (checked) {
              setValues([...values, o.value]);
            } else {
              setValues(values.filter((v) => v !== o.value));
            }
          }}
        >
          {o.label}
        </DropdownMenuCheckboxItem>
      ))}
    </TableFilterGroup>
  );
});

const TableFilterSwitch = memo(function TableFilterSwitch({
  filter,
}: {
  filter: TableFilterSwitch;
}) {
  const [checked, setChecked] = useState(filter.checked);

  useDebounceCallback(checked, filter.onCheckedChange, 500);

  return (
    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
      {filter.label}
      <Switch checked={checked} onCheckedChange={setChecked} />
    </DropdownMenuItem>
  );
});

const TableFilterGroup = memo(function TableFilterGroup({
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
});
