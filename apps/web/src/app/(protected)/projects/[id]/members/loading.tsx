import { PageLayout } from "@web/components/layout/page-layout";

export default function MembersLoading() {
  return (
    <PageLayout>
      <div className="flex flex-col gap-4">
        <div
          className="flex items-center justify-center py-12 text-sm text-muted-foreground"
          role="status"
          aria-live="polite"
        >
          Loading…
        </div>
      </div>
    </PageLayout>
  );
}
