import { PageLayout } from '@web/components/layout/page-layout';

export default function Loading() {
  return (
    <PageLayout>
      <div className="flex min-h-[40vh] items-center justify-center">
        <div
          className="size-10 animate-spin rounded-full border-2 border-primary border-t-transparent"
          aria-label="Loading"
        />
      </div>
    </PageLayout>
  );
}
