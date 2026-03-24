'use client';

import { useProjectQuery } from '@web/lib/api/queries';
import { ProjectMembersCard } from './project-members-card';
import { ProjectOverviewCard } from './project-overview-card';
import { ProjectStats } from './project-stats';
import { RecentTasksCard } from './recent-tasks-card';
import { Badge } from '@web/components/ui/badge';

type ProjectDetailContentProps = {
  projectId: string;
};

export function ProjectDetailContent({ projectId }: ProjectDetailContentProps) {
  const {
    data: project,
    isLoading,
    isError,
    error,
  } = useProjectQuery(projectId);

  if (isLoading && !project) {
    return null; // Route-level loading.tsx handles the shell
  }

  if (isError || !project) {
    return (
      <div
        role="alert"
        className="flex items-center justify-center py-12 text-destructive"
      >
        {error?.message ?? 'Project not found'}
      </div>
    );
  }

  const members = project.members ?? [];
  const recentTasks = project.recentTasks ?? [];
  const isReadOnly = !project.currentUserRole;

  return (
    <div className="space-y-4">
      {isReadOnly ? (
        <div className="flex">
          <Badge variant="outline">Read-only</Badge>
        </div>
      ) : null}
      <ProjectStats
        totalTasks={project.totalTasks}
        openTasks={project.openTasks}
        completedTasks={project.completedTasks}
        members={members}
      />
      <section className="grid gap-4 mb-4 lg:grid-cols-2">
        <RecentTasksCard
          project={project}
          recentTasks={recentTasks}
          allowTaskDetailNavigation={!isReadOnly}
        />
        <ProjectMembersCard
          project={project}
          members={members}
          canManageMembers={!isReadOnly}
        />
        <div className="lg:col-span-2">
          <ProjectOverviewCard project={project} canManage={!isReadOnly} />
        </div>
      </section>
    </div>
  );
}
