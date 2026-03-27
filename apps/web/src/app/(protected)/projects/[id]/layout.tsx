import { notFound } from 'next/navigation';
import { HydrationBoundary } from '@tanstack/react-query';
import {
  createServerQueryClient,
  prefetchProject,
  dehydrateClient,
} from '@web/lib/api/prefetch';
import { ProjectSubnav } from '@web/components/projects/projects-header/project-subnav';

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
};

export default async function ProjectLayout({ children, params }: LayoutProps) {
  const { id } = await params;
  const client = createServerQueryClient();

  try {
    await prefetchProject(client, id);
  } catch (e) {
    const message = e instanceof Error ? e.message : '';
    if (message === 'Project not found') notFound();
    throw e;
  }

  const dehydratedState = dehydrateClient(client);

  return (
    <HydrationBoundary state={dehydratedState}>
      <ProjectSubnav />
      {children}
    </HydrationBoundary>
  );
}
