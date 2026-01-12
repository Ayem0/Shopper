import { AsyncMultiSelectField } from '@/components/form/async-multiselect-field';
import { ComboboxField } from '@/components/form/combobox-field';
import { InputField } from '@/components/form/input-field';
import { SelectField } from '@/components/form/select-field';
import { SubmitButton } from '@/components/form/submit-button';
import { TextareaField } from '@/components/form/textarea-field';
import { createFormHook } from '@tanstack/react-form';

import { ColorPickerField } from '@/components/form/color-picker-field';
import { CreatableMultiSelectField } from '@/components/form/creatable-multiselect-field';
import { createFormHookContexts } from '@tanstack/react-form';

export const { fieldContext, useFieldContext, formContext, useFormContext } =
  createFormHookContexts();

export const { useAppForm, withForm, withFieldGroup } = createFormHook({
  fieldComponents: {
    Input: InputField,
    Textarea: TextareaField,
    Select: SelectField,
    CreatableMultiSelect: CreatableMultiSelectField,
    AsyncMultiSelect: AsyncMultiSelectField,
    Combobox: ComboboxField,
    ColorPicker: ColorPickerField,
  },
  formComponents: {
    SubmitButton,
  },
  fieldContext,
  formContext,
});
