import { ActiveStatus } from '@shopify-clone/proto-ts';
import { formOptions } from '@tanstack/react-form';
import * as z from 'zod';

const schema = z.object({
  name: z.string().min(1).max(255),
  parentCategoryId: z.guid().optional(),
  status: z.enum(ActiveStatus, 'Status is required').exclude(['UNRECOGNIZED']),
});

type ProductCategoryFormSchema = z.infer<typeof schema>;

export const productCategoryFormOptions = formOptions({
  defaultValues: {
    name: '',
    parentCategoryId: undefined,
    status: undefined,
  } as unknown as ProductCategoryFormSchema,
  validators: {
    onChange: schema,
    onSubmit: schema,
  },
});
