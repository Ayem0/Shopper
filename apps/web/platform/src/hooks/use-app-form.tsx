import { ComboboxField } from '@/components/form/combobox-field';
import { InputField } from '@/components/form/input-field';
import { MultiSelectField } from '@/components/form/multiselect-field';
import { SelectField } from '@/components/form/select-field';
import { SubmitButton } from '@/components/form/submit-button';
import { TextareaField } from '@/components/form/textarea-field';
import { createFormHook } from '@tanstack/react-form';

import { createFormHookContexts } from '@tanstack/react-form';

export const { fieldContext, useFieldContext, formContext, useFormContext } =
  createFormHookContexts();

export const { useAppForm, withForm, withFieldGroup } = createFormHook({
  fieldComponents: {
    Input: InputField,
    Textarea: TextareaField,
    Select: SelectField,
    MultiSelect: MultiSelectField,
    Combobox: ComboboxField,
  },
  formComponents: {
    SubmitButton,
  },
  fieldContext,
  formContext,
});
