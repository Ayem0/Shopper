'use client';

import { useDebounceCallback } from '@/hooks/use-debounce-callback';
import {
  ArrayItem,
  ArrayKeys,
  BooleanKeys,
  BoundCheckboxFilter,
  BoundRadioFilter,
  BoundSwitchFilter,
  BoundTableFilter,
  StringKeys,
} from '@/lib/data-table/data-table-filter';
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
import { useState } from 'react';

type TableFilterProps<TExtra> = {
  filters: readonly BoundTableFilter<TExtra>[];
};

export function DataTableFilter<TExtra>({ filters }: TableFilterProps<TExtra>) {
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
          switch (filter.type) {
            case 'checkbox':
              return (
                <CheckboxFilterComponent filter={filter} key={filter.key} />
              );

            case 'switch':
              return <SwitchFilterComponent filter={filter} key={filter.key} />;

            case 'radio':
              return <RadioFilterComponent filter={filter} key={filter.key} />;
          }
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function CheckboxFilterComponent<TState, K extends ArrayKeys<TState>>({
  filter,
}: {
  filter: BoundCheckboxFilter<TState, K>;
}) {
  const [values, setValues] = useState(filter.value as ArrayItem<TState[K]>[]);

  useDebounceCallback(
    values,
    () => {
      filter.setValue(values as TState[K]);
    },
    500
  );

  return (
    <TableFilterGroup label={filter.label}>
      {filter.options.map((o) => (
        <DropdownMenuCheckboxItem
          key={o.label}
          checked={values.includes(o.value)}
          onSelect={(e) => e.preventDefault()}
          onCheckedChange={(checked) => {
            setValues(
              checked
                ? [...values, o.value]
                : values.filter((v) => v !== o.value)
            );
          }}
        >
          {o.label}
        </DropdownMenuCheckboxItem>
      ))}
    </TableFilterGroup>
  );
}

function SwitchFilterComponent<TState, K extends BooleanKeys<TState>>({
  filter,
}: {
  filter: BoundSwitchFilter<TState, K>;
}) {
  const [checked, setChecked] = useState(filter.value as boolean);

  useDebounceCallback(
    checked,
    () => {
      filter.setValue(checked as TState[K]);
    },
    500
  );

  return (
    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
      {filter.label}
      <Switch checked={checked} onCheckedChange={setChecked} />
    </DropdownMenuItem>
  );
}

function RadioFilterComponent<TState, K extends StringKeys<TState>>({
  filter,
}: {
  filter: BoundRadioFilter<TState, K>;
}) {
  const [value, setValue] = useState(filter.value as string);

  useDebounceCallback(
    value,
    () => {
      filter.setValue(value as TState[K]);
    },
    500
  );

  return (
    <TableFilterGroup label={filter.label}>
      <DropdownMenuRadioGroup value={value} onValueChange={(v) => setValue(v)}>
        {filter.options.map((o) => (
          <DropdownMenuRadioItem key={o.label} value={o.value as string}>
            {o.label}
          </DropdownMenuRadioItem>
        ))}
      </DropdownMenuRadioGroup>
    </TableFilterGroup>
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
