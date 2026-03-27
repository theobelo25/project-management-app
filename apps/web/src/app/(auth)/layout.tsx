import { PageLayout } from '@web/components/layout/page-layout';

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex min-h-0 flex-1 flex-col min-w-0">
      <PageLayout variant="narrow" centerVertical={true}>
        {children}
      </PageLayout>
    </main>
  );
}
