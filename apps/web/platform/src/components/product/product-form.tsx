'use client';

import { useAppForm } from '@/hooks/use-app-form';
import {
  Button,
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@shopify-clone/ui';

import { getProductCategories } from '@/lib/queries/product-category/get-product-categories';
import { createProductQuery } from '@/lib/queries/product/create-product-query';
import { activeStatusOptionsStr } from '@/lib/types/active-status';
import {
  CreateProductRequest,
  ProductCategorySortBy,
} from '@shopify-clone/proto-ts';
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { productFormOptions } from './product-form-options';
import { ProductVariantField } from './product-variant-field';

export function ProductForm() {
  const [searchCategory, setSearchCategory] = useState('');
  const queryClient = useQueryClient();
  const router = useRouter();
  const { shopId } = useParams<{ shopId: string }>();
  const form = useAppForm({
    ...productFormOptions,
    onSubmit: ({ value }) => {
      createProductMutation.mutate({
        categoryIds: value.categories.map((category) => category.value),
        name: value.name,
        descr: value.descr,
        status: value.status,
        shopId: shopId,
        variantOptions: value.variants,
      });
    },
  });
  const createProductMutation = useMutation({
    mutationFn: async (req: CreateProductRequest) =>
      await createProductQuery(req),
    onSettled: async () =>
      await queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey[0] === 'products' && query.queryKey[1] === shopId,
      }),
    onSuccess: (data, variables) => {
      toast.success(`Product '${variables.name}' successfully created.`);
      form.reset();
      // TODO: modify when storing table search params
      router.push(`/store/${shopId}/products`);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  const key = useMemo(
    () => ['product-categories', shopId, searchCategory],
    [shopId, searchCategory]
  );

  const { data, isFetching, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfiniteQuery({
      queryKey: key,
      queryFn: ({ signal, pageParam }) =>
        getProductCategories(
          {
            pageIndex: pageParam,
            pageSize: 10,
            sortBy: ProductCategorySortBy.PRODUCT_CATEGORY_SORT_BY_NAME,
            desc: false,
            search: searchCategory,
            status: [],
            shopId: shopId,
          },
          signal
        ),
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      retry: false,
      getNextPageParam: (lastPage) =>
        lastPage.maxPageIndex === lastPage.pageIndex
          ? undefined
          : lastPage.pageIndex + 1,
      initialPageParam: 0,
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
              <form.AppField name="name">
                {(field) => (
                  <field.Input
                    label="Name"
                    placeholder="Name"
                    type="text"
                    field={field}
                  />
                )}
              </form.AppField>
              <form.AppField name="descr">
                {(field) => (
                  <field.Textarea
                    label="Description"
                    placeholder="Description"
                    description="Max 2048 characters"
                    field={field}
                  />
                )}
              </form.AppField>
              <form.AppField name="categories">
                {(field) => (
                  <field.AsyncMultiSelect
                    label="Categories"
                    placeholder="Categories"
                    options={data?.pages.flatMap((page) =>
                      page.items.map((item) => ({
                        label: item.name,
                        value: item.id,
                      }))
                    )}
                    onSearchChange={(value) => {
                      setSearchCategory(value);
                    }}
                    isFetching={isFetching}
                    isFetchingNextPage={isFetchingNextPage}
                    fetchNextPage={fetchNextPage}
                    hasNextPage={hasNextPage}
                    field={field}
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
                    field={field}
                  />
                )}
              </form.AppField>
              {/* <form.AppField name="template">
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
              </form.AppField> */}
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
