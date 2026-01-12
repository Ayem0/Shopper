import { MultipleSelector } from '@shopify-clone/ui';
import { Command } from 'cmdk';
import { BaseField, FieldProps } from './base-field';

interface CreatableMultiSelectFieldProps extends FieldProps<string[]> {
  placeholder: string;
  inputProps?: Omit<
    React.ComponentPropsWithoutRef<typeof Command.Input>,
    'value' | 'placeholder' | 'disabled'
  >;
}

export function CreatableMultiSelectField({
  placeholder,
  inputProps,
  ...props
}: CreatableMultiSelectFieldProps) {
  return (
    <BaseField
      {...props}
      children={({ field, isInvalid, isSubmitting }) => {
        return (
          <MultipleSelector
            inputProps={inputProps}
            creatable={true}
            disabled={isSubmitting}
            onChange={(e) => field.handleChange(e.map((v) => v.value))}
            aria-invalid={isInvalid}
            id={field.name}
            value={field.state.value.map((v) => ({
              label: v,
              value: v,
            }))}
            placeholder={placeholder}
          />
        );
      }}
    />
  );
}
