import { PageLayout } from '@web/components/layout/page-layout';

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="flex min-h-0 flex-1 flex-col min-w-0 outline-none"
    >
      <PageLayout variant="narrow" centerVertical={true}>
        {children}
      </PageLayout>
    </main>
  );
}
