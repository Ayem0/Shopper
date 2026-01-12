'use client';

import { useAppForm } from '@/hooks/use-app-form';
import { createProductCategoryQuery } from '@/lib/queries/product-category/create-product-category';
import { getProductCategories } from '@/lib/queries/product-category/get-product-categories';
import { activeStatusOptionsStr } from '@/lib/types/active-status';
import {
  CreateProductCategoryRequest,
  ProductCategorySortBy,
} from '@shopify-clone/proto-ts';
import { FieldGroup } from '@shopify-clone/ui';
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { productCategoryFormOptions } from './product-category-form-options';

export function ProductCategoryForm() {
  const { shopId } = useParams<{ shopId: string }>();
  const router = useRouter();
  const form = useAppForm({
    ...productCategoryFormOptions,
    onSubmit: async (data) => {
      await createProductCategoryMutation.mutateAsync({
        ...data.value,
        shopId: shopId,
      });
    },
  });
  const [searchCategory, setSearchCategory] = useState('');
  const queryClient = useQueryClient();
  const createProductCategoryMutation = useMutation({
    mutationFn: async (req: CreateProductCategoryRequest) =>
      await createProductCategoryQuery(req),
    onSettled: async () =>
      await queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey[0] === 'product-categories' &&
          query.queryKey[1] === shopId,
      }),
    onSuccess: (data, variables) => {
      toast.success(`Category '${variables.name}' successfully created.`);
      form.reset();
      // TODO: modify when storing table search params
      router.push(`/store/${shopId}/products/categories`);
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
      getNextPageParam: (lastPage, pages) =>
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
          <FieldGroup>
            <form.AppField name="name">
              {(field) => (
                <field.Input
                  field={field}
                  label="Name"
                  placeholder="Name"
                  type="text"
                />
              )}
            </form.AppField>
            <form.AppField name="status">
              {(field) => (
                <field.Select
                  field={field}
                  label="Status"
                  placeholder="Status"
                  mapValue={(value) => Number(value)}
                  options={activeStatusOptionsStr}
                />
              )}
            </form.AppField>
            <form.AppField name="parentCategoryId">
              {(field) => (
                <field.Combobox
                  field={field}
                  label="Parent Category"
                  placeholder="Parent Category"
                  isFetching={isFetching}
                  isFetchingNextPage={isFetchingNextPage}
                  onSearchChange={(e) => setSearchCategory(e)}
                  options={data?.pages.flatMap((page) =>
                    page.items.map((item) => ({
                      label: item.name,
                      value: item.id,
                    }))
                  )}
                  fetchNextPage={fetchNextPage}
                  hasNextPage={hasNextPage}
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
