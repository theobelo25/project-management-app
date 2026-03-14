import { PageLayout } from "@web/components/layout/page-layout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Manage your projects and tasks in Nudge.",
};

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
