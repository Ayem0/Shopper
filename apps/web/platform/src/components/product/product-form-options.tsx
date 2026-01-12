import { ActiveStatus } from '@shopify-clone/proto-ts';
import { formOptions } from '@tanstack/react-form';
import * as z from 'zod';

const variantSchema = z.object({
  name: z.string().min(1).max(255),
  values: z.array(z.string().min(1).max(255)).min(1),
});

const categorySchema = z.object({
  label: z.string().min(1).max(255),
  value: z.guid(),
});

const schema = z.object({
  name: z.string().min(1).max(255),
  descr: z.string().max(2048).optional(),
  categories: z.array(categorySchema).min(1),
  variants: z.array(variantSchema),
  // template: z.guid(),
  status: z.enum(ActiveStatus, 'Status is required').exclude(['UNRECOGNIZED']),
});

type ProductFormSchema = z.infer<typeof schema>;

export const productFormOptions = formOptions({
  defaultValues: {
    name: '',
    categories: [],
    variants: [],
    status: undefined,
    template: '',
    descr: '',
  } as unknown as ProductFormSchema,
  validators: {
    onChange: schema,
    onSubmit: schema,
  },
});
