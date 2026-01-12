import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '@shopify-clone/ui';
import { FieldApi, useStore } from '@tanstack/react-form';
import { memo, ReactNode } from 'react';

export interface FieldProps<T> {
  label?: string;
  description?: string;
  orientation?: 'horizontal' | 'vertical' | 'responsive';
  descriptionBefore?: boolean;
  field: TypedFieldApi<T>;
}

type TypedFieldApi<T> = FieldApi<
  any,
  any,
  T,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any
>;

type BaseFieldChildren<T> = (props: {
  field: TypedFieldApi<T>;
  isInvalid: boolean;
  isSubmitting: boolean;
  // value: T;
  // onChange: (value: T) => void;
}) => ReactNode;

interface BaseFieldProps<T> extends FieldProps<T> {
  children: BaseFieldChildren<T>;
}

function BaseFieldImpl<T>({
  label,
  description,
  descriptionBefore,
  orientation,
  field,
  children,
}: BaseFieldProps<T>) {
  const isSubmitting = useStore(
    field.form.store,
    (state) => state.isSubmitting
  );

  const errors = useStore(field.store, (state) => state.meta.errors);

  const isInvalid = useStore(
    field.store,
    (state) => state.meta.isTouched && !state.meta.isValid
  );

  const descrElem = description ? (
    <FieldDescription>{description}</FieldDescription>
  ) : null;

  const labelElem = label ? (
    <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
  ) : null;

  const errorElem = isInvalid && <FieldError errors={errors} />;

  const childrenElem = children({ field, isInvalid, isSubmitting });

  // const childrenElem = (
  //   <DebounceComponent
  //     value={field.state.value}
  //     onChange={field.handleChange}

  //   />
  // );

  return (
    <Field data-invalid={isInvalid} orientation={orientation}>
      {descriptionBefore ? (
        <>
          <FieldContent>
            {labelElem}
            {descrElem}
          </FieldContent>
          {childrenElem}
          {errorElem}
        </>
      ) : description ? (
        <>
          {labelElem}
          {errorElem}
          {childrenElem}
          {descrElem}
        </>
      ) : (
        <>
          {labelElem}
          {childrenElem}
          {errorElem}
        </>
      )}
    </Field>
  );
}

export const BaseField = memo(BaseFieldImpl) as typeof BaseFieldImpl;
