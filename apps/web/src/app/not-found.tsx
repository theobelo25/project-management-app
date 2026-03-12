import Link from "next/link";
import { PageLayout } from "@web/components/layout/page-layout";
import { Button } from "@web/components/ui/button";

export default function NotFound() {
  return (
    <PageLayout>
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-6 text-center">
        <h1 className="text-4xl font-bold">404</h1>
        <h2 className="text-xl font-semibold">Page not found</h2>
        <p className="max-w-md text-muted-foreground">
          The page you’re looking for doesn’t exist or was moved.
        </p>
        <Button asChild>
          <Link href="/">Go home</Link>
        </Button>
      </div>
    </PageLayout>
  );
}
