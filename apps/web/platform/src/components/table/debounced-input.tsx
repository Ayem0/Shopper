"use client";

import { useDebounceCallback } from '@/hooks/use-debounce-callback';
import { Input } from '@shopify-clone/ui';
import { useState } from 'react';

interface DebouncedInputProps
  extends Omit<React.ComponentProps<typeof Input>, 'onChange'> {
  value: string | number;
  onChange: (value: string | number) => void;
  debounce?: number;
}

export function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: DebouncedInputProps) {
  const [value, setValue] = useState(initialValue);

  useDebounceCallback(value, onChange, debounce);

  return (
    <Input
      {...props}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}
