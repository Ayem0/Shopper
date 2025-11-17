'use client';

import { SelectValue } from '@radix-ui/react-select';
import {
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectMultiple,
  SelectMultipleItem,
  SelectTrigger,
  Switch,
} from '@shopify-clone/ui';
import { LucideIcon } from 'lucide-react';

type FilterType = 'input' | 'switch' | 'selectMultiple' | 'select';

type FilterItemBase = {
  id: string;
  filterType: FilterType;
  className?: string;
};

type FilterItemInput<T extends string | number> = {
  filterType: 'input';
  type: string;
  placehodler?: string;
  label?: string;
  icon?: LucideIcon;
  defaultValue: T;
  onChange: (v: T) => void;
} & FilterItemBase;

type FilterItemSwitch = {
  filterType: 'switch';
  label?: string;
  onChange: (v: boolean) => void;
  defaultValue: boolean;
} & FilterItemBase;

type FilterItemSelect = {
  filterType: 'select';
  placeholder?: string;
  values: { label: string; value: string }[];
  defaultValue: { label: string; value: string };
  onChange: (v: string) => void;
} & FilterItemBase;

type FilterItemSelectMultiple<T> = {
  filterType: 'selectMultiple';
  placeholder?: string;
  values: SelectMultipleItem<T>[];
  defaultValues: SelectMultipleItem<T>[];
  onChange: (v: SelectMultipleItem<T>[]) => void;
} & FilterItemBase;

export type FilterItem =
  | FilterItemSwitch
  | FilterItemSelectMultiple<unknown>
  | FilterItemInput<string>
  | FilterItemInput<number>
  | FilterItemSelect;

type FilterGroupProps = {
  filters: FilterItem[];
};

export function FilterGroup({ filters }: FilterGroupProps) {
  return filters.map((filter, i) => {
    switch (filter.filterType) {
      case 'input':
        return filter.icon ? (
          <div className="relative" key={`filter-input-${i}`}>
            <Input
              className="pl-9"
              id={filter.id}
              type={filter.type}
              placeholder={filter.placehodler}
              value={filter.defaultValue}
              onChange={(e) =>
                typeof filter.defaultValue === 'string'
                  ? filter.onChange(e.target.value)
                  : filter.onChange(e.target.valueAsNumber)
              }
            />
            {filter.icon !== undefined && (
              <filter.icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
            )}
          </div>
        ) : (
          <Input
            id={filter.id}
            type={filter.type}
            placeholder={filter.placehodler}
            value={filter.defaultValue}
            onChange={(e) =>
              typeof filter.defaultValue === 'string'
                ? filter.onChange(e.target.value)
                : filter.onChange(e.target.valueAsNumber)
            }
          />
        );
      case 'switch':
        return (
          <div
            className="flex items-center space-x-2"
            key={`filter-switch-${i}`}
          >
            <Switch
              checked={filter.defaultValue}
              onCheckedChange={(value) => filter.onChange(value)}
              id={filter.id}
            />
            {filter.label && <Label htmlFor={filter.id}>Active only</Label>}
          </div>
        );
      case 'selectMultiple':
        return (
          <SelectMultiple
            key={`filter-select-multiple-${i}`}
            placeholder={filter.placeholder ?? ''}
            items={filter.values}
            selectedItems={filter.defaultValues}
            onChange={(items) => filter.onChange(items)}
          />
        );
      case 'select':
        return (
          <Select
            defaultValue={filter.defaultValue.value}
            key={`filter-select-${i}`}
          >
            <SelectTrigger>
              <SelectValue placeholder={filter.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {filter.values.map((value) => (
                <SelectItem key={value.label} value={value.value}>
                  {value.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
    }
  });
}
