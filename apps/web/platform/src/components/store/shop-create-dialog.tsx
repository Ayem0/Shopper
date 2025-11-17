'use client';

import { createShop } from '@/lib/queries/create-shop-query';
import { CreateShopRequest, ShopType } from '@shopify-clone/proto-ts';
import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectMultipleItem,
  SelectTrigger,
  SelectValue,
  Spinner,
} from '@shopify-clone/ui';
import { useForm } from '@tanstack/react-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import * as z from 'zod';

const shopTypes: SelectMultipleItem<ShopType>[] = [
  { label: 'Fashion', value: ShopType.SHOP_TYPE_FASHION },
  { label: 'Other', value: ShopType.SHOP_TYPE_UNSPECIFIED },
];

const schema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  type: z.enum(ShopType, 'Type is required').exclude(['UNRECOGNIZED']),
});
export function ShopCreateDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();
  const createShopMutation = useMutation({
    mutationFn: async (req: CreateShopRequest) => await createShop(req),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['shops'] }),
    onSuccess: (data, variables) => {
      toast.success(`Shop '${variables.name}' created successfully`);
      setIsOpen(false);
    },
  });
  const form = useForm({
    defaultValues: {
      name: '',
      type: undefined,
    } as unknown as z.infer<typeof schema>, // hack to not have a default value for the select
    validators: {
      onSubmit: schema,
    },
    onSubmit: async ({ value }) => await createShopMutation.mutateAsync(value),
  });
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <form
        id="create-shop-form"
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <DialogTrigger asChild>
          <Button>
            <Plus />
            Create
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create shop</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <FieldGroup>
              <form.Field name="name">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                      <Input
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
              <form.Field name="type">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Type</FieldLabel>
                      <Select
                        name={field.name}
                        value={field.state.value?.toString()}
                        // onBlur={field.handleBlur}
                        onValueChange={(e) => field.handleChange(Number(e))}
                        aria-invalid={isInvalid}
                        autoComplete="off"
                      >
                        <SelectTrigger
                          id="create-shop-type"
                          aria-invalid={isInvalid}
                        >
                          <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent>
                          {shopTypes.map((type) => (
                            <SelectItem
                              key={type.value}
                              value={type.value.toString()}
                            >
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              </form.Field>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button
                  type="submit"
                  form="create-shop-form"
                  disabled={createShopMutation.isPending}
                >
                  {createShopMutation.isPending ? <Spinner /> : 'Create'}
                </Button>
              </DialogFooter>
            </FieldGroup>
          </div>
        </DialogContent>
      </form>
    </Dialog>
  );
}
