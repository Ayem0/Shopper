export type ArrayKeys<T> = {
  [K in keyof T]: T[K] extends readonly unknown[] ? K : never;
}[keyof T] &
  string;

export type BooleanKeys<T> = {
  [K in keyof T]: T[K] extends boolean ? K : never;
}[keyof T] &
  string;

export type StringKeys<T> = {
  [K in keyof T]: T[K] extends string ? K : never;
}[keyof T] &
  string;

export type ArrayItem<T> = T extends readonly (infer U)[] ? U : never;

type CheckboxFilterDef<T, K extends ArrayKeys<T>> = {
  type: 'checkbox';
  key: K;
  label: string;
  options: readonly {
    label: string;
    value: ArrayItem<T[K]>;
  }[];
};

type SwitchFilterDef<T, K extends BooleanKeys<T>> = {
  type: 'switch';
  key: K;
  label: string;
};

type RadioFilterDef<T, K extends StringKeys<T>> = {
  type: 'radio';
  key: K;
  label: string;
  options: readonly {
    label: string;
    value: T[K];
  }[];
};

export type TableFilterDef<T> =
  | CheckboxFilterDef<T, ArrayKeys<T>>
  | SwitchFilterDef<T, BooleanKeys<T>>
  | RadioFilterDef<T, StringKeys<T>>;

export type BoundCheckboxFilter<T, K extends ArrayKeys<T>> = CheckboxFilterDef<
  T,
  K
> & {
  value: T[K];
  setValue: (value: T[K]) => void;
};

export type BoundSwitchFilter<T, K extends BooleanKeys<T>> = SwitchFilterDef<
  T,
  K
> & {
  value: T[K];
  setValue: (value: T[K]) => void;
};

export type BoundRadioFilter<T, K extends StringKeys<T>> = RadioFilterDef<
  T,
  K
> & {
  value: T[K];
  setValue: (value: T[K]) => void;
};

export type BoundTableFilter<T> =
  | BoundCheckboxFilter<T, ArrayKeys<T>>
  | BoundSwitchFilter<T, BooleanKeys<T>>
  | BoundRadioFilter<T, StringKeys<T>>;

export function bindFilters<T, U>(
  defs: readonly TableFilterDef<T>[],
  state: T,
  setState: (updater: (prev: U) => U) => void
): readonly BoundTableFilter<T>[] {
  return defs.map((def) => {
    switch (def.type) {
      case 'checkbox':
        return {
          ...def,
          ...bindFilter(def, state, setState),
        };
      case 'switch':
        return {
          ...def,
          ...bindFilter(def, state, setState),
        };
      case 'radio':
        return {
          ...def,
          ...bindFilter(def, state, setState),
        };
    }
  });
}

function bindFilter<T, U, K extends keyof T>(
  def: TableFilterDef<T> & { key: K },
  state: T,
  setState: (updater: (prev: U) => U) => void
): { value: T[K]; setValue: (value: T[K]) => void } {
  return {
    value: state[def.key],
    setValue: (value) => setState((prev) => ({ ...prev, [def.key]: value })),
  };
}
