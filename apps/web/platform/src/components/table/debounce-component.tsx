'use client';

import { useDebounceCallback } from '@/hooks/use-debounce-callback';
import { useEffect, useState } from 'react';

type DebounceComponentProps<T, P = {}> = {
  value: T;
  onChange: (value: T) => void;
  delay?: number;
  extraProps: P;
  children: (
    props: { value: T; onChange: (v: T) => void } & P
  ) => React.ReactNode;
};

export function DebounceComponent<T, P = {}>({
  value,
  onChange,
  delay = 500,
  children,
  extraProps,
}: DebounceComponentProps<T, P>) {
  const [localValue, setLocalValue] = useState(value);

  useDebounceCallback(localValue, onChange, delay);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  return children({
    value: localValue,
    onChange: setLocalValue,
    ...extraProps,
  });
}
