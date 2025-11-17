import { ProductForm } from '@/components/product/product-form';
import { Card } from '@shopify-clone/ui';

export default function CreateProductPage() {
  return (
    <>
      <div className="flex flex-col w-full px-4 xl:px-12">
        <Card className="p-4 md:p-6">
          <span className="text-3xl">New Product</span>
          <ProductForm />
        </Card>
      </div>
    </>
  );
}
