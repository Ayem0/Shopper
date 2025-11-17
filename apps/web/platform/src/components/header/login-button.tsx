'use client';
import { Button } from '@shopify-clone/ui';
import { signIn } from 'next-auth/react';
import { useState } from 'react';

export default function LoginButton() {
  const [isLogging, setIsLogging] = useState(false);
  const handleLogin = async () => {
    setIsLogging(true);
    await signIn(
      'keycloak',
      { callbackUrl: '/dashboard' }
      //   { prompt: 'login' }
    );
  };
  return (
    <Button onClick={handleLogin} disabled={isLogging}>
      Login
    </Button>
  );
}
