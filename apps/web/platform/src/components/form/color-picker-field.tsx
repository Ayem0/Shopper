import { Input } from '@shopify-clone/ui';
import { useDebouncedState } from '@tanstack/react-pacer';
import { BaseField, FieldProps } from './base-field';

interface ColorPickerFieldProps extends FieldProps<string> {
  placeholder: string;
}

export function ColorPickerField({
  placeholder,
  field,
  ...props
}: ColorPickerFieldProps) {
  const [localValue, setLocalValue] = useDebouncedState(field.state.value, {
    wait: 200,
  });
  return (
    <BaseField
      field={field}
      {...props}
      children={({ isInvalid, isSubmitting }) => (
        <Input
          type="color"
          id={field.name}
          name={field.name}
          value={localValue}
          onBlur={() => {
            field.handleChange(localValue);
            field.handleBlur;
          }}
          onChange={(e) => setLocalValue(e.target.value)}
          aria-invalid={isInvalid}
          placeholder={placeholder}
          autoComplete="off"
          disabled={isSubmitting}
        />
      )}
    />
  );
}
