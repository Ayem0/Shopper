'use client';
import { Card, CardContent, CardTitle } from '@shopify-clone/ui';

export function ShopOverview() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 px-4 gap-4">
      <Card className="p-4">
        <CardTitle>Products</CardTitle>
        <CardContent>
          <div>Hello world</div>
        </CardContent>
      </Card>
      <Card className="p-4">
        <CardTitle>Product Categories</CardTitle>
        <CardContent>
          <div>Hello world</div>
        </CardContent>
      </Card>
      <Card className="p-4">
        <CardTitle>Orders</CardTitle>
        <CardContent>
          <div>Hello world</div>
        </CardContent>
      </Card>
    </div>
  );
}
