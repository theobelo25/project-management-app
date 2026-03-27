'use client';

import { useParams, usePathname } from 'next/navigation';
import { useProjectQuery } from '@web/lib/api/queries';
import {
  CreateProjectDialog,
  PageHeader,
  TaskDetailHeader,
  useTaskDetail,
  HeaderSkeleton,
  ProjectLayoutHeader,
} from '@web/components/projects';
import { ROUTES } from '@web/lib/routes';

export function ProjectsUnifiedHeader() {
  const params = useParams();
  const pathname = usePathname();
  const projectId = typeof params?.id === 'string' ? params.id : null;
  const { taskForHeader } = useTaskDetail();
  const { data: project, isLoading: projectLoading } =
    useProjectQuery(projectId);

  const tasksHref = projectId ? `${ROUTES.projects}/${projectId}/tasks` : '';
  const isTaskDetail =
    !!projectId &&
    !!pathname?.startsWith(tasksHref + '/') &&
    pathname !== tasksHref;

  if (isTaskDetail) {
    if (taskForHeader && taskForHeader.projectId === projectId) {
      return (
        <TaskDetailHeader
          projectId={taskForHeader.projectId}
          task={taskForHeader.task}
        />
      );
    }
    return <HeaderSkeleton />;
  }

  if (!projectId) {
    return (
      <PageHeader
        backHref={ROUTES.dashboard}
        backLabel="Back to Dashboard"
        title="Projects"
        description="Manage your projects, track progress, and collaborate with your team."
        actions={<CreateProjectDialog />}
      />
    );
  }

  const projectForHeader = project
    ? {
        id: project.id,
        name: project.name,
        description: project.description ?? undefined,
        currentUserRole:
          'currentUserRole' in project ? project.currentUserRole : undefined,
      }
    : null;

  if (projectLoading && !project) {
    return <HeaderSkeleton />;
  }

  return <ProjectLayoutHeader project={projectForHeader} />;
}
