import type { ReactNode } from "react";
import { PageLayout } from "@web/components/layout/page-layout";

type LayoutProps = {
  children: ReactNode;
};

export default function OrganizationsLayout({ children }: LayoutProps) {
  return <PageLayout className="flex-1 min-h-0 pb-6">{children}</PageLayout>;
}
