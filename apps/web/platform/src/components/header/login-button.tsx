'use client';
import { Button } from '@shopify-clone/ui';
import { signIn } from 'next-auth/react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useState } from 'react';

export default function LoginButton() {
  const pathname = usePathname();
  // Get the current URL's search parameters (e.g., "category=shoes&page=2")
  const searchParams = useSearchParams();
  const currentPathWithParams = searchParams.toString()
    ? `${pathname}?${searchParams.toString()}`
    : pathname;
  const [isLogging, setIsLogging] = useState(false);
  const handleLogin = async () => {
    setIsLogging(true);
    await signIn(
      'keycloak',
      { callbackUrl: currentPathWithParams }
      //   { prompt: 'login' }
    );
  };
  return (
    <Button onClick={handleLogin} disabled={isLogging}>
      Login
    </Button>
  );
}
