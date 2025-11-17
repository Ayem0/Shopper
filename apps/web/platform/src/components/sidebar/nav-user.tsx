'use client';

import { Skeleton } from '@shopify-clone/ui';
import { useSession } from 'next-auth/react';
import UserProfileMenu from './user-profile-menu';

interface NavUserProps {
  isInSidebar: boolean;
}
export function NavUser({ isInSidebar }: NavUserProps) {
  const { data, status } = useSession();

  if (status === 'loading') {
    return <Skeleton className="rounded-full size-9" />;
  }

  if (status === 'authenticated' && data.user) {
    return <UserProfileMenu user={data.user} isInSidebar={isInSidebar} />;
  }

  return null;
}
