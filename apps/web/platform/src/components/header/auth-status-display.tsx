"use client"; 

import LoginButton from "@/components/header/login-button";
import UserProfileMenu from "@/components/header/user-profile-menu";
import { Skeleton } from "@shopify-clone/ui";
import { User } from "next-auth";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";

export default function AuthStatusDisplay() {
  const { data: session, status } = useSession();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [lastKnownUser, setLastKnownUser] = useState<User | undefined>(undefined); 

  const handleLogout = async () => {
    setIsLoggingOut(true);
    setLastKnownUser({
      ...session?.user,
      id: ""
    });
    try {
      await signOut({ redirect: false });
    } catch (error) {
      console.error("Logout failed:", error);
      setLastKnownUser(undefined);
      setIsLoggingOut(false);
    }
  };

  // currently logging out
  if (isLoggingOut && lastKnownUser) {
    return (
      <UserProfileMenu
        user={lastKnownUser}
        handleLogout={handleLogout}
        isLoggingOut={isLoggingOut}
      />
    );
  }
  // loading
  if (status === "loading") {
    return (
      <Skeleton className="rounded-full size-9"/>
    );
  }
  // auth
  if (status === "authenticated" && session?.user) {
    return (
      <UserProfileMenu
        user={{
          ...session?.user,
          id: ""
        }}
        handleLogout={handleLogout}
        isLoggingOut={isLoggingOut}
      />
    );
  }
  // not auth
  if (status === "unauthenticated") {
    return <LoginButton />;
  }
  // shouldnt happen
  return null;
}