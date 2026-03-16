import { notFound } from "next/navigation";
import { HydrationBoundary } from "@tanstack/react-query";
import {
  createServerQueryClient,
  prefetchProject,
  prefetchProjectMembers,
  dehydrateClient,
} from "@web/lib/api/prefetch";

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
};

export default async function ProjectMembersLayout({
  children,
  params,
}: LayoutProps) {
  const { id: projectId } = await params;
  const client = createServerQueryClient();

  try {
    await Promise.all([
      prefetchProject(client, projectId),
      prefetchProjectMembers(client, projectId),
    ]);
  } catch (e) {
    const message = e instanceof Error ? e.message : "";
    if (message === "Project not found") notFound();
    throw e;
  }

  const dehydratedState = dehydrateClient(client);

  return (
    <HydrationBoundary state={dehydratedState}>{children}</HydrationBoundary>
  );
}
