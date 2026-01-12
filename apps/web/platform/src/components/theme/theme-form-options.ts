import { formOptions } from '@tanstack/react-form';
import * as z from 'zod';

const schema = z.object({
  primary: z.string().min(1).max(255),
  secondary: z.string().min(1).max(255),
});

type ThemeFormSchema = z.infer<typeof schema>;

export const themeFormOptions = formOptions({
  defaultValues: {
    primary: '#FFFFFF',
    secondary: '#FFFFFF',
  } as ThemeFormSchema,
  validators: {
    onChange: schema,
    onSubmit: schema,
  },
});
