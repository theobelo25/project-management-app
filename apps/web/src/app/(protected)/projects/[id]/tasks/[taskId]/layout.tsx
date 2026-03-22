import { notFound } from 'next/navigation';
import { HydrationBoundary } from '@tanstack/react-query';
import {
  createServerQueryClient,
  prefetchProject,
  prefetchTask,
  dehydrateClient,
} from '@web/lib/api/prefetch';

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ id: string; taskId: string }>;
};

export default async function TaskDetailLayout({
  children,
  params,
}: LayoutProps) {
  const { id: projectId, taskId } = await params;
  const client = createServerQueryClient();

  try {
    await Promise.all([
      prefetchProject(client, projectId),
      prefetchTask(client, taskId),
    ]);
  } catch (e) {
    const message = e instanceof Error ? e.message : '';
    if (message === 'Task not found') notFound();
    throw e;
  }

  const dehydratedState = dehydrateClient(client);

  return (
    <HydrationBoundary state={dehydratedState}>{children}</HydrationBoundary>
  );
}
