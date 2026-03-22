'use client';
import { PageLayout } from '@web/components/layout/page-layout';
import { Button } from '@web/components/ui/button';
import Link from 'next/link';
import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <PageLayout>
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-6 text-center">
        <h2 className="text-xl font-semibold">Something went wrong</h2>
        <p className="max-w-md text-muted-foreground">
          We couldn’t load this page. Try again or go back home.
        </p>
        <div className="flex gap-3">
          <Button onClick={reset}>Try again</Button>
          <Button variant="outline" asChild>
            <Link href="/">Go home</Link>
          </Button>
        </div>
      </div>
    </PageLayout>
  );
}
