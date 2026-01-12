import { Textarea } from '@shopify-clone/ui';
import { BaseField, FieldProps } from './base-field';

interface TextareaFieldProps extends FieldProps<string | undefined> {
  placeholder: string;
  maxLength?: number;
}

export function TextareaField({
  placeholder,
  maxLength,
  ...props
}: TextareaFieldProps) {
  return (
    <BaseField
      {...props}
      children={({ field, isInvalid, isSubmitting }) => (
        <Textarea
          maxLength={maxLength}
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
