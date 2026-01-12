import {
  CreateProductRequest,
  CreateProductResponse,
} from '@shopify-clone/proto-ts';

export async function createProductQuery(
  req: CreateProductRequest,
  signal?: AbortSignal
): Promise<CreateProductResponse> {
  const res = await fetch(`/api/product`, {
    method: 'POST',
    signal: signal,
    body: JSON.stringify(req),
  });
  return res.json();
}
