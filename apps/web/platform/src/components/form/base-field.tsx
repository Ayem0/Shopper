import { useFieldContext } from '@/hooks/use-app-form';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '@shopify-clone/ui';
import { useStore } from '@tanstack/react-form';
import { ReactNode } from 'react';

export interface FieldProps {
  label: string;
  description?: string;
  orientation?: 'horizontal' | 'vertical' | 'responsive';
  descriptionBefore?: boolean;
}

type BaseFieldChildren = (props: {
  field: ReturnType<typeof useFieldContext>;
  isInvalid: boolean;
  isSubmitting: boolean;
}) => ReactNode;

interface BaseFieldProps extends FieldProps {
  children: BaseFieldChildren;
}

export function BaseField({
  label,
  description,
  descriptionBefore,
  orientation,
  children,
}: BaseFieldProps) {
  const field = useFieldContext();
  const store = useStore(field.form.store);
  const errors = field.state.meta.errors;
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
  const isSubmitting = store.isSubmitting;

  const descrElem = description ? (
    <FieldDescription>{description}</FieldDescription>
  ) : null;

  const errorElem = isInvalid && <FieldError errors={errors} />;

  return (
    <Field data-invalid={isInvalid} orientation={orientation}>
      {descriptionBefore ? (
        <>
          <FieldContent>
            <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
            {descrElem}
          </FieldContent>
          {children({ field, isInvalid, isSubmitting })}
          {errorElem}
        </>
      ) : description ? (
        <>
          <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
          {errorElem}
          {children({ field, isInvalid, isSubmitting })}
          {descrElem}
        </>
      ) : (
        <>
          <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
          {children({ field, isInvalid, isSubmitting })}
          {errorElem}
        </>
      )}
    </Field>
  );
}
