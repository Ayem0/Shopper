import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@shopify-clone/ui';
import { BaseField, FieldProps } from './base-field';

interface SelectFieldProps extends FieldProps {
  placeholder: string;
  options: { label: string; value: string }[];
  mapValue: (value: string) => unknown;
}

export function SelectField({
  placeholder,
  options,
  mapValue,
  ...props
}: SelectFieldProps) {
  return (
    <BaseField
      {...props}
      children={({ field, isInvalid, isSubmitting }) => (
        <Select
          disabled={isSubmitting}
          name={field.name}
          value={field.state.value?.toString()}
          onValueChange={(e) => field.handleChange(mapValue(e))}
        >
          <SelectTrigger aria-invalid={isInvalid} id={field.name}>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options.map((o) => (
              <SelectItem key={o.label} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    />
  );
}
