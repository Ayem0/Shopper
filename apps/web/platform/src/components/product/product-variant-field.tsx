import { withForm } from '@/hooks/use-app-form';
import { Badge, Button } from '@shopify-clone/ui';
import { Trash } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { productFormOptions } from './product-form-options';

export const ProductVariantField = withForm({
  ...productFormOptions,
  props: {
    index: 1,
  },
  render: ({ form, index }) => {
    const [isEditing, setIsEditing] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const nameInputRef = useRef<HTMLInputElement>(null);

    const nameValue = form.state.values.variants[index]?.name;

    const nameMeta = form.state.fieldMeta[`variants[${index}].name`];
    const valuesMeta = form.state.fieldMeta[`variants[${index}].values`];
    const isVariantInvalid =
      (nameMeta?.isTouched && !nameMeta?.isValid) ||
      (valuesMeta?.isTouched && !valuesMeta?.isValid);
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

    return (
      <div
        ref={containerRef}
        tabIndex={0}
        aria-invalid={isVariantInvalid}
        className="rounded-md border relative p-4 transition-colors aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none"
        onKeyDown={(e) => {
          if (!isEditing && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            setIsEditing(true);
          }
          if (isEditing && e.key === 'Escape') {
            e.preventDefault();
            setIsEditing(false);
            containerRef.current?.focus();
          }
        }}
        onBlur={(e) => {
          // Wait for the next frame to check where focus landed.
          // This handles cases where programmatic blur (e.g. from MultipleSelector)
          // temporarily sets focus to body before the click event focuses the container.
          requestAnimationFrame(() => {
            if (
              isEditing &&
              containerRef.current &&
              !containerRef.current.contains(document.activeElement)
            ) {
              setIsEditing(false);
            }
          });
        }}
        onMouseDown={(e) => {
          if (!isEditing) {
            e.preventDefault();
            setIsEditing(true);
          }
        }}
      >
        {!isEditing ? (
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
              onClick={() => {
                form.removeFieldValue('variants', index);
              }}
            >
              <Trash className="size-4" />
            </Button>
            <form.AppField name={`variants[${index}].name`}>
              {(field) => (
                <field.Input
                  label="Variant name"
                  ref={nameInputRef}
                  type="text"
                  placeholder="e.g. Size, Color"
                />
              )}
            </form.AppField>
            <form.AppField name={`variants[${index}].values`} mode="array">
              {(field) => (
                <field.MultiSelect
                  label="Options"
                  placeholder="Add value (e.g. Small, Red)"
                  creatable={true}
                />
              )}
            </form.AppField>
          </div>
        )}
      </div>
    );
  },
});
