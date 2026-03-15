// apps/web/src/app/(protected)/projects/error.tsx

"use client";

import { useEffect } from "react";
import { PageLayout } from "@web/components/layout/page-layout";
import { Button } from "@web/components/ui/button";

export default function ProjectsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Projects page error:", error);
  }, [error]);

  return (
    <PageLayout>
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive my-4">
        <p className="font-medium">Something went wrong</p>
        <p className="text-sm mt-1">{error.message}</p>
        <Button variant="outline" size="sm" onClick={reset} className="mt-2">
          Try again
        </Button>
      </div>
    </PageLayout>
  );
}
