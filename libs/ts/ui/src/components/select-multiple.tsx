'use client';

import { Check, ChevronsUpDown } from 'lucide-react';

import { useState } from 'react';
import { cn } from '../utils/utils';
import { Button } from './button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from './command';
import { Popover, PopoverContent, PopoverTrigger } from './popover';

export type SelectMultipleItemGroup<T> = {
  label: string;
  values: SelectMultipleItem<T>[];
};

export type SelectMultipleItem<T> = {
  label: string;
  value: T;
};

type SelectMultipleProps<T> = {
  placeholder: string;
  /** All possible items */
  items: SelectMultipleItem<T>[];
  /** Default selected items */
  selectedItems: SelectMultipleItem<T>[];
  onChange: (values: SelectMultipleItem<T>[]) => void;
};

export function SelectMultiple<T>({
  onChange,
  placeholder,
  items,
  selectedItems,
  ...props
}: SelectMultipleProps<T> &
  Omit<React.ComponentProps<'select'>, 'defaulT' | 'value' | 'onChange'>) {
  const [open, setOpen] = useState(false);

  const toggleItem = (item: SelectMultipleItem<T>) => {
    const exists = selectedItems.some((v) => v.value === item.value);
    const newValues = exists
      ? selectedItems.filter((v) => v.value !== item.value)
      : [...selectedItems, item];
    onChange(newValues);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between"
        >
          {placeholder}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Command>
          <CommandInput placeholder="Search..." className="h-9" />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {items.map((item, i) => (
                <CommandItem
                  key={i}
                  value={String(item.value)}
                  onSelect={() => toggleItem(item)}
                >
                  {item.label}
                  <Check
                    className={cn(
                      'ml-auto',
                      selectedItems.includes(item) ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
