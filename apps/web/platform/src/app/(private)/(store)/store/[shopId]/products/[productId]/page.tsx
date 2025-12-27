export default async function ProductPage(
  props: PageProps<'/store/[shopId]/products/[productId]'>
) {
  const { productId } = await props.params;
  return <></>;
}
