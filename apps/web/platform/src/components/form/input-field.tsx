import { Input } from '@shopify-clone/ui';
import { RefObject } from 'react';
import { BaseField, FieldProps } from './base-field';

interface InputFieldProps extends FieldProps<string> {
  type: string;
  placeholder: string;
  max?: number;
  ref?: RefObject<HTMLInputElement | null>;
}

export function InputField({
  type,
  placeholder,
  max,
  ref,
  field,
  ...props
}: InputFieldProps) {
  return (
    <BaseField
      field={field}
      {...props}
      children={({ field, isInvalid, isSubmitting }) => (
        <Input
          ref={ref}
          max={max}
          type={type}
          id={field.name}
          name={field.name}
          value={field.state.value}
          onBlur={field.handleBlur}
          onChange={(e) => field.handleChange(e.target.value)}
          aria-invalid={isInvalid}
          placeholder={placeholder}
          autoComplete="off"
          disabled={isSubmitting}
        />
      )}
    />
  );
}
