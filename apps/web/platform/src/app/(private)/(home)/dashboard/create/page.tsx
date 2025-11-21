import { StoreCreateForm } from '@/components/store/store-create-form';
import { Card } from '@shopify-clone/ui';

export default function CreateStorePage() {
  return (
    <div className="grid w-full">
      <div className="self-center justify-self-center flex w-full max-w-lg">
        <Card className="p-3 w-full">
          <h1 className="text-2xl font-bold">Create Shop</h1>
          <StoreCreateForm />
        </Card>
      </div>
    </div>
  );
}
