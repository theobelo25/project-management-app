// apps/web/src/app/(protected)/projects/loading.tsx

import { PageLayout } from "@web/components/layout/page-layout";

export default function ProjectsLoading() {
  return (
    <PageLayout>
      <div className="flex flex-col gap-4 my-4">
        <div className="h-9 w-48 rounded-md bg-muted animate-pulse" />
        <div className="h-10 w-full max-w-sm rounded-md bg-muted animate-pulse" />
      </div>
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-40 rounded-lg border bg-muted/50 animate-pulse"
          />
        ))}
      </div>
    </PageLayout>
  );
}
