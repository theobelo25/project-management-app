"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import { SessionExpiredHandlerSetup } from "./session-expired-handler-setup";

export function AppProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <SessionExpiredHandlerSetup />
      {children}
    </QueryClientProvider>
  );
}
