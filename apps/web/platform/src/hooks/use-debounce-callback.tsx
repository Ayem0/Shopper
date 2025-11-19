import { useEffect, useRef } from 'react';

export function useDebounceCallback<T>(value: T, onChange: (value: T) => void, delay = 400) {
  const callbackRef = useRef(onChange);

  useEffect(() => {
    callbackRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    const handler = setTimeout(() => callbackRef.current(value), delay);
    return () => clearTimeout(handler);
  }, [delay, value]);
}
