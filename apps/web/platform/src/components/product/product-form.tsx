'use client';

import { SelectValue } from '@radix-ui/react-select';
import {
  Badge,
  Button,
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  Input,
  MultipleSelector,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  Textarea,
} from '@shopify-clone/ui';
import { useForm, useStore } from '@tanstack/react-form';
import { Plus, Trash } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import * as z from 'zod';

const variantSchema = z.object({
  name: z.string().min(1).max(255),
  values: z.array(z.string().min(1).max(255)).min(1),
});

const schema = z.object({
  name: z.string().min(1).max(255),
  descr: z.string().max(2048).optional(),
  categories: z.array(z.guid()).min(1),
  variants: z.array(variantSchema),
  template: z.guid(),
  status: z.literal(['active', 'inactive', 'draft']),
});

type ProductFormSchema = z.infer<typeof schema>;

export function ProductForm() {
  const defaultValues = {
    name: '',
    categories: [],
    variants: [],
    status: undefined,
    template: '',
    descr: '',
  } as unknown as ProductFormSchema;
  const form = useForm({
    defaultValues: defaultValues,
    validators: {
      onChange: schema,
      onSubmit: schema,
    },
  });

  const VariantItem = ({
    index,
    onRemove,
  }: {
    index: number;
    onRemove: () => void;
  }) => {
    const [isEditing, setIsEditing] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const nameInputRef = useRef<HTMLInputElement>(null);

    const nameValue = useStore(
      form.store,
      (state) => state.values.variants[index]?.name
    );

    const isVariantInvalid = useStore(form.store, (state) => {
      const nameMeta = state.fieldMeta[`variants[${index}].name`];
      const valuesMeta = state.fieldMeta[`variants[${index}].values`];
      return (
        (nameMeta?.isTouched && !nameMeta?.isValid) ||
        (valuesMeta?.isTouched && !valuesMeta?.isValid)
      );
    });

    useEffect(() => {
      if (!nameValue) {
        setIsEditing(true);
      }
    }, []);

    useEffect(() => {
      if (isEditing && nameInputRef.current) {
        nameInputRef.current.focus();
      }
    }, [isEditing]);

    // Handle clicking outside to exit edit mode
    useEffect(() => {
      function handleClickOutside(event: MouseEvent) {
        if (
          containerRef.current &&
          !containerRef.current.contains(event.target as Node)
        ) {
          setIsEditing(false);
        }
      }
      if (isEditing) {
        document.addEventListener('mousedown', handleClickOutside);
      }
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [isEditing]);

    return (
      <div
        ref={containerRef}
        aria-invalid={isVariantInvalid}
        className="rounded-md border relative p-4 transition-colors aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
        onClick={() => !isEditing && setIsEditing(true)}
      >
        {!isEditing ? (
          // View Mode
          // <form.Field name={`variants[${index}].name`}>
          //   {(field) => {
          //     return (

          //     );
          //   }}
          // </form.Field>
          <form.Field name={`variants[${index}]`}>
            {(field) => {
              return (
                <div className="flex flex-col gap-2 cursor-pointer">
                  <div className="font-medium flex justify-between items-center">
                    <span>
                      {field.state.value.name || (
                        <span className="text-muted-foreground italic">
                          Unnamed Variant
                        </span>
                      )}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {!field.state.value.values ||
                    field.state.value.values.length === 0 ? (
                      <span className="text-sm text-muted-foreground">
                        No options
                      </span>
                    ) : (
                      field.state.value.values?.map((val: string) => (
                        <Badge key={val} variant="secondary">
                          {val}
                        </Badge>
                      ))
                    )}
                  </div>
                </div>
              );
            }}
          </form.Field>
        ) : (
          // Edit Mode
          <div className="flex flex-col gap-4">
            <Button
              type="button"
              variant="outline"
              className="hover:text-destructive hover:border-destructive absolute top-2 right-2 size-7"
              onClick={onRemove}
            >
              <Trash className="size-4" />
            </Button>
            <form.Field name={`variants[${index}].name`}>
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={`variant-${index}-name`}>
                      Variant Name
                    </FieldLabel>
                    <Input
                      ref={nameInputRef}
                      id={`variant-${index}-name`}
                      aria-invalid={isInvalid}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="e.g. Size, Color"
                      autoComplete="off"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>
            <form.Field name={`variants[${index}].values`} mode="array">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Options</FieldLabel>
                    <MultipleSelector
                      aria-invalid={isInvalid}
                      value={field.state.value.map((v) => ({
                        label: v,
                        value: v,
                      }))}
                      onChange={(e) =>
                        field.handleChange(e.map((v) => v.value))
                      }
                      creatable={true}
                      id={field.name}
                      placeholder="Add value (e.g. Small, Red)"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full">
      <form
        className="w-full"
        id="product-form"
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <div className="grid w-full grid-cols-3 gap-4 md:gap-6">
          <div className="col-span-2">
            <FieldGroup>
              <form.Field name="name">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                      <Input
                        max={255}
                        type="text"
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        placeholder="Name"
                        autoComplete="off"
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              </form.Field>
              <form.Field name="descr">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Description</FieldLabel>
                      <Textarea
                        maxLength={2048}
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        placeholder="Description"
                        autoComplete="off"
                      />
                      <FieldDescription>Max 2048 characters.</FieldDescription>
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              </form.Field>
              <form.Field name="categories">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Categories</FieldLabel>
                      <MultipleSelector
                        onChange={(e) =>
                          field.handleChange(e.map((v) => v.value))
                        }
                        aria-invalid={isInvalid}
                        id={field.name}
                        defaultOptions={[
                          { label: 'Shirt', value: 'someid' },
                          { label: 'Pants', value: 'someid2' },
                          { label: 'Jacket', value: 'someid3' },
                        ]}
                        placeholder="Categories"
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              </form.Field>
              <form.Field name="variants" mode="array">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Variants</FieldLabel>
                      {field.state.value.map((_, i) => (
                        <VariantItem
                          key={i}
                          index={i}
                          onRemove={() => field.removeValue(i)}
                        />
                      ))}
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                          field.pushValue({ name: '', values: [] })
                        }
                      >
                        <Plus />
                        Add variant
                      </Button>
                    </Field>
                  );
                }}
              </form.Field>
            </FieldGroup>
          </div>
          <div className="col-span-1">
            <FieldGroup>
              <form.Field name="status">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field orientation="vertical" data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Status</FieldLabel>
                      <Select
                        name={field.name}
                        value={field.state.value}
                        onValueChange={(e: 'active' | 'draft' | 'inactive') =>
                          field.handleChange(e)
                        }
                      >
                        <SelectTrigger aria-invalid={isInvalid} id={field.name}>
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              </form.Field>
              <form.Field name="template">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field orientation="vertical" data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Template</FieldLabel>
                      <Select
                        name={field.name}
                        value={field.state.value}
                        onValueChange={field.handleChange}
                      >
                        <SelectTrigger aria-invalid={isInvalid} id={field.name}>
                          <SelectValue placeholder="Template" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5549c55e-a7f7-4c30-935a-22eeeef2264f">
                            Template shirt
                          </SelectItem>
                          <SelectItem value="active">Template shoes</SelectItem>
                          <SelectItem value="inactive">
                            Template pants
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              </form.Field>
            </FieldGroup>
          </div>
        </div>
      </form>
    </div>
  );
}
