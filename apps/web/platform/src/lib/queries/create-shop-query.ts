import { CreateShopRequest, CreateShopResponse } from '@shopify-clone/proto-ts';

export async function createShop(
  req: CreateShopRequest
): Promise<CreateShopResponse> {
  const res = await fetch(`/api/shop`, {
    method: 'POST',
    body: JSON.stringify(req),
  });
  return res.json();
}
