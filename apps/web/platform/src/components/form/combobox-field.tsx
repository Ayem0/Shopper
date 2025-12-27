import {
  Button,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Spinner,
} from '@shopify-clone/ui';
import { UIEvent, useState } from 'react';
import { BaseField, FieldProps } from './base-field';

interface ComboboxFieldProps extends FieldProps {
  placeholder: string;
  options?: { label: string; value: string }[];
  isFetching: boolean;
  isFetchingNextPage: boolean;
  defaultValue?: { label: string; value: string };
  fetchNextPage: () => Promise<unknown>;
  hasNextPage: boolean;
  onSearchChange: (value: string) => void;
}

export function ComboboxField({
  placeholder,
  options,
  onSearchChange,
  defaultValue,
  isFetching,
  isFetchingNextPage,
  fetchNextPage,
  hasNextPage,
  ...props
}: ComboboxFieldProps) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<
    | {
        label: string;
        value: string;
      }
    | undefined
  >(defaultValue);

  const handleScroll = async (e: UIEvent<HTMLDivElement>) => {
    if (isFetching || isFetchingNextPage || !hasNextPage) return;
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop === clientHeight) {
      await fetchNextPage();
    }
  };

  return (
    <BaseField
      {...props}
      children={({ field, isInvalid, isSubmitting }) => (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-[150px] justify-start font-normal data-placeholder:text-muted-foreground"
              aria-invalid={isInvalid}
              disabled={isSubmitting}
              data-placeholder={selected === undefined ? '' : undefined}
            >
              {selected ? selected.label : placeholder}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0" side="right" align="start">
            <Command aria-invalid={isInvalid}>
              <CommandInput
                placeholder="Search..."
                onValueChange={(e) => onSearchChange(e)}
                aria-invalid={isInvalid}
                disabled={isSubmitting}
              />
              <CommandList
                aria-invalid={isInvalid}
                onScroll={handleScroll}
                className={
                  isFetching && !isFetchingNextPage
                    ? 'overflow-hidden'
                    : undefined
                }
              >
                {isFetching && !isFetchingNextPage ? (
                  <CommandEmpty className="w-full text-center">
                    <Spinner className="mx-auto block" />
                  </CommandEmpty>
                ) : options?.length || 0 > 0 ? (
                  <CommandGroup>
                    {options?.map((option) => (
                      <CommandItem
                        disabled={isSubmitting}
                        key={option.value}
                        value={option.value}
                        onSelect={(value) => {
                          field.handleChange(value);
                          setSelected(option);
                          setOpen(false);
                        }}
                      >
                        {option.label}
                      </CommandItem>
                    ))}
                    {isFetchingNextPage && (
                      <CommandItem
                        className="flex items-center justify-center"
                        disabled={true}
                      >
                        <Spinner />
                      </CommandItem>
                    )}
                  </CommandGroup>
                ) : (
                  <CommandEmpty>No results found.</CommandEmpty>
                )}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      )}
    />
  );
}
