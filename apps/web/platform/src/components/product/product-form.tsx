'use client';

import { useAppForm } from '@/hooks/use-app-form';
import {
  Button,
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@shopify-clone/ui';

import { activeStatusOptionsStr } from '@/lib/types/active-status';
import { Plus } from 'lucide-react';
import { productFormOptions } from './product-form-options';
import { ProductVariantField } from './product-variant-field';

export function ProductForm() {
  const form = useAppForm(productFormOptions);

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
              <form.AppField name="name">
                {(field) => (
                  <field.Input label="Name" placeholder="Name" type="text" />
                )}
              </form.AppField>
              <form.AppField name="descr">
                {(field) => (
                  <field.Textarea
                    label="Description"
                    placeholder="Description"
                    description="Max 2048 characters"
                  />
                )}
              </form.AppField>
              <form.AppField name="categories">
                {(field) => (
                  <field.MultiSelect
                    inputProps={{}}
                    label="Categories"
                    placeholder="Categories"
                    options={[
                      { label: 'Shirt', value: 'someid' },
                      { label: 'Pants', value: 'someid2' },
                      { label: 'Jacket', value: 'someid3' },
                    ]}
                  />
                )}
              </form.AppField>
              <form.Field name="variants" mode="array">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Variants</FieldLabel>
                      {field.state.value.map((_, i) => (
                        <ProductVariantField key={i} form={form} index={i} />
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
              <form.AppField name="status">
                {(field) => (
                  <field.Select
                    label="Status"
                    placeholder="Status"
                    mapValue={(value) => Number(value)}
                    options={activeStatusOptionsStr}
                  />
                )}
              </form.AppField>
              <form.AppField name="template">
                {(field) => (
                  <field.Select
                    label="Template"
                    placeholder="Template"
                    mapValue={(value) => value}
                    options={[
                      {
                        label: 'Template shirt',
                        value: '5549c55e-a7f7-4c30-935a-22eeeef2264e',
                      },
                      {
                        label: 'Template pants',
                        value: '5549c55e-a7f7-4c30-935a-22eeeef2264f',
                      },
                      {
                        label: 'Template jacket',
                        value: '5549c55e-a7f7-4c30-935a-22eeeef2264g',
                      },
                    ]}
                  />
                )}
              </form.AppField>
              <form.AppForm>
                <form.SubmitButton label="Create" />
              </form.AppForm>
            </FieldGroup>
          </div>
        </div>
      </form>
    </div>
  );
}
