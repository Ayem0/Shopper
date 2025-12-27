import { MultipleSelector } from '@shopify-clone/ui';
import { Command } from 'cmdk';
import { BaseField, FieldProps } from './base-field';

interface MultiSelectFieldProps extends FieldProps {
  placeholder: string;
  options?: { label: string; value: string }[];
  creatable?: boolean;
  inputProps?: Omit<
    React.ComponentPropsWithoutRef<typeof Command.Input>,
    'value' | 'placeholder' | 'disabled'
  >;
}

export function MultiSelectField({
  placeholder,
  options,
  creatable,
  inputProps,
  ...props
}: MultiSelectFieldProps) {
  return (
    <BaseField
      {...props}
      children={({ field, isInvalid, isSubmitting }) => (
        <MultipleSelector
          inputProps={inputProps}
          creatable={creatable}
          disabled={isSubmitting}
          onChange={(e) => field.handleChange(e.map((v) => v.value))}
          aria-invalid={isInvalid}
          id={field.name}
          options={options}
          value={(field.state.value as string[]).map((v) => ({
            label: v,
            value: v,
          }))}
          placeholder={placeholder}
        />
      )}
    />
  );
}
