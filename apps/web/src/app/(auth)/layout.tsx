import { PageLayout } from "@web/components/layout/page-layout";

export default function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <PageLayout variant="narrow" centerVertical={true}>
      {children}
    </PageLayout>
  );
}
