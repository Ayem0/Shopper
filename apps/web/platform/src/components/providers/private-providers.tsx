'use client';

import { getQueryClient } from '@/lib/queries/get-query-client';
import { Toaster } from '@shopify-clone/ui';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { SessionProvider } from 'next-auth/react';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import React from 'react';
import { ThemeProvider } from './theme-provider';

export function PrivateProviders({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <QueryClientProvider client={queryClient}>
          <NuqsAdapter>
          {children}
          <ReactQueryDevtools />
          <Toaster position="bottom-right" />
          </NuqsAdapter>
        </QueryClientProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
