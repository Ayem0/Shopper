'use client';

import { ShopType } from '@shopify-clone/proto-ts';
import {
  Button,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@shopify-clone/ui';
import { ListFilter } from 'lucide-react';
import React, { useCallback, useState } from 'react';

const shopTypes = [
  { label: 'Fashion', value: ShopType.SHOP_TYPE_FASHION },
  { label: 'Other', value: ShopType.SHOP_TYPE_UNSPECIFIED },
] as const;

export default function TestDropdownSelect() {
  // React state — external UI uses this
  const [types, setTypes] = useState<ShopType[]>([]);

  // Memoized toggle function so child components don't re-render
  const toggleType = useCallback((value: ShopType, checked: boolean) => {
    setTypes((prev) =>
      checked ? [...prev, value] : prev.filter((t) => t !== value)
    );
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <ListFilter />
          Filter
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Test</DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              {shopTypes.map((st) => (
                <CheckboxItem
                  key={st.value}
                  label={st.label}
                  value={st.value}
                  checked={types.includes(st.value)}
                  onChange={toggleType}
                />
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ✔ Each checkbox is memoized
// ✔ Only re-renders when *its own props* change
const CheckboxItem = React.memo(function CheckboxItem({
  label,
  value,
  checked,
  onChange,
}: {
  label: string;
  value: ShopType;
  checked: boolean;
  onChange: (value: ShopType, checked: boolean) => void;
}) {
  return (
    <DropdownMenuCheckboxItem
      onSelect={(e) => e.preventDefault()}
      checked={checked}
      onCheckedChange={(next) => onChange(value, next)}
    >
      {label}
    </DropdownMenuCheckboxItem>
  );
});
