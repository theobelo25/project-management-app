import { notFound } from 'next/navigation';
import { HydrationBoundary } from '@tanstack/react-query';
import {
  createServerQueryClient,
  prefetchProject,
  prefetchProjectTasks,
  dehydrateClient,
} from '@web/lib/api/prefetch';

const TASKS_PAGE_SIZE = 10;

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
};

export default async function ProjectTasksLayout({
  children,
  params,
}: LayoutProps) {
  const { id: projectId } = await params;
  const client = createServerQueryClient();

  try {
    await Promise.all([
      prefetchProject(client, projectId),
      prefetchProjectTasks(client, projectId, 1, TASKS_PAGE_SIZE),
    ]);
  } catch (e) {
    const message = e instanceof Error ? e.message : '';
    if (message === 'Project not found') notFound();
    throw e;
  }

  const dehydratedState = dehydrateClient(client);

  return (
    <HydrationBoundary state={dehydratedState}>{children}</HydrationBoundary>
  );
}
