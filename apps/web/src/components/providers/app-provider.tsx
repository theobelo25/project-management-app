'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { useState, type ReactNode } from 'react';
import { SessionExpiredHandlerSetup } from './session-expired-handler-setup';
import { Toaster } from '../ui/sonner';
import { ThemePreferenceSyncSetup } from './theme-preference-sync-setup';
import { RealtimeSetup } from './realtime-setup';

export function AppProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <SessionExpiredHandlerSetup />
        <ThemePreferenceSyncSetup />
        <RealtimeSetup />
        {children}
        <Toaster richColors />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
