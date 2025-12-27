import {
  CreateProductCategoryRequest,
  CreateProductCategoryResponse,
} from '@shopify-clone/proto-ts';

export async function createProductCategoryQuery(
  req: CreateProductCategoryRequest,
  signal?: AbortSignal
): Promise<CreateProductCategoryResponse> {
  const res = await fetch(`/api/product-category`, {
    method: 'POST',
    signal: signal,
    body: JSON.stringify(req),
  });
  return res.json();
}
