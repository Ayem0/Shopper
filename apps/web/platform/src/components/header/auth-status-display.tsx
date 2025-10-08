'use client';

import LoginButton from '@/components/header/login-button';
import UserProfileMenu from '@/components/header/user-profile-menu';
import { Skeleton } from '@shopify-clone/ui';
import { useSession } from 'next-auth/react';

export default function AuthStatusDisplay() {
  const { data: session, status } = useSession();

  // loading
  if (status === 'loading') {
    return <Skeleton className="rounded-full size-9" />;
  }
  // auth
  if (status === 'authenticated' && session?.user) {
    return (
      <UserProfileMenu
        user={{
          ...session?.user,
          id: '',
        }}
      />
    );
  }
  return <LoginButton />;
}
