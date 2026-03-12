import { PageLayout } from "@web/components/layout/page-layout";

import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Projects",
  description: "View and manage your projects in Nudge.",
};

export default function ProjectsPage() {
  return (
    <PageLayout>
      <h2>Projects</h2>
    </PageLayout>
  );
}
