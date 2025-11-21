import { StoreOverview } from '@/components/store/store-overview';

export default async function ShopPage(props: PageProps<'/store/[shopId]'>) {
  const { shopId } = await props.params;
  return <StoreOverview />;
}
