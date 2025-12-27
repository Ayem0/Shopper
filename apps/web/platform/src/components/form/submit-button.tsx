import { useFormContext } from '@/hooks/use-app-form';
import { Button, Spinner } from '@shopify-clone/ui';

export function SubmitButton({ label }: { label: string }) {
  const form = useFormContext();
  return (
    <form.Subscribe selector={(state) => state.isSubmitting}>
      {(isSubmitting) => (
        <Button disabled={isSubmitting} type="submit">
          {isSubmitting ? <Spinner /> : label}
        </Button>
      )}
    </form.Subscribe>
  );
}
