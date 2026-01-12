import { MultipleSelector } from '@shopify-clone/ui';
import { Command } from 'cmdk';
import { BaseField, FieldProps } from './base-field';

interface AsyncMultiSelectFieldProps
  extends FieldProps<{ label: string; value: string }[]> {
  placeholder: string;
  options?: { label: string; value: string }[];
  inputProps?: Omit<
    React.ComponentPropsWithoutRef<typeof Command.Input>,
    'value' | 'placeholder' | 'disabled'
  >;
  isFetching: boolean;
  isFetchingNextPage: boolean;
  onSearchChange: (value: string) => void;
  hasNextPage: boolean;
  fetchNextPage: () => Promise<unknown>;
}

export function AsyncMultiSelectField({
  placeholder,
  inputProps,
  options,
  ...props
}: AsyncMultiSelectFieldProps) {
  return (
    <BaseField
      {...props}
      children={({ field, isInvalid, isSubmitting }) => {
        return (
          <MultipleSelector
            inputProps={inputProps}
            creatable={false}
            disabled={isSubmitting}
            onChange={(e) => field.handleChange(e)}
            aria-invalid={isInvalid}
            id={field.name}
            options={options}
            value={field.state.value}
            placeholder={placeholder}
            onSearch={(e) => props.onSearchChange(e)}
            isFetching={props.isFetching}
            isFetchingNextPage={props.isFetchingNextPage}
            fetchNextPage={props.fetchNextPage}
            hasNextPage={props.hasNextPage}
            showEmpty={true}
          />
        );
      }}
    />
  );
}
