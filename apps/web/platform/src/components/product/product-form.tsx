'use client';

import { SelectValue } from '@radix-ui/react-select';
import {
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
import { useForm } from '@tanstack/react-form';
import { Plus, Trash } from 'lucide-react';
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
              <Field>
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
              </Field>
              <Field>
                <form.Field name="descr">
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>
                          Description
                        </FieldLabel>
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
                        <FieldDescription>
                          Max 2048 characters.
                        </FieldDescription>
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                </form.Field>
              </Field>
              <Field>
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
                            { label: 'Idk', value: 'someid4' },
                            { label: 'something', value: 'someid5' },
                            { label: 'vufd', value: 'someid6' },
                            { label: 'fbgsiogq', value: 'someid7' },
                            { label: 'fbdis', value: 'someid8' },
                            { label: 'fbdisfdsnj', value: 'someid9' },
                            { label: 'fnbgisgf', value: 'someid10' },
                            { label: 'fdfds', value: 'someid11' },
                            { label: 'fdsfdsfdsfds', value: 'someid12' },
                            { label: 'fdsfdsfdfds', value: 'someid13' },
                            {
                              label: 'fdfdsfdsfdfdsgfgfgfd',
                              value: 'someid14',
                            },
                            { label: 'gfhgfhg', value: 'someid15' },
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
              </Field>
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
          <div className="col-span-2">
            <FieldGroup>
              <form.Field name="variants" mode="array">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Variants</FieldLabel>
                      {field.state.value.map((variant, i) => (
                        <form.Field key={i} name={`variants[${i}].name`}>
                          {(subField) => {
                            const isInvalid =
                              subField.state.meta.isTouched &&
                              !subField.state.meta.isValid;
                            return (
                              <Field
                                data-invalid={isInvalid}
                                className="rounded-md border p-2"
                              >
                                <FieldLabel htmlFor={subField.name}>
                                  Name
                                </FieldLabel>
                                <div className="flex gap-2">
                                  <Input
                                    name={subField.name}
                                    value={subField.state.value}
                                    onChange={(e) =>
                                      subField.handleChange(e.target.value)
                                    }
                                  />
                                  <Button
                                    type="button"
                                    variant="outline"
                                    className="hover:text-red-500"
                                    onClick={() => field.removeValue(i)}
                                  >
                                    <Trash />
                                  </Button>
                                </div>

                                {isInvalid && (
                                  <FieldError
                                    errors={subField.state.meta.errors}
                                  />
                                )}
                              </Field>
                            );
                          }}
                        </form.Field>
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
        </div>
      </form>
    </div>
  );
}
