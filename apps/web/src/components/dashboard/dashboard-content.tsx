'use client';

import { useQueries } from '@tanstack/react-query';
import { PageLayout } from '@web/components/layout/page-layout';
import {
  DashboardProjectsCard,
  DashboardStats,
  DashboardTasksCard,
  DashboardWelcome,
} from '@web/components/dashboard';
import { fetchTasks } from '@web/lib/api/client';
import {
  DASHBOARD_PROJECTS_QUERY,
  DASHBOARD_TASKS_LIMIT,
  PROJECT_TASKS_QUERY_KEY,
  useProjectsQuery,
} from '@web/lib/api/queries';
import type {
  PaginatedProjectsListView,
  PaginationResult,
  TaskView,
} from '@repo/types';

const DASHBOARD_TASK_PROJECTS = 3;

function mergeRecentTasks(
  pages: PaginationResult<TaskView>[],
  limit: number,
): TaskView[] {
  const rows = pages.flatMap((p) => p.data ?? []);
  const byId = new Map<string, TaskView>();
  for (const t of rows) {
    if (!byId.has(t.id)) byId.set(t.id, t);
  }
  return [...byId.values()]
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, limit);
}

type DashboardContentProps = {
  initialProjects: PaginatedProjectsListView | null;
  initialTasks: PaginationResult<TaskView> | null;
  firstProjectId: string | null;
};

export function DashboardContent({
  initialProjects,
  initialTasks,
  firstProjectId,
}: DashboardContentProps) {
  const projectsQuery = useProjectsQuery(DASHBOARD_PROJECTS_QUERY, {
    initialData: initialProjects ?? undefined,
    initialDataUpdatedAt: initialProjects ? Date.now() : 0,
  });

  const tasksQueryParams = {
    page: 1,
    limit: DASHBOARD_TASKS_LIMIT,
  };

  const projectsData = projectsQuery.data;
  const projectItems = projectsData?.items ?? [];
  const projectIdsForTasks = projectItems
    .slice(0, DASHBOARD_TASK_PROJECTS)
    .map((p) => p.id);

  const taskQueries = useQueries({
    queries: projectIdsForTasks.map((projectId, index) => {
      const effectiveQuery = {
        ...tasksQueryParams,
        projectId,
        page: tasksQueryParams.page ?? 1,
        limit: tasksQueryParams.limit ?? 10,
      };
      const isFirstServerProject =
        index === 0 && projectId === firstProjectId && initialTasks != null;
      return {
        queryKey: [...PROJECT_TASKS_QUERY_KEY(projectId), effectiveQuery],
        queryFn: () => fetchTasks(effectiveQuery),
        enabled: projectIdsForTasks.length > 0,
        staleTime: 30 * 1000,
        initialData: isFirstServerProject ? initialTasks : undefined,
        initialDataUpdatedAt: isFirstServerProject ? Date.now() : undefined,
      };
    }),
  });

  const totalProjects = projectsData?.total ?? 0;
  const openTasksCount = projectItems.reduce((sum, p) => sum + p.openTasks, 0);
  const completedCount = projectItems.reduce(
    (sum, p) => sum + p.completedTasks,
    0,
  );

  const stats = [
    {
      title: 'Projects',
      value: String(totalProjects),
      description: 'Active workspaces',
      iconKey: 'projects' as const,
    },
    {
      title: 'Open Tasks',
      value: String(openTasksCount),
      description: 'Still in progress',
      iconKey: 'open' as const,
    },
    {
      title: 'Completed',
      value: String(completedCount),
      description: 'Finished this month',
      iconKey: 'completed' as const,
    },
  ];

  const recentProjects = projectItems.slice(0, 3);
  const taskPages = taskQueries
    .map((q) => q.data)
    .filter((p): p is PaginationResult<TaskView> => p != null);
  const myTasks = mergeRecentTasks(taskPages, DASHBOARD_TASKS_LIMIT);

  const isPending = projectsQuery.isPending;
  const isError = projectsQuery.isError;
  const error = projectsQuery.error;

  if (isError) {
    return (
      <PageLayout className="space-y-6 pb-6">
        <div className="p-6 text-destructive">
          {error instanceof Error ? error.message : 'Failed to load dashboard'}
        </div>
      </PageLayout>
    );
  }
  if (isPending && !projectsQuery.data) {
    return (
      <PageLayout className="space-y-6 pb-6">
        <div className="p-6 text-muted-foreground">Loading dashboard…</div>
      </PageLayout>
    );
  }
  return (
    <PageLayout className="space-y-6 pb-6">
      <DashboardWelcome />
      <DashboardStats stats={stats} />
      <section className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
        <div className="sm:col-span-2 xl:col-span-2 h-full">
          <DashboardProjectsCard projects={recentProjects} />
        </div>
        <DashboardTasksCard tasks={myTasks} />
      </section>
    </PageLayout>
  );
}
