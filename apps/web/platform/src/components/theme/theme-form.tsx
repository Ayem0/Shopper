'use client';

import { useAppForm } from '@/hooks/use-app-form';
import { FieldGroup } from '@shopify-clone/ui';
import { themeFormOptions } from './theme-form-options';
import { ThemePreview } from './theme-preview';

export function ThemeForm() {
  const form = useAppForm({
    ...themeFormOptions,
    onSubmit: ({ value }) => {
      console.log(value);
    },
  });

  // const store = useStore(form.store, (state) => state.values);
  // const [throttled] = useThrottledValue(store, {
  //   wait: 1000,
  // });

  return (
    <div className="w-full">
      <form
        className="w-full"
        id="theme-form"
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <div className="grid w-full grid-cols-3 gap-4 md:gap-6">
          <div className="col-span-2">
            <ThemePreview primary={'#FFFFFF'} secondary={'#FFFFFF'} />
          </div>
          <FieldGroup>
            <form.AppField name="primary">
              {(field) => (
                <field.ColorPicker
                  label="Primary color"
                  placeholder="Primary color"
                  field={field}
                />
              )}
            </form.AppField>
            <form.AppField name="secondary">
              {(field) => (
                <field.ColorPicker
                  label="Secondary color"
                  placeholder="Secondary color"
                  field={field}
                />
              )}
            </form.AppField>
            <form.AppForm>
              <form.SubmitButton label="Create" />
            </form.AppForm>
          </FieldGroup>
        </div>
      </form>
    </div>
  );
}
