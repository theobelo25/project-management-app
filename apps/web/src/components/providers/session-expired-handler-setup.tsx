// session-expired-handler-setup.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { setSessionExpiredHandler } from "@web/lib/api/client";
import { useQueryClient } from "@tanstack/react-query";
import { ME_QUERY_KEY } from "@web/lib/api/queries";

export function SessionExpiredHandlerSetup() {
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    setSessionExpiredHandler(() => {
      queryClient.setQueryData(ME_QUERY_KEY, null);
      router.push("/signin");
    });
  }, [router]);

  return null;
}
