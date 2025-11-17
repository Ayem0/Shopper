import { ShopOverview } from '@/components/store/shop-overview';

export default async function ShopPage(props: PageProps<'/store/[shopId]'>) {
  const { shopId } = await props.params;
  return <ShopOverview />;
}
