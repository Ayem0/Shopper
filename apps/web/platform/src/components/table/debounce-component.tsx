'use client';

import { useDebouncedCallback } from '@tanstack/react-pacer';
import { useEffect, useState } from 'react';

type DebounceComponentProps<T> = {
  value: T;
  onChange: (value: T) => void;
  delay?: number;
  children: (props: { value: T; onChange: (v: T) => void }) => React.ReactNode;
};

export function DebounceComponent<T>({
  value,
  onChange,
  delay = 500,
  children,
}: DebounceComponentProps<T>) {
  const [localValue, setLocalValue] = useState(value);

  const debouncedCallback = useDebouncedCallback(
    (value: T) => onChange(value),
    {
      wait: delay,
    }
  );

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  return children({
    value: localValue,
    onChange: debouncedCallback,
  });
}
