export default async function ProductPage(
  props: PageProps<'/store/[id]/products/[productId]'>
) {
  const { productId } = await props.params;
  return <></>;
}
